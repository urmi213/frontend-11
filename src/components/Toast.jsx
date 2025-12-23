import React, { useEffect } from 'react';
import { CheckCircleIcon, XCircleIcon, InformationCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';

const Toast = ({ message, type = 'success', duration = 3000, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const bgColor = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    warning: 'bg-yellow-50 border-yellow-200',
    info: 'bg-blue-50 border-blue-200'
  };

  const textColor = {
    success: 'text-green-800',
    error: 'text-red-800',
    warning: 'text-yellow-800',
    info: 'text-blue-800'
  };

  const icon = {
    success: <CheckCircleIcon className="w-5 h-5 text-green-600" />,
    error: <XCircleIcon className="w-5 h-5 text-red-600" />,
    warning: <InformationCircleIcon className="w-5 h-5 text-yellow-600" />,
    info: <InformationCircleIcon className="w-5 h-5 text-blue-600" />
  };

  return (
    <div className="fixed top-4 right-4 z-50 animate-fadeIn">
      <div className={`${bgColor[type]} border rounded-lg shadow-lg p-4 max-w-sm`}>
        <div className="flex items-start gap-3">
          {icon[type]}
          <div className="flex-1">
            <p className={`font-medium ${textColor[type]}`}>{message}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Toast;