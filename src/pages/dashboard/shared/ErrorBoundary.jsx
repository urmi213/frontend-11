import React from 'react'
import { Link } from 'react-router-dom'
import { FaExclamationTriangle, FaHome, FaRedo } from 'react-icons/fa'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    })
    
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo)
    }
    
    // You can also log errors to an error reporting service here
    // logErrorToService(error, errorInfo)
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-base-100 p-4">
          <div className="card bg-base-100 shadow-2xl max-w-2xl w-full">
            <div className="card-body">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-error rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaExclamationTriangle className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-error">Something Went Wrong</h1>
                <p className="text-gray-600 mt-2">
                  We apologize for the inconvenience. An error occurred while rendering this page.
                </p>
              </div>

              <div className="space-y-6">
                {/* Error Details (Visible only in development) */}
                {process.env.NODE_ENV === 'development' && this.state.error && (
                  <div className="collapse collapse-arrow bg-base-200">
                    <input type="checkbox" />
                    <div className="collapse-title font-medium">
                      Error Details (Development Only)
                    </div>
                    <div className="collapse-content">
                      <pre className="text-xs overflow-auto p-4 bg-base-300 rounded">
                        {this.state.error.toString()}
                        {this.state.errorInfo?.componentStack}
                      </pre>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={this.handleRetry}
                    className="btn btn-primary"
                  >
                    <FaRedo className="mr-2" />
                    Retry Page
                  </button>

                  <Link to="/" className="btn btn-outline">
                    <FaHome className="mr-2" />
                    Go Home
                  </Link>

                  <button
                    onClick={() => window.history.back()}
                    className="btn btn-ghost"
                  >
                    Go Back
                  </button>
                </div>

                {/* Contact Information */}
                <div className="alert alert-info">
                  <div>
                    <h3 className="font-bold">Need Help?</h3>
                    <div className="text-sm mt-1">
                      If the problem persists, please contact our support team.
                    </div>
                    <div className="mt-2 text-xs">
                      <p>Email: support@bloodlink.com</p>
                      <p>Phone: +880 1234 567890</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary