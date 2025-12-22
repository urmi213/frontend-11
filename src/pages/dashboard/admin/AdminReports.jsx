// components/dashboard/AdminReports.jsx - SIMPLE WORKING EXPORT
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { BarChart3, Download } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminReports = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setReports(data.data || {});
        }
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
      toast.error('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  // ✅ WORKING EXPORT FUNCTION
  const handleExportReport = () => {
    // Create CSV content
    const csvData = [
      ['Metric', 'Value'],
      ['Total Users', reports.totalUsers || 0],
      ['Total Requests', reports.totalRequests || 0],
      ['Pending Requests', reports.pendingRequests || 0],
      ['Total Donors', reports.totalDonors || 0],
      ['Total Admins', reports.totalAdmins || 0],
      ['In Progress', reports.inProgressRequests || 0],
      ['Completed', reports.completedRequests || 0],
      ['Cancelled', reports.cancelledRequests || 0]
    ];

    // Convert to CSV string
    const csvString = csvData.map(row => row.join(',')).join('\n');
    
    // Create download link
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `blood-donation-report-${new Date().toISOString().split('T')[0]}.csv`;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success('Report exported successfully!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            <BarChart3 className="inline mr-2 h-8 w-8" />
            Admin Reports
          </h1>
          <p className="mt-2 text-gray-600">System reports dashboard</p>
        </div>

        {/* Export Button - SIMPLE */}
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">Export Report</h2>
            <button 
              onClick={handleExportReport}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Download className="h-5 w-5 mr-2" />
              Export as CSV
            </button>
          </div>
          <p className="mt-2 text-gray-600 text-sm">
            Click export to download a CSV file with all system statistics
          </p>
        </div>

        {/* ... rest of your existing stats display ... */}
      </div>
    </div>
  );
};

export default AdminReports;