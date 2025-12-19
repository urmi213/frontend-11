import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import { 
  Users, 
  Droplets, 
  DollarSign, 
  Activity,
  Shield,
  TrendingUp,
  Calendar,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDonors: 0,
    totalFunding: 0,
    totalRequests: 0,
    pendingRequests: 0,
    completedRequests: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentRequests, setRecentRequests] = useState([]);

  useEffect(() => {
    // Check if user is admin
    if (!user || user.role !== 'admin') {
      toast.error('Access denied. Admin only.');
      navigate('/dashboard');
      return;
    }
    
    fetchAdminData();
  }, [user, navigate]);

  const fetchAdminData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch admin stats
      const statsRes = await fetch('http://localhost:5000/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        if (statsData.success) {
          setStats(statsData.data);
        }
      }
      
      // Fetch recent requests
      const requestsRes = await fetch('http://localhost:5000/api/requests?limit=5', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (requestsRes.ok) {
        const requestsData = await requestsRes.json();
        if (requestsData.success) {
          setRecentRequests(requestsData.data || []);
        }
      }
      
    } catch (error) {
      console.error('Error fetching admin data:', error);
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Admin Dashboard...</p>
        </div>
      </div>
    );
  }

  // Stats cards data
  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: <Users className="h-6 w-6" />,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: 'Registered users in system'
    },
    {
      title: 'Total Donors',
      value: stats.totalDonors,
      icon: <Droplets className="h-6 w-6" />,
      color: 'bg-red-500',
      textColor: 'text-red-600',
      bgColor: 'bg-red-50',
      description: 'Active blood donors'
    },
    {
      title: 'Total Funding',
      value: `$${stats.totalFunding}`,
      icon: <DollarSign className="h-6 w-6" />,
      color: 'bg-green-500',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50',
      description: 'Total donations received'
    },
    {
      title: 'Blood Requests',
      value: stats.totalRequests,
      icon: <Activity className="h-6 w-6" />,
      color: 'bg-purple-500',
      textColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
      description: 'All donation requests'
    },
    {
      title: 'Pending Requests',
      value: stats.pendingRequests,
      icon: <AlertCircle className="h-6 w-6" />,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      description: 'Requests awaiting donors'
    },
    {
      title: 'Completed',
      value: stats.completedRequests,
      icon: <Shield className="h-6 w-6" />,
      color: 'bg-indigo-500',
      textColor: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      description: 'Successfully completed'
    }
  ];

  // Quick action buttons
  const quickActions = [
    {
      title: 'Manage Users',
      description: 'View and manage all users',
      icon: '👥',
      path: '/admin/users',
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'All Requests',
      description: 'Manage donation requests',
      icon: '🩸',
      path: '/admin/all-requests',
      color: 'from-red-500 to-red-600'
    },
    {
      title: 'View Reports',
      description: 'System analytics & reports',
      icon: '📊',
      path: '/admin/reports',
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Funding',
      description: 'Manage donations & funds',
      icon: '💰',
      path: '/dashboard/funding',
      color: 'from-yellow-500 to-yellow-600'
    }
  ];

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">👑 Admin Dashboard</h1>
              <p className="mt-1 text-gray-600">
                Welcome back, <span className="font-semibold text-blue-600">{user?.name}</span>
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-2">
                <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-semibold">
                  ADMIN
                </span>
                <span className="text-sm text-gray-500">|</span>
                <span className="text-sm text-gray-600">{user?.email}</span>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                >
                  User Dashboard
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
          <h2 className="text-2xl font-bold mb-2">Welcome to Admin Control Panel</h2>
          <p className="mb-4">Manage your blood donation system efficiently with full administrative privileges.</p>
          <div className="flex items-center space-x-4">
            <div className="bg-white bg-opacity-20 px-4 py-2 rounded-lg">
              <TrendingUp className="h-5 w-5 inline mr-2" />
              System Status: <span className="font-bold">Active</span>
            </div>
            <div className="bg-white bg-opacity-20 px-4 py-2 rounded-lg">
              <Calendar className="h-5 w-5 inline mr-2" />
              Last Updated: {new Date().toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">📊 System Overview</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            {statCards.map((stat, index) => (
              <div
                key={index}
                className={`${stat.bgColor} rounded-xl shadow-sm p-6 transition-all hover:shadow-md hover:scale-105`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`${stat.color} p-3 rounded-full text-white`}>
                    {stat.icon}
                  </div>
                  <span className={`text-2xl font-bold ${stat.textColor}`}>
                    {stat.value}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-800">{stat.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{stat.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">⚡ Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quickActions.map((action, index) => (
                <Link
                  key={index}
                  to={action.path}
                  className={`bg-gradient-to-r ${action.color} rounded-xl p-6 text-white shadow-lg transition-all hover:shadow-xl hover:scale-105`}
                >
                  <div className="flex items-center space-x-4">
                    <span className="text-3xl">{action.icon}</span>
                    <div>
                      <h3 className="font-bold text-lg">{action.title}</h3>
                      <p className="text-white text-opacity-80 text-sm mt-1">{action.description}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Requests */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">🆕 Recent Requests</h2>
              <Link 
                to="/admin/all-requests" 
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                View All →
              </Link>
            </div>
            
            <div className="bg-white rounded-xl shadow overflow-hidden">
              {recentRequests.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {recentRequests.map((request) => (
                    <div key={request._id} className="p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-900">{request.recipientName}</h4>
                          <p className="text-sm text-gray-600">{request.hospitalName}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          request.status === 'inprogress' ? 'bg-blue-100 text-blue-800' :
                          request.status === 'done' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {request.status}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center justify-between text-sm text-gray-500">
                        <span>🩸 {request.bloodGroup}</span>
                        <span>📍 {request.recipientDistrict}</span>
                        <span>📅 {formatDate(request.donationDate)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-gray-500">
                  No recent requests found
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;