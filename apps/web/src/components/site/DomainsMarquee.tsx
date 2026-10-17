import { DOMAINS } from "@/data/home";

/** Endless strip of industries. The first copy is read; the repeats only loop the animation. */
export function DomainsMarquee() {
  const copies = [0, 1, 2, 3];
  return (
    <section
      aria-label="Industries shipped to"
      style={{
        marginTop: 72,
        borderTop: "1px solid rgba(111,168,255,0.12)",
        borderBottom: "1px solid rgba(111,168,255,0.12)",
        background: "rgba(10,16,52,0.4)",
        overflow: "hidden",
      }}
    >
      <div className="marquee" style={{ display: "flex", width: "max-content" }}>
        {copies.map((c) => (
          <ul key={c} aria-hidden={c > 0 ? true : undefined} style={{ display: "flex", margin: 0, padding: 0, listStyle: "none" }}>
            {DOMAINS.map((d) => (
              <li
                key={d}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 18,
                  padding: "18px 18px",
                  whiteSpace: "nowrap",
                  fontWeight: 600,
                  fontSize: 18,
                  color: "#8C97B8",
                }}
              >
                {d}
                <span aria-hidden="true" style={{ color: "#2F6BFF" }}>
                  ✦
                </span>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </section>
  );
}
