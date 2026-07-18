# IDX Exchange — AI Agentic Engineer Internship

OpenClaw-based multi-agent AI assistant for querying MLS real estate data
(rets_property + california_sold) via WhatsApp, using natural language
search, embeddings, and RAG.

## Progress

- [x] Week 0 — Environment setup (MySQL import scripts, connection test)
- [x] Week 1 — OpenClaw architecture fundamentals
- [x] Week 2 — Natural language property query parser
- [x] Week 3 — MySQL query layer (rets_property + california_sold)
- [x] Week 4 — Conversational multi-turn agent
- [ ] Week 5 — Market statistics agent
- [ ] Week 6 — Embeddings & vector search
- [ ] Week 7 — Recommendation engine
- [ ] Week 8 — RAG pipeline
- [ ] Week 9 — Multi-agent orchestration
- [ ] Week 10 — WhatsApp communication layer
- [ ] Week 11 — Email agents & safety guardrails
- [ ] Week 12 — Capstone demo

## Setup

\`\`\`bash
npm install
cp .env.example .env
\`\`\`

See week0-setup/import_databases.sh for MySQL import instructions.
Week 3 database query layer is implemented in src/db/propertyQueries.js.