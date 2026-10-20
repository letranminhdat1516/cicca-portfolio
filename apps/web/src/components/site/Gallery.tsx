import Image from "next/image";
import Link from "next/link";
import { ACCENT, GALLERY, KEYCAP } from "@/data/home";
import { Eyebrow, H2, MONO, PlayIcon } from "./ui";

/**
 * Behind-the-scenes photos as slim, slightly tilted gradient-edged frames around the keycap.
 * Placement and tilt live in globals.css (.pol-*), so phones get a simple
 * stacked column.
 */
export function Gallery() {
  return (
    <section id="gallery" style={{ position: "relative" }}>
      <div className="glow-right" aria-hidden="true" style={{ position: "absolute", inset: 0 }} />
      <div
        style={{ position: "relative", maxWidth: 1200, margin: "0 auto", padding: "100px 24px 60px", display: "flex", flexDirection: "column", gap: 32 }}
      >
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", gap: 16 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <Eyebrow>05 · GALLERY</Eyebrow>
            <h2 style={H2}>Behind the scenes</h2>
          </div>
          <p style={{ margin: 0, maxWidth: 380, fontSize: 15, lineHeight: 1.6, color: "#8C97B8" }}>
            Hackathon stages, finals and the people I met along the way.
          </p>
        </div>
        <div className="pol-board">
          <div className="pol-keycap" aria-hidden="true">
            <div className="halo" style={{ position: "absolute", left: "20%", top: "20%", width: "60%", height: "60%", opacity: 0.6 }} />
            <Image
              src={KEYCAP.src}
              alt=""
              fill
              sizes="(max-width: 900px) 0px, 520px"
              style={{
                objectFit: "cover",
                objectPosition: "66% 55%",
                transform: "scale(1.18)",
                WebkitMaskImage: "radial-gradient(closest-side at 50% 50%, #000 62%, transparent 100%)",
                maskImage: "radial-gradient(closest-side at 50% 50%, #000 62%, transparent 100%)",
              }}
            />
          </div>
          {GALLERY.map((g, i) => (
            <Link key={g.title} href={`/projects/${g.slug}`} className={`pol pol-${i + 1}`}>
              <span style={{ position: "relative", display: "block", aspectRatio: "4 / 3", overflow: "hidden", borderRadius: 12, background: "#0b1233" }}>
                <Image src={g.image.src} alt={g.image.alt} fill sizes="(max-width: 900px) 100vw, 560px" quality={90} style={{ objectFit: "cover" }} />
                {g.video && (
                  <span
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      left: "50%",
                      top: "50%",
                      transform: "translate(-50%,-50%)",
                      width: 54,
                      height: 54,
                      borderRadius: "50%",
                      background: ACCENT,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 0 24px rgba(47,123,255,0.7)",
                    }}
                  >
                    <PlayIcon size={20} color="#FFFFFF" />
                  </span>
                )}
              </span>
              <span style={{ display: "flex", flexDirection: "column", gap: 4, padding: "12px 6px 0" }}>
                <span style={{ fontWeight: 600, fontSize: 15, color: "#E8EEFF", lineHeight: 1.3 }}>{g.title}</span>
                <span style={{ ...MONO, fontSize: 11, color: "#8C97B8" }}>{g.meta}</span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
