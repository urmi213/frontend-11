import React from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaTint } from 'react-icons/fa';
import Button from '../buttons';

const DonorCard = ({ donor, onContact }) => {
  const bloodGroupColor = {
    'A+': 'bg-red-100 text-red-800',
    'A-': 'bg-pink-100 text-pink-800',
    'B+': 'bg-blue-100 text-blue-800',
    'B-': 'bg-indigo-100 text-indigo-800',
    'AB+': 'bg-purple-100 text-purple-800',
    'AB-': 'bg-violet-100 text-violet-800',
    'O+': 'bg-orange-100 text-orange-800',
    'O-': 'bg-amber-100 text-amber-800',
  };

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <img
            src={donor.avatar || 'https://i.ibb.co.com/4pDNDk1/avatar.png'}
            alt={donor.name}
            className="w-16 h-16 rounded-full border-4 border-red-100"
          />
          <div>
            <h3 className="text-xl font-bold text-gray-900">{donor.name}</h3>
            <div className="flex items-center mt-1">
              <FaTint className={`mr-2 ${bloodGroupColor[donor.bloodGroup]?.split(' ')[1] || 'text-red-600'}`} />
              <span className={`px-3 py-1 rounded-full text-sm font-bold ${bloodGroupColor[donor.bloodGroup] || 'bg-red-100 text-red-800'}`}>
                {donor.bloodGroup}
              </span>
            </div>
          </div>
        </div>
        
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
          donor.status === 'active' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {donor.status === 'active' ? 'Available' : 'Unavailable'}
        </span>
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex items-center text-gray-600">
          <FaMapMarkerAlt className="mr-3 text-red-500" />
          <span>{donor.district}, {donor.upazila}</span>
        </div>
        
        <div className="flex items-center text-gray-600">
          <FaEnvelope className="mr-3 text-blue-500" />
          <span>{donor.email}</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Last donation: {donor.lastDonation ? new Date(donor.lastDonation).toLocaleDateString() : 'Never'}
        </div>
        
        <Button
          variant="primary"
          size="sm"
          onClick={() => onContact(donor)}
          disabled={donor.status !== 'active'}
        >
          Contact Donor
        </Button>
      </div>

      {donor.status !== 'active' && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-700">
            This donor is currently unavailable for donation.
          </p>
        </div>
      )}
    </div>
  );
};

export default DonorCard;