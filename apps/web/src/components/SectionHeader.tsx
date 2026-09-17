export function SectionHeader({
  index,
  label,
  title,
  plain,
  center,
}: {
  index: string;
  label: string;
  title?: string;
  /** Plain-language meaning of a themed title, for screen readers and crawlers. */
  plain?: string;
  center?: boolean;
}) {
  return (
    <div className={center ? "text-center" : ""}>
      <div
        className="text-[11px] tracking-[4px]"
        style={{ fontFamily: "var(--font-mono), monospace", color: "#bf4dff" }}
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
          {plain && <span className="sr-only"> — {plain}</span>}
        </h2>
      )}
    </div>
  );
}
