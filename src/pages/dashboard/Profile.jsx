import { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { FaUser, FaEnvelope, FaTint, FaMapMarkerAlt, FaEdit, FaSave, FaTimes } from 'react-icons/fa'
import toast from 'react-hot-toast'
import districtsData from '../../utils/districts'

const Profile = () => {
  const { user, updateProfile } = useAuth()
  const [editMode, setEditMode] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    bloodGroup: '',
    district: '',
    upazila: '',
    avatar: ''
  })
  const [districts, setDistricts] = useState([])
  const [upazilas, setUpazilas] = useState([])

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        bloodGroup: user.bloodGroup || '',
        district: user.district || '',
        upazila: user.upazila || '',
        avatar: user.avatar || ''
      })
    }
    // Load districts
    setDistricts(districtsData)
    
    // Set upazilas based on current district
    if (user?.district) {
      const selectedDistrict = districtsData.find(d => d.id === user.district)
      setUpazilas(selectedDistrict?.upazilas || [])
    }
  }, [user])

  const handleDistrictChange = (e) => {
    const districtId = e.target.value
    setFormData({ ...formData, district: districtId, upazila: '' })
    
    const selectedDistrict = districts.find(d => d.id === districtId)
    setUpazilas(selectedDistrict?.upazilas || [])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      await updateProfile(formData)
      toast.success('Profile updated successfully')
      setEditMode(false)
    } catch (error) {
      toast.error('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      name: user.name || '',
      bloodGroup: user.bloodGroup || '',
      district: user.district || '',
      upazila: user.upazila || '',
      avatar: user.avatar || ''
    })
    setEditMode(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="text-gray-600">Manage your personal information</p>
        </div>
        <div className="flex gap-2">
          {!editMode ? (
            <button 
              className="btn btn-primary"
              onClick={() => setEditMode(true)}
            >
              <FaEdit className="mr-2" />
              Edit Profile
            </button>
          ) : (
            <>
              <button 
                className="btn btn-success"
                onClick={handleSubmit}
                disabled={loading}
              >
                <FaSave className="mr-2" />
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
              <button 
                className="btn btn-outline"
                onClick={handleCancel}
              >
                <FaTimes className="mr-2" />
                Cancel
              </button>
            </>
          )}
        </div>
      </div>

      {/* Profile Card */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Avatar Section */}
            <div className="md:col-span-1 flex flex-col items-center">
              <div className="avatar mb-4">
                <div className="w-40 rounded-full ring ring-primary ring-offset-2">
                  <img src={formData.avatar || 'https://i.ibb.co/4gJQyTD/default-avatar.png'} alt={formData.name} />
                </div>
              </div>
              {editMode && (
                <input
                  type="text"
                  placeholder="Avatar URL"
                  className="input input-bordered w-full mt-4"
                  value={formData.avatar}
                  onChange={(e) => setFormData({...formData, avatar: e.target.value})}
                />
              )}
              <div className="mt-4 text-center">
                <div className="badge badge-primary badge-lg">
                  {user?.role?.toUpperCase()}
                </div>
                <p className="text-sm mt-2">Member since {new Date(user?.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            {/* Profile Details */}
            <div className="md:col-span-2 space-y-6">
              {/* Name */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text flex items-center gap-2">
                    <FaUser />
                    Full Name
                  </span>
                </label>
                {editMode ? (
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                ) : (
                  <div className="text-lg font-medium">{formData.name}</div>
                )}
              </div>

              {/* Email (Read-only) */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text flex items-center gap-2">
                    <FaEnvelope />
                    Email Address
                  </span>
                </label>
                <div className="text-lg font-medium">{user?.email}</div>
                <div className="text-sm text-gray-500 mt-1">Email cannot be changed</div>
              </div>

              {/* Blood Group */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text flex items-center gap-2">
                    <FaTint />
                    Blood Group
                  </span>
                </label>
                {editMode ? (
                  <select
                    className="select select-bordered w-full"
                    value={formData.bloodGroup}
                    onChange={(e) => setFormData({...formData, bloodGroup: e.target.value})}
                    required
                  >
                    <option value="">Select Blood Group</option>
                    {bloodGroups.map(group => (
                      <option key={group} value={group}>{group}</option>
                    ))}
                  </select>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="badge badge-lg bg-red-100 text-red-800 border-0">
                      {formData.bloodGroup}
                    </span>
                  </div>
                )}
              </div>

              {/* Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text flex items-center gap-2">
                      <FaMapMarkerAlt />
                      District
                    </span>
                  </label>
                  {editMode ? (
                    <select
                      className="select select-bordered w-full"
                      value={formData.district}
                      onChange={handleDistrictChange}
                      required
                    >
                      <option value="">Select District</option>
                      {districts.map(district => (
                        <option key={district.id} value={district.id}>{district.name}</option>
                      ))}
                    </select>
                  ) : (
                    <div className="text-lg font-medium">{formData.district}</div>
                  )}
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Upazila</span>
                  </label>
                  {editMode ? (
                    <select
                      className="select select-bordered w-full"
                      value={formData.upazila}
                      onChange={(e) => setFormData({...formData, upazila: e.target.value})}
                      required
                      disabled={!formData.district}
                    >
                      <option value="">Select Upazila</option>
                      {upazilas.map(upazila => (
                        <option key={upazila} value={upazila}>{upazila}</option>
                      ))}
                    </select>
                  ) : (
                    <div className="text-lg font-medium">{formData.upazila}</div>
                  )}
                </div>
              </div>

              {/* Additional Info */}
              {!editMode && (
                <div className="mt-8">
                  <h3 className="text-lg font-bold mb-4">Account Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">User ID</p>
                      <p className="font-mono text-sm">{user?._id?.substring(0, 8)}...</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Account Status</p>
                      <span className={`badge ${user?.status === 'active' ? 'badge-success' : 'badge-error'}`}>
                        {user?.status}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Last Updated</p>
                      <p>{new Date(user?.updatedAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Donations Made</p>
                      <p className="font-bold">12</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="stat bg-base-100 shadow">
          <div className="stat-figure text-primary">
            <FaTint />
          </div>
          <div className="stat-title">Blood Group</div>
          <div className="stat-value text-red-600">{user?.bloodGroup}</div>
          <div className="stat-desc">Your blood type</div>
        </div>
        
        <div className="stat bg-base-100 shadow">
          <div className="stat-figure text-secondary">
            <FaMapMarkerAlt />
          </div>
          <div className="stat-title">Location</div>
          <div className="stat-value text-lg">{user?.district}</div>
          <div className="stat-desc">{user?.upazila}</div>
        </div>
        
        <div className="stat bg-base-100 shadow">
          <div className="stat-title">Member Since</div>
          <div className="stat-value text-lg">
            {new Date(user?.createdAt).toLocaleDateString('en-US', { 
              month: 'short', 
              year: 'numeric' 
            })}
          </div>
          <div className="stat-desc">{user?.role.toUpperCase()}</div>
        </div>
      </div>
    </div>
  )
}

export default Profile