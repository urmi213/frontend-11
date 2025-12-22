import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { 
  getDashboardData, 
  updateRequestStatus, 
  deleteRequest 
} from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { 
  UsersIcon, 
  CurrencyDollarIcon, 
  HeartIcon,
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  UserIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowRightIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const DashboardHome = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const data = await getDashboardData();
      setDashboardData(data);
      setError(null);
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  /* ===============================
     Status Update Handler
  ================================ */
  const handleStatusUpdate = async (id, status) => {
    if (actionLoading) return;
    
    try {
      setActionLoading(true);
      await updateRequestStatus(id, status);
      
      // Update local state
      if (user?.role === 'donor') {
        setDashboardData(prev => ({
          ...prev,
          recentRequests: prev.recentRequests.map(req =>
            req._id === id ? { ...req, status } : req
          )
        }));
      }
      
      // Refresh data
      setTimeout(() => fetchDashboardData(), 500);
    } catch (err) {
      console.error('Status update error:', err);
      alert('Failed to update status');
    } finally {
      setActionLoading(false);
    }
  };

  /* ===============================
     Delete Handlers
  ================================ */
  const handleDeleteClick = (id) => {
    if (user?.status === 'blocked') {
      alert('Blocked users cannot delete requests');
      return;
    }
    setSelectedRequestId(id);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setActionLoading(true);
      await deleteRequest(selectedRequestId);
      
      if (user?.role === 'donor') {
        setDashboardData(prev => ({
          ...prev,
          recentRequests: prev.recentRequests.filter(
            req => req._id !== selectedRequestId
          )
        }));
      }
      
      setDeleteModalOpen(false);
      setSelectedRequestId(null);
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete request');
    } finally {
      setActionLoading(false);
    }
  };

  const handleEdit = (id) => {
    if (user?.status === 'blocked') {
      alert('Blocked users cannot edit requests');
      return;
    }
    navigate(`/dashboard/edit-request/${id}`);
  };

  const handleView = (id) => {
    navigate(`/dashboard/requests/${id}`);
  };

  const handleCreateRequest = () => {
    if (user?.status === 'blocked') {
      alert('Blocked users cannot create donation requests');
      return;
    }
    navigate('/dashboard/create-donation-request');
  };

  const handleViewAllRequests = () => {
    if (user?.role === 'donor') {
      navigate('/dashboard/my-donation-requests');
    } else {
      navigate('/dashboard/all-blood-donation-request');
    }
  };

  /* ===============================
     Loading & Error States
  ================================ */
  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[400px] flex items-center justify-center p-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ExclamationTriangleIcon className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Oops! Something went wrong</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="px-6 py-2.5 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const userRole = user?.role || dashboardData?.user?.role;
  const userName = user?.name || dashboardData?.user?.name;

  return (
    <div className="space-y-8 p-4 md:p-6">
      {/* Welcome Section - Common for all roles */}
      <WelcomeSection userName={userName} userRole={userRole} />
      
      {/* Role-based Content */}
      {userRole === 'donor' ? (
        /* Donor: Recent Requests Table */
        <DonorRecentRequests
          data={dashboardData}
          onStatusUpdate={handleStatusUpdate}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
          onView={handleView}
          onCreateRequest={handleCreateRequest}
          onViewAllRequests={handleViewAllRequests}
          actionLoading={actionLoading}
        />
      ) : (
        /* Admin & Volunteer: Statistics Cards */
        <StatisticsCards data={dashboardData} userRole={userRole} />
      )}
      
      {/* Quick Links for Admin & Volunteer */}
      {(userRole === 'admin' || userRole === 'volunteer') && (
        <QuickLinksSection userRole={userRole} />
      )}
      
      {/* Delete Modal */}
      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedRequestId(null);
        }}
        onConfirm={handleConfirmDelete}
        isLoading={actionLoading}
      />
    </div>
  );
};

