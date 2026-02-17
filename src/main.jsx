import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import BetaGate from './components/BetaGate'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BetaGate>
      <App />
    </BetaGate>
  </StrictMode>,
)
