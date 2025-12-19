import React, { useState, useRef } from 'react';
import { FaCloudUploadAlt, FaTimes, FaImage } from 'react-icons/fa';

const FileUpload = ({ 
  label, 
  onFileSelect, 
  accept = 'image/*',
  maxSize = 5, // in MB
  required = false,
  error,
  preview = true,
  className = '',
  ...props 
}) => {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (selectedFile) => {
    if (!selectedFile) return;

    if (selectedFile.size > maxSize * 1024 * 1024) {
      alert(`File size must be less than ${maxSize}MB`);
      return;
    }

    if (!selectedFile.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    setFile(selectedFile);
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(selectedFile);

    onFileSelect(selectedFile);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    handleFileSelect(droppedFile);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleRemove = () => {
    setFile(null);
    setPreviewUrl('');
    onFileSelect(null);
  };

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <input
        type="file"
        ref={fileInputRef}
        accept={accept}
        onChange={(e) => handleFileSelect(e.target.files[0])}
        className="hidden"
        {...props}
      />

      {!file ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`
            border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors duration-300
            ${dragOver ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-red-400 hover:bg-red-50'}
            ${error ? 'border-red-500' : ''}
          `}
        >
          <FaCloudUploadAlt className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">
            <span className="font-semibold text-red-600">Click to upload</span> or drag and drop
          </p>
          <p className="text-sm text-gray-500">
            PNG, JPG, GIF up to {maxSize}MB
          </p>
        </div>
      ) : (
        <div className="border border-gray-300 rounded-lg p-4">
          {preview && previewUrl && (
            <div className="mb-4 text-center">
              <img
                src={previewUrl}
                alt="Preview"
                className="h-32 w-32 object-cover rounded-lg mx-auto border"
              />
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FaImage className="h-8 w-8 text-gray-400 mr-3" />
              <div>
                <p className="font-medium text-gray-900 truncate max-w-xs">{file.name}</p>
                <p className="text-sm text-gray-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            
            <button
              type="button"
              onClick={handleRemove}
              className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-50 transition-colors"
            >
              <FaTimes className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default FileUpload;