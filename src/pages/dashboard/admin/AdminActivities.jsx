// pages/admin/AdminActivities.jsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { 
  Activity, 
  Users, 
  Droplets, 
  DollarSign, 
  Calendar, 
  Clock, 
  Filter, 
  Download,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

const AdminActivities = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [dateRange, setDateRange] = useState('today');

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Try to get activities from API
      try {
        const response = await fetch('http://https://myapp-cq1llcwyg-urmis-projects-37af7542.vercel.app/api/admin/recent-activities', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.activities) {
            setActivities(data.activities);
          } else {
            // Use mock data if API returns different format
            generateMockActivities();
          }
        } else {
          // Use mock data if API fails
          generateMockActivities();
        }
      } catch (error) {
        console.log('Using mock activities:', error);
        generateMockActivities();
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
      generateMockActivities();
    } finally {
      setLoading(false);
    }
  };

  const generateMockActivities = () => {
    const mockActivities = [
      {
        _id: '1',
        type: 'registration',
        description: 'New donor registered: John Smith',
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
        status: 'done',
        user: { name: 'John Smith' }
      },
      {
        _id: '2',
        type: 'donation',
        description: 'Blood request created for Sarah Johnson',
        timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
        status: 'pending',
        user: { name: 'Sarah Johnson' }
      },
      {
        _id: '3',
        type: 'funding',
        description: 'Donation received from Alex Brown',
        timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(), // 3 hours ago
        status: 'done',
        amount: 500
      },
      {
        _id: '4',
        type: 'donation',
        description: 'Urgent O+ blood request marked as completed',
        timestamp: new Date(Date.now() - 1000 * 60 * 300).toISOString(), // 5 hours ago
        status: 'done',
        user: { name: 'Emergency Case' }
      },
      {
        _id: '5',
        type: 'status_change',
        description: 'User Michael Chen blocked by admin',
        timestamp: new Date(Date.now() - 1000 * 60 * 420).toISOString(), // 7 hours ago
        status: 'done',
        user: { name: 'Michael Chen' }
      },
      {
        _id: '6',
        type: 'donation',
        description: 'Blood donation in progress at Dhaka Medical',
        timestamp: new Date(Date.now() - 1000 * 60 * 540).toISOString(), // 9 hours ago
        status: 'inprogress'
      },
      {
        _id: '7',
        type: 'registration',
        description: 'New volunteer added: Emma Wilson',
        timestamp: new Date(Date.now() - 1000 * 60 * 660).toISOString(), // 11 hours ago
        status: 'done',
        user: { name: 'Emma Wilson' }
      },
      {
        _id: '8',
        type: 'funding',
        description: 'Monthly funding target achieved',
        timestamp: new Date(Date.now() - 1000 * 60 * 780).toISOString(), // 13 hours ago
        status: 'done'
      }
    ];
    
    setActivities(mockActivities);
  };

  const getActivityIcon = (type) => {
    switch(type) {
      case 'registration': return <Users className="h-5 w-5" />;
      case 'donation': return <Droplets className="h-5 w-5" />;
      case 'funding': return <DollarSign className="h-5 w-5" />;
      case 'status_change': return <AlertCircle className="h-5 w-5" />;
      default: return <Activity className="h-5 w-5" />;
    }
  };

  const getActivityColor = (type) => {
    switch(type) {
      case 'registration': return 'bg-blue-100 text-blue-600';
      case 'donation': return 'bg-red-100 text-red-600';
      case 'funding': return 'bg-green-100 text-green-600';
      case 'status_change': return 'bg-yellow-100 text-yellow-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'done': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'inprogress': return <Activity className="h-4 w-4 text-blue-500" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) {
      return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const filteredActivities = activities.filter(activity => {
    if (filter === 'all') return true;
    return activity.type === filter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading activities...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">📋 System Activities</h1>
              <p className="text-gray-600 mt-2">Monitor all system activities and logs</p>
            </div>
            <div className="flex space-x-3">
              <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center">
                <Download className="h-4 w-4 mr-2" />
                Export Logs
              </button>
              <button 
                onClick={fetchActivities}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Activities</p>
                <p className="text-2xl font-bold mt-2">{activities.length}</p>
              </div>
              <Activity className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Today</p>
                <p className="text-2xl font-bold mt-2">
                  {activities.filter(a => {
                    const activityDate = new Date(a.timestamp);
                    const today = new Date();
                    return activityDate.toDateString() === today.toDateString();
                  }).length}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-green-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Completed</p>
                <p className="text-2xl font-bold mt-2">
                  {activities.filter(a => a.status === 'done').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Pending</p>
                <p className="text-2xl font-bold mt-2">
                  {activities.filter(a => a.status === 'pending').length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <Filter className="h-5 w-5 text-gray-500" />
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 rounded-lg ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'}`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter('registration')}
                  className={`px-4 py-2 rounded-lg ${filter === 'registration' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'}`}
                >
                  Registrations
                </button>
                <button
                  onClick={() => setFilter('donation')}
                  className={`px-4 py-2 rounded-lg ${filter === 'donation' ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-700'}`}
                >
                  Donations
                </button>
                <button
                  onClick={() => setFilter('funding')}
                  className={`px-4 py-2 rounded-lg ${filter === 'funding' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700'}`}
                >
                  Funding
                </button>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="today">Today</option>
                <option value="yesterday">Yesterday</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="all">All Time</option>
              </select>
              
              <input
                type="text"
                placeholder="Search activities..."
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Activities Timeline */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">🕒 Activity Timeline</h3>
            
            <div className="space-y-6">
              {filteredActivities.map((activity, index) => (
                <div key={activity._id} className="flex items-start">
                  {/* Timeline line */}
                  <div className="relative">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getActivityColor(activity.type)}`}>
                      {getActivityIcon(activity.type)}
                    </div>
                    {index < filteredActivities.length - 1 && (
                      <div className="absolute top-10 left-5 w-0.5 h-12 bg-gray-200"></div>
                    )}
                  </div>
                  
                  {/* Activity content */}
                  <div className="ml-4 flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900">{activity.description}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          {activity.user?.name && `By ${activity.user.name} • `}
                          {formatDate(activity.timestamp)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(activity.status)}
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          activity.status === 'done' ? 'bg-green-100 text-green-800' :
                          activity.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          activity.status === 'inprogress' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {activity.status}
                        </span>
                      </div>
                    </div>
                    
                    {activity.amount && (
                      <div className="mt-2 inline-block bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm">
                        Amount: ${activity.amount}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            {filteredActivities.length === 0 && (
              <div className="text-center py-12">
                <Activity className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No activities found</p>
              </div>
            )}
          </div>
        </div>

        {/* Activity Summary */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Activity Types Distribution */}
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Activity Types</h3>
            <div className="space-y-4">
              {['registration', 'donation', 'funding', 'status_change'].map((type) => {
                const count = activities.filter(a => a.type === type).length;
                const percentage = activities.length > 0 ? (count / activities.length) * 100 : 0;
                
                return (
                  <div key={type} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getActivityColor(type)}`}>
                        {getActivityIcon(type)}
                      </div>
                      <span className="capitalize">{type.replace('_', ' ')}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            type === 'registration' ? 'bg-blue-500' :
                            type === 'donation' ? 'bg-red-500' :
                            type === 'funding' ? 'bg-green-500' :
                            'bg-yellow-500'
                          }`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium w-10 text-right">
                        {count}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Stats */}
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">📈 Recent Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="text-blue-700">Activities in last 24 hours</span>
                <span className="font-bold text-blue-700">
                  {activities.filter(a => {
                    const activityDate = new Date(a.timestamp);
                    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
                    return activityDate > yesterday;
                  }).length}
                </span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="text-green-700">Completed tasks</span>
                <span className="font-bold text-green-700">
                  {activities.filter(a => a.status === 'done').length}
                </span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                <span className="text-yellow-700">Pending actions</span>
                <span className="font-bold text-yellow-700">
                  {activities.filter(a => a.status === 'pending').length}
                </span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                <span className="text-purple-700">Average daily activities</span>
                <span className="font-bold text-purple-700">
                  {Math.round(activities.length / 7)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminActivities;