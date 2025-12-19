import React from 'react';
import { FaTint } from 'react-icons/fa';

const Loader = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-white">
      <div className="text-center">
        <div className="relative inline-block">
          <FaTint className="h-16 w-16 text-red-600 animate-pulse" />
          <div className="absolute inset-0">
            <FaTint className="h-16 w-16 text-red-400 animate-ping" />
          </div>
        </div>
        <p className="mt-4 text-gray-600 font-medium">Loading...</p>
      </div>
    </div>
  );
};

export default Loader;