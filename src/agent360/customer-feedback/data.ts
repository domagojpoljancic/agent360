import { computeFeedbackStats } from './stats'
import { additionalEnterpriseFeedbackReviews } from './feedbackReviewsAdditional'
import { evaluationProgramFeedbackReviews } from './feedbackEvaluationProgramReviews'

export type FeedbackCategory =
  | 'Value Delivered'
  | 'Cost Optimization'
  | 'Agent Effectiveness & Trust'
  | 'Operational Health'
  | 'Governance'

export type Sentiment = 'Positive' | 'Mixed' | 'Critical'

/** Stakeholder AI program maturity (evaluation-program cohort). */
export type AIMaturityLevel =
  | 'AI Beginner'
  | 'Early AI Adoption'
  | 'Scaling AI Operations'
  | 'Mature AI Platform Organization'
  | 'Enterprise AI Governance Phase'

/** Agent360 product areas a reviewer explicitly exercised in the pilot. */
export type ExploredAgent360Page =
  | 'Overview'
  | 'Value Delivered'
  | 'Cost Optimization'
  | 'Agent Effectiveness & Trust'
  | 'Operational Health'
  | 'Governance'

export type CustomerReview = {
  id: string
  name: string
  /** Job title (always present; legacy cards rely on this). */
  role: string
  /** One-line org / program context (always present). */
  companyContext: string
  rating: number
  sentiment: Sentiment
  /** Primary thematic bucket for filters. */
  category: FeedbackCategory
  review: string
  likes: string
  improves: string
  /** Optional: same as `role` when using extended persona fields; UI may prefer `title` when set. */
  title?: string
  department?: string
  industry?: string
  companySize?: string
  region?: string
  aiMaturity?: AIMaturityLevel
  aiExperience?: string
  competingTools?: string
  exploredPages?: ExploredAgent360Page[]
  /** When set, shown as the primary “concerns” copy; falls back to `improves`. */
  concerns?: string
}

export type ReviewFilter =
  | 'all'
  | 'Positive'
  | 'Mixed'
  | 'Critical'
  | 'Value Delivered'
  | 'Cost Optimization'
  | 'Trust'
  | 'Operational Health'
  | 'Governance'

