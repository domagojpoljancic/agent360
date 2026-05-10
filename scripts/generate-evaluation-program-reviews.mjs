/**
 * Writes src/agent360/customer-feedback/feedbackEvaluationProgramReviews.ts
 * Run: node scripts/generate-evaluation-program-reviews.mjs
 */
import { writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const out = join(__dirname, '../src/agent360/customer-feedback/feedbackEvaluationProgramReviews.ts')

const maturities = [
  'AI Beginner',
  'Early AI Adoption',
  'Scaling AI Operations',
  'Mature AI Platform Organization',
  'Enterprise AI Governance Phase',
]

const pages = {
  exec: ['Overview', 'Value Delivered'],
  finance: ['Value Delivered', 'Cost Optimization'],
  ops: ['Operational Health', 'Agent Effectiveness & Trust'],
  sre: ['Operational Health', 'Overview'],
  gov: ['Governance', 'Agent Effectiveness & Trust'],
  trust: ['Agent Effectiveness & Trust', 'Operational Health'],
  cost: ['Cost Optimization', 'Value Delivered'],
  value: ['Value Delivered', 'Governance'],
  mixedCx: ['Agent Effectiveness & Trust', 'Value Delivered'],
}

/** Hand-authored, role-aware seeds (not templated). */
const seeds = [
  {
    slug: 'catherine-blake-cfo',
    name: 'Catherine Blake',
    role: 'Chief Financial Officer',
    dept: 'Finance',
    industry: 'Retail',
    size: 'Enterprise (~12k employees)',
    region: 'United States',
    maturity: 'Scaling AI Operations',
    aiExp: 'Overseeing AI line items for the first time; team recently consolidated vendor spend.',
    tools: 'Workday + internal Power BI; compared notes to OpenAI usage exports.',
    explore: 'finance',
    category: 'Cost Optimization',
    sentiment: 'Positive',
    rating: 4.5,
    review: `My mandate in the pilot was blunt: prove we can explain AI spend the way we explain payroll. I lived in Value Delivered and Cost Optimization for two weeks—skipped Operational Health almost entirely. The Cost Optimization page helped us identify that premium models were handling low-complexity refund flows that a mid-tier route could cover. Finance finally has cost-per-resolution language we can defend in a budget review.`,
    likes: `Spend segmentation by workflow and “premium overuse” callouts without naming individuals.`,
    concerns: `Forecasting still needs clearer formulas in the UI—our FP&A team rebuilt part of the model offline.`,
  },
  {
    slug: 'diego-ramos-sre',
    name: 'Diego Ramos',
    role: 'Principal Site Reliability Engineer',
    dept: 'Platform Reliability',
    industry: 'Fintech',
    size: 'Mid-market (~2k)',
    region: 'Brazil',
    maturity: 'Mature AI Platform Organization',
    aiExp: 'Managing inference paths for payments copilots; migrated from Grafana-only views last year.',
    tools: 'Datadog + Grafana; Operational Health feels closer to Datadog than most AI dashboards we evaluated.',
    explore: 'sre',
    category: 'Operational Health',
    sentiment: 'Positive',
    rating: 5,
    review: `I did not touch Value Delivered. My evaluation path was Operational Health end-to-end: provider latency, retries, saturation, and failure bursts. The view exposed retries and provider instability we previously only saw buried in logs. Compared to our Datadog boards, Agent360 ties failures to agent sessions without me writing custom joins.`,
    likes: `Incident-shaped timelines and honest provider attribution.`,
    concerns: `Rate-limit annotations could surface quota headers when vendors throttle silently.`,
  },
  {
    slug: 'imogen-clarke-compliance',
    name: 'Imogen Clarke',
    role: 'Senior Compliance Officer',
    dept: 'Second Line Risk',
    industry: 'Banking',
    size: 'Global bank (~45k)',
    region: 'United Kingdom',
    maturity: 'Enterprise AI Governance Phase',
    aiExp: 'Evaluating AI governance tooling after a regulatory letter on model documentation.',
    tools: 'Internal GRC archive; legacy BI for exceptions—nothing agent-native until this pilot.',
    explore: 'gov',
    category: 'Governance',
    sentiment: 'Mixed',
    rating: 3.5,
    review: `I focused on Governance and Agent Effectiveness & Trust: evidence trails, trust scoring, and human corrections. The narrative is adult, but trust scoring still feels too abstract for committee packs—we need the score decomposed into inspectable factors. Auditability stops short of what external reviewers would call a complete chain for some toggles.`,
    likes: `Role language and retention thinking is visible in the UI, not bolted on in PDFs.`,
    concerns: `Stronger immutable logs for policy changes and exports that map cleanly to our GRC tool.`,
  },
  {
    slug: 'minseo-paik-support-ops',
    name: 'Minseo Paik',
    role: 'Support Operations Lead',
    dept: 'Global CX Operations',
    industry: 'SaaS',
    size: 'Enterprise (~6k)',
    region: 'South Korea',
    maturity: 'Early AI Adoption',
    aiExp: 'Recently deployed first support agent; replacing a rules-based chatbot.',
    tools: 'Zendesk + legacy support analytics; missed cross-tool joins Agent360 provides.',
    explore: 'mixedCx',
    category: 'Agent Effectiveness & Trust',
    sentiment: 'Positive',
    rating: 4.5,
    review: `Pilot goal: see escalations and quality in one place. I spent most time in Agent Effectiveness & Trust, with Value Delivered for leadership readouts only. Trust scoring became much more useful after we correlated escalations with confidence mismatches. Handoff visibility finally matches how supervisors coach.`,
    likes: `Escalation reasons tied to rubric dimensions, not vanity CSAT.`,
    concerns: `Onboarding for non-technical team leads is still dense—too many metrics before the first “aha”.`,
  },
  {
    slug: 'helmut-weber-cio',
    name: 'Helmut Weber',
    role: 'Chief Information Officer',
    dept: 'Enterprise IT',
    industry: 'Manufacturing',
    size: 'Enterprise (~20k)',
    region: 'Germany',
    maturity: 'Scaling AI Operations',
    aiExp: 'Balancing plant-floor pilots with corporate IT standards.',
    tools: 'ServiceNow + internal observability; compared rollout narrative to Azure AI Studio summaries.',
    explore: 'exec',
    category: 'Value Delivered',
    sentiment: 'Positive',
    rating: 4,
    review: `I used Overview and Value Delivered intentionally—I needed a board-safe storyline, not another engineering-only tool. Executives immediately understood Value Delivered, but some operations managers wanted workflow-level drilldowns that are still a click too deep. Cross-team alignment improved once product and ops referenced the same tiles.`,
    likes: `Strategic visibility without forcing everyone into raw telemetry.`,
    concerns: `Executive one-pagers would help; current summary density varies by workspace.`,
  },
  {
    slug: 'sofia-aguilar-fin-analyst',
    name: 'Sofía Aguilar',
    role: 'Finance Transformation Analyst',
    dept: 'FP&A',
    industry: 'Hospitality',
    size: 'Large (~8k)',
    region: 'Mexico',
    maturity: 'AI Beginner',
    aiExp: 'First time modeling agent costs beyond “API invoice totals”.',
    tools: 'Excel-heavy; triangulated against OpenAI dashboard snapshots.',
    explore: 'finance',
    category: 'Cost Optimization',
    sentiment: 'Mixed',
    rating: 3.5,
    review: `I was asked to validate ROI assumptions. Cost Optimization and Value Delivered were my home pages. The optimization recommendations need clearer assumptions—when volume shifts seasonally, the recommended routing tier jumps without showing sensitivity. Useful directionally; not yet something I’d sign without footnotes.`,
    likes: `Premium model overuse is visible by intent family—finally a finance-friendly slice.`,
    concerns: `Embedded sensitivity tables next to each recommendation would save offline rework.`,
  },
  {
    slug: 'aaron-mensah-secops',
    name: 'Aaron Mensah',
    role: 'Security Operations Manager',
    dept: 'Cyber Defense',
    industry: 'Insurance',
    size: 'Enterprise (~15k)',
    region: 'Canada',
    maturity: 'Enterprise AI Governance Phase',
    aiExp: 'Evaluating how agent tooling surfaces privileged actions and tool calls.',
    tools: 'Splunk SOAR + internal dashboards; wanted fewer swivel-chair hops than LangSmith for exec views.',
    explore: 'ops',
    category: 'Operational Health',
    sentiment: 'Mixed',
    rating: 4,
    review: `I stayed in Operational Health and Trust to see if incidents and risky tool patterns surface early. Operational metrics are excellent, but alert fatigue arrived fast—defaults page like a cautious SRE, not a lean SOC rotation. Trust views help, yet workflow ownership for who acknowledges an agent risk is still fuzzy.`,
    likes: `Honest correlation between failures and customer-visible symptoms.`,
    concerns: `Progressive alerting (signal → ticket → page) and clearer on-call RACI in-product.`,
  },
  {
    slug: 'yulia-novak-ml-eng',
    name: 'Yulia Novak',
    role: 'ML Platform Engineer',
    dept: 'AI Platform',
    industry: 'eCommerce marketplace',
    size: 'Enterprise (~10k)',
    region: 'Poland',
    maturity: 'Mature AI Platform Organization',
    aiExp: 'Migrating evaluation workflows from LangSmith + internal Grafana panels.',
    tools: 'LangSmith for traces; Agent360 for stakeholder-ready health narratives.',
    explore: 'sre',
    category: 'Operational Health',
    sentiment: 'Positive',
    rating: 4.5,
    review: `I explored Operational Health deeply—latency percentiles, error taxonomy, provider degradation. Compared to LangSmith alone, this is closer to how SREs think: time-bounded incidents, not infinite trace search. Model degradation during deploy windows showed up without a custom panel.`,
    likes: `Provider comparison language that doesn’t pretend all SLAs are equal.`,
    concerns: `Deeper export of trace IDs for teams that still debug in LangSmith.`,
  },
  {
    slug: 'gregory-holt-cro',
    name: 'Gregory Holt',
    role: 'Chief Revenue Officer',
    dept: 'GTM Leadership',
    industry: 'B2B SaaS',
    size: 'Scale-up (~1.2k)',
    region: 'United States',
    maturity: 'Early AI Adoption',
    aiExp: 'Pushing sales copilots while protecting brand tone.',
    tools: 'Salesforce analytics + spreadsheets; wanted cleaner exec summaries than internal BI.',
    explore: 'exec',
    category: 'Value Delivered',
    sentiment: 'Positive',
    rating: 4.5,
    review: `I only had time for Overview and Value Delivered. My evaluation criteria were simple: can I explain pipeline risk from AI quality without a data scientist in the room? Yes—with caveats. The narrative connects rework and cycle time to assistant behavior in language RevOps trusts.`,
    likes: `Readable outcome framing for QBRs.`,
    concerns: `CRM-native objects for two weekly KPIs would reduce manual pulls.`,
  },
  {
    slug: 'nour-el-din-audit',
    name: "Nour el-Din Farouk",
    role: 'Internal Audit Manager',
    dept: 'Internal Audit',
    industry: 'Energy',
    size: 'Enterprise (~25k)',
    region: 'Egypt',
    maturity: 'Enterprise AI Governance Phase',
    aiExp: 'Sampling AI-assisted financial controls for the first time.',
    tools: 'ACL + PDF workpapers; needs stronger export discipline than legacy chatbot logs.',
    explore: 'gov',
    category: 'Governance',
    sentiment: 'Critical',
    rating: 2.5,
    review: `I audited Governance and Trust flows, not pricing pages. Promising, but sampling still requires manual screenshots for some controls. Weak evidence trails on configuration changes mean I cannot rely on this alone for sign-off—yet. Intelligent critique, not a dismissal: fix the chain and we’re credible.`,
    likes: `The product vocabulary matches how auditors ask questions.`,
    concerns: `Signed exports, hash manifests, and control IDs that survive external review.`,
  },
  {
    slug: 'lena-bergstrom-procurement',
    name: 'Lena Bergström',
    role: 'Head of Enterprise Procurement',
    dept: 'Procurement',
    industry: 'Telecom',
    size: 'Enterprise (~18k)',
    region: 'Sweden',
    maturity: 'Scaling AI Operations',
    aiExp: 'Negotiating AI vendor commits with engineering pushback on “unknown growth”.',
    tools: 'SAP Ariba + engineering Grafana cost tiles—wanted one story for committees.',
    explore: 'finance',
    category: 'Cost Optimization',
    sentiment: 'Mixed',
    rating: 4,
    review: `Evaluation path: Cost Optimization and Value Delivered. Procurement evaluation packs improved our renewal conversation, but contract caps still needed finance to rebuild assumptions. I care about spend visibility and defensible ROI—not latency charts, which I deliberately ignored.`,
    likes: `Unit economics narrative that doesn’t shame engineering publicly.`,
    concerns: `Versioned assumption worksheets with audit-friendly change history.`,
  },
  {
    slug: 'mariana-silva-clinical',
    name: 'Mariana Silva',
    role: 'Clinical Quality Director',
    dept: 'Clinical Operations',
    industry: 'Healthcare',
    size: 'IDN (~9k)',
    region: 'Portugal',
    maturity: 'Early AI Adoption',
    aiExp: 'Piloting nursing assistant nudges; cautious on patient safety claims.',
    tools: 'Epic reporting + manual chart audits; compared trust views to internal incident reviews.',
    explore: 'trust',
    category: 'Agent Effectiveness & Trust',
    sentiment: 'Mixed',
    rating: 4,
    review: `I explored Agent Effectiveness & Trust and Governance. Explainability for clinical adjacent suggestions is improving, but I still want line-level provenance for policy citations. Trust score opacity remains a concern when nurses escalate—scores need to map to “safe to follow” guidance, not abstract indexes.`,
    likes: `Human correction loops are visible and attributable.`,
    concerns: `Clearer calibration narratives for clinical risk tiers and simpler nurse-facing summaries.`,
  },
  {
    slug: 'viktor-han-aviation-ops',
    name: 'Viktor Han',
    role: 'Operations Control Manager',
    dept: 'Network Operations',
    industry: 'Aviation',
    size: 'Major carrier (~35k)',
    region: 'Singapore',
    maturity: 'Scaling AI Operations',
    aiExp: 'Introducing disruption assistants for crew and passenger comms.',
    tools: 'Ops control tooling + Datadog for passenger-facing APIs.',
    explore: 'ops',
    category: 'Operational Health',
    sentiment: 'Positive',
    rating: 4.5,
    review: `Operational Health and Trust were my focus—delays, retries, and comms agent failures during IROPS. The Operational Health view exposed retry storms we previously rationalized as “passenger spikes”. I did not evaluate Cost Optimization; that’s finance’s lane.`,
    likes: `Incident visibility aligned to passenger-visible failures.`,
    concerns: `Playbooks linking degraded model tiers to approved fallback phrases.`,
  },
  {
    slug: 'amara-okonkwo-dpo',
    name: 'Amara Okonkwo',
    role: 'Data Protection Officer',
    dept: 'Privacy Office',
    industry: 'Pharma',
    size: 'Enterprise (~22k)',
    region: 'Switzerland',
    maturity: 'Enterprise AI Governance Phase',
    aiExp: 'Evaluating DPIA evidence for copilots touching trial communications.',
    tools: 'OneTrust + manual evidence; compared retention UX to Azure AI Studio policy docs.',
    explore: 'gov',
    category: 'Governance',
    sentiment: 'Mixed',
    rating: 3.5,
    review: `Governance-first evaluation: retention, lawful basis tags, and access trails. Agent360 makes the intent obvious, but governance gaps remain for cross-border replicas. I skimmed Operational Health only to confirm no surprise logging categories.`,
    likes: `Serious language on accountability—not marketing fluff.`,
    concerns: `Configurable retention and geography-bound exports with legal hold tagging.`,
  },
  {
    slug: 'petr-novak-logistics',
    name: 'Petr Novák',
    role: 'Supply Chain Analytics Lead',
    dept: 'Logistics',
    industry: 'Logistics',
    size: 'Enterprise (~14k)',
    region: 'Czech Republic',
    maturity: 'Scaling AI Operations',
    aiExp: 'Replacing legacy chatbot for shipment inquiries with an agent.',
    tools: 'Internal BI + support analytics platforms; wanted fewer CSV reconciliations.',
    explore: 'mixedCx',
    category: 'Value Delivered',
    sentiment: 'Positive',
    rating: 4.5,
    review: `I split time between Value Delivered and Operational Health—value for leadership, reliability for me. Dock workers don’t care about executive summaries; they care if the assistant lies about ETA. Workflow visibility for exceptions improved once ops trusted the health signals.`,
    likes: `Bridging business outcomes and reliability without two tools.`,
    concerns: `Deeper drill to lane-level bottlenecks from agent-suggested reroutes.`,
  },
  {
    slug: 'james-tan-bpo',
    name: 'James Tan',
    role: 'Program Director, CX Outsourcing',
    dept: 'Global Delivery',
    industry: 'BPO / Contact Centers',
    size: 'Large BPO (~50k)',
    region: 'Philippines',
    maturity: 'Early AI Adoption',
    aiExp: 'Rolling out client-branded copilots across programs.',
    tools: 'Client-specific Grafana + Excel scorecards; Agent360 as a client-facing narrative layer.',
    explore: 'mixedCx',
    category: 'Agent Effectiveness & Trust',
    sentiment: 'Positive',
    rating: 4,
    review: `Client buyers asked for proof, not vibes. I used Agent Effectiveness & Trust and Value Delivered to show quality and operational load together. Human-in-the-loop workflows are credible in demos—important for skeptical program managers.`,
    likes: `Client-safe framing for quality and rework.`,
    concerns: `White-label export templates with client branding slots.`,
  },
  {
    slug: 'elise-marchand-automotive',
    name: 'Élise Marchand',
    role: 'Aftersales Digital Lead',
    dept: 'Customer Digital',
    industry: 'Automotive',
    size: 'OEM (~28k)',
    region: 'France',
    maturity: 'AI Beginner',
    aiExp: 'First dealership-network assistant pilot; low AI maturity in dealer body.',
    tools: 'Dealer DMS exports + Power BI; no prior agent observability.',
    explore: 'value',
    category: 'Value Delivered',
    sentiment: 'Mixed',
    rating: 3.5,
    review: `I explored Value Delivered and Governance lightly—dealers need simple stories, legal needs receipts. Executives understood the value tiles; dealers wanted fewer metrics and clearer “what to do Monday”. Onboarding complexity is real for a fragmented network.`,
    likes: `Outcome language that translates to service revenue, not just NPS.`,
    concerns: `Role-based simplified mode for franchise read-only users.`,
  },
  {
    slug: 'oliver-stone-government',
    name: 'Oliver Stone',
    role: 'Digital Service Owner',
    dept: 'Citizen Services IT',
    industry: 'Government',
    size: 'National agency (~4k staff)',
    region: 'Australia',
    maturity: 'Enterprise AI Governance Phase',
    aiExp: 'Evaluating AI for citizen intake under strict records rules.',
    tools: 'Internal observability + records archive; compared audit UX to custom dashboards.',
    explore: 'gov',
    category: 'Governance',
    sentiment: 'Critical',
    rating: 3,
    review: `My test plan centered Governance and Trust: records retention, explainability, and escalation ownership. Some dashboards feel too dense for executives—we need one-page attestations with mandatory narrative slots for committees. Intelligent gaps, not drama.`,
    likes: `Thoughtful about public-sector constraints.`,
    concerns: `Immutable records exports and clearer workflow ownership in escalations.`,
  },
  {
    slug: 'rita-khoury-pm',
    name: 'Rita Khoury',
    role: 'Senior Product Manager, Platform',
    dept: 'Product',
    industry: 'Enterprise IT',
    size: 'Software vendor (~3k)',
    region: 'Lebanon · Remote EMEA',
    maturity: 'Mature AI Platform Organization',
    aiExp: 'Managing 40+ internal copilots across business units.',
    tools: 'LangSmith for engineering; Agent360 for cross-BU governance reviews.',
    explore: 'trust',
    category: 'Agent Effectiveness & Trust',
    sentiment: 'Positive',
    rating: 5,
    review: `I explored Trust and Operational Health to see if platform teams could stop building one-off Grafana folders per copilot. Trust scoring became actionable when tied to correction velocity. This is the first tool my PM peers and SREs agreed on for triage meetings.`,
    likes: `Scalable narrative across many agents without bespoke dashboards.`,
    concerns: `Benchmarking against anonymized peer cohorts would accelerate maturity conversations.`,
  },
  {
    slug: 'valerie-nguyen-coo',
    name: 'Valerie Nguyen',
    role: 'Chief Operating Officer',
    dept: 'Operations',
    industry: 'Hospitality',
    size: 'Global chain (~16k)',
    region: 'United States',
    maturity: 'Scaling AI Operations',
    aiExp: 'Pushing property-level copilots while protecting brand standards in guest messaging.',
    tools: 'Tableau exec packs + property PMS exports; wanted fewer “trust me” conversations with owners.',
    explore: 'exec',
    category: 'Value Delivered',
    sentiment: 'Positive',
    rating: 4,
    review: `I stayed in Overview and Value Delivered by design—my job is cross-site consistency, not tracing tokens. The Value Delivered page gave owners a readable story on rework and recovery without asking them to interpret model names. I only skimmed Cost Optimization when finance asked for a joint session.`,
    likes: `Strategic visibility that translates to property scorecards.`,
    concerns: `Workflow-level drilldowns for multi-property clusters still require analyst support.`,
  },
  {
    slug: 'stefan-wolf-vp-eng',
    name: 'Stefan Wolf',
    role: 'VP Engineering',
    dept: 'R&D',
    industry: 'eCommerce marketplace',
    size: 'Enterprise (~11k)',
    region: 'Germany',
    maturity: 'Mature AI Platform Organization',
    aiExp: 'Owns search-and-discovery agents with strict SLOs on peak events.',
    tools: 'Internal Grafana + Datadog; LangSmith for trace forensics when things go wrong.',
    explore: 'sre',
    category: 'Operational Health',
    sentiment: 'Positive',
    rating: 4.5,
    review: `Evaluation was Operational Health first, Trust second. I care about tail latency, saturation, and provider brownouts during campaigns—not ROI paragraphs. The retries panel matched what we later confirmed in Datadog; Agent360 added session context we usually stitch manually.`,
    likes: `SRE-native incident framing without pretending agents are “just another microservice”.`,
    concerns: `Deeper jump links into raw traces for engineers who still live in LangSmith.`,
  },
  {
    slug: 'chidi-okafor-fraud',
    name: 'Chidi Okafor',
    role: 'Director, Fraud Decisioning',
    dept: 'Financial Crime',
    industry: 'Fintech',
    size: 'Scale-up (~1.8k)',
    region: 'Nigeria',
    maturity: 'Enterprise AI Governance Phase',
    aiExp: 'Evaluating agent-assisted investigations under central bank scrutiny.',
    tools: 'Case management + internal observability; compared trust scoring discipline to legacy rules engines.',
    explore: 'gov',
    category: 'Governance',
    sentiment: 'Critical',
    rating: 3,
    review: `I tested Governance and Agent Effectiveness & Trust exclusively. Investigators need evidence trails that survive legal inquiry, not composite trust scores that look elegant but hide feature attribution. The product is thoughtful; the bar in our jurisdiction is higher.`,
    likes: `No-nonsense language about human review and escalation.`,
    concerns: `Per-decision factor exports and signed chain-of-custody for model-assisted recommendations.`,
  },
  {
    slug: 'mirai-takahashi-deal-desk',
    name: 'Mirai Takahashi',
    role: 'Deal Desk Manager',
    dept: 'Revenue Operations',
    industry: 'SaaS',
    size: 'Enterprise (~5k)',
    region: 'Japan',
    maturity: 'Early AI Adoption',
    aiExp: 'Sales engineers now lean on drafting agents for complex quotes.',
    tools: 'Salesforce CPQ + spreadsheets; compared clarity to OpenAI project dashboards for usage spikes.',
    explore: 'finance',
    category: 'Cost Optimization',
    sentiment: 'Mixed',
    rating: 3.5,
    review: `I split time between Cost Optimization and Value Delivered. Pricing assistants burn premium context on repetitive clauses; the Cost Optimization page made that obvious in yen terms. I did not spend time in Operational Health—engineering owns that.`,
    likes: `Intent-level spend framing that matches how deal desk argues for exceptions.`,
    concerns: `Clearer ROI assumptions when discounting seasons shift win rates.`,
  },
  {
    slug: 'bridget-oconnell-plant',
    name: "Bridget O'Connell",
    role: 'Plant Operations Director',
    dept: 'Manufacturing Ops',
    industry: 'Manufacturing',
    size: 'Plant network (~7k)',
    region: 'Ireland',
    maturity: 'AI Beginner',
    aiExp: 'First maintenance copilot on a single line; union-sensitive rollout.',
    tools: 'MES screens + paper logs for audits; no prior AI observability culture.',
    explore: 'mixedCx',
    category: 'Agent Effectiveness & Trust',
    sentiment: 'Mixed',
    rating: 4,
    review: `I used Value Delivered for leadership and Agent Effectiveness & Trust with the reliability team. Supervisors care whether the assistant stops a line safely, not executive summaries. Trust views helped explain false positives to union stewards; onboarding for floor leads was still heavy.`,
    likes: `Operational language that respects safety-critical context.`,
    concerns: `Simpler kiosk mode and shorter paths to human escalation with preserved context.`,
  },
  {
    slug: 'samira-hosseini-procurement-it',
    name: 'Samira Hosseini',
    role: 'IT Category Manager',
    dept: 'Procurement',
    industry: 'Telecom',
    size: 'Enterprise (~19k)',
    region: 'UAE',
    maturity: 'Scaling AI Operations',
    aiExp: 'Running enterprise RFP for AI observability alongside existing cloud commitments.',
    tools: 'Ariba + vendor scorecards; compared export controls to Azure AI Studio admin logs.',
    explore: 'cost',
    category: 'Cost Optimization',
    sentiment: 'Positive',
    rating: 4,
    review: `My evaluation centered Cost Optimization and Governance—commercial terms and data handling, not latency charts. Spend visibility by workload made vendor comparisons more honest. Legal joined for Governance screens only; that sequencing worked.`,
    likes: `Procurement-grade narratives that engineering does not have to translate.`,
    concerns: `Standard export schedules for enterprise DPA exhibits and security questionnaires.`,
  },
]

const industries = [
  'Retail',
  'Banking',
  'Fintech',
  'Insurance',
  'Telecom',
  'Healthcare',
  'Logistics',
  'Aviation',
  'Manufacturing',
  'Government',
  'SaaS',
  'BPO / Contact Centers',
  'Pharma',
  'Energy',
  'Hospitality',
  'Automotive',
  'Enterprise IT',
  'eCommerce marketplace',
]

const regions = [
  'United States',
  'Canada',
  'United Kingdom',
  'Germany',
  'France',
  'Nordics',
  'Poland',
  'UAE',
  'India',
  'Japan',
  'Singapore',
  'Australia',
  'Brazil',
  'Mexico',
  'South Africa',
  'Kenya',
  'Nigeria',
  'Turkey',
  'Indonesia',
  'Vietnam',
]

const sizes = [
  'Enterprise (~8k)',
  'Enterprise (~15k)',
  'Mid-market (~2k)',
  'Scale-up (~900)',
  'Global corp (~30k)',
  'Enterprise (~22k)',
]

const categoryByExplore = {
  exec: 'Value Delivered',
  finance: 'Cost Optimization',
  ops: 'Operational Health',
  sre: 'Operational Health',
  gov: 'Governance',
  trust: 'Agent Effectiveness & Trust',
  cost: 'Cost Optimization',
  value: 'Value Delivered',
  mixedCx: 'Agent Effectiveness & Trust',
}

const roles = [
  ['VP Finance', 'Finance', 'finance'],
  ['Director of IT Governance', 'Risk & IT', 'gov'],
  ['Head of Customer Support', 'CX', 'mixedCx'],
  ['Staff SRE', 'Infrastructure', 'sre'],
  ['Principal Product Manager', 'Product', 'value'],
  ['Director of AI Ethics', 'Responsible AI', 'gov'],
  ['Revenue Operations Director', 'RevOps', 'finance'],
  ['Clinical Informatics Manager', 'Clinical IT', 'trust'],
  ['Network Reliability Engineer', 'NOC', 'sre'],
  ['Head of Procurement', 'Procurement', 'cost'],
  ['Director of Transformation', 'Strategy', 'exec'],
  ['Security Architect', 'Cybersecurity', 'gov'],
  ['CX Quality Manager', 'Quality', 'trust'],
  ['Data Engineering Manager', 'Data Platform', 'ops'],
  ['Managing Director, Operations', 'Operations', 'ops'],
  ['Associate General Counsel', 'Legal', 'gov'],
  ['Director of Workforce Management', 'WFM', 'mixedCx'],
  ['Cloud Cost Lead', 'FinOps', 'cost'],
  ['Patient Access Director', 'Access', 'value'],
  ['Store Systems Lead', 'Retail IT', 'ops'],
  ['VP Operations', 'Operations', 'ops'],
  ['AI Transformation Director', 'Digital', 'exec'],
  ['Trust & Safety Program Lead', 'Integrity', 'trust'],
  ['Observability Engineer', 'Platform', 'sre'],
  ['Principal Solutions Consultant', 'Field Engineering', 'value'],
]

const sentimentPlan = []
for (let i = 0; i < 56; i++) sentimentPlan.push('Positive')
for (let i = 0; i < 32; i++) sentimentPlan.push('Mixed')
for (let i = 0; i < 12; i++) sentimentPlan.push('Critical')
let seed = 987654321
function rand() {
  seed = (seed * 1103515245 + 12345) >>> 0
  return seed / 4294967296
}
for (let i = sentimentPlan.length - 1; i > 0; i--) {
  const j = Math.floor(rand() * (i + 1))
  ;[sentimentPlan[i], sentimentPlan[j]] = [sentimentPlan[j], sentimentPlan[i]]
}

const firstNames = [
  'Alex',
  'Jordan',
  'Morgan',
  'Taylor',
  'Riley',
  'Casey',
  'Quinn',
  'Avery',
  'Jamie',
  'Reese',
  'Blake',
  'Logan',
  'Hayden',
  'Emerson',
  'Finley',
  'Rowan',
  'Sloane',
  'Tatum',
  'Kendall',
  'Dakota',
]

const lastNames = [
  'Abbott',
  'Bennett',
  'Carver',
  'Dalton',
  'Ellison',
  'Frost',
  'Grayson',
  'Holloway',
  'Iverson',
  'Jensen',
  'Kline',
  'Langford',
  'Mercer',
  'Norris',
  'Osborne',
  'Porter',
  'Rhodes',
  'Sinclair',
  'Thatcher',
  'Underwood',
  'Vance',
  'Whitaker',
  'York',
  'Zimmer',
  'Blackwood',
  'Carmichael',
  'Donovan',
  'Ellington',
  'Fairchild',
  'Gallagher',
]

const toolRot = [
  'I cross-checked slices with our Datadog service map for the same window.',
  'We compared trust deltas to LangSmith evaluation runs for overlapping intents.',
  'Finance triangulated cost tiles with Azure AI Studio usage exports.',
  'Ops replayed incidents next to internal Grafana RED metrics—story matched.',
  'Legacy BI still handles headcount planning; Agent360 finally covers agent outcomes.',
  'OpenAI org dashboard totals were directionally consistent; variance was explained by routing tags.',
  'Support analytics platforms never linked model tier to escalation reason—this did.',
]

const openers = [
  'Our evaluation script was strict: only score what we actually clicked through in the pilot tenant.',
  'I followed a written test plan aligned to my incentives—no random clicking.',
  'We ran a two-hour structured walkthrough with engineering taking notes.',
  'My brief was to judge readiness, not to be polite.',
  'I compared this to how we evaluate any other enterprise system: receipts, not adjectives.',
]

const positives = [
  'Signals were specific enough to defend in a steering committee.',
  'The product respected that I do not live in ML notebooks.',
  'It met the “so what?” test for my function without hand-waving.',
  'Narratives felt grounded in operational reality, not slide optimism.',
]

const mixeds = [
  'Directionally strong, but a few assumptions should be visible in-line, not implied.',
  'We still exported a subset to Excel to finish the story—acceptable, not ideal.',
  'Onboarding friction showed up for secondary teams who were not in the pilot core.',
  'Dashboard density is manageable for me; my peers asked for a thinner executive path.',
]

const criticals = [
  'I would not sign enterprise rollout until evidence trails match how auditors sample.',
  'Governance gaps are narrow but deep—exactly the kind that block procurement.',
  'Trust metrics need clearer provenance; opacity will slow legal review.',
  'Alert defaults leaned aggressive; we burned attention on non-customer-impacting noise.',
]

function buildSynthReview(sent, ex, tool, opener) {
  const p1 = `Primary time on ${ex.join(' and ')}. ${opener}`
  const p2 = ` ${tool}`
  const p3 =
    sent === 'Critical'
      ? criticals[Math.floor(rand() * criticals.length)]
      : sent === 'Mixed'
        ? mixeds[Math.floor(rand() * mixeds.length)]
        : positives[Math.floor(rand() * positives.length)]
  return (p1 + p2 + ' ' + p3).replace(/\s+/g, ' ').trim()
}

const personas = [...seeds]
let g = 0
while (personas.length < 100) {
  const fn = firstNames[g % firstNames.length]
  const ln = lastNames[Math.floor(g / firstNames.length) % lastNames.length]
  const [roleTitle, dept, exKey] = roles[g % roles.length]
  const ind = industries[g % industries.length]
  const reg = regions[Math.floor(g / 7) % regions.length]
  const sz = sizes[g % sizes.length]
  const mat = maturities[g % maturities.length]
  const sent = sentimentPlan[personas.length]
  const ex = pages[exKey] || pages.mixedCx
  const rating =
    sent === 'Critical'
      ? [2.5, 3, 3.5][g % 3]
      : sent === 'Mixed'
        ? [3.5, 4, 4][g % 3]
        : [4, 4.5, 5][g % 3]

  const cat = categoryByExplore[exKey] ?? 'Value Delivered'

  const tool = toolRot[g % toolRot.length]
  const opener = openers[g % openers.length]
  const review = buildSynthReview(sent, ex, tool, opener)

  const likes =
    sent === 'Critical'
      ? 'Issues are articulated the way internal champions can actually act on them.'
      : 'Keeps the evaluation focused on what my role is accountable for.'

  const concerns =
    sent === 'Critical'
      ? 'Need stronger audit exports, calmer alert defaults, and clearer ownership on workflow changes.'
      : sent === 'Mixed'
        ? 'Ask for benchmarking, inline formula transparency, and lighter paths for non-primary personas.'
        : 'Want deeper integrations and more export controls for enterprise records policy.'

  const aiExpVariants = [
    'Recently deployed first support agent in production.',
    'Managing dozens of internal copilots with uneven documentation.',
    'Replacing legacy chatbot systems region by region.',
    'Evaluating AI governance tooling for board-ready reporting.',
    'Migrating from LangSmith, Grafana, and internal scripts toward a unified story.',
    'Still skeptical about automation in regulated workflows—looking for receipts.',
  ]

  personas.push({
    slug: `fb-eval-cohort-${String(g).padStart(3, '0')}`,
    name: `${fn} ${ln}`,
    role: roleTitle,
    dept,
    industry: ind,
    size: sz,
    region: reg,
    maturity: mat,
    aiExp: aiExpVariants[g % aiExpVariants.length],
    tools: tool,
    explore: exKey,
    category: cat,
    sentiment: sent,
    rating,
    review,
    likes,
    concerns,
  })
  g++
}

function esc(s) {
  return String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, ' ')
}

