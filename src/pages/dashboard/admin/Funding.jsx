import { useState, useEffect } from 'react'
import { fundingApi } from '../../../services/api'
import { FaDonate, FaDownload, FaPrint, FaFilter, FaSearch } from 'react-icons/fa'
import toast from 'react-hot-toast'

const Funding = () => {
  const [fundingData, setFundingData] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [stats, setStats] = useState({
    totalFunding: 0,
    monthlyAverage: 0,
    totalDonors: 0,
    recentGrowth: 0
  })
  const itemsPerPage = 10

  useEffect(() => {
    fetchFundingData()
    fetchStats()
  }, [])

  const fetchFundingData = async () => {
    try {
      const response = await fundingApi.getAllFunding()
      setFundingData(response.data)
    } catch (error) {
      toast.error('Failed to load funding data')
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fundingApi.getStats()
      setStats(response.data)
    } catch (error) {
      console.error('Failed to load stats:', error)
    }
  }

  const filteredData = fundingData.filter(funding =>
    funding.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    funding.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentData = filteredData.slice(startIndex, endIndex)

  const handleDonate = () => {
    toast.success('Redirecting to donation page...')
    // Implement Stripe payment integration here
  }

  const handleExport = () => {
    toast.success('Exporting funding data...')
  }

  const handlePrint = () => {
    window.print()
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Funding Management</h1>
          <p className="text-gray-600">Manage all funding donations and transactions</p>
        </div>
        <button className="btn btn-primary" onClick={handleDonate}>
          <FaDonate className="mr-2" />
          Give Fund
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="stat bg-base-100 shadow">
          <div className="stat-figure text-primary">
            <FaDonate className="w-8 h-8" />
          </div>
          <div className="stat-title">Total Funding</div>
          <div className="stat-value text-primary">{formatCurrency(stats.totalFunding)}</div>
          <div className="stat-desc">All time donations</div>
        </div>

        <div className="stat bg-base-100 shadow">
          <div className="stat-title">Monthly Average</div>
          <div className="stat-value text-secondary">{formatCurrency(stats.monthlyAverage)}</div>
          <div className="stat-desc">Per month</div>
        </div>

        <div className="stat bg-base-100 shadow">
          <div className="stat-title">Total Donors</div>
          <div className="stat-value">{stats.totalDonors}</div>
          <div className="stat-desc">Unique donors</div>
        </div>

        <div className="stat bg-base-100 shadow">
          <div className="stat-title">Growth</div>
          <div className="stat-value text-success">+{stats.recentGrowth}%</div>
          <div className="stat-desc">This month</div>
        </div>
      </div>

      {/* Search and Actions */}
      <div className="card bg-base-100 shadow">
        <div className="card-body">
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <div className="form-control flex-1">
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Search by donor name or email..."
                  className="input input-bordered w-full"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    setCurrentPage(1)
                  }}
                />
                <button className="btn btn-square">
                  <FaSearch />
                </button>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button className="btn btn-outline" onClick={handlePrint}>
                <FaPrint className="mr-2" />
                Print
              </button>
              <button className="btn btn-success" onClick={handleExport}>
                <FaDownload className="mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Funding Table */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl">All Funding Records</h2>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Donor</th>
                      <th>Email</th>
                      <th>Amount</th>
                      <th>Date</th>
                      <th>Transaction ID</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentData.map((funding) => (
                      <tr key={funding._id}>
                        <td>
                          <div className="flex items-center gap-3">
                            <div className="avatar">
                              <div className="w-10 rounded-full">
                                <img src={funding.avatar || 'https://i.ibb.co/4gJQyTD/default-avatar.png'} alt={funding.userName} />
                              </div>
                            </div>
                            <div>
                              <div className="font-bold">{funding.userName}</div>
                            </div>
                          </div>
                        </td>
                        <td>{funding.email}</td>
                        <td>
                          <span className="font-bold text-success">
                            {formatCurrency(funding.amount)}
                          </span>
                        </td>
                        <td>{new Date(funding.createdAt).toLocaleDateString()}</td>
                        <td>
                          <code className="text-xs">{funding.transactionId}</code>
                        </td>
                        <td>
                          <span className="badge badge-success badge-sm">
                            {funding.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-between items-center mt-8">
                  <div className="text-sm text-gray-600">
                    Showing {startIndex + 1} to {Math.min(endIndex, filteredData.length)} of {filteredData.length} records
                  </div>
                  <div className="join">
                    <button 
                      className="join-item btn"
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      «
                    </button>
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        className={`join-item btn ${currentPage === i + 1 ? 'btn-active' : ''}`}
                        onClick={() => setCurrentPage(i + 1)}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button 
                      className="join-item btn"
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    >
                      »
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Donation Information */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card bg-base-200">
          <div className="card-body">
            <h3 className="card-title">How Funding Helps</h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <div className="badge badge-primary badge-xs mt-1"></div>
                <span>Medical equipment for blood testing</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="badge badge-primary badge-xs mt-1"></div>
                <span>Transportation for blood delivery</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="badge badge-primary badge-xs mt-1"></div>
                <span>Donor awareness campaigns</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="badge badge-primary badge-xs mt-1"></div>
                <span>Hospital partnership programs</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="card bg-base-200">
          <div className="card-body">
            <h3 className="card-title">Recent Large Donations</h3>
            <div className="space-y-4">
              {fundingData
                .sort((a, b) => b.amount - a.amount)
                .slice(0, 3)
                .map((funding, index) => (
                  <div key={funding._id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{funding.userName}</p>
                      <p className="text-sm opacity-70">{new Date(funding.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="text-lg font-bold text-success">
                      {formatCurrency(funding.amount)}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Funding