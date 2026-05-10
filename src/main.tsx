import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { PageTransitionProvider } from './agent360/page-transition/PageTransitionProvider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PageTransitionProvider>
      <App />
    </PageTransitionProvider>
  </StrictMode>,
)
