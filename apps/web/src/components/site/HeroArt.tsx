import type { CSSProperties } from "react";
import Image from "next/image";
import { BITS, FLOOR_TILES, HERO, SPARKS } from "@/data/home";
import { MONO } from "./ui";

const ROBOT = { src: "/brand/robot.png", width: 1171, height: 1035 };
const ROBOT_SIZES = "(max-width: 640px) 100vw, (max-width: 1100px) 90vw, 660px";

// Same deep blue as the Shift key the robot holds.
const KEY_SKIN: CSSProperties = {
  background: "radial-gradient(120% 90% at 60% 55%,#3B5BFF,#1F33E0 40%,#0E1890 75%,#070C55)",
  border: "1px solid rgba(90,120,255,0.6)",
  boxShadow:
    "inset 0 1px 1px rgba(160,180,255,0.55), inset 0 -6px 10px rgba(5,8,60,0.7), 0 5px 0 #070C4A, 0 12px 28px -6px rgba(40,70,255,0.7)",
};

/** Floating keycap: one shared spec (52px, r14, 5px depth, 15px mono label). */
function Keycap({ label, tilt, className, pos }: { label: string; tilt: string; className: string; pos: CSSProperties }) {
  return (
    <span className={className} aria-hidden="true" style={{ position: "absolute", width: 52, height: 52, ...pos }}>
      <span
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 14,
          transform: `perspective(320px) ${tilt}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          ...KEY_SKIN,
        }}
      >
        <span
          style={{
            position: "absolute",
            inset: "6px 6px 10px",
            borderRadius: 10,
            background: "linear-gradient(180deg,rgba(120,150,255,0.22),rgba(40,60,255,0.04))",
            border: "1px solid rgba(130,160,255,0.25)",
          }}
        />
        <span
          style={{
            ...MONO,
            position: "relative",
            marginTop: -4,
            fontSize: 15,
            fontWeight: 600,
            color: "#FFFFFF",
            textShadow: "0 0 8px rgba(110,150,255,0.9)",
          }}
        >
          {label}
        </span>
      </span>
    </span>
  );
}

const CHIP: CSSProperties = {
  ...MONO,
  position: "absolute",
  zIndex: 5,
  whiteSpace: "nowrap",
  display: "inline-flex",
  alignItems: "center",
  gap: 9,
  padding: "7px 14px",
  borderRadius: 999,
  background: "rgba(10,16,52,0.78)",
  border: "1px solid rgba(111,168,255,0.32)",
  boxShadow: "0 8px 24px -10px rgba(47,123,255,0.6)",
  fontSize: 12,
  color: "#DCE4FF",
};

function Dot({ dot, glow }: { dot: string; glow: string }) {
  return (
    <span style={{ flex: "0 0 auto", width: 8, height: 8, borderRadius: "50%", background: dot, boxShadow: `0 0 0 3px ${glow}, 0 0 10px ${dot}` }} />
  );
}

/**
 * The hero stage: halo ring, perspective floor with a mirrored robot and
 * fading 0/1 bits, spinning orbit, sparkles, floating keycaps, a mini
 * terminal and three orbit chips. Pure CSS animation, no client JS.
 */
export function HeroArt() {
  const [sdk, rag, k3s] = HERO.chips;
  return (
    <div className="hero-art" style={{ position: "relative", width: "100%", maxWidth: 660, margin: "110px 0 40px" }}>
      {/* halo: one ring system, larger than the robot so it reads all the way round */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          zIndex: 0,
          left: 0,
          top: "-17%",
          width: "110%",
          aspectRatio: "1 / 1",
          borderRadius: "50%",
          background: "radial-gradient(closest-side,rgba(47,123,255,0.35),rgba(91,75,230,0.14) 55%,transparent)",
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          zIndex: 0,
          left: "13%",
          top: "-2.3%",
          width: "84%",
          aspectRatio: "1 / 1",
          borderRadius: "50%",
          overflow: "hidden",
          background: "radial-gradient(circle at 50% 40%,rgba(61,107,255,0.32),rgba(28,46,158,0.18) 60%,rgba(10,18,64,0.05))",
          border: "1.5px solid rgba(140,175,240,0.5)",
          boxShadow: "0 0 18px 2px rgba(47,123,255,0.35), 0 0 70px 12px rgba(91,75,230,0.15), inset 0 0 30px rgba(47,123,255,0.25)",
        }}
      >
        {/* the stage floor */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: "81.7%",
            bottom: 0,
            background: "linear-gradient(180deg,rgba(111,168,255,0.42),rgba(47,107,255,0.18) 40%,rgba(10,18,64,0.6))",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: "-20%",
              right: "-20%",
              top: 0,
              height: "260%",
              transformOrigin: "50% 0",
              transform: "perspective(240px) rotateX(62deg)",
              backgroundImage:
                "linear-gradient(rgba(160,200,255,0.35) 1px,transparent 1px),linear-gradient(90deg,rgba(160,200,255,0.35) 1px,transparent 1px)",
              backgroundSize: "34px 34px",
            }}
          >
            {BITS.map((b, i) => (
              <span
                key={i}
                className="bit"
                style={{
                  ...MONO,
                  position: "absolute",
                  left: b.x,
                  top: b.y,
                  width: 34,
                  textAlign: "center",
                  fontSize: b.size,
                  fontWeight: 600,
                  color: b.c,
                  textShadow: `0 0 8px ${b.c}`,
                  animationDuration: b.dur,
                  animationDelay: b.d,
                }}
              >
                {b.v}
              </span>
            ))}
            {FLOOR_TILES.map((t) => (
              <span
                key={`${t.left}-${t.top}`}
                className="tile"
                style={{
                  position: "absolute",
                  left: t.left,
                  top: t.top,
                  width: 33,
                  height: 33,
                  background: t.color,
                  boxShadow: `0 0 14px ${t.color}`,
                  animationDelay: t.delay,
                }}
              />
            ))}
          </div>
          {/* mirrored robot on the floor */}
          <Image
            src={ROBOT.src}
            alt=""
            width={ROBOT.width}
            height={ROBOT.height}
            sizes={ROBOT_SIZES}
            style={{
              position: "absolute",
              left: "-15.48%",
              top: 0,
              width: "119.05%",
              maxWidth: "none",
              height: "auto",
              transform: "translateY(-24.64%) scaleY(-1)",
              opacity: 0.32,
              filter: "blur(1.5px) saturate(1.2)",
              WebkitMaskImage: "linear-gradient(180deg,transparent 52%,#000 75.4%)",
              maskImage: "linear-gradient(180deg,transparent 52%,#000 75.4%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: "22%",
              width: "56%",
              top: "-18%",
              height: "70%",
              borderRadius: "50%",
              background: "radial-gradient(closest-side,rgba(191,216,255,0.55),rgba(111,168,255,0.22) 55%,transparent)",
              filter: "blur(6px)",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: -1,
              height: 2,
              background: "linear-gradient(90deg,transparent,#BFD8FF 25%,#FFFFFF 50%,#BFD8FF 75%,transparent)",
              boxShadow: "0 0 14px 2px rgba(111,168,255,0.9)",
            }}
          />
        </div>
      </div>
      <div
        className="spin-rev"
        aria-hidden="true"
        style={{
          position: "absolute",
          zIndex: 1,
          left: "11%",
          top: "-4.5%",
          width: "88%",
          aspectRatio: "1 / 1",
          borderRadius: "50%",
          background: "conic-gradient(from 0deg,transparent,rgba(150,180,240,0.55) 18%,transparent 34%,transparent 50%,rgba(140,125,230,0.55) 68%,transparent 84%)",
          WebkitMaskImage: "radial-gradient(closest-side,transparent 96%,#000 97%)",
          maskImage: "radial-gradient(closest-side,transparent 96%,#000 97%)",
          filter: "drop-shadow(0 0 4px rgba(111,168,255,0.4))",
        }}
      />
      <div
        className="spin"
        aria-hidden="true"
        style={{
          position: "absolute",
          zIndex: 0,
          left: "5%",
          top: "-11.3%",
          width: "100%",
          aspectRatio: "1 / 1",
          borderRadius: "50%",
          border: "1px dashed rgba(111,168,255,0.3)",
        }}
      >
        <span style={{ position: "absolute", top: -5, left: "50%", width: 10, height: 10, borderRadius: "50%", background: "#6FA8FF", boxShadow: "0 0 14px 3px rgba(111,168,255,0.9)" }} />
        <span style={{ position: "absolute", bottom: "14%", left: "4%", width: 7, height: 7, borderRadius: "50%", background: "#9B8CFF", boxShadow: "0 0 12px 3px rgba(155,140,255,0.9)" }} />
      </div>
      {/* sparkles */}
      {SPARKS.map((s) => (
        <span
          key={`${s.x}-${s.y}`}
          className="twinkle"
          aria-hidden="true"
          style={{
            position: "absolute",
            left: s.x,
            top: s.y,
            width: s.size,
            height: s.size,
            borderRadius: "50%",
            background: "#CFE0FF",
            boxShadow: "0 0 8px 2px rgba(111,168,255,0.8)",
            animationDelay: s.delay,
          }}
        />
      ))}
      <Image
        src={ROBOT.src}
        alt={HERO.robotAlt}
        width={ROBOT.width}
        height={ROBOT.height}
        sizes={ROBOT_SIZES}
        loading="eager"
        fetchPriority="high"
        style={{ position: "relative", zIndex: 2, width: "100%", height: "auto", display: "block" }}
      />
      {/* glowing pedestal under the robot */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          zIndex: 0,
          left: "18%",
          top: "70%",
          width: "64%",
          height: "14%",
          borderRadius: "50%",
          background: "radial-gradient(closest-side,rgba(47,123,255,0.5),transparent)",
          filter: "blur(14px)",
        }}
      />
      {/* AI: behind the hood, left of the head */}
      <Keycap label="AI" className="float2" tilt="rotateX(20deg) rotateY(-18deg) rotateZ(-12deg)" pos={{ zIndex: 1, left: "33%", top: "18%" }} />
      {/* </>: in front, beside the orb hand */}
      <Keycap label="</>" className="float3" tilt="rotateX(22deg) rotateY(16deg) rotateZ(-8deg)" pos={{ zIndex: 5, left: "14%", top: "59%" }} />
      {/* cmd: in front, above the Shift key */}
      <Keycap label="⌘" className="float1" tilt="rotateX(20deg) rotateY(20deg) rotateZ(14deg)" pos={{ zIndex: 5, right: "12%", top: "45%" }} />
      {/* mini terminal */}
      <div
        className="chip float1 term"
        aria-hidden="true"
        style={{
          ...MONO,
          position: "absolute",
          zIndex: 5,
          left: "-2%",
          top: "-10%",
          width: 178,
          borderRadius: 14,
          background: "rgba(10,16,52,0.72)",
          border: "1px solid rgba(111,168,255,0.45)",
          boxShadow: "0 16px 40px -16px rgba(47,123,255,0.8)",
          overflow: "hidden",
          fontSize: 10.5,
          lineHeight: 1.65,
        }}
      >
        <div style={{ display: "flex", gap: 5, padding: "8px 10px", borderBottom: "1px solid rgba(111,168,255,0.2)" }}>
          {["#FF6B81", "#FFC857", "#3DDC97"].map((c) => (
            <span key={c} style={{ width: 8, height: 8, borderRadius: "50%", background: c }} />
          ))}
        </div>
        <div style={{ padding: "8px 12px 10px", color: "#C9D4F2" }}>
          <span style={{ color: "#6FA8FF" }}>$</span> agent.deploy()
          <br />
          <span style={{ color: "#3DDC97" }}>✓</span> build passed
          <br />
          <span style={{ color: "#3DDC97" }}>✓</span> argocd synced
          <br />
          <span style={{ color: "#9B8CFF" }}>›</span> status: live<span className="blink">▍</span>
        </div>
      </div>
      {/* orbit chips: the status dot pins onto the dotted orbit */}
      <span
        className="chip bob1 orbit-chip"
        style={{ ...CHIP, left: "19.6%", top: "85.3%", transform: "translate(var(--tx),-50%)", ["--tx" as string]: "calc(-100% + 18px)" }}
      >
        {sdk.label}
        <Dot dot={sdk.dot} glow={sdk.glow} />
      </span>
      <span
        className="chip bob2 orbit-chip"
        style={{ ...CHIP, left: "90.4%", top: "5.2%", transform: "translate(var(--tx),-50%)", ["--tx" as string]: "-18px" }}
      >
        <Dot dot={rag.dot} glow={rag.glow} />
        {rag.label}
      </span>
      <span
        className="chip bob3 orbit-chip"
        style={{ ...CHIP, left: "90.4%", top: "85.3%", transform: "translate(var(--tx),-50%)", ["--tx" as string]: "-18px" }}
      >
        <Dot dot={k3s.dot} glow={k3s.glow} />
        {k3s.label}
      </span>
    </div>
  );
}
