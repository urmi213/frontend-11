// components/donation/DonateModal.jsx
import React from 'react';
import {
  X,
  AlertTriangle,
  CheckCircle,
  User,
  Mail,
  Phone,
  Shield,
  Clock
} from 'lucide-react';

const DonateModal = ({ isOpen, onClose, onConfirm, loading, request }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose}></div>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg leading-6 font-bold text-gray-900">
                  Confirm Blood Donation
                </h3>
                <div className="mt-4">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                    <p className="text-red-800 font-medium text-center">
                      🩸 You are about to commit to donate blood for {request?.recipientName}
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-700">
                      <User className="h-4 w-4 mr-2 text-blue-500" />
                      <span>Recipient: <strong>{request?.recipientName}</strong></span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <Clock className="h-4 w-4 mr-2 text-purple-500" />
                      <span>Date: <strong>{new Date(request?.donationDate).toLocaleDateString()}</strong> at <strong>{request?.donationTime}</strong></span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <Shield className="h-4 w-4 mr-2 text-green-500" />
                      <span>Blood Group Required: <strong className="text-red-600">{request?.bloodGroup}</strong></span>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h4 className="font-semibold text-yellow-800 mb-2 flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Important Information
                    </h4>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      <li>• Make sure you meet the eligibility criteria for blood donation</li>
                      <li>• Bring your ID card to the donation center</li>
                      <li>• Have a good meal 2-3 hours before donation</li>
                      <li>• Drink plenty of fluids before and after donation</li>
                      <li>• Inform the recipient when you're on your way</li>
                    </ul>
                  </div>

                  <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      What happens next?
                    </h4>
                    <ol className="text-sm text-blue-700 space-y-1">
                      <li>1. Your contact information will be shared with the requester</li>
                      <li>2. Request status will change to "In Progress"</li>
                      <li>3. You can coordinate directly with the requester</li>
                      <li>4. After donation, mark the request as "Completed"</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={onConfirm}
              disabled={loading}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Confirming...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Yes, I Want to Donate
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              <X className="mr-2 h-4 w-4" />
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonateModal;