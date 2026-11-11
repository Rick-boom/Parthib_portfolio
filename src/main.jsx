import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import PortfolioV2 from './portfolio-v2/PortfolioV2.jsx'
// The previous site is still in App.jsx. To switch back, render <App /> and restore `import './index.css'`.

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PortfolioV2 />
  </StrictMode>,
)
