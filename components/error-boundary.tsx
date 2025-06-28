"use client"

import React from 'react'

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ComponentType<{ error: Error }> },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode; fallback?: React.ComponentType<{ error: Error }> }) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Filter out extension-related errors
    if (
      error.message?.includes('param') && error.message?.includes('not legal') ||
      error.message?.includes('MetaMask') ||
      error.message?.includes('ChromeTransport')
    ) {
      return { hasError: false, error: null }
    }
    
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Filter out extension-related errors
    if (
      error.message?.includes('param') && error.message?.includes('not legal') ||
      error.message?.includes('MetaMask') ||
      error.message?.includes('ChromeTransport')
    ) {
      return
    }
    
    console.error('Application error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError && this.state.error) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback
      return <FallbackComponent error={this.state.error} />
    }

    return this.props.children
  }
}

function DefaultErrorFallback({ error }: { error: Error }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-green-50">
      <div className="text-center p-8 max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h2>
        <p className="text-gray-600 mb-6">
          We're sorry, but something unexpected happened. Please try refreshing the page.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-gradient-to-r from-orange-500 to-green-500 text-white rounded-lg hover:from-orange-600 hover:to-green-600 transition-all duration-300"
        >
          Refresh Page
        </button>
        <details className="mt-6 text-left">
          <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
            Technical Details
          </summary>
          <pre className="mt-2 text-xs text-gray-600 bg-gray-100 p-3 rounded overflow-auto">
            {error.message}
          </pre>
        </details>
      </div>
    </div>
  )
}

export default ErrorBoundary
