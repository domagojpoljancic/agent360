export type MetricExplainContent = {
  title: string
  definition: string
  why: string
  measured: string
  ops: string
}

export const TRUST_METRIC_EXPLAINS: Record<string, MetricExplainContent> = {
  'operational-trust-index': {
    title: 'Operational trust index',
    definition: 'A 0–100 roll-up of how often agents finish work without friction: task success, trusted replies, retry/clarification burden, and escalations.',
    why: 'Gives leadership one number to scan before drilling into agents or conversations.',
    measured: 'Computed daily from workflow completion events, user reformulation signals, internal draft edits where applicable, and handoffs in Agent360.',
    ops: 'Use it to spot fleet-wide regressions after releases, catalog changes, or prompt updates.',
  },
  'task-success': {
    title: 'Task success rate',
    definition: 'Share of conversations that reached a successful outcome without escalation and without a retry-or-clarification loop after the agent reply.',
    why: 'Direct read on whether customers and internal users can finish the job with the agent alone.',
    measured: 'Terminal workflow state = success, plus checks for handoff events and clarification-loop detectors in the same session.',
    ops: 'Falling success usually pairs with higher retry/clarification rates or escalations—investigate those agents first.',
  },
  'retry-clarification': {
    title: 'Retry & clarification rate',
    definition:
      'Percentage of conversations where users needed to retry, rephrase, or clarify their request after an AI response.',
    why: 'High retry rates often indicate confusion, weak relevance, or reduced trust in the agent’s response.',
    measured:
      'Detected through repeated intent patterns, reformulations, clarification phrases, or rapid follow-up prompts within the same conversation.',
    ops: 'Useful for identifying agents that appear functional but still create friction or misunderstanding.',
  },
  'human-corrections': {
    title: 'Internal draft edit rate',
    definition:
      'Share of copilot- or agent-assist drafts that an employee changed before sending—meaningful on internal surfaces, not a fleet KPI for customer-only chat.',
    why: 'Shows where operators do not trust the draft enough to ship it as-is on tooling workflows.',
    measured: 'Diff or editor events against the model output on internal copilot and assist surfaces.',
    ops: 'Use in Support Copilot and internal agent drill-downs; pair with retry/clarification for customer-facing agents.',
  },
  'escalation-rate': {
    title: 'Escalation rate',
    definition: 'Percentage of conversations transferred to a human queue or owner.',
    why: 'Captures lost confidence or blocked automation—cost and CX both move with this.',
    measured: 'Handoff events from the agent flow to human queues, ticketing, or chat takeover.',
    ops: 'Break down by reason (unclear answer, policy, tool failure) to prioritize fixes.',
  },
  'trusted-responses': {
    title: 'Trusted responses',
    definition:
      'Replies accepted as-is: no user retry or clarification loop, no escalation, and (on internal surfaces) no material draft edit in the same session.',
    why: 'Best proxy for “accepted as good enough” in production—not a lab score—for both shoppers and operators.',
    measured:
      'Session logs where the outbound text matches the model output and no loop or handoff fired before send.',
    ops: 'Compare to retry/clarification and escalations; gaps show where grounding, policy snippets, or tone work pays off.',
  },
  'user-satisfaction': {
    title: 'User satisfaction',
    definition: 'Blended CSAT and behavioral signals (e.g. quick resolution, no re-open) where available.',
    why: 'Connects agent behavior to how people felt about the outcome.',
    measured: 'Post-chat ratings, thumbs, and lightweight resolution flags tied to the conversation ID.',
    ops: 'Pair with escalation reasons to see whether friction is visible to users or only internally.',
  },
  'high-confidence-fails': {
    title: 'High-confidence failures',
    definition:
      'Cases where the model was flagged as highly confident, but the user still had to retry, clarify, or escalate—or an operator materially edited the draft on internal flows.',
    why: 'The riskiest trust break: sounded sure, was wrong or incomplete—hurts adoption fast.',
    measured: 'Confidence flag from the agent runtime crossed with clarification-loop, handoff, or edit events.',
    ops: 'Tune retrieval, add uncertainty language, or route edge cases earlier when this cluster grows.',
  },
  'trust-drift': {
    title: 'Trust drift',
    definition: 'Change in trust signals after a deployment, prompt change, or data refresh.',
    why: 'Catches “we shipped something and behavior shifted” without waiting for incidents.',
    measured: 'Rolling comparison of task success, trusted replies, retry/clarification rate, and escalations vs. baseline.',
    ops: 'Correlate with release calendar and catalog/policy updates; roll forward or roll back with evidence.',
  },
  'escalation-reasons': {
    title: 'Escalation reasons',
    definition: 'Why people handed off to humans—unclear answer, wrong info, tool failure, policy gray areas, etc.',
    why: 'Turns volume into actionable buckets for product and ops.',
    measured: 'Reason codes captured at handoff (agent or user selection + rules where automated).',
    ops: 'Fix the top two reasons first; they usually dominate cost and complaints.',
  },
  'refund-rewrite-share': {
    title: 'Refund-path rewrites',
    definition: 'Share of refund-related drafts that support edited before send.',
    why: 'Policy-sensitive flows are where trust and compliance matter most.',
    measured: 'Sessions tagged “returns/refunds” with an edit event on the draft.',
    ops: 'If high, refresh policy snippets and exception rules in the knowledge layer.',
  },
  'copilot-adoption': {
    title: 'Copilot adoption',
    definition: 'Weekly trend in active internal copilot sessions (agents drafting or assisting support/ops).',
    why: 'Rising adoption with flat or falling internal edits and customer retry/clarify loops means teams are relying on agents safely.',
    measured: 'Unique session starts on copilot surfaces, normalized to prior week.',
    ops: 'Pair with internal draft edits, retry/clarification, and escalation trends—healthy adoption should not spike handoffs.',
  },
  'conversation-explorer-agent': {
    title: 'Agent',
    definition: 'The AI agent that handled this session (same fleet as Operational Health).',
    why: 'Lets you tie a trust incident back to routing, prompts, and ownership.',
    measured: 'Agent ID from the conversation metadata in Agent360.',
    ops: 'Click the row to open investigation and jump to matrix metrics for that agent.',
  },
  'conversation-explorer-what-happened': {
    title: 'What happened',
    definition: 'One-line incident label: what went wrong or what the user was trying to do.',
    why: 'Scan the table without reading full transcripts.',
    measured: 'Derived from intent tags plus the first human or system classification on the thread.',
    ops: 'Sort and filter by this column to find repeating failure modes.',
  },
  'conversation-explorer-outcome': {
    title: 'Outcome',
    definition: 'How the thread ended after AI + human steps (e.g. escalated, resolved, reviewed).',
    why: 'Separates “felt risky” from “actually burned time or CSAT.”',
    measured: 'Terminal workflow state and ticket status within the session window.',
    ops: 'Pair with Trust and Human signal to see if friction was contained.',
  },
  'conversation-explorer-trust': {
    title: 'Trust impact',
    definition: 'Whether this example helped or hurt confidence in the agent (positive, neutral, negative).',
    why: 'Surfaces trust winners and trust breaks for leadership narratives.',
    measured:
      'Rules on outcomes: escalation, retry/clarification spiral, or heavy internal edit → negative; no touch → positive; light edit → neutral.',
    ops: 'Use negatives for backlog; use positives as templates.',
  },
  'conversation-explorer-human-signal': {
    title: 'Human signal',
    definition: 'What a person did—rewrite, override, handoff, or none.',
    why: 'Shows real reliance: humans vote with edits and queues.',
    measured: 'Editor events, queue transfers, and explicit handoff actions logged on the thread.',
    ops: 'If the same signal repeats, fix retrieval, policy snippets, or routing—not more training slides.',
  },
  'conversation-explorer-status': {
    title: 'Status',
    definition: 'Resolved (closed without open risk), Reviewed (touched by QA/lead), or Escalated (human-owned).',
    why: 'Triage volume: escalations usually need product or policy follow-up.',
    measured: 'Case and conversation status from CRM / Agent360 handoff events.',
    ops: 'Watch escalations after releases or catalog changes.',
  },
  'drawer-section-snapshot': {
    title: 'Conversation snapshot',
    definition: 'The customer question, the agent draft, and the outcome in one place.',
    why: 'Grounds every trust decision in the actual words users saw.',
    measured: 'Final user message, model output, and resolution summary from the session record.',
    ops: 'Use this block when sharing examples with legal, policy, or product.',
  },
  'drawer-section-trust-read': {
    title: 'Trust read',
    definition: 'Short bullets interpreting trust signals for this case (impact, rates, index).',
    why: 'Turns raw events into an operational story in under a minute.',
    measured: 'Assembled from agent matrix metrics, impact labels, and signal context for the selection.',
    ops: 'Paste into incident notes or weekly trust reviews.',
  },
  'drawer-section-human-intervention': {
    title: 'Human intervention',
    definition: 'Concrete actions people took—edits, overrides, escalations.',
    why: 'Proves where automation stopped and humans carried risk.',
    measured: 'Logged editor diffs, queue transfers, and manual resolutions.',
    ops: 'If interventions cluster, prioritize playbook and grounding work.',
  },
  'drawer-section-next-actions': {
    title: 'Next actions',
    definition: 'Suggested fixes tied to this pattern (not generic AI advice).',
    why: 'Closes the loop from observation to backlog.',
    measured: 'Curated recommendations from playbooks and trust analytics rules.',
    ops: 'Track completion like any other operational action item.',
  },
  'drawer-section-related-trends': {
    title: 'Related trends',
    definition: 'Fleet-level sparklines for trust index, adoption, escalations, and retry/clarification share.',
    why: 'Shows whether this case is a one-off or part of a moving trend.',
    measured: 'Same time series as the Trust & adoption section for the selected range.',
    ops: 'If trends diverge from this case, dig into cohort or agent filters.',
  },
  'section-fleet-trust-snapshot': {
    title: 'Fleet trust · snapshot',
    definition:
      'Live strip of the six behavioral metrics leadership tracks: task success, retry/clarification, escalations, trusted replies, satisfaction shift, and high-confidence failures.',
    why: 'One glance answers whether the fleet is getting easier or harder to rely on right now.',
    measured: 'Aggregated from session outcomes, clarification-loop signals, handoffs, and CSAT for the selected time range.',
    ops: 'Use before the matrix and signals; refresh after incidents or releases to confirm recovery.',
  },
  'section-trust-matrix': {
    title: 'Trust matrix',
    definition:
      'Per-agent facing (Customer vs Internal, same fleet labels as Operational Health), index, task success, retry/clarification (Retry+), escalations, trusted replies, CSAT, high-confidence failures, and trend.',
    why: 'Shows which agents earn reliance and which create friction or human work.',
    measured: 'Session metrics rolled up by agent ID; same fleet as Operational Health.',
    ops: 'Sort by index, Retry+, or hi-conf to prioritize playbook and routing fixes.',
  },
  'section-trust-signals': {
    title: 'Trust signals',
    definition:
      'Six behavioral cards: task success, retry/clarification (with loop mix), escalation reasons, trusted responses, high-confidence failures, and trust drift after changes.',
    why: 'Turns volumes into a short list of operational stories that apply to customer chat and internal copilot alike.',
    measured: 'Sampled sessions with reason codes, reformulation detectors, edit events on internal surfaces, and pre/post deploy comparisons.',
    ops: 'Open a card to jump into investigation with context already attached.',
  },
  'section-conversation-trust': {
    title: 'Conversation trust',
    definition: 'Incident-style rows: real threads with outcome, trust impact, and human signal.',
    why: 'Makes trust tangible for reviews and exec reviews.',
    measured:
      'Curated examples from production traffic with PII scrubbed and packaged for governance review.',
    ops: 'Sort by status and trust impact to build the weekly narrative.',
  },
  'section-trust-trends': {
    title: 'Trust & adoption',
    definition: 'Fleet trends for trust index, copilot adoption, escalation share, and retry/clarification rate.',
    why: 'Shows direction: are people adopting assistive agents while user friction (loops and handoffs) falls?',
    measured: 'Rolling series aligned to the page time range (1h / 24h / 7d).',
    ops: 'If adoption rises but escalations or retry/clarification rise too, pause rollout and fix grounding first.',
  },
  'section-prompt-performance': {
    title: 'Prompt Performance',
    definition:
      'Operational view of how deployed prompt templates (versions) line up with task success, handoffs, and user retry behavior—without opening an editor or raw prompt text.',
    why: 'Leadership and ops can see whether a template change helped or hurt trust and completion before digging into transcripts.',
    measured:
      'Metrics are attributed to the prompt version active in each time bucket, using release tags and conversation metadata in Agent360.',
    ops: 'Use after prompt or policy rollouts to confirm recovery, or to prioritize the next revision with evidence.',
  },
  'prompt-success-rate': {
    title: 'Prompt success rate',
    definition:
      'Share of conversations that finished successfully while a given prompt version was live—same “clean completion” idea as fleet task success, scoped to the template window.',
    why: 'Shows whether a wording or instruction change actually made it easier for users to get done.',
    measured: 'Successful terminal workflow state with no escalation and no retry/clarification loop in-session.',
    ops: 'Compare v17→v19 when you need a simple before/after story for stakeholders.',
  },
  'prompt-escalation-share': {
    title: 'Escalation share (prompt window)',
    definition:
      'Percentage of conversations that hit a human handoff while that prompt version was active—fleet escalation rate, sliced by template deployment.',
    why: 'Spikes here often mean the model is confident but wrong, policy is unclear in the template, or tools fail mid-flow.',
    measured: 'Handoff events divided by conversations in the version-attributed cohort for the selected range.',
    ops: 'Pair with retry/clarification and the escalation-reasons card to decide whether to fix retrieval, tone, or routing.',
  },
  'avg-prompt-tokens': {
    title: 'Avg tokens',
    definition:
      'Average model tokens consumed per conversation for replies attributed to that prompt version—inbound + outbound relevant context, as logged by the runtime.',
    why: 'Rising tokens with flat success can signal bloat; falling tokens with stable success can signal a healthier, cheaper template.',
    measured: 'Summed completion tokens divided by conversation count per version, from agent runtime billing or usage logs.',
    ops: 'Watch this alongside success and escalations so efficiency gains do not trade away trust.',
  },
}
