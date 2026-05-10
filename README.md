# Agent360

**From agent activity to business value — in one 360° view.**

Agent360 is a **prototype** AI agent observability and optimization platform. It gives product, operations, engineering, and finance stakeholders a shared **360° view** of reliability, trust, cost, and business impact across an enterprise AI agent fleet — using realistic **illustrative data** for demos and walkthroughs (not a live production system).

## Why Agent360?

As companies scale AI agents across support, operations, sales, and internal workflows, visibility fragments. Engineering sees reliability and errors; finance sees spend; operations sees escalations and workload; leadership wants business outcomes. **Agent360** brings these perspectives into **one operational narrative** so teams can prioritize the same facts.

## Product Thesis

Agent360 helps teams move from disconnected activity metrics to shared business understanding:

- Which agents create **value**?
- Which agents **cost** too much relative to outcomes?
- Which agents do users **trust**?
- Which agents need **operational** attention before customers feel it?

## Core Views

### Value Delivered

Measures whether AI agents create business value through **time saved**, **workload reduced**, **successful outcomes**, and **revenue influence** — so value is discussable in business terms, not only model metrics.

### Cost Optimization

Helps teams understand **AI spend**, **model routing efficiency**, **premium model overuse**, and **cost per successful outcome** — connecting FinOps thinking to what actually shipped for users.

### Agent Effectiveness & Trust

Shows whether agents are **useful and trusted** through task success, human corrections, escalation signals, and fleet-wide trust indicators — bridging “works in the lab” with “works in the wild.”

### Operational Health

Monitors **runtime reliability**, **latency**, **availability**, **errors**, **model/provider health**, and **dependency/tooling issues** — the layer that keeps agents dependable at scale.

## Demo Scenario

The prototype is framed around a **generic enterprise retailer** using Agent360 to monitor a fleet of AI agents across customer-facing and internal workflows (illustrative only).

Example agents:

- Shopping Concierge Agent  
- Product Q&A Agent  
- Order & Delivery Agent  
- Returns & Refunds Agent  
- Customer Support Copilot  
- Merchandising Insights Agent  
- Inventory & Fulfillment Agent  

## What This Prototype Demonstrates

From a product-management lens, Agent360 showcases:

- **Multidimensional** AI observability (value, cost, trust, operations — not a single dashboard)
- **Fleet-wide** agent monitoring and comparison
- **Business value** framing alongside technical signals
- **Cost-to-value** thinking (unit economics of successful outcomes)
- **Human trust** signals next to automation metrics
- **Enterprise stakeholder** perspectives in one UI
- **AI-native** dashboard patterns (summaries, drill-downs, dense-but-readable enterprise dark UI)

## Screens & Features

- Landing / vision page with **360°** product positioning  
- **Four** main business/operational views (Value, Cost, Trust, Health)  
- **Customer feedback** page with ratings and structured reviews  
- **AI feedback summaries** in operational flows  
- Compact **global footer** with feedback entry  
- **Premium dark** enterprise dashboard aesthetic  
- Logo and asset previews under `public/` (SVG + PNG exports)

## Running Locally

```bash
npm install
npm run dev
```

Other scripts (when useful):

- `npm run build` — production build  
- `npm run lint` — ESLint  

There is no `npm test` script in this repo.

## Data note

Metrics, reviews, and narratives in this repo are **illustrative** for product storytelling. They do not represent a specific customer deployment or live production telemetry.
