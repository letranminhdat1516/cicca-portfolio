import Image from "next/image";
import Link from "next/link";
import { ACCENT, GALLERY, KEYCAP } from "@/data/home";
import { Eyebrow, H2, PILL_OUTLINE, PlayIcon } from "./ui";

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
          <Link href={`/projects/${GALLERY[0].slug}`} style={PILL_OUTLINE}>
            View all media
          </Link>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 24, alignItems: "center" }}>
          <div style={{ flex: "1 1 360px", minWidth: 0, maxWidth: 460, display: "flex", flexDirection: "column", gap: 20 }}>
            {GALLERY.map((g) => (
              <Link
                key={g.title}
                href={`/projects/${g.slug}`}
                className="card"
                style={{
                  textDecoration: "none",
                  color: "#E8EEFF",
                  borderRadius: 20,
                  border: "1px solid rgba(111,168,255,0.3)",
                  background: "rgba(10,16,52,0.75)",
                  padding: "12px 12px 18px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                <div className="ph" style={{ aspectRatio: "16 / 9", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {g.video && (
                    <span
                      aria-hidden="true"
                      style={{
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
                </div>
                <div style={{ padding: "0 6px", display: "flex", flexDirection: "column", gap: 2 }}>
                  <h3 style={{ margin: 0, fontWeight: 700, fontSize: 17 }}>{g.title}</h3>
                  <span style={{ fontSize: 12, color: "#8C97B8" }}>{g.meta}</span>
                </div>
              </Link>
            ))}
          </div>
          <div style={{ flex: "1.5 1 480px", minWidth: 0, display: "flex", justifyContent: "center" }}>
            <div style={{ position: "relative", width: "100%", maxWidth: 760, aspectRatio: "1 / 1" }}>
              <div className="halo" aria-hidden="true" style={{ position: "absolute", left: "20%", top: "20%", width: "60%", height: "60%", opacity: 0.6 }} />
              <Image
                src={KEYCAP.src}
                alt={KEYCAP.alt}
                fill
                sizes="(max-width: 900px) 100vw, 760px"
                style={{
                  objectFit: "cover",
                  objectPosition: "66% 55%",
                  transform: "scale(1.18)",
                  WebkitMaskImage: "radial-gradient(closest-side at 50% 50%, #000 62%, transparent 100%)",
                  maskImage: "radial-gradient(closest-side at 50% 50%, #000 62%, transparent 100%)",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
