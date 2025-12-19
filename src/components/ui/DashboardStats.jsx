import { useState, useEffect } from 'react';
import { dashboardAPI } from '../../services/api';  // ✅ Changed from statsApi
import StatsCard from './cards/StatsCard';

const DashboardStats = ({ userType = 'admin' }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, [userType]);

  const fetchStats = async () => {
    try {
      let response;
      
      if (userType === 'admin') {
        response = await dashboardAPI.getAdminStats();  // ✅ dashboardAPI ব্যবহার করুন
      } else if (userType === 'donor') {
        response = await dashboardAPI.getDonorStats();  // ✅ dashboardAPI ব্যবহার করুন
      } else {
        response = await dashboardAPI.getAdminStats();  // Default
      }

      if (response.data.success) {
        setStats(response.data.stats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading statistics...</div>;
  }

  if (!stats) {
    return <div>No statistics available</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatsCard
        title="Total Donations"
        value={stats.totalDonations}
        icon="💰"
        color="green"
        trend="+12.5%"
      />
      <StatsCard
        title="Active Donors"
        value={stats.activeDonors}
        icon="👥"
        color="blue"
        trend="+8.2%"
      />
      <StatsCard
        title="Pending Requests"
        value={stats.pendingRequests}
        icon="📋"
        color="orange"
        trend="-3.2%"
      />
      <StatsCard
        title="Success Rate"
        value={`${stats.successRate}%`}
        icon="✅"
        color="purple"
        trend="+2.5%"
      />
    </div>
  );
};

export default DashboardStats;