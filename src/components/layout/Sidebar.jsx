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
  X,
  Users,
  FileText,
  Heart
} from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = React.useState(false);

  // Function to get avatar URL - FIXED
  const getAvatarUrl = () => {
    if (!user) {
      return `https://ui-avatars.com/api/?name=User&background=ccc&color=000&size=128`;
    }
    
    // Always use UI Avatars API for consistency
    const name = user.name || user.email || 'User';
    const encodedName = encodeURIComponent(name);
    
    // Different colors based on role
    const background = 
      user.role === 'admin' ? '8b5cf6' : // Purple
      user.role === 'volunteer' ? 'f59e0b' : // Orange
      'dc2626'; // Red for donor
    
    return `https://ui-avatars.com/api/?name=${encodedName}&background=${background}&color=fff&size=128`;
  };

  // Base menu items for all users
  const baseMenuItems = [
    { 
      path: '/dashboard', 
      label: 'Dashboard', 
      icon: <Home className="h-5 w-5" />,
      showFor: ['admin', 'volunteer', 'donor']
    },
    { 
      path: '/dashboard/profile', 
      label: 'Profile', 
      icon: <User className="h-5 w-5" />,
      showFor: ['admin', 'volunteer', 'donor']
    },
    { 
      path: '/dashboard/funding', 
      label: 'Funding', 
      icon: <DollarSign className="h-5 w-5" />,
      showFor: ['admin', 'volunteer', 'donor']
    },
  ];

  // Donor specific menu items
  const donorMenuItems = [
    { 
      path: '/dashboard/my-donation-requests', 
      label: 'My Requests', 
      icon: <Droplets className="h-5 w-5" />,
      showFor: ['donor']
    },
    { 
      path: '/dashboard/create-donation-request', 
      label: 'Create Request', 
      icon: <PlusCircle className="h-5 w-5" />,
      showFor: ['donor']
    },
  ];

  // Admin specific menu items
  const adminMenuItems = [
    { 
      path: '/dashboard/all-users', 
      label: 'All Users', 
      icon: <Users className="h-5 w-5" />,
      showFor: ['admin']
    },
    { 
      path: '/dashboard/all-blood-donation-request', 
      label: 'All Requests', 
      icon: <FileText className="h-5 w-5" />,
      showFor: ['admin']
    },
  ];

  // Volunteer specific menu items
  const volunteerMenuItems = [
    { 
      path: '/dashboard/all-blood-donation-request', 
      label: 'All Blood Donation Requests', 
      icon: <Heart className="h-5 w-5" />,
      showFor: ['volunteer']
    },
  ];

  // Combine all menu items based on user role
  const getAllMenuItems = () => {
    let items = [...baseMenuItems];
    
    if (user?.role === 'admin') {
      items = [...items, ...adminMenuItems];
    } else if (user?.role === 'volunteer') {
      items = [...items, ...volunteerMenuItems];
    } else if (user?.role === 'donor') {
      items = [...items, ...donorMenuItems];
    }
    
    // Filter items based on user role
    return items.filter(item => item.showFor.includes(user?.role || 'donor'));
  };

  const menuItems = getAllMenuItems();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
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
        w-64 bg-white shadow-xl lg:shadow-none h-full flex flex-col
      `}>
        {/* User Profile */}
        <div className="p-6 border-b">
          <div className="flex items-center space-x-3">
            <img
              src={getAvatarUrl()}
              alt={user?.name || 'User'}
              className="h-12 w-12 rounded-full border-2 border-blue-100 bg-gray-100"
              onError={(e) => {
                // Fallback if image fails to load
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=ccc&color=000`;
              }}
            />
            <div>
              <h2 className="font-bold text-gray-900 truncate max-w-[150px]">{user?.name || 'User'}</h2>
              <p className="text-sm text-gray-600 truncate max-w-[150px]">{user?.email || ''}</p>
              <span className={`text-xs px-2 py-1 rounded-full mt-1 inline-block ${
                user?.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                user?.role === 'volunteer' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'User'}
              </span>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="p-4 space-y-2 flex-1">
          {menuItems.map((item) => {
            const active = isActive(item.path, item.path === '/dashboard');
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`
                  flex items-center space-x-3 px-4 py-3 rounded-lg transition
                  ${active 
                    ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600' 
                    : 'text-gray-700 hover:bg-gray-50'
                  }
                `}
              >
                {item.icon}
                <span className="flex-1">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t">
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