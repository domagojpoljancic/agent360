import { LandingPage } from './agent360/pages/LandingPage'
import { NotFoundPage } from './agent360/pages/NotFoundPage'
import { OperationalHealthAgentPage } from './agent360/pages/OperationalHealthAgentPage'
import { OperationalHealthPage } from './agent360/pages/OperationalHealthPage'
import { PlaceholderPage } from './agent360/components/PlaceholderPage'
import { getViewByPath } from './agent360/data/views'
import { useRoute } from './agent360/router'
import { LegacyDashboard } from './legacy/LegacyDashboard'

function App() {
  const route = useRoute()

  if (route === '/') {
    return <LandingPage />
  }

  if (route === '/test') {
    return <LegacyDashboard />
  }

  if (route === '/operational-health') {
    return <OperationalHealthPage />
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
