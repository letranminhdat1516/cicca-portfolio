/**
 * Who the site is about, stated once. Search engines and answer engines merge
 * mentions of a person into one entity only when the name variants, profiles
 * and facts agree everywhere ("entity consolidation"), so JSON-LD, the FAQ,
 * llms.txt and the visible copy all read from here. Facts come from the CV
 * (CV/letranminhdat_CV_2026-10.html) — never add anything that is not on it.
 */
export const IDENTITY = {
  name: "Le Tran Minh Dat",
  /** With Vietnamese diacritics — how local searchers type it. */
  nativeName: "Lê Trần Minh Đạt",
  givenName: "Dat",
  familyName: "Le",
  handle: "cicca",
  /** Every other form the name is written in, for schema.org alternateName. */
  alternateNames: ["Lê Trần Minh Đạt", "cicca", "Minh Dat", "Dat Le"],
  jobTitle: "AI-Native Software Engineer",
  focus: "Agents · Backend · LLM Infrastructure",
  locality: "Ho Chi Minh City",
  country: "Vietnam",
  countryCode: "VN",
  timezone: "GMT+7",
  workStyle: "Remote-ready · GMT+7 · async-first",
  email: "datltmse@gmail.com",
  sameAs: [
    "https://github.com/letranminhdat1516",
    "https://www.linkedin.com/in/dat-le-139a85284",
  ],
  /** Third-person one-liner from the CV summary. */
  summary:
    "He builds AI agents and the backend they run on — LLM gateways, MCP servers, RAG systems and voice agents — and since 2025 has taken projects from an empty repository to production, on his own or leading teams of two to four.",
  studio: {
    name: "Zillexa",
    description: "Independent dev studio of five engineers that takes on product and AI builds and competes in hackathons as a team.",
    since: "2024",
  },
  university: {
    name: "FPT University",
    sameAs: "https://en.wikipedia.org/wiki/FPT_University",
    locality: "Ho Chi Minh City",
    degree: "B.Eng. Software Engineering",
    year: "2026",
    gpa: "3.47/4.0",
  },
  /** Specific topics for schema.org knowsAbout, ahead of the CMS skill list. */
  topics: [
    "AI agents",
    "Model Context Protocol (MCP)",
    "Claude Agent SDK",
    "LLM gateways",
    "LiteLLM",
    "LLM cost reconciliation (FinOps)",
    "PII guardrails",
    "Retrieval-augmented generation (RAG)",
    "pgvector",
    "LiveKit voice agents",
    "Computer vision",
    "YOLO pose estimation",
    "AWS Bedrock",
    "OAuth 2.1",
    "Backend engineering",
    "Go",
    "TypeScript",
    "Python",
    "PostgreSQL",
    "Kubernetes (k3s)",
    "GitOps (ArgoCD)",
    "Terraform",
  ],
  openSource: [
    {
      name: "hotwatch",
      url: "https://github.com/letranminhdat1516/hotwatch",
      language: "Go",
      description: "Fast system monitor in Go with a native UI for macOS, Windows and Linux, plus an agent for remote servers and Docker.",
    },
    {
      name: "esp32-translator",
      url: "https://github.com/letranminhdat1516/esp32-translator",
      description: "Live English ↔ Vietnamese translation on an ESP32-S3 board, an iPhone and AirPods, fully on-device.",
    },
  ],
  /** Short Vietnamese briefing (FAQ answer, llms.txt). */
  vietnameseSummary:
    "Lê Trần Minh Đạt (Le Tran Minh Dat, tên trên mạng là cicca) là kỹ sư phần mềm AI-native (AI-Native Software Engineer) tại Thành phố Hồ Chí Minh, Việt Nam. Đạt xây dựng AI agent và hệ thống backend phía sau chúng: lớp mở rộng cho AI gateway (LiteLLM) của một ngân hàng doanh nghiệp, máy chủ MCP cho thương mại AI (Siz), trợ lý gọi món bằng giọng nói (Bảo Bối) và chatbot tư vấn tuyển sinh dùng RAG. Đạt là đồng sáng lập Zillexa (studio phát triển độc lập), tốt nghiệp Kỹ sư Kỹ thuật phần mềm tại Đại học FPT TP. Hồ Chí Minh năm 2026 (GPA 3.47/4.0), lọt chung kết ETHGlobal Singapore 2026 (giải nhì, top 5 main track) và đạt Á quân (Top 4) Viettel AI Race 2026. Sẵn sàng làm việc từ xa (GMT+7). Liên hệ: datltmse@gmail.com.",
} as const;

/** "Le Tran Minh Dat (Lê Trần Minh Đạt)" — the form used in titles and the footer. */
export const BOTH_NAMES = `${IDENTITY.name} (${IDENTITY.nativeName})`;
