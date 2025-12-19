import { Link } from 'react-router'
import { FaHome, FaSearch, FaHeartbeat } from 'react-icons/fa'

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-100">
      <div className="text-center">
        <div className="mb-8">
          <div className="w-32 h-32 mx-auto mb-6">
            <div className="w-full h-full bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
              <FaHeartbeat className="w-16 h-16 text-white" />
            </div>
          </div>
          <h1 className="text-9xl font-bold text-primary">404</h1>
          <h2 className="text-3xl font-bold mt-4">Page Not Found</h2>
          <p className="text-gray-600 mt-2 max-w-md mx-auto">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
        </div>

        <div className="space-y-4">
          <Link to="/" className="btn btn-primary btn-lg">
            <FaHome className="mr-2" />
            Go to Homepage
          </Link>
          
          <div className="divider">OR</div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/dashboard" className="btn btn-outline">
              Go to Dashboard
            </Link>
            <Link to="/search" className="btn btn-outline">
              <FaSearch className="mr-2" />
              Search Donors
            </Link>
            <Link to="/requests" className="btn btn-outline">
              View Requests
            </Link>
          </div>
        </div>

        {/* Support Info */}
        <div className="mt-12 p-6 bg-base-200 rounded-2xl max-w-md mx-auto">
          <h3 className="font-bold text-lg mb-2">Need Help?</h3>
          <p className="text-sm text-gray-600 mb-4">
            Contact our support team for assistance
          </p>
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2">
              <span className="font-medium">Email:</span>
              <span className="text-primary">support@bloodlink.com</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="font-medium">Phone:</span>
              <span className="text-primary">+880 1234 567890</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotFound