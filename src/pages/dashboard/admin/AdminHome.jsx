// pages/dashboard/AdminHome.jsx
import React, { useEffect, useState } from 'react';
import { 
  UsersIcon, 
  DropletIcon, 
  WalletIcon, 
  TrendingUpIcon,
  ActivityIcon,
  ClockIcon,
  UserCheckIcon,
  UserXIcon
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, 
         XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AdminHome = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDonors: 0,
    totalVolunteers: 0,
    totalAdmins: 0,
    totalRequests: 0,
    totalFunds: 0,
    pendingRequests: 0,
    completedRequests: 0
  });

  const [recentActivities, setRecentActivities] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [bloodGroupData, setBloodGroupData] = useState([]);

  useEffect(() => {
    // Fetch dashboard statistics
    fetchDashboardStats();
    fetchRecentActivities();
    fetchChartData();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_API_URL}/admin/dashboard-stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchRecentActivities = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_API_URL}/admin/recent-activities`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setRecentActivities(data);
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
    }
  };

  const fetchChartData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_API_URL}/admin/chart-data`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setChartData(data.donationTrend);
        setBloodGroupData(data.bloodGroupDistribution);
      }
    } catch (error) {
      console.error('Error fetching chart data:', error);
    }
  };

  const statsCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: <UsersIcon className="h-6 w-6 text-blue-500" />,
      change: '+12%',
      color: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Total Donors',
      value: stats.totalDonors,
      icon: <DropletIcon className="h-6 w-6 text-red-500" />,
      change: '+8%',
      color: 'bg-red-50',
      textColor: 'text-red-600'
    },
    {
      title: 'Donation Requests',
      value: stats.totalRequests,
      icon: <ActivityIcon className="h-6 w-6 text-green-500" />,
      change: '+15%',
      color: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'Total Funds',
      value: `$${stats.totalFunds.toLocaleString()}`,
      icon: <WalletIcon className="h-6 w-6 text-purple-500" />,
      change: '+23%',
      color: 'bg-purple-50',
      textColor: 'text-purple-600'
    }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white shadow-lg">
        <h1 className="text-3xl font-bold">Welcome back, Admin! 👋</h1>
        <p className="mt-2 text-blue-100">
          Here's what's happening with your blood donation platform today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                <p className="text-2xl font-bold mt-2">{stat.value}</p>
                <p className="text-xs text-green-500 mt-1 flex items-center">
                  <TrendingUpIcon className="h-3 w-3 mr-1" />
                  {stat.change} from last month
                </p>
              </div>
              <div className={`p-3 rounded-full ${stat.color}`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Donation Trend Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Donation Requests Trend</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="requests" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ stroke: '#3b82f6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="donations" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  dot={{ stroke: '#10b981', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Blood Group Distribution */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Blood Group Distribution</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={bloodGroupData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {bloodGroupData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${value} donors`, 'Count']}
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-800">Recent Activities</h3>
          <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
            View All →
          </button>
        </div>
        
        <div className="space-y-4">
          {recentActivities.map((activity, index) => (
            <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${
                  activity.type === 'donation' ? 'bg-red-100 text-red-600' :
                  activity.type === 'registration' ? 'bg-blue-100 text-blue-600' :
                  activity.type === 'fund' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                }`}>
                  {activity.type === 'donation' && <DropletIcon className="h-4 w-4" />}
                  {activity.type === 'registration' && <UserCheckIcon className="h-4 w-4" />}
                  {activity.type === 'fund' && <WalletIcon className="h-4 w-4" />}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                  <p className="text-xs text-gray-500 flex items-center">
                    <ClockIcon className="h-3 w-3 mr-1" />
                    {activity.time}
                  </p>
                </div>
              </div>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                activity.status === 'completed' ? 'bg-green-100 text-green-800' :
                activity.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {activity.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminHome;