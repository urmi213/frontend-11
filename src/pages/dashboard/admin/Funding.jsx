// pages/dashboard/Funding.jsx
import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, Users, Target, Calendar, Download, BarChart3 } from 'lucide-react';
import toast from 'react-hot-toast';
import { getFundingStats } from '../../../services/api';

const Funding = () => {
  const [stats, setStats] = useState({
    totalDonations: 0,
    totalDonors: 0,
    monthlyGoal: 0,
    currentMonth: 0,
    fundingHistory: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const result = await getFundingStats();
      
      // Handle both response structures
      if (result.success && result.data) {
        // API returns { success: true, data: {...} }
        setStats(result.data);
      } else if (result.totalDonations !== undefined) {
        // Direct data structure
        setStats(result);
      } else {
        // Fallback mock data
        console.log('Using mock funding data');
        setStats({
          totalDonations: 12500,
          totalDonors: 234,
          monthlyGoal: 10000,
          currentMonth: 8500,
          fundingHistory: [
            { month: 'Jan', amount: 8500 },
            { month: 'Feb', amount: 9200 },
            { month: 'Mar', amount: 7800 },
            { month: 'Apr', amount: 10500 },
            { month: 'May', amount: 12500 }
          ]
        });
      }
    } catch (error) {
      console.error('Failed to load funding stats:', error);
      toast.error('Failed to load funding statistics');
      
      // Use mock data on error
      setStats({
        totalDonations: 12500,
        totalDonors: 234,
        monthlyGoal: 10000,
        currentMonth: 8500,
        fundingHistory: [
          { month: 'Jan', amount: 8500 },
          { month: 'Feb', amount: 9200 },
          { month: 'Mar', amount: 7800 },
          { month: 'Apr', amount: 10500 },
          { month: 'May', amount: 12500 }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDonate = () => {
    toast.success('Redirecting to donation portal...');
    // Implement donation redirection
  };

  const handleExportReport = () => {
    toast.success('Exporting funding report...');
    // Implement export functionality
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading funding data...</p>
        </div>
      </div>
    );
  }

  const progressPercentage = (stats.currentMonth / stats.monthlyGoal) * 100;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            <DollarSign className="inline mr-2 h-8 w-8" />
            Funding & Donations
          </h1>
          <p className="mt-2 text-gray-600">Track donations and funding progress for our blood donation initiatives</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Donations</p>
                <p className="text-3xl font-bold text-gray-900">${stats.totalDonations.toLocaleString()}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <p className="mt-2 text-sm text-green-600">
              <TrendingUp className="inline h-4 w-4 mr-1" />
              +12.5% from last month
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Donors</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalDonors}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-600">Active contributors</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Monthly Goal</p>
                <p className="text-3xl font-bold text-gray-900">${stats.monthlyGoal.toLocaleString()}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <Target className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-3">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full" 
                  style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-600 mt-1">{progressPercentage.toFixed(1)}% of goal</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">This Month</p>
                <p className="text-3xl font-bold text-gray-900">${stats.currentMonth.toLocaleString()}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <Calendar className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-600">Collected in current month</p>
          </div>
        </div>

        {/* Funding History Chart */}
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Funding History</h2>
            <button 
              onClick={handleExportReport}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </button>
          </div>
          
          <div className="space-y-4">
            {stats.fundingHistory.map((item, index) => (
              <div key={index} className="flex items-center">
                <div className="w-20 text-sm text-gray-600">{item.month}</div>
                <div className="flex-1">
                  <div className="flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div 
                        className="bg-blue-600 h-4 rounded-full" 
                        style={{ 
                          width: `${(item.amount / Math.max(...stats.fundingHistory.map(h => h.amount))) * 100}%` 
                        }}
                      ></div>
                    </div>
                    <div className="ml-4 text-sm font-semibold text-gray-900">
                      ${item.amount.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Donation Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">One-time Donation</h3>
            <p className="text-gray-600 mb-6">Make a single contribution to support our blood donation initiatives</p>
            <button 
              onClick={handleDonate}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
            >
              Donate Now
            </button>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Monthly Support</h3>
            <p className="text-gray-600 mb-6">Become a monthly supporter and help us maintain consistent operations</p>
            <button 
              onClick={handleDonate}
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700"
            >
              Start Monthly Support
            </button>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Corporate Partnership</h3>
            <p className="text-gray-600 mb-6">Partner with us as a corporate sponsor for larger impact</p>
            <button 
              onClick={handleDonate}
              className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700"
            >
              Contact for Partnership
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Funding;