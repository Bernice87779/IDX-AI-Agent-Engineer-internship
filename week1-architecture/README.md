# Week 1 — OpenClaw Architecture Fundamentals

## Core Components
- Skills — modular capability units (property search, market stats, RAG, etc.)
- Channels — communication interfaces: WhatsApp, email, web
- Sessions — per-user conversation state and memory
- Tools — typed async functions the agent can call
- Memory — short-term session state + long-term vector storage
- Orchestrator — routes queries to the correct skill/agent

## Workflow Diagram

```
User (WhatsApp)
      |
      v
OpenClaw Gateway / Runtime
      |
      v
  Skill Selector (intent classification)
      |
      v
  Tool Execution
   /          \
rets_property  california_sold
   \          /
      v
  Memory Update (session state)
      |
      v
  Response formatted for WhatsApp
      |
      v
    User
```