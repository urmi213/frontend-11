import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const [formData, setFormData] = useState({
    email: 'admin@gmail.com', // Default admin email
    password: 'admin123'      // Default admin password
  });
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, error, setError } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email.trim()) {
      toast.error('Please enter email');
      return;
    }
    
    if (!formData.password.trim()) {
      toast.error('Please enter password');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('🔄 Logging in with:', formData.email);
      
      const result = await login(formData);
      console.log('📦 Login result:', result);
      
      if (result.success) {
        toast.success(`Welcome ${result.user.name}! (${result.user.role})`);
        
        // Redirect based on role
        setTimeout(() => {
          if (result.user.role === 'admin') {
            navigate('/admin/dashboard');
          } else {
            navigate('/dashboard');
          }
        }, 500);
        
      } else {
        toast.error(result.message || 'Login failed');
      }
      
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Set test credentials function
  const setTestCredentials = (email, password, role) => {
    setFormData({ email, password });
    toast.success(`${role} credentials loaded`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Blood Donation Portal
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to manage blood donation system
          </p>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Error Display */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              <p className="font-medium">Error: {error}</p>
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : 'Sign in'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
                Register here
              </Link>
            </p>
          </div>

          {/* Test Credentials Section */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Test Login:</h3>
            
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setTestCredentials('admin@gmail.com', 'admin123', 'Admin')}
                className="bg-purple-100 text-purple-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-purple-200 transition"
              >
                👑 Admin
              </button>
              
              <button
                type="button"
                onClick={() => setTestCredentials('test@gmail.com', 'test123', 'Donor')}
                className="bg-blue-100 text-blue-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-200 transition"
              >
                👤 Donor
              </button>
              
              <button
                type="button"
                onClick={() => setTestCredentials('donor@gmail.com', 'donor123', 'Donor 2')}
                className="bg-green-100 text-green-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-green-200 transition"
              >
                💉 Donor 2
              </button>
              
              <button
                type="button"
                onClick={() => setTestCredentials('volunteer@gmail.com', 'volunteer123', 'Volunteer')}
                className="bg-yellow-100 text-yellow-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-yellow-200 transition"
              >
                🫂 Volunteer
              </button>
            </div>
            
            <p className="mt-3 text-xs text-gray-500">
              These test users are auto-created when server starts
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;