import { Component, type ReactNode, type ErrorInfo } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('AYU-RAKSHA Error Boundary caught an error:', error, errorInfo)
  }

  handleReset = () => {
    try {
      sessionStorage.removeItem('active_innovation_result')
      sessionStorage.removeItem('active_innovation_data')
    } catch {
      // ignore
    }
    this.setState({ hasError: false, error: null })
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div style={{
          minHeight: '60vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 20px',
          background: '#fcfbf7',
          color: '#1f4936',
          fontFamily: "'Cinzel', 'Playfair Display', Georgia, serif",
          textAlign: 'center'
        }}>
          <div style={{
            background: '#ffffff',
            border: '1px solid #e3ddd1',
            borderRadius: '16px',
            padding: '36px 32px',
            maxWidth: '560px',
            boxShadow: '0 8px 30px rgba(47, 107, 79, 0.08)'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🌿</div>
            <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#1f4936', marginBottom: '12px' }}>
              Something went wrong loading this view
            </h2>
            <p style={{ fontSize: '14px', color: '#556b2f', lineHeight: 1.6, marginBottom: '24px' }}>
              A temporary rendering or data issue occurred. You can clear the cached assessment state and reload the analyzer smoothly.
            </p>
            {this.state.error && (
              <details style={{ textAlign: 'left', background: '#f7f4ea', padding: '12px', borderRadius: '8px', marginBottom: '24px', fontSize: '12px', color: '#8b0000', overflowX: 'auto' }}>
                <summary style={{ cursor: 'pointer', fontWeight: 600 }}>Error Details</summary>
                <pre style={{ marginTop: '8px', whiteSpace: 'pre-wrap' }}>{this.state.error.toString()}</pre>
              </details>
            )}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={this.handleReset}
                style={{
                  background: '#2f6b4f',
                  color: '#ffffff',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '999px',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(47, 107, 79, 0.25)'
                }}
              >
                🔄 Reset Analyzer & Reload
              </button>
              <a
                href="/"
                style={{
                  background: '#f7f4ea',
                  color: '#1f4936',
                  border: '1px solid #d4cebe',
                  padding: '12px 24px',
                  borderRadius: '999px',
                  fontSize: '14px',
                  fontWeight: 600,
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center'
                }}
              >
                Return to Home
              </a>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
export default ErrorBoundary
