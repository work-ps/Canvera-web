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

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }
  componentDidCatch(error, info) {
    console.error('React Error Boundary caught:', error, info)
  }
  render() {
    if (this.state.hasError) {
      return React.createElement('div', { style: { padding: 40, fontFamily: 'Inter, sans-serif' } },
        React.createElement('h1', { style: { color: '#D93025', marginBottom: 16 } }, 'Something went wrong'),
        React.createElement('pre', { style: { background: '#f5f5f5', padding: 16, borderRadius: 8, overflow: 'auto', fontSize: 13 } },
          this.state.error?.message + '\n\n' + this.state.error?.stack
        )
      )
    }
    return this.props.children
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  React.createElement(ErrorBoundary, null,
    React.createElement(React.StrictMode, null,
      React.createElement(BrowserRouter, null,
        React.createElement(App)
      )
    )
  )
)
