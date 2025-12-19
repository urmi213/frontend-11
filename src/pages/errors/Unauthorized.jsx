import { Link } from 'react-router'
import { FaLock, FaHome, FaSignInAlt, FaUserShield } from 'react-icons/fa'

const Unauthorized = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-100 p-4">
      <div className="card bg-base-100 shadow-2xl max-w-md w-full">
        <div className="card-body text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-error rounded-full flex items-center justify-center mx-auto mb-4">
              <FaLock className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-error">Access Denied</h1>
            <p className="text-gray-600 mt-2">
              You don't have permission to access this page
            </p>
          </div>

          <div className="space-y-4">
            <div className="alert alert-warning">
              <FaUserShield />
              <div>
                <h3 className="font-bold">Permission Required</h3>
                <div className="text-xs">
                  This page requires special privileges that your account doesn't have.
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Link to="/" className="btn btn-primary w-full">
                <FaHome className="mr-2" />
                Go to Homepage
              </Link>
              
              <Link to="/dashboard" className="btn btn-outline w-full">
                Go to Dashboard
              </Link>
              
              <button 
                onClick={() => window.history.back()}
                className="btn btn-ghost w-full"
              >
                Go Back
              </button>
            </div>

            <div className="divider">OR</div>

            <div className="text-sm space-y-2">
              <p className="opacity-70">If you believe this is an error:</p>
              <div className="flex gap-2">
                <button className="btn btn-sm btn-outline flex-1">
                  Contact Support
                </button>
                <Link to="/login" className="btn btn-sm btn-secondary flex-1">
                  <FaSignInAlt className="mr-1" />
                  Login Again
                </Link>
              </div>
            </div>
          </div>

          {/* Role Information */}
          <div className="mt-8 p-4 bg-base-200 rounded-lg">
            <h4 className="font-bold mb-2">Available Roles</h4>
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div className="badge badge-primary">Donor</div>
              <div className="badge badge-secondary">Volunteer</div>
              <div className="badge badge-accent">Admin</div>
            </div>
            <p className="text-xs mt-2 opacity-70">
              Contact administrator to request role upgrade
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Unauthorized