function toTs(p) {
  const ex = pages[p.explore] || pages.mixedCx
  const ctx = `${p.industry} · ${p.size} · ${p.region}`
  return `  {
    id: '${p.slug}',
    name: '${esc(p.name)}',
    role: '${esc(p.role)}',
    companyContext: '${esc(ctx)}',
    title: '${esc(p.role)}',
    department: '${esc(p.dept)}',
    industry: '${esc(p.industry)}',
    companySize: '${esc(p.size)}',
    region: '${esc(p.region)}',
    aiMaturity: '${esc(p.maturity)}',
    aiExperience: '${esc(p.aiExp)}',
    competingTools: '${esc(p.tools)}',
    exploredPages: [${ex.map((x) => `'${x}'`).join(', ')}],
    rating: ${p.rating},
    sentiment: '${p.sentiment}',
    category: '${p.category}',
    review:
      '${esc(p.review)}',
    likes: '${esc(p.likes)}',
    improves: '${esc(p.concerns)}',
    concerns: '${esc(p.concerns)}',
  }`
}

const header = `/**
 * Enterprise evaluation program cohort — contextual stakeholder notes (batch 3).
 * Seeded personas + deterministic cohort expansion (see scripts/generate-evaluation-program-reviews.mjs).
 */
export const evaluationProgramFeedbackReviews = [
`

const body = personas.map(toTs).join(',\n')
writeFileSync(out, header + body + '\n]\n')
console.log('Wrote', out, 'reviews:', personas.length)
