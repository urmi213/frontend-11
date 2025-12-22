// pages/admin/AdminDashboard.jsx - FIXED VERSION
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import {
  Users,
  Droplets,
  DollarSign,
  TrendingUp,
  Calendar,
  RefreshCw,
  Activity,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  BarChart3,
  Download,
  Eye,
  ArrowRight,
  Loader2,
  Heart,
  Package,
  AlertTriangle
} from 'lucide-react';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // ✅ DEFAULT VALUES দিয়ে initialize - toLocaleString error fix
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalFunding: 0, // এটা number থাকবে
    totalRequests: 0,
    pendingRequests: 0,
    inProgressRequests: 0,
    completedRequests: 0,
    todayRequests: 0,
    weeklyGrowth: 0,
    successRate: 85 // default value
  });
  
  const [loading, setLoading] = useState(true);
  const [recentActivities, setRecentActivities] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  const [useMockData, setUseMockData] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      toast.error('Access denied. Admin only.');
      navigate('/dashboard');
      return;
    }
    
    fetchAdminData();
  }, [user, navigate]);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // ✅ TRY REAL API FIRST
      try {
        // Fetch admin stats
        const statsRes = await fetch('http://localhost:5000/api/admin/stats', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (statsRes.ok) {
          const data = await statsRes.json();
          console.log('📊 Stats API response:', data);
          
          // ✅ Handle different response structures
          if (data.success && data.data) {
            setStats(data.data);
            setUseMockData(false);
          } else if (data.success) {
            // Direct data in response
            setStats(data);
            setUseMockData(false);
          } else if (data) {
            // No success property, assume it's stats
            setStats(data);
            setUseMockData(false);
          } else {
            throw new Error('Invalid response format');
          }
        } else {
          console.log('Stats API failed, using mock data');
          loadMockData();
        }
      } catch (apiError) {
        console.log('API error, using mock data:', apiError.message);
        loadMockData();
      }

      // ✅ TRY RECENT ACTIVITIES
      try {
        const activitiesRes = await fetch('http://localhost:5000/api/admin/recent-activities', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (activitiesRes.ok) {
          const data = await activitiesRes.json();
          if (data.success && data.activities) {
            setRecentActivities(data.activities);
          } else if (data.activities) {
            setRecentActivities(data.activities);
          } else {
            setRecentActivities(getMockActivities());
          }
        } else {
          setRecentActivities(getMockActivities());
        }
      } catch (error) {
        console.log('Activities API error:', error);
        setRecentActivities(getMockActivities());
      }

      // ✅ TRY WEEKLY DATA
      try {
        const weeklyRes = await fetch('http://localhost:5000/api/admin/weekly-stats', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (weeklyRes.ok) {
          const data = await weeklyRes.json();
          if (data.success && data.data) {
            setWeeklyData(data.data);
          } else if (data.data) {
            setWeeklyData(data.data);
          } else {
            setWeeklyData(getMockWeeklyData());
          }
        } else {
          setWeeklyData(getMockWeeklyData());
        }
      } catch (error) {
        console.log('Weekly data API error:', error);
        setWeeklyData(getMockWeeklyData());
      }

    } catch (error) {
      console.error('Error in fetchAdminData:', error);
      loadMockData();
    } finally {
      setLoading(false);
    }
  };

  // ✅ MOCK DATA FUNCTIONS
  const loadMockData = () => {
    console.log('🛠️ Loading mock data for development');
    setUseMockData(true);
    
    // Mock stats
    setStats({
      totalUsers: 1250,
      totalFunding: 45250, // ✅ Number format, string না
      totalRequests: 324,
      pendingRequests: 24,
      inProgressRequests: 12,
      completedRequests: 288,
      todayRequests: 8,
      weeklyGrowth: 15.5,
      successRate: 88.9
    });
    
    setRecentActivities(getMockActivities());
    setWeeklyData(getMockWeeklyData());
  };

  const getMockActivities = () => {
    return [
      {
        _id: '1',
        type: 'donation',
        description: 'Blood donation request by John Doe',
        timestamp: new Date().toISOString(),
        status: 'pending',
        user: { name: 'John Doe' }
      },
      {
        _id: '2',
        type: 'registration',
        description: 'New donor registered: Sarah Smith',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        status: 'done',
        user: { name: 'Sarah Smith' }
      },
      {
        _id: '3',
        type: 'funding',
        description: 'Donation received from Alex Johnson',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        status: 'done',
        amount: 500
      },
      {
        _id: '4',
        type: 'donation',
        description: 'Urgent request for O+ blood',
        timestamp: new Date(Date.now() - 10800000).toISOString(),
        status: 'inprogress',
        user: { name: 'Emergency Case' }
      },
      {
        _id: '5',
        type: 'donation',
        description: 'Blood donation completed by Maria Garcia',
        timestamp: new Date(Date.now() - 14400000).toISOString(),
        status: 'done',
        user: { name: 'Maria Garcia' }
      }
    ];
  };

  const getMockWeeklyData = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map((day, index) => ({
      day,
      requests: Math.floor(Math.random() * 20) + 5,
      donations: Math.floor(Math.random() * 15) + 3,
      funding: Math.floor(Math.random() * 5000) + 1000
    }));
  };

  const handleRefresh = () => {
    fetchAdminData();
    toast.success('Dashboard refreshed');
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  // ✅ SAFE NUMBER FORMATTING - toLocaleString error fix
  const formatNumber = (num) => {
    if (num === undefined || num === null) return '0';
    if (typeof num === 'string') {
      const parsed = parseFloat(num);
      if (isNaN(parsed)) return '0';
      num = parsed;
    }
    
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  // ✅ SAFE CURRENCY FORMATTING
  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return '$0';
    if (typeof amount === 'string') {
      const parsed = parseFloat(amount);
      if (isNaN(parsed)) return '$0';
      amount = parsed;
    }
    
    try {
      return '$' + amount.toLocaleString('en-US');
    } catch (error) {
      return '$' + amount.toString();
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'inprogress': return 'bg-blue-100 text-blue-800';
      case 'done': return 'bg-green-100 text-green-800';
      case 'canceled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'inprogress': return <Activity className="h-4 w-4" />;
      case 'done': return <CheckCircle className="h-4 w-4" />;
      case 'canceled': return <XCircle className="h-4 w-4" />;
      default: return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading Admin Dashboard...</p>
          <p className="text-gray-400 text-sm mt-2">Fetching system data</p>
        </div>
      </div>
    );
  }

  // ✅ REQUIREMENTS: 3 MAIN STATS CARDS
  const mainStats = [
    {
      title: 'Total Users (Donors)',
      value: formatNumber(stats.totalUsers),
      icon: <Users className="h-8 w-8" />,
      color: 'from-blue-500 to-blue-600',
      description: 'Registered blood donors',
      change: '+12% this month',
      changeColor: 'text-green-500',
      link: '/admin/users'
    },
    {
      title: 'Total Funding',
      value: formatCurrency(stats.totalFunding), // ✅ FIXED: formatCurrency ব্যবহার করুন
      icon: <DollarSign className="h-8 w-8" />,
      color: 'from-green-500 to-green-600',
      description: 'Total donations received',
      change: '+23% this month',
      changeColor: 'text-green-500',
      link: '/admin/funding'
    },
    {
      title: 'Blood Donation Requests',
      value: formatNumber(stats.totalRequests),
      icon: <Droplets className="h-8 w-8" />,
      color: 'from-red-500 to-red-600',
      description: 'Total requests made',
      change: '+15% this week',
      changeColor: 'text-green-500',
      link: '/admin/requests'
    }
  ];

  // Additional stats
  const additionalStats = [
    {
      title: 'Pending Requests',
      value: formatNumber(stats.pendingRequests),
      icon: <AlertCircle className="h-6 w-6" />,
      color: 'bg-yellow-100',
      textColor: 'text-yellow-600',
      description: 'Awaiting response'
    },
    {
      title: 'In Progress',
      value: formatNumber(stats.inProgressRequests),
      icon: <Activity className="h-6 w-6" />,
      color: 'bg-blue-100',
      textColor: 'text-blue-600',
      description: 'Currently being handled'
    },
    {
      title: 'Completed',
      value: formatNumber(stats.completedRequests),
      icon: <CheckCircle className="h-6 w-6" />,
      color: 'bg-green-100',
      textColor: 'text-green-600',
      description: 'Successfully fulfilled'
    },
    {
      title: 'Success Rate',
      value: `${stats.successRate?.toFixed(1) || '0'}%`,
      icon: <TrendingUp className="h-6 w-6" />,
      color: 'bg-purple-100',
      textColor: 'text-purple-600',
      description: 'Request fulfillment rate'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <div className="mt-1 flex items-center gap-3">
                <p className="text-gray-600">
                  Welcome back, <span className="font-semibold text-blue-600">{user?.name}</span>
                </p>
                {useMockData && (
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full flex items-center">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Using Mock Data
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-3">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600">System Online</span>
                </div>
                <span className="text-gray-300">|</span>
                <button
                  onClick={handleRefresh}
                  className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                  disabled={loading}
                >
                  <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
                  <span className="text-sm">Refresh</span>
                </button>
              </div>
              
              <div className="flex space-x-3">
                <Link
                  to="/dashboard"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  User View
                </Link>
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
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2">Welcome to Admin Control Panel</h2>
                <p className="text-blue-100 mb-4">
                  Monitor and manage all activities of the blood donation system from one place.
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="bg-white bg-opacity-20 px-4 py-2 rounded-lg">
                    <div className="flex items-center">
                      <TrendingUp className="h-5 w-5 mr-2" />
                      <span>Weekly Growth: <span className="font-bold">{stats.weeklyGrowth}%</span></span>
                    </div>
                  </div>
                  <div className="bg-white bg-opacity-20 px-4 py-2 rounded-lg">
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 mr-2" />
                      <span>Today: <span className="font-bold">{new Date().toLocaleDateString()}</span></span>
                    </div>
                  </div>
                  <div className="bg-white bg-opacity-20 px-4 py-2 rounded-lg">
                    <div className="flex items-center">
                      <Heart className="h-5 w-5 mr-2" />
                      <span>Success Rate: <span className="font-bold">{stats.successRate?.toFixed(1) || '0'}%</span></span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex-shrink-0">
                <div className="bg-white text-blue-600 px-6 py-3 rounded-lg font-bold text-center">
                  <div className="text-sm">Admin Role</div>
                  <div className="text-xl">Full Access</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ✅ REQUIREMENTS: 3 MAIN STATS CARDS */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">📊 System Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mainStats.map((stat, index) => (
              <Link
                key={index}
                to={stat.link}
                className={`bg-gradient-to-r ${stat.color} rounded-xl shadow-lg p-6 text-white hover:shadow-xl hover:scale-[1.02] transition-all duration-300`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="mb-4">
                      {stat.icon}
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{stat.value}</h3>
                    <p className="font-semibold text-white opacity-90 mb-1">{stat.title}</p>
                    <p className="text-white opacity-80 text-sm">{stat.description}</p>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-medium ${stat.changeColor}`}>
                      {stat.change}
                    </div>
                    <ArrowRight className="h-5 w-5 mt-4 opacity-70" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Additional Stats and Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Left Column - Additional Stats */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">📈 Detailed Statistics</h2>
                <button className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center">
                  <Download className="h-4 w-4 mr-1" />
                  Export Data
                </button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {additionalStats.map((stat, index) => (
                  <div
                    key={index}
                    className={`${stat.color} rounded-lg p-4`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className={`p-2 rounded-lg ${stat.color.replace('bg-', 'bg-opacity-20 ')}`}>
                        {stat.icon}
                      </div>
                      <span className={`text-2xl font-bold ${stat.textColor}`}>
                        {stat.value}
                      </span>
                    </div>
                    <h4 className="font-medium text-gray-800 text-sm">{stat.title}</h4>
                    <p className="text-xs text-gray-600">{stat.description}</p>
                  </div>
                ))}
              </div>

              {/* Weekly Chart */}
              <div className="mt-8 pt-6 border-t">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-blue-500" />
                  Weekly Activity Overview
                </h3>
                <div className="h-64 bg-gray-50 rounded-lg p-4">
                  {weeklyData.length > 0 ? (
                    <div className="h-full flex items-end space-x-2">
                      {weeklyData.map((day, index) => (
                        <div key={index} className="flex-1 flex flex-col items-center">
                          <div 
                            className="w-12 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg"
                            style={{ height: `${(day.requests / Math.max(...weeklyData.map(d => d.requests || 1)) * 100) || 10}%` }}
                          ></div>
                          <div className="mt-2 text-xs text-gray-600 font-medium">
                            {day.day}
                          </div>
                          <div className="text-xs text-gray-500">
                            {day.requests || 0} req
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center text-gray-400">
                      <div className="text-center">
                        <BarChart3 className="h-12 w-12 mx-auto mb-2" />
                        <p>No weekly data available</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Recent Activities */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mt-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">🔄 Recent Activities</h2>
                <Link to="/admin/activities" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                  View All →
                </Link>
              </div>
              
              <div className="space-y-4">
                {recentActivities.length > 0 ? (
                  recentActivities.slice(0, 5).map((activity, index) => (
                    <div key={activity._id || index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-full ${
                          activity.type === 'donation' ? 'bg-red-100' :
                          activity.type === 'registration' ? 'bg-blue-100' :
                          activity.type === 'funding' ? 'bg-green-100' : 'bg-gray-100'
                        }`}>
                          {activity.type === 'donation' && <Droplets className="h-4 w-4 text-red-600" />}
                          {activity.type === 'registration' && <Users className="h-4 w-4 text-blue-600" />}
                          {activity.type === 'funding' && <DollarSign className="h-4 w-4 text-green-600" />}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{activity.description}</p>
                          <p className="text-sm text-gray-500">
                            {formatDate(activity.timestamp)}
                            {activity.user?.name && ` • By ${activity.user.name}`}
                          </p>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)} flex items-center`}>
                        {getStatusIcon(activity.status)}
                        <span className="ml-1 capitalize">{activity.status || 'unknown'}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Activity className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p>No recent activities</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Quick Actions */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-6">⚡ Quick Actions</h2>
              
              <div className="space-y-4">
                <Link
                  to="/admin/users"
                  className="flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Manage Users</h3>
                      <p className="text-sm text-gray-600">View and manage all users</p>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                </Link>

                <Link
                  to="/admin/requests"
                  className="flex items-center justify-between p-4 bg-red-50 hover:bg-red-100 rounded-lg transition-colors group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <Droplets className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Donation Requests</h3>
                      <p className="text-sm text-gray-600">Manage all blood requests</p>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-red-600 transition-colors" />
                </Link>

                <Link
                  to="/admin/funding"
                  className="flex items-center justify-between p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <DollarSign className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Funding Management</h3>
                      <p className="text-sm text-gray-600">View and manage donations</p>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-green-600 transition-colors" />
                </Link>

                <Link
                  to="/admin/settings"
                  className="flex items-center justify-between p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Package className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">System Settings</h3>
                      <p className="text-sm text-gray-600">Configure system parameters</p>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
                </Link>
              </div>
            </div>

            {/* System Status */}
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
              <h3 className="text-lg font-bold mb-6">🖥️ System Status</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-indigo-100">Database</span>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                    <span className="font-medium">Online</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-indigo-100">API Server</span>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                    <span className="font-medium">Running</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-indigo-100">Storage</span>
                  <span className="font-medium">78% used</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-indigo-100">Uptime</span>
                  <span className="font-medium">99.8%</span>
                </div>
                
                <div className="pt-4 border-t border-indigo-400 mt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-indigo-100">Last Backup</span>
                    <span className="font-medium">2 hours ago</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4">📋 Quick Stats</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Avg. Response Time</span>
                  <span className="font-medium text-gray-900">24 minutes</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Success Rate</span>
                  <span className="font-medium text-green-600">{stats.successRate?.toFixed(1) || '0'}%</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Active Sessions</span>
                  <span className="font-medium text-gray-900">{formatNumber(45)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">System Load</span>
                  <span className="font-medium text-gray-900">Medium</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;