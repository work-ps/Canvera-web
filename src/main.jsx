import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './styles/tokens.css'
import './styles/global.css'
import './styles/pdp-layout.css'
import './styles/pdp-header.css'
import './styles/pdp-visualizer.css'
import './styles/pdp-sections.css'
import './styles/pdp-shared.css'
import './styles/pdp-review.css'
import './styles/size-chart.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
