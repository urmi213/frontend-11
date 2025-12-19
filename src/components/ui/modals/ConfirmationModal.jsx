import React from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { FaExclamationTriangle, FaInfoCircle, FaCheckCircle, FaQuestionCircle } from 'react-icons/fa';

const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = 'Confirm Action',
  message = 'Are you sure you want to perform this action?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'warning',
  loading = false,
  icon = null
}) => {
  const variantConfig = {
    warning: {
      icon: FaExclamationTriangle,
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-600',
      buttonVariant: 'danger'
    },
    danger: {
      icon: FaExclamationTriangle,
      bgColor: 'bg-red-100',
      textColor: 'text-red-600',
      buttonVariant: 'danger'
    },
    info: {
      icon: FaInfoCircle,
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600',
      buttonVariant: 'primary'
    },
    success: {
      icon: FaCheckCircle,
      bgColor: 'bg-green-100',
      textColor: 'text-green-600',
      buttonVariant: 'success'
    },
    question: {
      icon: FaQuestionCircle,
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-600',
      buttonVariant: 'primary'
    }
  };

  const config = variantConfig[variant] || variantConfig.warning;
  const IconComponent = icon || config.icon;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="text-center p-6">
        <div className={`mx-auto flex items-center justify-center h-16 w-16 rounded-full ${config.bgColor} ${config.textColor} mb-4`}>
          <IconComponent className="h-8 w-8" />
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        
        <div className="flex justify-center space-x-4">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="min-w-[100px]"
          >
            {cancelText}
          </Button>
          
          <Button
            variant={config.buttonVariant}
            onClick={onConfirm}
            loading={loading}
            className="min-w-[100px]"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;