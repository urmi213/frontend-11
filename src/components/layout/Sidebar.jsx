import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import { 
  Home, 
  User, 
  Droplets, 
  PlusCircle,
  DollarSign,
  LogOut,
  Menu,
  X
} from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = React.useState(false);

  // Function to get avatar URL
  const getAvatarUrl = () => {
    if (!user) {
      return 'https://ui-avatars.com/api/?name=User&background=ccc&color=000';
    }
    
    if (user.avatar && user.avatar.startsWith('http')) {
      return user.avatar;
    }
    
    const name = user.name || user.email || 'User';
    const encodedName = encodeURIComponent(name);
    
    // Different colors based on role
    const background = 
      user.role === 'admin' ? '8b5cf6' : 
      user.role === 'volunteer' ? 'f59e0b' : 
      'dc2626';
    
    return `https://ui-avatars.com/api/?name=${encodedName}&background=${background}&color=fff`;
  };

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <Home className="h-5 w-5" /> },
    { path: '/dashboard/profile', label: 'Profile', icon: <User className="h-5 w-5" /> },
    { path: '/dashboard/my-requests', label: 'My Requests', icon: <Droplets className="h-5 w-5" /> },
    { path: '/dashboard/create-request', label: 'Create Request', icon: <PlusCircle className="h-5 w-5" /> },
    { path: '/dashboard/funding', label: 'Funding', icon: <DollarSign className="h-5 w-5" /> },
  ];

  // Admin specific menu items
  if (user?.role === 'admin') {
    menuItems.push(
      { path: '/admin/dashboard', label: 'Admin Dashboard', icon: <User className="h-5 w-5" /> }
    );
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-40 
        transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0 transition-transform duration-300 
        w-64 bg-white shadow-xl lg:shadow-none
      `}>
        {/* User Profile */}
        <div className="p-6 border-b">
          <div className="flex items-center space-x-3">
            <img
              src={getAvatarUrl()} // ✅ Fixed avatar URL
              alt={user?.name}
              className="h-12 w-12 rounded-full border-2 border-blue-100"
              onError={(e) => {
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}`;
              }}
            />
            <div>
              <h2 className="font-bold text-gray-900">{user?.name}</h2>
              <p className="text-sm text-gray-600">{user?.email}</p>
              <span className={`text-xs px-2 py-1 rounded-full ${
                user?.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                user?.role === 'volunteer' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {user?.role}
              </span>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`
                  flex items-center space-x-3 px-4 py-3 rounded-lg transition
                  ${isActive 
                    ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600' 
                    : 'text-gray-700 hover:bg-gray-50'
                  }
                `}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-0 w-full p-4 border-t">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;