// pages/public/SearchDonors.jsx
import React, { useState } from 'react';
import { Search, Filter, MapPin, Phone, Mail, Heart } from 'lucide-react';

const SearchDonors = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [location, setLocation] = useState('');

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  // Mock data - replace with API call
  const donors = [
    { id: 1, name: 'John Doe', bloodGroup: 'A+', location: 'Dhaka', lastDonation: '2 months ago', contact: '+8801234567890' },
    { id: 2, name: 'Jane Smith', bloodGroup: 'B-', location: 'Chittagong', lastDonation: '3 months ago', contact: '+8801234567891' },
    { id: 3, name: 'Mike Johnson', bloodGroup: 'O+', location: 'Dhaka', lastDonation: '1 month ago', contact: '+8801234567892' },
    { id: 4, name: 'Sarah Williams', bloodGroup: 'AB+', location: 'Sylhet', lastDonation: '4 months ago', contact: '+8801234567893' },
    { id: 5, name: 'David Brown', bloodGroup: 'A-', location: 'Khulna', lastDonation: '2 weeks ago', contact: '+8801234567894' },
  ];

  const filteredDonors = donors.filter(donor => {
    const matchesSearch = donor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         donor.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBlood = !bloodGroup || donor.bloodGroup === bloodGroup;
    const matchesLocation = !location || donor.location.toLowerCase().includes(location.toLowerCase());
    
    return matchesSearch && matchesBlood && matchesLocation;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Find Blood Donors
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Search for available blood donors in your area. Connect with lifesavers.
          </p>
        </div>

        {/* Search Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Blood Group Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Blood Group
              </label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="">All Blood Groups</option>
                {bloodGroups.map(group => (
                  <option key={group} value={group}>{group}</option>
                ))}
              </select>
            </div>

            {/* Location Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter city or district"
                  className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Search Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Donors
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name or location"
                  className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center mt-6">
            <div className="text-sm text-gray-600">
              {filteredDonors.length} donors found
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setBloodGroup('');
                  setLocation('');
                }}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                <Filter size={18} className="inline mr-2" />
                Clear Filters
              </button>
              <button className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                Search Now
              </button>
            </div>
          </div>
        </div>

        {/* Donors List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDonors.map(donor => (
            <div key={donor.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="p-6">
                {/* Donor Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center space-x-2">
                      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                        <Heart className="h-6 w-6 text-red-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">{donor.name}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm font-medium">
                            {donor.bloodGroup}
                          </span>
                          <span className="text-gray-600 flex items-center">
                            <MapPin size={14} className="mr-1" />
                            {donor.location}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Donor Details */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Last Donation:</span>
                    <span className="font-medium">{donor.lastDonation}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Contact:</span>
                    <span className="font-medium">{donor.contact}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Availability:</span>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                      Available
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 flex space-x-3">
                  <button className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center">
                    <Phone size={18} className="mr-2" />
                    Call Now
                  </button>
                  <button className="flex-1 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 flex items-center justify-center">
                    <Mail size={18} className="mr-2" />
                    Send SMS
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results Message */}
        {filteredDonors.length === 0 && (
          <div className="text-center py-12">
            <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-700 mb-2">No Donors Found</h3>
            <p className="text-gray-600">Try adjusting your search filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchDonors;