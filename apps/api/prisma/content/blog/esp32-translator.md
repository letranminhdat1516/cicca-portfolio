---
slug: esp32-translator-live-english-vietnamese
title: A pocket English-Vietnamese translator on ESP32
excerpt: An ESP32-S3 board, an iPhone and AirPods, wired into a two-way English-Vietnamese translator that runs fully on device.
tags: [esp32, ios, ble, on-device-ai]
cover: /covers/esp32-translator.jpg
published: 2026-10-20
---

## Why I built it

Translation apps on a phone work, but they turn a conversation into a ritual: hold the phone up, press a button, wait, hand it over, repeat. Both people end up looking at a screen instead of at each other.

I wanted something that stays out of the way. The other person talks normally and I hear Vietnamese in my ears. I answer in Vietnamese and they read English on a small screen. No push-to-talk, no passing a phone around, and no dependence on a good mobile signal.

So I built esp32-translator out of three things I could put on a table: a Waveshare ESP32-S3-Touch-AMOLED-1.75C board with a round screen and two microphones, an iPhone on iOS 26, and a pair of AirPods.

## What it does in practice

There are two directions, and both run all the time:

- **Them to me.** The board's microphones pick up the other person's English. A few moments after they finish a phrase, I hear it in Vietnamese in my AirPods, privately.
- **Me to them.** I speak Vietnamese and live English subtitles show up on the board's round AMOLED screen while I'm still talking.

Once the speech and translation models have been downloaded the first time, it doesn't need a network. The phone can stay in my pocket with the screen locked, because the app keeps running in the background.

## How the pieces fit

The README sums up the whole pipeline in three lines:

```
Them → You   Board mics ─ADPCM / BLE, 20 ms─► SpeechTranscriber en-US ─final phrase─► Translation EN→VI ─► vi-VN speech ─► AirPods
You → Them   AirPods mic (echo-cancelled) ──► DictationTranscriber vi-VN ─partials─► Translation VI→EN ─BLE─► subtitles on AMOLED
Arbiter      While you speak (and for 1 s after), "Them → You" results are dropped so the board mic never translates your own voice
```

**The board** runs ESP-IDF 5.5 firmware written in C. It records both microphones at 16 kHz, mixes them to mono, compresses each 20 ms frame with IMA ADPCM and sends it to the phone as BLE notifications. Going the other way, it receives subtitle text and draws it with LVGL. I converted Be Vietnam Pro into 22 px and 36 px LVGL bitmap fonts so that full Vietnamese diacritics display properly.

**The iPhone** does the heavy lifting. A SwiftUI app runs two speech recognizers at once with Apple's `SpeechAnalyzer`. English uses `SpeechTranscriber`, the newer and faster model. Vietnamese uses `DictationTranscriber`, because it is the one that supports Vietnamese. Translation uses Apple's on-device `Translation` framework.

**The AirPods** play the spoken Vietnamese, and in this version their microphone, with echo cancellation, captures my voice.

The BLE link is a small custom GATT service with three characteristics: audio (notify), text (write-without-response, with chunk flags for long subtitles) and control (one byte that turns the board mic on or off). I kept each audio packet self-contained. It carries its own sequence number and ADPCM predictor state, so a dropped packet costs 20 ms of silence and doesn't corrupt the packets after it:

```c
pkt[0] = seq & 0xff;
pkt[1] = seq >> 8;
pkt[2] = (uint16_t)st->predictor & 0xff;
pkt[3] = (uint16_t)st->predictor >> 8;
pkt[4] = st->index;
```

## The hard parts

**The board can hear me too.** It sits between two people, so its microphones pick up my Vietnamese as well. Without a guard, the English recognizer would try to transcribe me. The fix is a small arbiter in `ConversationEngine`: while I have a partial Vietnamese result, and for one second after (`echoHold`), anything from the board mic is dropped.

**Two directions need different latency strategies.** The subtitles have to follow my speech as it happens, so partial results get translated immediately. That produces a flood of requests, though, so a `LatestWinsTranslator` keeps only the newest one and throws away the stale ones. The screen always shows the current sentence and never replays old ones. Spoken output works the other way: each finalized English phrase is translated and spoken strictly in order, so a later phrase can never overtake an earlier one.

**Ending a phrase quickly.** The board only streams while someone is talking, so the phone treats a gap in packets as the end of a phrase. About 250 ms after the stream pauses, it calls `finalize` on the English recognizer, so the last phrase is spoken without waiting for the next one to start. In the README's measurements, the Vietnamese comes out about one second after the English speaker stops, and the translation step itself takes 24–27 ms.

**Why on-device.** A cloud API would have been easier to start with, but the places where you need a translator are often the places with a bad signal. Running speech and translation on the phone keeps it working offline and keeps the conversation off a server. It also makes the models predictable to keep warm: the analyzers live for the whole session (`modelRetention: .processLifetime`), and the text-to-speech voice is preloaded at launch.

**Power.** On the board, an energy-based voice detector with an adaptive noise floor means silence is never sent. It keeps 300 ms of pre-roll so the first syllable isn't lost, and an 800 ms hangover so short pauses don't split a sentence. The screen turns off after 30 seconds of inactivity. The board goes into deep sleep after three minutes without an iPhone. The CPU scales between 160 and 80 MHz, with BLE modem sleep between connection events. The phone applies the same voice gate to its own mic, so neural recognition only runs when someone is speaking. I haven't measured battery life yet.

**Hardware limits I had to accept.** The ESP32-S3 has BLE but no Bluetooth Classic, so it can't stream audio to the AirPods itself. The iPhone has to handle that part. Using the AirPods microphone also switches them to the call profile, which keeps speech clear but isn't music quality. Only English and Vietnamese are wired up right now. Adding another pair mostly means changing the locales in `ConversationEngine`.

## Stack

- ESP32-S3 (Waveshare ESP32-S3-Touch-AMOLED-1.75C), ESP-IDF 5.5, C, FreeRTOS
- NimBLE GATT server: 2M PHY, MTU 247, notifications for audio
- IMA ADPCM, 16 kHz mono, 20 ms frames
- LVGL with custom Vietnamese bitmap fonts (Be Vietnam Pro, OFL)
- AXP2101 power management (battery level, PWR button)
- iOS 26, Swift, SwiftUI, CoreBluetooth, AVAudioSession
- Apple `SpeechAnalyzer` (`SpeechTranscriber`, `DictationTranscriber`), `Translation` framework, on-device text-to-speech
- XcodeGen for the Xcode project

The code is MIT-licensed: [github.com/letranminhdat1516/esp32-translator](https://github.com/letranminhdat1516/esp32-translator)
