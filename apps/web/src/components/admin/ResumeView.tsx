"use client";

type Row = { id: string; [k: string]: unknown };
const s = (v: unknown) => String(v ?? "");

// Print-friendly CV generated from the portfolio content. Light theme for paper.
export function ResumeView({
  profile,
  experiences,
  skills,
  achievements,
  missions,
  onBack,
}: {
  profile: Record<string, unknown>;
  experiences: Row[];
  skills: Row[];
  achievements: Row[];
  missions: Row[];
  onBack: () => void;
}) {
  const groups = Array.from(new Set(skills.map((k) => s(k.groupName))));
  return (
    <div style={{ minHeight: "100vh", background: "#f4f4ef" }}>
      <div className="no-print sticky top-0 flex items-center justify-between px-6 py-3" style={{ background: "#1a1a1a", color: "#fff" }}>
        <button onClick={onBack} className="text-sm">◂ Back</button>
        <button onClick={() => window.print()} className="rounded px-4 py-1.5 text-sm font-semibold" style={{ background: "#d97757", color: "#fff" }}>Print / Save PDF</button>
      </div>

      <article className="mx-auto max-w-[800px] bg-white p-12" style={{ color: "#1a1a1a", fontFamily: "Inter, system-ui, sans-serif" }}>
        <header className="border-b pb-4" style={{ borderColor: "#ddd" }}>
          <h1 className="text-3xl font-bold">{s(profile.name) || "[Your Name]"}</h1>
          <p className="mt-1 text-lg" style={{ color: "#555" }}>{s(profile.classRole)}</p>
          <p className="mt-1 text-sm" style={{ color: "#777" }}>
            {[s(profile.email), s(profile.region)].filter(Boolean).join("  ·  ")}
          </p>
          {s(profile.bio) && <p className="mt-3 text-sm leading-6" style={{ color: "#333" }}>{s(profile.bio)}</p>}
        </header>

        {experiences.length > 0 && (
          <Section title="Experience">
            {experiences.map((e) => (
              <div key={e.id} className="mb-3">
                <div className="flex items-baseline justify-between">
                  <span className="font-semibold">{s(e.title)}</span>
                  <span className="text-sm" style={{ color: "#777" }}>{s(e.period)}</span>
                </div>
                <div className="text-sm" style={{ color: "#555" }}>{s(e.org)}</div>
                <p className="mt-1 text-sm leading-6" style={{ color: "#333" }}>{s(e.description)}</p>
              </div>
            ))}
          </Section>
        )}

        {missions.length > 0 && (
          <Section title="Selected Projects">
            {missions.map((m) => (
              <div key={m.id} className="mb-2">
                <span className="font-semibold">{s(m.title)}</span>
                {s(m.impact) && <span className="text-sm" style={{ color: "#777" }}> — {s(m.impact)}</span>}
                <p className="text-sm leading-6" style={{ color: "#333" }}>{s(m.objective)}</p>
              </div>
            ))}
          </Section>
        )}

        {skills.length > 0 && (
          <Section title="Skills">
            {groups.map((g) => (
              <div key={g} className="mb-1.5 text-sm">
                <span className="font-semibold">{g}: </span>
                <span style={{ color: "#333" }}>{skills.filter((k) => s(k.groupName) === g).map((k) => s(k.name)).join(", ")}</span>
              </div>
            ))}
          </Section>
        )}

        {achievements.length > 0 && (
          <Section title="Achievements">
            {achievements.map((a) => (
              <div key={a.id} className="mb-1.5 text-sm">
                <span className="font-semibold">{s(a.year)}</span> — {s(a.title)}
                <span style={{ color: "#555" }}> · {s(a.description)}</span>
              </div>
            ))}
          </Section>
        )}
      </article>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-6">
      <h2 className="mb-2 text-xs font-bold uppercase tracking-widest" style={{ color: "#d97757" }}>{title}</h2>
      {children}
    </section>
  );
}