export const customerFeedbackReviews: CustomerReview[] = [
  // Batch 1 (base) + batch 2 (`additionalEnterpriseFeedbackReviews`) + batch 3 evaluation program (`evaluationProgramFeedbackReviews`).
  {
    id: 'fb-elena-whitfield',
    name: 'Elena Whitfield',
    role: 'VP Product',
    companyContext: 'Global omnichannel retailer · Digital Product',
    rating: 5,
    sentiment: 'Positive',
    category: 'Value Delivered',
    review:
      'Makes AI performance legible for product and ops without asking teams to live in raw logs. Executive readouts finally match what we see in workflows.',
    likes: 'Shared vocabulary across PMs and ops; clear tie from agent behavior to customer outcomes.',
    improves: 'Deeper drill-down from summary tiles into cohort-level exceptions.',
  },
  {
    id: 'fb-marcus-okonkwo',
    name: 'Marcus Okonkwo',
    role: 'AI Platform Lead',
    companyContext: 'Enterprise software · Platform & ML',
    rating: 4,
    sentiment: 'Mixed',
    category: 'Operational Health',
    review:
      'Dependency and latency signals caught two provider degradations before our own paging fired. Integration work was heavier than the sales deck implied.',
    likes: 'Cross-provider health in one surface; incident context is easier to hand off.',
    improves: 'First-time connector setup and permission modeling need clearer guardrails.',
  },
  {
    id: 'fb-priya-natarajan',
    name: 'Priya Natarajan',
    role: 'Head of Customer Support',
    companyContext: 'Healthcare services · Member Experience',
    rating: 5,
    sentiment: 'Positive',
    category: 'Value Delivered',
    review:
      'We measured a real drop in repeat contacts after aligning coaching to Agent360’s quality signals. Supervisors spend less time arguing about “what good looks like.”',
    likes: 'Operational impact is visible week over week; workload per agent feels more manageable.',
    improves: 'Workforce management export formats could match our WFM vendor out of the box.',
  },
  {
    id: 'fb-daniel-reeves',
    name: 'Daniel Reeves',
    role: 'Support Operations Manager',
    companyContext: 'Telecommunications · CX Operations',
    rating: 4.5,
    sentiment: 'Positive',
    category: 'Operational Health',
    review:
      'Queue health and latency visibility reduced our blind spots during peak. We can show leadership a single narrative instead of three dashboards.',
    likes: 'Alerting tied to customer-impacting latency, not just infra pings.',
    improves: 'More presets for regional routing and after-hours escalation paths.',
  },
  {
    id: 'fb-nina-kowalski',
    name: 'Nina Kowalski',
    role: 'Site Reliability Engineer',
    companyContext: 'Fintech · Reliability',
    rating: 3.5,
    sentiment: 'Mixed',
    category: 'Operational Health',
    review:
      'Useful for correlating model tier with tail latency. I still want stronger evidence when a third-party SDK is the real culprit versus our agent stack.',
    likes: 'Honest about provider variance; good starting point for blameless reviews.',
    improves: 'Deeper traces into downstream tool calls without exporting everything to a separate APM.',
  },
  {
    id: 'fb-hiro-tanaka',
    name: 'Hiro Tanaka',
    role: 'Finance Business Partner',
    companyContext: 'Consumer electronics · FP&A',
    rating: 4,
    sentiment: 'Mixed',
    category: 'Cost Optimization',
    review:
      'Model routing and spend views shortened our monthly AI review with engineering. ROI framing is directionally right but still leans on assumptions we have to defend.',
    likes: 'Cost transparency by use case; easier to flag premium model overuse.',
    improves: 'Clearer documentation of ROI assumptions and sensitivity to volume shifts.',
  },
  {
    id: 'fb-clare-donovan',
    name: 'Clare Donovan',
    role: 'Data Privacy Officer',
    companyContext: 'Insurance · Privacy Office',
    rating: 2.5,
    sentiment: 'Critical',
    category: 'Governance',
    review:
      'The governance story is headed in the right direction, but I need immutable audit trails and retention controls spelled out before we expand past pilot regions.',
    likes: 'Intent to surface data lineage and policy tags is encouraging.',
    improves: 'Enterprise-grade evidence packs for DPIA and regulator-style inquiries.',
  },
  {
    id: 'fb-andre-silva',
    name: 'André Silva',
    role: 'Trust & Safety Lead',
    companyContext: 'Social commerce · Integrity',
    rating: 4,
    sentiment: 'Mixed',
    category: 'Agent Effectiveness & Trust',
    review:
      'Human correction loops are visible, which helps us trust rollout pace. Escalation paths for edge-case harm categories still feel manual.',
    likes: 'Explainability hooks and review queues are aligned with how T&S actually works.',
    improves: 'Faster playbook templates for policy updates across locales.',
  },
  {
    id: 'fb-james-wright',
    name: 'James Wright',
    role: 'Compliance Lead',
    companyContext: 'Banking · Second line risk',
    rating: 3,
    sentiment: 'Critical',
    category: 'Governance',
    review:
      'Trust metrics are promising on paper. For enterprise rollout I need reproducible evidence trails—not screenshots—and stronger segregation-of-duties on config changes.',
    likes: 'Audit-oriented language in the UI; roles mapped more clearly than most vendors.',
    improves: 'Formal control mapping (who approved what, when) exportable to GRC tools.',
  },
  {
    id: 'fb-amy-liu',
    name: 'Amy Liu',
    role: 'Product Analyst',
    companyContext: 'B2B SaaS · Growth & Product',
    rating: 3.5,
    sentiment: 'Mixed',
    category: 'Value Delivered',
    review:
      'Strong optimization insights, but the jump from metrics to “so what” for the business still takes analyst time. Good for exploration, not yet turnkey for every PM.',
    likes: 'Segmentation ideas; experiment-friendly views.',
    improves: 'Sharper narrative templates for non-technical stakeholders.',
  },
  {
    id: 'fb-rachel-meyer',
    name: 'Rachel Meyer',
    role: 'Customer Success Director',
    companyContext: 'Logistics technology · CS Leadership',
    rating: 5,
    sentiment: 'Positive',
    category: 'Value Delivered',
    review:
      'Our enterprise customers ask harder questions about AI reliability. Agent360 gives CSMs credible answers and reduces “we’ll get back to you” moments.',
    likes: 'Customer-facing summaries we can sanitize for QBRs.',
    improves: 'Multi-tenant roll-up for accounts with many child workspaces.',
  },
  {
    id: 'fb-omar-haddad',
    name: 'Omar Haddad',
    role: 'Engineering Manager',
    companyContext: 'E-commerce marketplace · Buyer experience',
    rating: 4.5,
    sentiment: 'Positive',
    category: 'Agent Effectiveness & Trust',
    review:
      'Engineers finally see which prompts and tools drive bad outcomes. Review load dropped because corrections are routed with context.',
    likes: 'Human-in-the-loop flows that don’t feel bolted on.',
    improves: 'APIs for bulk annotation sync with our issue tracker.',
  },
  {
    id: 'fb-steffi-brandt',
    name: 'Steffi Brandt',
    role: 'Prompt Engineer',
    companyContext: 'Automotive · IT & Innovation',
    rating: 5,
    sentiment: 'Positive',
    category: 'Agent Effectiveness & Trust',
    review:
      'Version drift was killing us. Side-by-side evals and trust signals make it obvious when a “small” prompt change regresses production behavior.',
    likes: 'Clear linkage between prompt changes and outcome deltas.',
    improves: 'Bulk diff tools across environments.',
  },
  {
    id: 'fb-devon-ellis',
    name: 'Devon Ellis',
    role: 'ML Evaluation Engineer',
    companyContext: 'Media streaming · Personalization',
    rating: 5,
    sentiment: 'Positive',
    category: 'Agent Effectiveness & Trust',
    review:
      'Evaluation is no longer a spreadsheet silo. We can align offline rubrics with what operations actually sees live.',
    likes: 'Consistent rubric language between research and production monitoring.',
    improves: 'Native connectors for our labeling vendor would save glue code.',
  },
  {
    id: 'fb-lucia-fernandez',
    name: 'Lucía Fernández',
    role: 'Conversational Design Lead',
    companyContext: 'Travel & hospitality · Digital CX',
    rating: 4.5,
    sentiment: 'Positive',
    category: 'Value Delivered',
    review:
      'Design and ops share one story on containment, handoffs, and tone failures. Onboarding designers took less time than expected.',
    likes: 'Workflow visibility that respects conversation structure, not just KPIs.',
    improves: 'Persona-based journey overlays for seasonal campaigns.',
  },
  {
    id: 'fb-kenji-morita',
    name: 'Kenji Morita',
    role: 'BI Lead',
    companyContext: 'Wholesale distribution · Analytics CoE',
    rating: 4.5,
    sentiment: 'Positive',
    category: 'Value Delivered',
    review:
      'Executive visibility improved: we can show cost, quality, and throughput without rebuilding a semantic layer from scratch.',
    likes: 'Metrics that map to board-level questions on AI adoption.',
    improves: 'Certified semantic definitions for our warehouse metrics.',
  },
  {
    id: 'fb-vanessa-holt',
    name: 'Vanessa Holt',
    role: 'CTO',
    companyContext: 'Enterprise grocery · Technology',
    rating: 5,
    sentiment: 'Positive',
    category: 'Value Delivered',
    review:
      'Finally a layer that connects model choices to operational risk and customer impact. It’s become part of our monthly tech council pack.',
    likes: 'Credible narrative for the board on AI operational maturity.',
    improves: 'Faster time-to-value for acquisitions with messy legacy integrations.',
  },
  {
    id: 'fb-michael-brennan',
    name: 'Michael Brennan',
    role: 'COO',
    companyContext: 'Industrial supply · Operations',
    rating: 4,
    sentiment: 'Mixed',
    category: 'Cost Optimization',
    review:
      'Cost controls are real, but I need more confidence forecasting spend when we scale seasonal volume. Dashboard density is still high for my team.',
    likes: 'Model routing discipline; fewer surprise invoices from premium models.',
    improves: 'Simpler executive slice: three KPIs, not twenty tiles.',
  },
  {
    id: 'fb-sarah-kim',
    name: 'Sarah Kim',
    role: 'Revenue Operations Lead',
    companyContext: 'High-growth SaaS · RevOps',
    rating: 4.5,
    sentiment: 'Positive',
    category: 'Value Delivered',
    review:
      'Sales engineering and CS stopped debating whose spreadsheet is right. Agent quality metrics now show up in pipeline risk reviews where they belong.',
    likes: 'Cross-functional alignment on what “good” AI-assisted selling looks like.',
    improves: 'CRM-native objects for key metrics would reduce swivel-chair work.',
  },
  {
    id: 'fb-tomas-navarro',
    name: 'Tomás Navarro',
    role: 'Inventory Operations Manager',
    companyContext: 'Fast fashion retail · Supply chain',
    rating: 5,
    sentiment: 'Positive',
    category: 'Operational Health',
    review:
      'Stock-out and recommendation agents were opaque before. We see latency and failure modes early enough to reroute before stores feel it.',
    likes: 'Operational impact tied to physical outcomes, not abstract scores.',
    improves: 'Store-level granularity for regional pilots.',
  },
  {
    id: 'fb-isabelle-marchand',
    name: 'Isabelle Marchand',
    role: 'Merchandising Lead',
    companyContext: 'Department store group · Merchandising',
    rating: 4,
    sentiment: 'Mixed',
    category: 'Value Delivered',
    review:
      'Helpful for spotting when styling assistants over-recommend distressed inventory. I still want faster iteration loops with campaign calendars.',
    likes: 'Clear read on agent influence on conversion and margin guardrails.',
    improves: 'Tighter integration with planning calendars and promo windows.',
  },
  {
    id: 'fb-jordan-lee',
    name: 'Jordan Lee',
    role: 'Frontline Support Agent',
    companyContext: 'Shared services · BPO partnership',
    rating: 2,
    sentiment: 'Critical',
    category: 'Agent Effectiveness & Trust',
    review:
      'Suggestions sometimes contradict our knowledge base and the UI doesn’t always say why. I’m double-checking everything, which eats the time the tool was supposed to save.',
    likes: 'When it cites a source correctly, it speeds up simple cases.',
    improves: 'Stronger grounding indicators and one-click “report bad suggestion” with feedback loop visibility.',
  },
  {
    id: 'fb-fatima-alrashid',
    name: 'Fatima Al-Rashid',
    role: 'Procurement Lead',
    companyContext: 'Energy sector · IT procurement',
    rating: 3.5,
    sentiment: 'Mixed',
    category: 'Cost Optimization',
    review:
      'Vendor comparisons and commit modeling helped our negotiation narrative. Contracting for audit rights and data handling still took longer than anticipated.',
    likes: 'Transparent unit economics we can share with finance.',
    improves: 'Standard enterprise DPA schedules and security appendix alignment.',
  },
  {
    id: 'fb-greta-lindholm',
    name: 'Greta Lindholm',
    role: 'Technical Program Manager',
    companyContext: 'Cloud-first retailer · Program Office',
    rating: 4.5,
    sentiment: 'Positive',
    category: 'Operational Health',
    review:
      'Cut through cross-team thrash on incidents. RACI is easier when everyone references the same health and dependency view.',
    likes: 'Program-friendly timelines linking releases to observed regressions.',
    improves: 'Milestone templates for large cutovers (e.g., model migrations).',
  },
  {
    id: 'fb-david-osei',
    name: 'David Osei',
    role: 'Regional Operations Director',
    companyContext: 'Quick-service restaurant chain · Field ops',
    rating: 5,
    sentiment: 'Positive',
    category: 'Value Delivered',
    review:
      'Regional leads finally see which assistant flows drive rework at the store. We retrained two playbooks and saw fewer overnight escalations.',
    likes: 'Practical, ops-grounded metrics; credible with franchise partners.',
    improves: 'Offline-capable summaries for markets with brittle connectivity.',
  },
  {
    id: 'fb-patricia-nguyen',
    name: 'Patricia Nguyen',
    role: 'Governance Lead',
    companyContext: 'Public-sector contractor · GRC',
    rating: 3,
    sentiment: 'Critical',
    category: 'Governance',
    review:
      'Policy tags and workflow visibility are useful prototypes. For our environment, change management and evidence retention need to be boring, exhaustive, and boring again.',
    likes: 'Thoughtful language on accountability and roles.',
    improves: 'Configurable retention policies and signed export manifests.',
  },
  {
    id: 'fb-ben-carter',
    name: 'Ben Carter',
    role: 'Internal Knowledge Manager',
    companyContext: 'Professional services · Knowledge',
    rating: 4.5,
    sentiment: 'Positive',
    category: 'Agent Effectiveness & Trust',
    review:
      'We can see when agents drift from canonical content and where experts correct them. Knowledge hygiene work finally has measurable leverage.',
    likes: 'Human corrections surfaced as first-class data, not side chats.',
    improves: 'Bulk reconcile tools when source systems update weekly.',
  },
  {
    id: 'fb-monique-dubois',
    name: 'Monique Dubois',
    role: 'Customer Experience Director',
    companyContext: 'Luxury retail · CX',
    rating: 5,
    sentiment: 'Positive',
    category: 'Value Delivered',
    review:
      'Premium brand standards mean we cannot afford tone-deaf automation. Agent360 makes quality and recovery metrics visible without drowning the team in charts.',
    likes: 'Balance of qualitative signals with operational rigor.',
    improves: 'Localized nuance dashboards for high-touch markets.',
  },
  {
    id: 'fb-sven-andersson',
    name: 'Sven Andersson',
    role: 'Data Engineer',
    companyContext: 'Pharmaceutical commercial · Data platform',
    rating: 4,
    sentiment: 'Mixed',
    category: 'Operational Health',
    review:
      'Pipelines into our lake landed faster than expected, but schema evolution notices could be louder. We almost broke a downstream compliance report.',
    likes: 'Sensible defaults for batch exports; decent observability hooks.',
    improves: 'Contract testing or deprecation warnings on metric schema changes.',
  },
  {
    id: 'fb-hannah-oconnor',
    name: "Hannah O'Connor",
    role: 'Skeptical Frontline Employee',
    companyContext: 'Construction supply · Branch network',
    rating: 3.5,
    sentiment: 'Mixed',
    category: 'Agent Effectiveness & Trust',
    review:
      'I’m not against the assistant, but I need to trust it on the yard floor. Sometimes it’s right, sometimes it’s confidently wrong about stock and substitutes.',
    likes: 'When it shows reasoning tied to inventory snapshots, I use it.',
    improves: 'Clearer confidence cues and faster path to a human who owns the answer.',
  },
  ...additionalEnterpriseFeedbackReviews,
  // Generated module infers string literals loosely; narrow at merge boundary.
  ...(evaluationProgramFeedbackReviews as unknown as CustomerReview[]),
]

/** Derived metrics for the feedback page, footer, and any other surfaces — always in sync with `customerFeedbackReviews`. */
export const feedbackStats = computeFeedbackStats(customerFeedbackReviews)

export { computeFeedbackStats, type FeedbackStats } from './stats'

export function matchesReviewFilter(review: CustomerReview, filter: ReviewFilter): boolean {
  if (filter === 'all') return true
  if (filter === 'Positive') return review.sentiment === 'Positive'
  if (filter === 'Mixed') return review.sentiment === 'Mixed'
  if (filter === 'Critical') return review.sentiment === 'Critical'
  if (filter === 'Trust') return review.category === 'Agent Effectiveness & Trust'
  return review.category === filter
}
