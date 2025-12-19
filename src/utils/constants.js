export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const DONATION_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'inprogress',
  DONE: 'done',
  CANCELED: 'canceled'
};

export const USER_ROLES = {
  DONOR: 'donor',
  VOLUNTEER: 'volunteer',
  ADMIN: 'admin'
};

export const USER_STATUS = {
  ACTIVE: 'active',
  BLOCKED: 'blocked'
};

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    VERIFY: '/auth/verify',
    PROFILE: '/auth/profile'
  },
  USERS: {
    BASE: '/users',
    BLOCK: '/users/:id/block',
    UNBLOCK: '/users/:id/unblock',
    ROLE: '/users/:id/role'
  },
  DONATION_REQUESTS: {
    BASE: '/donation-requests',
    MY: '/donation-requests/my',
    STATUS: '/donation-requests/:id/status',
    DONATE: '/donation-requests/:id/donate'
  },
  SEARCH: {
    DONORS: '/search/donors',
    REQUESTS: '/search/requests'
  },
  FUNDING: {
    BASE: '/funding',
    PAYMENT: '/funding/create-payment',
    STATS: '/funding/stats'
  },
  STATS: {
    DASHBOARD: '/stats/dashboard',
    ADMIN_DASHBOARD: '/stats/admin-dashboard',
    VOLUNTEER_DASHBOARD: '/stats/volunteer-dashboard'
  }
};

export const VALIDATION_RULES = {
  NAME: {
    MIN: 2,
    MAX: 50
  },
  EMAIL: {
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  PASSWORD: {
    MIN: 6,
    MAX: 100
  },
  BLOOD_GROUP: BLOOD_GROUPS,
  DISTRICTS: 64, // Total districts in Bangladesh
  UPAZILAS: 495 // Total upazilas in Bangladesh
};

export const DATE_FORMATS = {
  DISPLAY: 'DD MMM YYYY',
  DATABASE: 'YYYY-MM-DD',
  TIME: 'HH:mm'
};

export const CURRENCY_FORMAT = {
  LOCALE: 'en-BD',
  CURRENCY: 'BDT'
};

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100
};

export const IMAGEBB_CONFIG = {
  API_URL: 'https://api.imgbb.com/1/upload',
  MAX_SIZE: 2 * 1024 * 1024, // 2MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
};

export const STRIPE_CONFIG = {
  PUBLISHABLE_KEY: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY,
  SUCCESS_URL: `${window.location.origin}/dashboard/funding?success=true`,
  CANCEL_URL: `${window.location.origin}/dashboard/funding?canceled=true`
};

export const LOCAL_STORAGE_KEYS = {
  AUTH_TOKEN: 'token',
  USER_DATA: 'user',
  THEME: 'theme',
  LANGUAGE: 'language'
};

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'Access forbidden. Please contact administrator.',
  NOT_FOUND: 'Requested resource not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  DEFAULT: 'Something went wrong. Please try again.'
};

export const SUCCESS_MESSAGES = {
  LOGIN: 'Login successful!',
  REGISTER: 'Registration successful!',
  PROFILE_UPDATE: 'Profile updated successfully!',
  REQUEST_CREATE: 'Donation request created successfully!',
  REQUEST_UPDATE: 'Request updated successfully!',
  REQUEST_DELETE: 'Request deleted successfully!',
  STATUS_UPDATE: 'Status updated successfully!',
  FUNDING_SUCCESS: 'Thank you for your donation!'
};