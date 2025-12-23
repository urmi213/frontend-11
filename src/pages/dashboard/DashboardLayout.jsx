import { Outlet } from 'react-router';
import Sidebar from '../../components/layout/Sidebar';

const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar for Desktop */}
      <div className="hidden lg:block w-64 bg-white shadow-lg">
        <Sidebar />
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <div className="lg:hidden sticky top-0 z-40 bg-white shadow-sm">
          <div className="flex items-center h-16 px-4">
            <label 
              htmlFor="dashboard-drawer" 
              className="btn btn-ghost btn-square drawer-button lg:hidden"
              onClick={() => document.getElementById('dashboard-drawer')?.click()}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </label>
            <div className="ml-4">
              <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
            </div>
          </div>
        </div>
        
        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
      
      {/* Mobile Drawer */}
      <div className="drawer drawer-end lg:hidden">
        <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-side">
          <label htmlFor="dashboard-drawer" className="drawer-overlay"></label>
          <div className="w-64 bg-white h-full">
            <Sidebar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;