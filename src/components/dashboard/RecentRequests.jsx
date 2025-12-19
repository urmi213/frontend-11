// src/components/dashboard/RecentRequests.jsx (Simplified)
import React from 'react';
import { Link } from 'react-router';
import { FaTint, FaMapMarkerAlt, FaCalendarAlt, FaUser } from 'react-icons/fa';

const RecentRequests = ({ requests = [], onDonate, showActions = false }) => {
  if (!requests.length) {
    return (
      <div className="text-center py-8">
        <FaTint className="text-4xl mx-auto mb-2 text-gray-300" />
        <p className="text-gray-500">No urgent requests at the moment</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {requests.map((request) => (
        <div key={request._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="badge badge-error">
                  <FaTint className="mr-1" /> {request.bloodGroup}
                </span>
                <span className="badge badge-warning">
                  {request.status || 'Pending'}
                </span>
              </div>
              
              <h3 className="font-bold text-lg">{request.patientName}</h3>
              <p className="text-gray-600">{request.hospitalName}</p>
              
              <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-700">
                <div className="flex items-center gap-1">
                  <FaUser className="text-gray-400" />
                  <span>{request.requesterName}</span>
                </div>
                <div className="flex items-center gap-1">
                  <FaMapMarkerAlt className="text-gray-400" />
                  <span>{request.district}</span>
                </div>
                <div className="flex items-center gap-1">
                  <FaCalendarAlt className="text-gray-400" />
                  <span>{new Date(request.requiredDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            
            {showActions && (
              <button 
                onClick={() => onDonate(request._id)}
                className="btn btn-sm btn-primary ml-4"
              >
                Donate
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentRequests;