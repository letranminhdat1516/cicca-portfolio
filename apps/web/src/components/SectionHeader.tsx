export function SectionHeader({
  index,
  label,
  title,
  center,
}: {
  index: string;
  label: string;
  title?: string;
  center?: boolean;
}) {
  return (
    <div className={center ? "text-center" : ""}>
      <div
        className="text-[11px] tracking-[4px]"
        style={{ fontFamily: "var(--font-mono), monospace", color: "#b026ff" }}
      >
        [{index}] {label}
      </div>
      {title && (
        <h2
          className="mt-2 mb-8 font-bold"
          style={{
            fontFamily: "var(--font-title), sans-serif",
            fontSize: "clamp(26px,4vw,40px)",
            color: "#fff",
          }}
        >
          {title}
        </h2>
      )}
    </div>
  );
}
