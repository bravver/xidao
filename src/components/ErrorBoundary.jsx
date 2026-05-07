import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('React Error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(to bottom, #64748B, #334155)',
          color: 'white',
          fontFamily: 'system-ui, sans-serif',
          padding: '2rem',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>😅</div>
          <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>应用出错了</h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '1rem' }}>
            {this.state.error?.message || '未知错误'}
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '0.75rem 1.5rem',
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              borderRadius: '0.5rem',
              color: 'white',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            重新加载
          </button>
          <details style={{ marginTop: '2rem', textAlign: 'left', maxWidth: '400px' }}>
            <summary style={{ cursor: 'pointer', marginBottom: '0.5rem' }}>错误详情</summary>
            <pre style={{
              background: 'rgba(0,0,0,0.3)',
              padding: '1rem',
              borderRadius: '0.5rem',
              fontSize: '0.75rem',
              overflow: 'auto',
              maxHeight: '200px'
            }}>
              {this.state.error?.stack || 'No stack trace'}
            </pre>
          </details>
        </div>
      )
    }

    return this.props.children
  }
}