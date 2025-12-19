// components/layout/Navbar.jsx
import { Link, useNavigate, useLocation } from 'react-router';
import { useAuth } from '../../hooks/useAuth';
import { 
  FaHeartbeat,
  FaSearch,
  FaUser,
  FaSignInAlt,
  FaBell,
  FaHome,
  FaTint, // Blood drop icon
  FaUsers,
  FaChartLine,
  FaCog,
  FaSignOutAlt,
  FaPhoneAlt,
  FaMapMarkerAlt
} from 'react-icons/fa';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  // Navigation items
  const navItems = [
    { path: '/', label: 'Home', icon: <FaHome /> },
    { path: '/search', label: 'Find Donors', icon: <FaSearch /> },
    { path: '/requests', label: 'Blood Requests', icon: <FaTint /> },
    { path: '/about', label: 'About', icon: <FaUsers /> },
  ];

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-lg' : 'bg-white'}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                <FaHeartbeat className="text-white text-xl" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-red-600">BloodLink</h1>
                <p className="text-xs text-gray-500">Save Lives</p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                  isActive(item.path)
                    ? 'bg-red-50 text-red-600 font-semibold'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right Side Buttons */}
          <div className="flex items-center gap-3">
            
            {/* Emergency Button */}
            <button
              onClick={() => navigate('/emergency')}
              className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-red-700 transition-colors"
            >
              <FaTint />
              Emergency
            </button>

            {/* Notification */}
            <button className="relative p-2 hover:bg-gray-100 rounded-lg">
              <FaBell className="text-gray-600 text-xl" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </button>

            {/* User Profile */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-lg"
                >
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <FaUser className="text-red-600" />
                  </div>
                  <span className="hidden md:inline font-medium">{user.name}</span>
                </button>

                {/* Dropdown Menu */}
                {showMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border">
                    <div className="p-4 border-b">
                      <p className="font-semibold">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                    <div className="p-2">
                      <Link
                        to="/dashboard"
                        className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded"
                      >
                        <FaChartLine />
                        Dashboard
                      </Link>
                      <Link
                        to="/profile"
                        className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded"
                      >
                        <FaUser />
                        Profile
                      </Link>
                      <Link
                        to="/settings"
                        className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded"
                      >
                        <FaCog />
                        Settings
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 p-2 hover:bg-gray-100 rounded text-red-600"
                      >
                        <FaSignOutAlt />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-lg border hover:bg-gray-50"
                >
                  <span className="hidden md:inline">Login</span>
                  <FaSignInAlt className="md:hidden" />
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  <span className="hidden md:inline">Register</span>
                  <FaUser className="md:hidden" />
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
              onClick={() => setShowMenu(!showMenu)}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMenu && (
          <div className="md:hidden bg-white border-t mt-2 py-4">
            <div className="space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg"
                  onClick={() => setShowMenu(false)}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
              
              {user ? (
                <>
                  <div className="border-t pt-2">
                    <Link
                      to="/dashboard"
                      className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg"
                      onClick={() => setShowMenu(false)}
                    >
                      <FaChartLine />
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setShowMenu(false);
                      }}
                      className="w-full flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg text-red-600"
                    >
                      <FaSignOutAlt />
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <div className="border-t pt-4 flex gap-2">
                  <Link
                    to="/login"
                    className="flex-1 text-center p-2 border rounded-lg hover:bg-gray-50"
                    onClick={() => setShowMenu(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="flex-1 text-center p-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    onClick={() => setShowMenu(false)}
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Top Emergency Bar */}
      <div className="bg-red-100 text-red-800 py-2 px-4 text-center text-sm">
        <div className="container mx-auto flex items-center justify-center gap-4">
          <span className="font-semibold">Emergency Helpline:</span>
          <a href="tel:16263" className="font-bold flex items-center gap-1">
            <FaPhoneAlt /> 16263
          </a>
          <span className="hidden md:inline">•</span>
          <span className="hidden md:inline">
            Urgent Need: <span className="font-bold">O+, A+, B+</span>
          </span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;