import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { 
  FaUsers, 
  FaTint, 
  FaHospital, 
  FaMoneyBillWave,
  FaChartLine,
  FaCalendarCheck,
  FaUserCheck,
  FaExclamationTriangle
} from 'react-icons/fa';
import { dashboardAPI } from '../../../services/api';  // ✅ Changed from statsApi
import { donationAPI } from '../../../services/api';
import { userAPI } from '../../../services/api';
import StatsCard from '../../../components/dashboard/StatsCards';
import RecentRequests from '../../../components/dashboard/RecentRequests';
import toast from 'react-hot-toast';

const AdminHome = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDonations: 0,
    pendingRequests: 0,
    totalRevenue: 0,
    activeDonors: 0,
    successRate: 0,
    todayDonations: 0,
    urgentRequests: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      // Fetch admin stats
      const statsResponse = await dashboardAPI.getAdminStats();  // ✅ dashboardAPI
      if (statsResponse?.data?.success) {
        setStats(statsResponse.data.stats);
      }

      // Fetch recent activities/requests
      const requestsResponse = await donationAPI.getAllRequests({ limit: 5 });
      if (requestsResponse?.data?.success) {
        setRecentActivities(requestsResponse.data.requests);
      }
    } catch (error) {
      toast.error('Failed to load admin dashboard data');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveRequest = async (requestId) => {
    try {
      const response = await donationAPI.updateStatus(requestId, 'approved');
      if (response?.data?.success) {
        toast.success('Request approved successfully');
        fetchAdminData(); // Refresh data
      }
    } catch (error) {
      toast.error('Failed to approve request');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="opacity-90">
          Monitor system activities, manage users, and oversee blood donation operations
        </p>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Users"
          value={stats.totalUsers}
          icon={<FaUsers className="text-blue-500 text-xl" />}
          color="blue"
          description="Registered users"
          trend="+12%"
        />
        <StatsCard
          title="Total Donations"
          value={stats.totalDonations}
          icon={<FaTint className="text-red-500 text-xl" />}
          color="red"
          description="Blood units donated"
          trend="+8.5%"
        />
        <StatsCard
          title="Pending Requests"
          value={stats.pendingRequests}
          icon={<FaHospital className="text-yellow-500 text-xl" />}
          color="yellow"
          description="Awaiting approval"
          trend="-3"
        />
        <StatsCard
          title="Total Revenue"
          value={`$${stats.totalRevenue?.toLocaleString() || '0'}`}
          icon={<FaMoneyBillWave className="text-green-500 text-xl" />}
          color="green"
          description="Funds raised"
          trend="+15.2%"
        />
      </div>

      {/* Second Row Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Active Donors"
          value={stats.activeDonors}
          icon={<FaUserCheck className="text-teal-500 text-xl" />}
          color="teal"
          description="Currently active"
          trend="+5"
        />
        <StatsCard
          title="Success Rate"
          value={`${stats.successRate}%`}
          icon={<FaChartLine className="text-purple-500 text-xl" />}
          color="purple"
          description="Request fulfillment"
          trend="+2.5%"
        />
        <StatsCard
          title="Today's Donations"
          value={stats.todayDonations}
          icon={<FaCalendarCheck className="text-orange-500 text-xl" />}
          color="orange"
          description="Donations today"
          trend="+3"
        />
        <StatsCard
          title="Urgent Requests"
          value={stats.urgentRequests}
          icon={<FaExclamationTriangle className="text-pink-500 text-xl" />}
          color="pink"
          description="Need immediate attention"
          trend="+2"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Link to="/admin/users" className="btn btn-primary">
            <FaUsers className="mr-2" />
            Manage Users
          </Link>
          <Link to="/admin/requests" className="btn btn-secondary">
            <FaHospital className="mr-2" />
            Review Requests
          </Link>
          <Link to="/admin/donations" className="btn btn-success">
            <FaTint className="mr-2" />
            View Donations
          </Link>
          <Link to="/admin/reports" className="btn btn-warning">
            <FaChartLine className="mr-2" />
            Generate Reports
          </Link>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Recent Activities</h2>
          <Link to="/admin/activities" className="text-indigo-600 hover:underline">
            View All →
          </Link>
        </div>
        
        {recentActivities.length > 0 ? (
          <RecentRequests 
            requests={recentActivities}
            showActions={true}
            onStatusUpdate={handleApproveRequest}
            title="Latest Blood Requests"
          />
        ) : (
          <div className="text-center py-8 text-gray-500">
            <FaChartLine className="text-4xl mx-auto mb-2 text-gray-300" />
            <p>No recent activities</p>
          </div>
        )}
      </div>

      {/* System Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6">
          <h3 className="text-lg font-bold mb-3">System Status</h3>
          <ul className="space-y-3">
            <li className="flex justify-between items-center">
              <span className="text-gray-700">Database</span>
              <span className="badge badge-success">Online</span>
            </li>
            <li className="flex justify-between items-center">
              <span className="text-gray-700">API Services</span>
              <span className="badge badge-success">Running</span>
            </li>
            <li className="flex justify-between items-center">
              <span className="text-gray-700">Email Service</span>
              <span className="badge badge-success">Active</span>
            </li>
            <li className="flex justify-between items-center">
              <span className="text-gray-700">Payment Gateway</span>
              <span className="badge badge-success">Connected</span>
            </li>
          </ul>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6">
          <h3 className="text-lg font-bold mb-3">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/admin/settings" className="text-blue-600 hover:underline">
                ⚙️ System Settings
              </Link>
            </li>
            <li>
              <Link to="/admin/analytics" className="text-blue-600 hover:underline">
                📊 Analytics Dashboard
              </Link>
            </li>
            <li>
              <Link to="/admin/notifications" className="text-blue-600 hover:underline">
                🔔 Send Notifications
              </Link>
            </li>
            <li>
              <Link to="/admin/backup" className="text-blue-600 hover:underline">
                💾 Backup & Restore
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;