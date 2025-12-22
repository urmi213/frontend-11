// components/layout/AdminLayout.jsx
import React, { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Home,
  Users,
  Droplets,
  DollarSign,
  Settings,
  LogOut,
  Menu,
  X,
  User,
  Bell,
  BarChart3,
  Shield,
  Calendar,
  Activity,
  FileText,
  HelpCircle
} from 'lucide-react';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { name: 'Dashboard', icon: <Home size={20} />, path: '/admin/dashboard' },
    { name: 'Manage Users', icon: <Users size={20} />, path: '/admin/users' },
    { name: 'Donation Requests', icon: <Droplets size={20} />, path: '/admin/requests' },
    { name: 'Funding Management', icon: <DollarSign size={20} />, path: '/admin/funding' },
    { name: 'Reports & Analytics', icon: <BarChart3 size={20} />, path: '/admin/reports' },
    { name: 'System Settings', icon: <Settings size={20} />, path: '/admin/settings' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-md bg-blue-600 text-white shadow-lg"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar for Desktop */}
      <div className={`hidden lg:flex fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-xl flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        {/* Logo */}
        <div className="flex items-center justify-center h-20 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
              <Droplets className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">BloodFlow</h1>
              <p className="text-xs text-gray-500">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Admin Profile */}
        <div className="p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <img
                src={user?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'Admin')}&background=6366f1&color=fff`}
                alt={user?.name}
                className="w-12 h-12 rounded-full border-2 border-purple-200"
              />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">{user?.name}</h3>
              <div className="flex items-center mt-1">
                <Shield size={12} className="text-purple-500 mr-1" />
                <span className="text-xs text-gray-600">Administrator</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
              onClick={() => setSidebarOpen(false)}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center space-x-2 w-full px-4 py-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Top Bar */}
        <header className="bg-white shadow-sm">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">Admin Dashboard</h2>
                <p className="text-sm text-gray-600">Welcome back, {user?.name}</p>
              </div>
              
              <div className="flex items-center space-x-4">
                <button className="relative p-2 text-gray-600 hover:text-gray-900">
                  <Bell size={20} />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                
                <div className="hidden md:flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold">
                    {user?.name?.charAt(0) || 'A'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;