/* ===============================
   Welcome Section (Common for all)
================================ */
const WelcomeSection = ({ userName, userRole }) => {
  const getRoleInfo = () => {
    const roles = {
      admin: { 
        color: 'bg-purple-100 text-purple-800',
        icon: '👑',
        subtitle: 'Manage blood donation system and save lives.'
      },
      donor: { 
        color: 'bg-red-100 text-red-800',
        icon: '❤️',
        subtitle: 'Thank you for helping save lives through blood donation.'
      },
      volunteer: { 
        color: 'bg-blue-100 text-blue-800',
        icon: '🤝',
        subtitle: 'Help coordinate blood donations and save lives.'
      }
    };
    return roles[userRole] || roles.donor;
  };

  const roleInfo = getRoleInfo();

  return (
    <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl shadow-lg overflow-hidden">
      <div className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                Welcome back, <span className="text-yellow-200">{userName}</span>!
              </h1>
              <span className={`${roleInfo.color} px-3 py-1 rounded-full text-sm font-medium`}>
                <span className="mr-1">{roleInfo.icon}</span>
                {userRole?.charAt(0).toUpperCase() + userRole?.slice(1)}
              </span>
            </div>
            <p className="text-red-100 text-lg mb-6 max-w-3xl">{roleInfo.subtitle}</p>
            
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 bg-red-500/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                <HeartIcon className="w-5 h-5 text-white" />
                <span className="text-white text-sm">Every donation saves 3 lives</span>
              </div>
              <div className="flex items-center gap-2 bg-red-500/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                <ClockIcon className="w-5 h-5 text-white" />
                <span className="text-white text-sm">Donation takes 10-15 minutes</span>
              </div>
            </div>
          </div>
          
          <div className="hidden lg:block">
            <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
              <HeartIcon className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ===============================
   Statistics Cards (Admin & Volunteer)
================================ */
const StatisticsCards = ({ data, userRole }) => {
  const stats = [
    {
      title: 'Total Users',
      value: data?.totalUsers || 0,
      icon: <UsersIcon className="w-8 h-8 text-blue-600" />,
      color: 'bg-blue-50 border-blue-200',
      textColor: 'text-blue-700',
      description: 'Registered donors',
      trend: '+12% from last month',
      link: userRole === 'admin' ? '/dashboard/all-users' : null
    },
    {
      title: 'Total Funding',
      value: `$${(data?.totalFunding || 0).toLocaleString()}`,
      icon: <CurrencyDollarIcon className="w-8 h-8 text-green-600" />,
      color: 'bg-green-50 border-green-200',
      textColor: 'text-green-700',
      description: 'Funds raised',
      trend: '+18% from last month',
      link: '/dashboard/funding'
    },
    {
      title: 'Total Requests',
      value: data?.totalRequests || 0,
      icon: <HeartIcon className="w-8 h-8 text-red-600" />,
      color: 'bg-red-50 border-red-200',
      textColor: 'text-red-700',
      description: 'Blood donation requests',
      trend: '+8% from last month',
      link: '/dashboard/all-blood-donation-request'
    }
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Dashboard Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div 
            key={index} 
            className={`${stat.color} border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-xl bg-white shadow-sm">
                {stat.icon}
              </div>
              <span className="text-sm font-medium text-green-600">
                {stat.trend}
              </span>
            </div>
            
            <h3 className="text-3xl font-bold text-gray-900 mb-1">
              {stat.value}
            </h3>
            <p className="text-gray-700 font-medium mb-1">
              {stat.title}
            </p>
            <p className="text-sm text-gray-500 mb-4">
              {stat.description}
            </p>
            
            {stat.link && (
              <a 
                href={stat.link}
                className="inline-flex items-center text-sm text-red-600 font-medium hover:text-red-700"
              >
                View details
                <ArrowRightIcon className="w-4 h-4 ml-1" />
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

/* ===============================
   Donor Recent Requests Table
================================ */
const DonorRecentRequests = ({
  data,
  onStatusUpdate,
  onEdit,
  onDelete,
  onView,
  onCreateRequest,
  onViewAllRequests,
  actionLoading
}) => {
  const recentRequests = data?.recentRequests || [];
  const hasRequests = recentRequests.length > 0;

  const getStatusBadge = (status) => {
    const config = {
      pending: { 
        label: 'Pending', 
        className: 'bg-yellow-100 text-yellow-800',
        icon: '⏳'
      },
      inprogress: { 
        label: 'In Progress', 
        className: 'bg-blue-100 text-blue-800',
        icon: '🔄'
      },
      done: { 
        label: 'Completed', 
        className: 'bg-green-100 text-green-800',
        icon: '✅'
      },
      canceled: { 
        label: 'Canceled', 
        className: 'bg-red-100 text-red-800',
        icon: '❌'
      }
    };
    const { label, className, icon } = config[status] || config.pending;
    
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${className}`}>
        <span>{icon}</span>
        {label}
      </span>
    );
  };

  if (!hasRequests) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <HeartIcon className="w-8 h-8 text-red-500" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Donation Requests Yet</h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          You haven't created any donation request yet. Create your first request to find blood donors.
        </p>
        <button
          onClick={onCreateRequest}
          className="px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
        >
          Create Donation Request
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Recent Donation Requests</h2>
            <p className="text-gray-600 text-sm mt-1">
              Showing {Math.min(recentRequests.length, 3)} of {recentRequests.length} requests
            </p>
          </div>
          <button
            onClick={onViewAllRequests}
            className="px-4 py-2 border border-red-600 text-red-600 font-medium rounded-lg hover:bg-red-50 transition-colors"
          >
            View All Requests
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Recipient
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date & Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Blood Group
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Donor Info
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {recentRequests.slice(0, 3).map((request) => (
              <tr key={request._id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div>
                    <div className="font-medium text-gray-900">{request.recipientName}</div>
                    <div className="text-sm text-gray-500">{request.hospitalName}</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <div className="font-medium text-gray-900">{request.district}</div>
                    <div className="text-sm text-gray-500">{request.upazila}</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <div className="font-medium text-gray-900">
                      {new Date(request.donationDate).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-gray-500">{request.donationTime}</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center justify-center w-12 h-8 bg-red-50 text-red-700 font-bold rounded-md">
                    {request.bloodGroup}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {getStatusBadge(request.status)}
                </td>
                <td className="px-6 py-4">
                  {request.status === 'inprogress' && request.donor ? (
                    <div>
                      <div className="font-medium text-gray-900">{request.donor.name}</div>
                      <div className="text-sm text-gray-500">{request.donor.email}</div>
                    </div>
                  ) : (
                    <span className="text-gray-400">Not assigned</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-2">
                    {request.status === 'inprogress' && (
                      <>
                        <button
                          onClick={() => onStatusUpdate(request._id, 'done')}
                          disabled={actionLoading}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-100 text-green-700 rounded-md text-sm font-medium hover:bg-green-200 transition-colors disabled:opacity-50"
                        >
                          <CheckCircleIcon className="w-4 h-4" />
                          Done
                        </button>
                        <button
                          onClick={() => onStatusUpdate(request._id, 'canceled')}
                          disabled={actionLoading}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-700 rounded-md text-sm font-medium hover:bg-red-200 transition-colors disabled:opacity-50"
                        >
                          <XCircleIcon className="w-4 h-4" />
                          Cancel
                        </button>
                      </>
                    )}
                    
                    <button
                      onClick={() => onEdit(request._id)}
                      disabled={actionLoading}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-yellow-100 text-yellow-700 rounded-md text-sm font-medium hover:bg-yellow-200 transition-colors disabled:opacity-50"
                    >
                      <PencilIcon className="w-4 h-4" />
                      Edit
                    </button>
                    
                    <button
                      onClick={() => onDelete(request._id)}
                      disabled={actionLoading}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-700 rounded-md text-sm font-medium hover:bg-red-200 transition-colors disabled:opacity-50"
                    >
                      <TrashIcon className="w-4 h-4" />
                      Delete
                    </button>
                    
                    <button
                      onClick={() => onView(request._id)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-md text-sm font-medium hover:bg-blue-200 transition-colors"
                    >
                      <EyeIcon className="w-4 h-4" />
                      View
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* ===============================
   Quick Links (Admin & Volunteer)
================================ */
const QuickLinksSection = ({ userRole }) => {
  const links = [
    {
      title: 'All Donation Requests',
      description: 'View and manage all donation requests',
      icon: '🩸',
      href: '/dashboard/all-blood-donation-request',
      color: 'bg-red-50 text-red-700 border-red-200'
    },
    {
      title: 'Funding',
      description: 'Manage donations and funding',
      icon: '💰',
      href: '/dashboard/funding',
      color: 'bg-green-50 text-green-700 border-green-200'
    },
    ...(userRole === 'admin' ? [{
      title: 'User Management',
      description: 'Manage all users and permissions',
      icon: '👥',
      href: '/dashboard/all-users',
      color: 'bg-blue-50 text-blue-700 border-blue-200'
    }] : [])
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {links.map((link, index) => (
          <a
            key={index}
            href={link.href}
            className={`${link.color} border rounded-xl p-5 hover:shadow-md transition-shadow block`}
          >
            <div className="flex items-start gap-4">
              <span className="text-2xl">{link.icon}</span>
              <div>
                <h3 className="font-semibold text-lg mb-1">{link.title}</h3>
                <p className="text-sm opacity-80">{link.description}</p>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

/* ===============================
   Delete Modal Component
================================ */
const DeleteModal = ({ isOpen, onClose, onConfirm, isLoading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        />
        
        {/* Modal */}
        <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full p-6">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Confirm Deletion
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this donation request? 
              This action cannot be undone.
            </p>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Deleting...' : 'Delete Request'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;