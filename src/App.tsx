import { NotFoundPage } from './agent360/pages/NotFoundPage'
import { OperationalHealthAgentPage } from './agent360/pages/OperationalHealthAgentPage'
import { OperationalHealthPage } from './agent360/pages/OperationalHealthPage'
import { AgentEffectivenessTrustPage } from './agent360/pages/AgentEffectivenessTrustPage'
import { ValueDeliveredPage } from './agent360/pages/ValueDeliveredPage'
import { CostOptimizationPage } from './agent360/pages/CostOptimizationPage'
import { CostDeepDivePlaceholderPage } from './agent360/pages/CostDeepDivePlaceholderPage'
import { OperationalPage } from './agent360/pages/OperationalPage'
import { VisionPage } from './agent360/pages/VisionPage'
import { CustomerFeedbackPage } from './agent360/pages/CustomerFeedbackPage'
import { ModelComparisonPage } from './agent360/pages/ModelComparisonPage'
import { RetrievalComparisonPage } from './agent360/pages/RetrievalComparisonPage'
import { ApiOverviewPage } from './agent360/pages/ApiOverviewPage'
import { PlaceholderPage } from './agent360/components/PlaceholderPage'
import { getViewByPath } from './agent360/data/views'
import { useRoute } from './agent360/router'
import { LegacyDashboard } from './legacy/LegacyDashboard'

function App() {
  const route = useRoute()

  // Vision / intro homepage — cinematic positioning before entering the system.
  if (route === '/') {
    return <VisionPage />
  }

  // Operational exploration view — sphere navigation + AI assistant.
  if (route === '/overview') {
    return <OperationalPage />
  }

  if (route === '/test') {
    return <LegacyDashboard />
  }

  if (route === '/value-delivered') {
    return <ValueDeliveredPage />
  }

  if (route === '/cost-optimization') {
    return <CostOptimizationPage />
  }

  if (route === '/agent-effectiveness-trust') {
    return <AgentEffectivenessTrustPage />
  }

  if (route === '/operational-health') {
    return <OperationalHealthPage />
  }

  if (route === '/cost-optimization/deep-dive') {
    return <CostDeepDivePlaceholderPage />
  }

  if (route === '/model-comparison') {
    return <ModelComparisonPage />
  }

  if (route === '/retrieval-comparison') {
    return <RetrievalComparisonPage />
  }

  if (route === '/api-overview') {
    return <ApiOverviewPage />
  }

  if (route === '/api-comparison') {
    return <ApiOverviewPage />
  }

  if (route === '/customer-feedback') {
    return <CustomerFeedbackPage />
  }

  if (route.startsWith('/operational-health/agent/')) {
    const agentId = route.replace('/operational-health/agent/', '')
    return <OperationalHealthAgentPage agentId={agentId} />
  }

  const view = getViewByPath(route)
  if (view) {
    return <PlaceholderPage view={view} />
  }

  return <NotFoundPage />
}

export default App
