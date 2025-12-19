import React from 'react';
import { 
  FaUser, 
  FaHospital, 
  FaCalendar, 
  FaClock, 
  FaMapMarkerAlt, 
  FaTint,
  FaExclamationCircle
} from 'react-icons/fa';
import { useNavigate } from 'react-router';
import Button from '../buttons';

const RequestCard = ({ request, showActions = false, onStatusUpdate }) => {
  const navigate = useNavigate();

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    inprogress: 'bg-blue-100 text-blue-800',
    done: 'bg-green-100 text-green-800',
    canceled: 'bg-red-100 text-red-800'
  };

  const bloodGroupColor = {
    'A+': 'bg-red-500',
    'A-': 'bg-pink-500',
    'B+': 'bg-blue-500',
    'B-': 'bg-indigo-500',
    'AB+': 'bg-purple-500',
    'AB-': 'bg-violet-500',
    'O+': 'bg-orange-500',
    'O-': 'bg-amber-500',
  };

  const handleViewDetails = () => {
    navigate(`/dashboard/request/${request._id}`);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-bold text-gray-900 flex items-center">
              <FaUser className="mr-2 text-red-500" />
              {request.recipientName}
            </h3>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[request.status]}`}>
              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
            </span>
          </div>
          
          <div className="flex items-center mb-2">
            <FaTint className={`mr-2 text-white p-1 rounded-full ${bloodGroupColor[request.bloodGroup] || 'bg-red-500'}`} />
            <span className="font-bold text-gray-900">{request.bloodGroup}</span>
            <span className="mx-3 text-gray-300">•</span>
            <FaHospital className="mr-2 text-gray-500" />
            <span className="text-gray-700">{request.hospitalName}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            <div className="flex items-center text-gray-600">
              <FaCalendar className="mr-2 text-green-500" />
              <span>{new Date(request.donationDate).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <FaClock className="mr-2 text-blue-500" />
              <span>{request.donationTime}</span>
            </div>
            <div className="flex items-center text-gray-600 col-span-2">
              <FaMapMarkerAlt className="mr-2 text-red-500" />
              <span>{request.fullAddress}, {request.recipientDistrict}, {request.recipientUpazila}</span>
            </div>
          </div>

          {request.requestMessage && (
            <div className="mb-4">
              <p className="text-gray-600 text-sm line-clamp-2">
                <FaExclamationCircle className="inline mr-1 text-red-500" />
                {request.requestMessage}
              </p>
            </div>
          )}

          {request.donorName && request.status === 'inprogress' && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-700">
                <span className="font-semibold">Donor Assigned:</span> {request.donorName} ({request.donorEmail})
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Requested by: <span className="font-semibold">{request.requesterName}</span>
          <span className="mx-2">•</span>
          {new Date(request.createdAt).toLocaleDateString()}
        </div>
        
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleViewDetails}
          >
            View Details
          </Button>
          
          {showActions && request.status === 'inprogress' && (
            <>
              <Button
                variant="success"
                size="sm"
                onClick={() => onStatusUpdate(request._id, 'done')}
              >
                Mark Done
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => onStatusUpdate(request._id, 'canceled')}
              >
                Cancel
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RequestCard;