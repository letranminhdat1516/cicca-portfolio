"use client";
import { useEffect, useState } from "react";
import { useReducedMotion } from "./useReducedMotion";

export function useTypewriter(
  words: string[],
  opts: { typeMs?: number; deleteMs?: number; pauseMs?: number } = {},
) {
  const { typeMs = 70, deleteMs = 35, pauseMs = 1400 } = opts;
  const [text, setText] = useState(words[0] ?? "");
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || words.length === 0) {
      setText(words[0] ?? "");
      return;
    }

    let wordIdx = 0;
    let charIdx = 0;
    let deleting = false;
    let timer: ReturnType<typeof setTimeout>;

    const step = () => {
      const word = words[wordIdx];
      if (!deleting) {
        charIdx++;
        setText(word.slice(0, charIdx));
        if (charIdx === word.length) {
          deleting = true;
          timer = setTimeout(step, pauseMs);
          return;
        }
        timer = setTimeout(step, typeMs);
      } else {
        charIdx--;
        setText(word.slice(0, charIdx));
        if (charIdx === 0) {
          deleting = false;
          wordIdx = (wordIdx + 1) % words.length;
        }
        timer = setTimeout(step, deleteMs);
      }
    };

    timer = setTimeout(step, typeMs);
    return () => clearTimeout(timer);
  }, [words, typeMs, deleteMs, pauseMs, reduced]);

  return text;
}
