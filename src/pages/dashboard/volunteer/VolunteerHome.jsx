import { useState, useEffect } from 'react'
import DashboardStats from '../../../components/ui/DashboardStats'
import { FaHeartbeat, FaUsers, FaChartLine, FaExclamationTriangle } from 'react-icons/fa'
import { statsApi } from '../../../services/api'
import toast from 'react-hot-toast'

const VolunteerHome = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalFunding: 0,
    totalRequests: 0,
    pendingRequests: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await statsApi.getVolunteerDashboardStats()
      setStats(response.data)
    } catch (error) {
      toast.error('Failed to load dashboard statistics')
    } finally {
      setLoading(false)
    }
  }

  const quickStats = [
    {
      title: 'Total Requests',
      value: stats.totalRequests,
      icon: <FaHeartbeat className="w-8 h-8" />,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      description: 'All donation requests'
    },
    {
      title: 'Pending',
      value: stats.pendingRequests,
      icon: <FaExclamationTriangle className="w-8 h-8" />,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      description: 'Need immediate attention'
    },
    {
      title: 'Total Donors',
      value: stats.totalUsers,
      icon: <FaUsers className="w-8 h-8" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      description: 'Registered blood donors'
    },
    {
      title: 'Total Funding',
      value: `৳${stats.totalFunding.toLocaleString()}`,
      icon: <FaChartLine className="w-8 h-8" />,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      description: 'Funds raised'
    }
  ]

  const urgentRequests = [
    { id: 1, recipient: 'Ahmed Khan', bloodGroup: 'O+', location: 'Dhaka Medical', time: '2 hours ago' },
    { id: 2, recipient: 'Fatima Begum', bloodGroup: 'A-', location: 'Square Hospital', time: '3 hours ago' },
    { id: 3, recipient: 'Rahim Ahmed', bloodGroup: 'B+', location: 'Apollo Hospital', time: '5 hours ago' }
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="hero bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8">
        <div className="hero-content text-center">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold mb-4">Volunteer Dashboard</h1>
            <p className="text-lg mb-6">
              Monitor donation requests and help coordinate blood donation activities
            </p>
            <div className="badge badge-lg badge-primary">
              Volunteer Privileges Active
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat, index) => (
          <div key={index} className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-70">{stat.title}</p>
                  <h3 className="text-2xl font-bold mt-2">{stat.value}</h3>
                  <p className="text-xs mt-2 opacity-70">{stat.description}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor} ${stat.color}`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Urgent Requests */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex justify-between items-center">
            <h2 className="card-title text-2xl">Urgent Requests</h2>
            <div className="badge badge-error">High Priority</div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Recipient</th>
                  <th>Blood Group</th>
                  <th>Location</th>
                  <th>Time Posted</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {urgentRequests.map(request => (
                  <tr key={request.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar">
                          <div className="w-8 rounded-full">
                            <img src="https://i.ibb.co/4gJQyTD/default-avatar.png" alt="Recipient" />
                          </div>
                        </div>
                        <div>
                          <div className="font-bold">{request.recipient}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge bg-red-100 text-red-800">
                        {request.bloodGroup}
                      </span>
                    </td>
                    <td>{request.location}</td>
                    <td>{request.time}</td>
                    <td>
                      <button className="btn btn-primary btn-sm">
                        Update Status
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="card-actions justify-end mt-4">
            <a href="/dashboard/all-blood-donation-request" className="btn btn-secondary">
              View All Requests
            </a>
          </div>
        </div>
      </div>

      {/* Volunteer Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <h3 className="card-title">Your Permissions</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <div className="badge badge-success badge-sm"></div>
                <span>View all donation requests</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="badge badge-success badge-sm"></div>
                <span>Update donation status</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="badge badge-error badge-sm"></div>
                <span>Manage users (Restricted)</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="badge badge-error badge-sm"></div>
                <span>Delete requests (Restricted)</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <h3 className="card-title">Quick Actions</h3>
            <div className="space-y-4">
              <a href="/dashboard/all-blood-donation-request" className="btn btn-primary btn-block">
                Manage Donation Requests
              </a>
              <a href="/dashboard/profile" className="btn btn-outline btn-block">
                Update Your Profile
              </a>
              <button className="btn btn-ghost btn-block" onClick={fetchStats}>
                Refresh Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-base-200 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="avatar">
                  <div className="w-10 rounded-full">
                    <img src="https://i.ibb.co/4gJQyTD/default-avatar.png" alt="User" />
                  </div>
                </div>
                <div>
                  <p className="font-medium">You updated request status</p>
                  <p className="text-sm opacity-70">2 hours ago</p>
                </div>
              </div>
              <span className="badge badge-info">Completed</span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-base-200 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="avatar">
                  <div className="w-10 rounded-full">
                    <img src="https://i.ibb.co/4gJQyTD/default-avatar.png" alt="User" />
                  </div>
                </div>
                <div>
                  <p className="font-medium">New urgent request received</p>
                  <p className="text-sm opacity-70">4 hours ago</p>
                </div>
              </div>
              <span className="badge badge-warning">Pending</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VolunteerHome