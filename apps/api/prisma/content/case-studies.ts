// Case-study markdown for each project page (/projects/<slug>). A project page
// is noindex until its `content` is filled, so these seed the first version;
// anything written in the admin CMS later wins (see mergeContent in cv.ts).
// Facts only from the CV (CV/letranminhdat_CV_2026-10.html) and cv.ts. Never
// name the bank or the café brand, no vanity counters, no .NET.

export const caseStudies: Record<string, string> = {
  'siz-commerce-gateway': `## The problem

Vietnamese merchants have no API an AI assistant can use. A user can ask Claude or ChatGPT to find a cinema seat or a flight, but the assistant cannot actually book it on the user's behalf, and nobody wants an AI holding their money. Siz exists to close that gap safely.

## What I built

Siz is an AI commerce gateway built as an MCP (Model Context Protocol) server. I work in a two-person product team, since August 2026, and I built the gateway and its web app:

- **Booking tools for assistants** — MCP tools that let an AI assistant search and book cinema and flight tickets on real merchant sites.
- **Account linking** — users connect their assistant to Siz with OAuth 2.1 + PKCE, and can review and revoke connected assistants from a "manage connections" page.
- **Signed merchant requests** — every request Siz sends to a merchant is signed with Ed25519 following RFC 9421 (HTTP Message Signatures), so the merchant can verify it really came from Siz.
- **Payment handed back** — Siz never holds money. It returns a VietQR code that is verified before the user sees it, and the user pays in their own banking app.
- **AI-Ready scorer** — a crawler that grades merchant sites on how usable they are for AI agents, plus a merchant integration guide.

## How it works

An assistant calls Siz's MCP tools with the user's linked account. Siz turns the request into calls against the merchant's site, signs each one, and walks the booking up to the point of payment. At that point control returns to the human: the assistant shows a verified VietQR and the user approves the payment in their bank app. The agent can do the tedious part; the money decision stays with the person.

## Outcome

Siz is a live MVP: an assistant can book tickets through it end to end, with account linking, signed merchant calls and verified payment hand-off in place. The web app covers consent, connection management, the AI-Ready score report and the merchant guide.

## Stack

- Go and PostgreSQL for the MCP gateway
- Next.js for the web app
- OAuth 2.1 + PKCE, Ed25519 / RFC 9421 request signing, VietQR
- Shipped to Kubernetes (k3s) through a GitOps pipeline with ArgoCD
`,

  'bank-llm-gateway': `## The problem

An enterprise bank runs open-source LiteLLM as one AI gateway in front of the models its internal teams use. To run it as a bank, it needed enterprise controls: spend that matches the AWS bill, an audit trail, protection for personal data and proper access control. It had to get there without commercially licensed code and without changing the LiteLLM core, so the bank can keep taking upstream releases.

## What I built

I work on an outsourced contract in a two-engineer team, since August 2026: I built the extension layer and own delivery and planning; the lead engineer reviews and merges. Everything ships as a separate extension package plus admin pages on top of LiteLLM:

- **Tamper-evident audit log** — append-only and hash-chained, exportable to Sentinel.
- **Vietnamese PII guardrails** — detection of Vietnamese personal data, with a review flow for false positives.
- **SSO and an auditor role** for the people who review how the gateway is used.
- **Budget-aware routing** — requests are downgraded to a cheaper model as a budget runs low.
- **Alerts** — by email, SES and SNS, with editable templates.
- **Bulk onboarding** — teams and users imported from a spreadsheet.
- **Cross-account access** through assumed roles, X-Ray-linked traces, and Terraform for the AWS stack.

## How it works

The core piece is Bedrock cost reconciliation. Every day it checks the gateway's own spend records against Bedrock invocation logs and the AWS bill (queried with Athena), broken down by account, team, user and model, with Bedrock tax shown separately so the numbers line up with the invoice. When I validated it line by line against the real invoice, it exposed a 4× over-count, which I traced and fixed in the reconciliation. Because the controls live outside the LiteLLM core, upstream releases still merge cleanly.

## Outcome

Gateway spend now matches the real AWS bill, every request leaves an audit record that cannot be silently edited, and personal data is screened before it reaches a model. I wrote the architecture docs and runbooks for the handover. The work is ongoing: I still maintain and extend the gateway.

## Stack

- LiteLLM (open source) with a separate Python extension package
- AWS Bedrock, Athena, IAM, CloudWatch, SES, SNS, X-Ray
- Presidio-based PII guardrails
- Terraform
`,

  'voice-ordering-agent': `## The problem

A café wanted customers to order by talking, without waiting for staff at peak hours. A voice assistant in a real shop has to be friendly, get the order right, hand it to the till and take payment, and keep working when nobody is watching it.

## What I built

Bảo Bối is a cat-mascot ordering assistant for an F&B and AI-commerce company, where I work as Backend & AI Engineer on contract since May 2026. I built the ordering flow end to end:

- **Chat and real-time voice** — speech-to-text and text-to-speech over LiveKit, so customers can type or simply talk.
- **Drink suggestions by mood** — the assistant recommends drinks from how the customer feels.
- **Order dispatch** — the cart is pushed to the café's POS, and the customer gets a VietQR code to pay.
- **A review loop** — bad replies are turned into scenarios that staff can approve, so the assistant improves from real conversations.
- **A self-healing watchdog** — added after a LiveKit outage went unnoticed for two weeks, plus an admin page that checks every service the assistant depends on.

## How it works

Version 1 runs in the café. The customer talks to Bảo Bối on a tablet or phone; the LiveKit agent turns speech into text, the assistant builds the order, and the backend sends it to the POS and returns a VietQR. The watchdog restarts what has stopped instead of waiting for someone to notice.

Version 2 rebuilds it for many shops: a Go core with per-shop isolation through PostgreSQL row-level security, a Python LiveKit agent, and safe fallbacks when Redis is down. Each shop only ever sees its own data, enforced by the database rather than by application code alone.

## Outcome

Bảo Bối ran in a real café, taking orders by chat and voice and handing them to the POS with payment by VietQR. Version 2, the multi-shop rebuild, is the current work.

## Stack

- LiveKit (speech-to-text, text-to-speech) with a Python agent
- Go core service
- PostgreSQL with row-level security, Redis
- VietQR payment
`,

  'rag-enrollment-advisor': `## The problem

Hướng Nghiệp Á Âu is an academy with 19 branches. Its admissions advisors were buried in messages from prospective students, and any chatbot answering for them had to meet one hard rule: never invent a course or a price.

## What I built

I was the sole developer, freelance as AI Agent Consultant Engineer, from April to September 2026, and handed the system over at the end:

- **A 24/7 admissions chatbot** that answers prospective students on the academy's live CRM.
- **An advisor cockpit** — after each customer message, a background job drafts three replies and a lead summary for the advisor to pick from.
- **Grounded answers** — the CRM is the only source for prices and schedules; a course allow-list and topic pinning keep follow-up questions on the right course.
- **Image reading** through a self-hosted vision-language model, protected against SSRF.
- **A provider-agnostic LLM layer**, with routing between LLM providers set from a settings page.

## How it works

Retrieval is hybrid RAG: pgvector similarity search combined with Vietnamese full-text search, so both meaning and exact course names are matched. Anything with a price or a date is read from the CRM at answer time rather than from embedded documents, which is what stops the bot from making numbers up. The allow-list rejects courses that do not exist, and topic pinning keeps a conversation tied to the course it started on. The whole system runs on-prem inside the academy's network, behind nine end-to-end test suites that had to pass before handover.

## Outcome

Advisors accepted 97% of the drafted replies, so the cockpit took most of the typing off their hands while they stayed in control of what was sent. The system was handed over in September 2026.

## Stack

- Hybrid RAG: pgvector + Vietnamese full-text search on PostgreSQL
- Provider-agnostic LLM layer
- Self-hosted VLM for images
- On-prem deployment inside the client's network
`,

  'vas-accounting-erp': `## The problem

Businesses that run several companies needed one accounting platform that follows Vietnamese accounting rules (Circular 99/2025), produces consolidated reports across companies, and can be trusted by the accountants who use it every day. In accounting, a half-posted batch or an edit to a closed period is not a bug; it is a wrong set of books.

## What I built

I was the top contributor, from the first commit, in a three-engineer team, from 2025 to September 2026, when the platform was handed over:

- **Consolidated financial reporting under Circular 202**, end to end, with intercompany elimination and Excel export.
- **Fixed assets, loans and bank reconciliation** modules.
- **Safe posting** — atomic batch posting and period locking.
- **CI/CD** from GitHub Actions to GHCR, with Watchtower updating the containers on the client's own servers.

## How it works

The platform is multi-company: each company keeps its own books, and consolidation combines them while eliminating intercompany transactions, so the group report does not count the same money twice. Posting a batch of journal entries is all-or-nothing: either every entry lands or none does, so the ledger never ends up half-updated. Once a period is closed it is locked, and entries can no longer be posted into it. Releases are built by GitHub Actions and pushed to GHCR; Watchtower on the client's servers picks up new images, so deployment runs on the client's infrastructure.

## Outcome

The platform is used daily by 20 accountants, covering journal entries, trial balance, cash vouchers, customers and the financial reports built to Vietnamese standards. It was handed over in September 2026.

## Stack

- React frontend
- REST API
- PostgreSQL
- Docker images built with GitHub Actions, published to GHCR, deployed with Watchtower
`,

  'ipbms-patient-monitoring': `## The problem

Falls and seizures need a fast response, and caregivers cannot watch every camera all the time. Automatic detection only helps if staff trust it: a system that raises false alarms all day gets muted.

## What I built

IPBMS is a real-time patient monitoring system for Whammy Tech. From June 2025 to January 2026 I was AI Team Lead, leading four engineers across backend, frontend and mobile, and I owned all the AI work:

- **Fall and seizure detection** on live RTSP camera streams using YOLO pose estimation.
- **LLM-written incident reports**, so a caregiver gets a readable account of what happened, not just a raw alert.
- **A five-frame rule** — an alert fires only after the event is detected in five frames in a row.
- The detection feeds a real-time event dashboard, live alerts in the mobile app, a web admin portal for patients, cameras and caregivers, and an AI summary of each patient's recent events.

## How it works

Camera streams are read over RTSP and processed frame by frame. YOLO pose estimation finds people and their body keypoints, and the pose over time is used to spot a fall or a seizure. A single odd frame is not enough to alert: the event has to hold for five consecutive frames, which filters out the brief misdetections that cause most false alarms. When an alert does fire, an LLM writes the incident report that goes to caregivers.

## Outcome

The five-frame rule cut false alarms by 84% across 4,000 test cases. The system ran on-site on two real cameras.

## Stack

- YOLO pose estimation, OpenCV
- RTSP camera streams
- LLM-written incident reports
- Python
`,

  'neuradao-ai-trading': `## The problem

NEURADAO wanted a live AI trading platform, and wanted it fast: an empty repository at the start of October 2025, and a product people could use within weeks. The risk with a deadline like that is a demo that never becomes a working system.

## What I built

As Team Lead, Software Engineer on contract, I led three engineers. I set the architecture and the plan, and I wrote the core of the product myself:

- **The trading logic** behind the platform's AI trading agent, which users configure and whose performance they can follow.
- **An AI chatbot** that answers users' trading questions.
- **The automation backend** that runs the platform.
- **Deployment on AWS.**

The product around it includes a landing page, an earnings dashboard showing each user's returns, and a Chrome extension.

## How it works

The backend is split by language where it fits: TypeScript for the application services and Python for the trading and AI parts, with PostgreSQL as the shared store. Users set up the AI trading agent, the automation backend runs it, and results flow into the earnings dashboard. The chat assistant sits alongside so users can ask about the platform and their trades in plain language.

## Outcome

The platform went from an empty repository to live in 20 days, deployed on AWS: the landing page, the configurable AI trading agent, the chat assistant, the earnings dashboard and the Chrome extension, on top of the trading logic and automation backend I wrote.

## Stack

- TypeScript and Python
- PostgreSQL
- AWS
`,

  'cicca-fleet-k3s': `## The problem

I wanted one place to run my own services, this website included, that behaves like production rather than a pet server: declarative, observable and recoverable, across machines that are not in the same building or even the same CPU architecture.

## What I built

Cicca Fleet is my personal multi-site Kubernetes cluster:

- **k3s nodes** on cloud VPS machines plus an ARM64 Orange Pi at home, so the cluster is multi-arch.
- **A Tailscale mesh** connecting the sites.
- **GitOps with ArgoCD** using the app-of-apps pattern: the cluster's state lives in Git.
- **An in-cluster container registry** on MinIO, and **NFS storage** from a Synology NAS.
- **Observability** with Grafana, Mimir, Loki and Alloy, with alerting.
- **Public apps through Cloudflare Tunnel.**

## How it works

Every app is described in a Git repository; ArgoCD watches it and brings the cluster in line, so a change is a commit and a rollback is a revert. Images are pushed to the registry inside the cluster, and persistent data sits on the NAS over NFS. Nodes talk to each other over Tailscale whether they run in a data centre or on my desk. Metrics, logs and alerts flow into Grafana through Alloy, Mimir and Loki, so problems show up on a dashboard before a visitor notices them. Public traffic reaches services through Cloudflare Tunnel.

## Outcome

The fleet runs my projects in production, and this website — letranminhdat.com — is served from it.

## Stack

- k3s (Kubernetes), multi-arch (amd64 + ARM64)
- ArgoCD (app-of-apps GitOps)
- Tailscale, Cloudflare Tunnel
- MinIO registry, Synology NAS (NFS)
- Grafana, Mimir, Loki, Alloy
`,
};
