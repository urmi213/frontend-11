import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router'
import { useAuth } from '../../hooks/useAuth'
import { donationApi } from '../../services/api'
import { 
  FaHeartbeat, 
  FaMapMarkerAlt, 
  FaCalendar, 
  FaClock, 
  FaHospital, 
  FaUser, 
  FaEnvelope,
  FaArrowLeft,
  FaPhone,
  FaNotesMedical
} from 'react-icons/fa'
import toast from 'react-hot-toast'
import Loader from '../../components/shared/Loader'

const DonationRequestDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [request, setRequest] = useState(null)
  const [loading, setLoading] = useState(true)
  const [donateModalOpen, setDonateModalOpen] = useState(false)
  const [donateLoading, setDonateLoading] = useState(false)

  useEffect(() => {
    fetchRequestDetails()
  }, [id])

  const fetchRequestDetails = async () => {
    try {
      const response = await donationApi.getById(id)
      setRequest(response.data)
    } catch (error) {
      toast.error('Failed to load request details')
      navigate('/requests')
    } finally {
      setLoading(false)
    }
  }

  const handleDonate = async () => {
    if (!user) {
      navigate('/login')
      return
    }

    setDonateLoading(true)
    try {
      await donationApi.donate(id, {
        donorId: user._id,
        donorName: user.name,
        donorEmail: user.email
      })
      
      toast.success('Thank you for your donation! Status updated to in progress.')
      setDonateModalOpen(false)
      fetchRequestDetails()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to process donation')
    } finally {
      setDonateLoading(false)
    }
  }

  const getStatusBadge = (status) => {
    const badges = {
      pending: <span className="badge badge-warning">Pending</span>,
      inprogress: <span className="badge badge-info">In Progress</span>,
      done: <span className="badge badge-success">Completed</span>,
      canceled: <span className="badge badge-error">Canceled</span>
    }
    return badges[status] || badges.pending
  }

  if (loading) {
    return <Loader text="Loading request details..." />
  }

  if (!request) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Request Not Found</h2>
          <Link to="/requests" className="btn btn-primary">
            <FaArrowLeft className="mr-2" />
            Back to Requests
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-base-100 py-8">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <div className="mb-6">
          <button onClick={() => navigate(-1)} className="btn btn-ghost">
            <FaArrowLeft className="mr-2" />
            Back
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Request Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h1 className="text-3xl font-bold">{request.recipientName}</h1>
                    <div className="flex items-center gap-4 mt-2">
                      {getStatusBadge(request.status)}
                      <span className="badge badge-lg bg-red-100 text-red-800 border-0">
                        <FaHeartbeat className="mr-2" />
                        {request.bloodGroup}
                      </span>
                    </div>
                  </div>
                  
                  {request.status === 'pending' && user && user._id !== request.requesterId && (
                    <button 
                      className="btn btn-primary btn-lg"
                      onClick={() => setDonateModalOpen(true)}
                    >
                      <FaHeartbeat className="mr-2" />
                      Donate Now
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Hospital Information */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title text-2xl mb-4 flex items-center gap-2">
                  <FaHospital />
                  Hospital Information
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <FaHospital className="text-gray-400 mt-1" />
                    <div>
                      <p className="font-semibold">Hospital Name</p>
                      <p className="text-lg">{request.hospitalName}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <FaMapMarkerAlt className="text-gray-400 mt-1" />
                    <div>
                      <p className="font-semibold">Full Address</p>
                      <p className="text-lg">{request.fullAddress}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <FaMapMarkerAlt className="text-gray-400 mt-1" />
                    <div>
                      <p className="font-semibold">Location</p>
                      <p className="text-lg">
                        {request.recipientDistrict}, {request.recipientUpazila}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Donation Schedule */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title text-2xl mb-4">Donation Schedule</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex items-center gap-4 p-4 bg-base-200 rounded-lg">
                    <FaCalendar className="text-3xl text-primary" />
                    <div>
                      <p className="font-semibold">Donation Date</p>
                      <p className="text-xl">
                        {new Date(request.donationDate).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 p-4 bg-base-200 rounded-lg">
                    <FaClock className="text-3xl text-primary" />
                    <div>
                      <p className="font-semibold">Donation Time</p>
                      <p className="text-xl">{request.donationTime}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Request Message */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title text-2xl mb-4 flex items-center gap-2">
                  <FaNotesMedical />
                  Request Message
                </h2>
                <div className="bg-base-200 p-6 rounded-lg">
                  <p className="text-lg whitespace-pre-line">{request.requestMessage}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Side Information */}
          <div className="space-y-6">
            {/* Requester Information */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title text-xl mb-4">Requester Information</h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="w-12 rounded-full">
                        <img src="https://i.ibb.co/4gJQyTD/default-avatar.png" alt="Requester" />
                      </div>
                    </div>
                    <div>
                      <p className="font-semibold">{request.requesterName}</p>
                      <p className="text-sm opacity-70">{request.requesterEmail}</p>
                    </div>
                  </div>
                  
                  <div className="divider"></div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <FaUser className="text-gray-400" />
                      <span>Role: Donor</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaEnvelope className="text-gray-400" />
                      <span>{request.requesterEmail}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Donor Information (if in progress) */}
            {request.status === 'inprogress' && request.donorName && (
              <div className="card bg-base-100 shadow-xl border-l-4 border-success">
                <div className="card-body">
                  <h2 className="card-title text-xl mb-4 text-success">Donor Information</h2>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="w-12 rounded-full">
                          <img src="https://i.ibb.co/4gJQyTD/default-avatar.png" alt="Donor" />
                        </div>
                      </div>
                      <div>
                        <p className="font-semibold">{request.donorName}</p>
                        <p className="text-sm opacity-70">{request.donorEmail}</p>
                      </div>
                    </div>
                    
                    <div className="alert alert-success">
                      <FaHeartbeat />
                      <span>Donor has committed to donate</span>
                    </div>
                    
                    <div className="text-sm space-y-2">
                      <p>Please contact the donor to coordinate the donation:</p>
                      <button className="btn btn-outline btn-sm w-full">
                        <FaPhone className="mr-2" />
                        Contact Donor
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Info */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title text-xl mb-4">Quick Information</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="opacity-70">Request ID:</span>
                    <span className="font-mono text-sm">{request._id?.substring(0, 8)}...</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="opacity-70">Posted:</span>
                    <span>{new Date(request.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="opacity-70">Last Updated:</span>
                    <span>{new Date(request.updatedAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="opacity-70">Urgency:</span>
                    <span className="badge badge-warning">High</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            {user && (
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h2 className="card-title text-xl mb-4">Actions</h2>
                  <div className="space-y-3">
                    {user.role === 'admin' && (
                      <>
                        <button className="btn btn-outline w-full">
                          Edit Request
                        </button>
                        <button className="btn btn-error btn-outline w-full">
                          Delete Request
                        </button>
                      </>
                    )}
                    
                    {user.role === 'volunteer' && request.status === 'pending' && (
                      <button className="btn btn-primary w-full">
                        Update Status
                      </button>
                    )}
                    
                    <button className="btn btn-ghost w-full">
                      Report Issue
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Donate Modal */}
      {donateModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Confirm Donation</h3>
            <p className="mb-6">
              By clicking confirm, you agree to donate blood for <strong>{request.recipientName}</strong>.
              The request status will be updated to "In Progress".
            </p>
            
            <div className="bg-base-200 p-4 rounded-lg mb-6">
              <p className="font-semibold">Your Information:</p>
              <p>Name: {user?.name}</p>
              <p>Email: {user?.email}</p>
              <p>Blood Group: {user?.bloodGroup}</p>
            </div>
            
            <div className="modal-action">
              <button 
                className="btn btn-ghost"
                onClick={() => setDonateModalOpen(false)}
              >
                Cancel
              </button>
              <button 
                className={`btn btn-primary ${donateLoading ? 'loading' : ''}`}
                onClick={handleDonate}
                disabled={donateLoading}
              >
                Confirm Donation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DonationRequestDetails