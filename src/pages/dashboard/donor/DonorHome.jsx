import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { FaTint, FaHeart, FaBell, FaHistory } from 'react-icons/fa';
import { donationAPI } from '../../../services/api';  // ✅ Changed from donationApi
import { userAPI } from '../../../services/api';      // ✅ Also likely needs uppercase
import { StatsCard } from '../../../components/dashboard/StatsCards';
import RecentRequests from '../../../components/dashboard/RecentRequests';
import toast from 'react-hot-toast';

const DonorHome = () => {
  const [stats, setStats] = useState({
    totalDonations: 0,
    lastDonation: '',
    upcomingAppointments: 0,
    points: 0
  });
  const [recentRequests, setRecentRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDonorData();
  }, []);

  const fetchDonorData = async () => {
    try {
      // Fetch donor stats
      const statsResponse = await userAPI.getUserStats();  // ✅ uppercase
      if (statsResponse.data.success) {
        setStats(statsResponse.data.stats);
      }

      // Fetch recent blood requests
      const requestsResponse = await donationAPI.getPublicRequests();  // ✅ uppercase
      if (requestsResponse.data.success) {
        setRecentRequests(requestsResponse.data.requests.slice(0, 5));
      }
    } catch (error) {
      toast.error('Failed to load dashboard data');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDonate = async (requestId) => {
    try {
      const response = await donationAPI.donateToRequest(requestId);  // ✅ uppercase
      if (response.data.success) {
        toast.success('Thank you for your donation commitment!');
        fetchDonorData(); // Refresh data
      }
    } catch (error) {
      toast.error('Failed to commit donation');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-xl p-6">
        <h1 className="text-3xl font-bold mb-2">Welcome Back, Donor!</h1>
        <p className="text-gray-600">
          Your generosity saves lives. Check out urgent blood requests and your donation history.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Donations"
          value={stats.totalDonations}
          icon={<FaTint className="text-red-500" />}
          color="red"
          description="Lifetime donations"
        />
        <StatsCard
          title="Last Donation"
          value={stats.lastDonation ? new Date(stats.lastDonation).toLocaleDateString() : 'Never'}
          icon={<FaHistory className="text-blue-500" />}
          color="blue"
          description="Most recent donation"
        />
        <StatsCard
          title="Upcoming Appointments"
          value={stats.upcomingAppointments}
          icon={<FaBell className="text-yellow-500" />}
          color="yellow"
          description="Scheduled donations"
        />
        <StatsCard
          title="Donor Points"
          value={stats.points}
          icon={<FaHeart className="text-pink-500" />}
          color="pink"
          description="Reward points earned"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Link to="/donate-now" className="btn btn-primary">
            <FaTint className="mr-2" />
            Donate Now
          </Link>
          <Link to="/appointments" className="btn btn-outline">
            Schedule Appointment
          </Link>
          <Link to="/history" className="btn btn-outline">
            View History
          </Link>
          <Link to="/rewards" className="btn btn-outline">
            My Rewards
          </Link>
        </div>
      </div>

      {/* Recent Blood Requests */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Urgent Blood Requests Near You</h2>
          <Link to="/requests" className="text-red-600 hover:underline">
            View All →
          </Link>
        </div>
        
        {recentRequests.length > 0 ? (
          <RecentRequests 
            requests={recentRequests} 
            onDonate={handleDonate}
            showActions={true}
          />
        ) : (
          <div className="text-center py-8 text-gray-500">
            <FaTint className="text-4xl mx-auto mb-2 text-gray-300" />
            <p>No urgent requests at the moment</p>
          </div>
        )}
      </div>

      {/* Health Tips */}
      <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-xl p-6">
        <h3 className="text-lg font-bold mb-3">Donor Health Tips</h3>
        <ul className="space-y-2">
          <li className="flex items-start gap-2">
            <div className="badge badge-success badge-xs mt-1"></div>
            <span>Stay hydrated before and after donation</span>
          </li>
          <li className="flex items-start gap-2">
            <div className="badge badge-success badge-xs mt-1"></div>
            <span>Eat iron-rich foods like spinach and red meat</span>
          </li>
          <li className="flex items-start gap-2">
            <div className="badge badge-success badge-xs mt-1"></div>
            <span>Wait at least 8 weeks between donations</span>
          </li>
          <li className="flex items-start gap-2">
            <div className="badge badge-success badge-xs mt-1"></div>
            <span>Get adequate rest after donating blood</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default DonorHome;