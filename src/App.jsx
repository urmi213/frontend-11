import { BrowserRouter, Routes, Route, Navigate } from 'react-router'; // ✅ Fix import
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './routes/PrivateRoute';

// Layouts
import PublicLayout from './components/layout/PublicLayout'; // ✅ Add this
import DashboardLayout from './pages/dashboard/DashboardLayout';

// Public Pages
import Home from './pages/public/Home';
import Register from './pages/public/Register';
import Login from './pages/public/Login';
import SearchDonors from './pages/public/Search';
import BloodRequests from './pages/public/Requests';
import About from './pages/public/About';

// Dashboard Pages
import DashboardHome from './pages/dashboard/DashboardHome';
import Profile from './pages/dashboard/Profile';
import MyRequests from './pages/dashboard/donor/MyRequests';
import CreateRequest from './pages/dashboard/donor/CreateRequest';
import AllUsers from './pages/dashboard/admin/AllUsers';
import AllDonationRequests from './pages/dashboard/admin/AllRequests';
import EditRequestAdmin from './pages/dashboard/admin/EditRequestAdmin';
import VolunteerRequests from './pages/dashboard/volunteer/VolunteerRequests';
import Funding from './pages/dashboard/admin/Funding';

// Error Pages
import NotFound from './pages/errors/NotFound';
import Unauthorized from './pages/errors/Unauthorized';

function App() {
  return (
    <BrowserRouter> {/* ✅ Router প্রথমে */}
      <AuthProvider> {/* ✅ AuthProvider Router এর ভিতরে */}
        {/* ✅ Remove global Navbar/Footer - Layouts এ আছে */}
        <Routes>
          {/* ==================== PUBLIC ROUTES (With Navbar & Footer) ==================== */}
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<Home />} />
            <Route path="register" element={<Register />} />
            <Route path="login" element={<Login />} />
            <Route path="search" element={<SearchDonors />} />
            <Route path="requests" element={<BloodRequests />} />
            <Route path="about" element={<About />} />
            <Route path="unauthorized" element={<Unauthorized />} />
          </Route>

          {/* ==================== DASHBOARD ROUTES (NO Navbar/Footer) ==================== */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardHome />} />
            <Route path="profile" element={<Profile />} />
            
            {/* ========== DONOR ROUTES ========== */}
            <Route 
              path="my-donation-requests" 
              element={
                <ProtectedRoute allowedRoles={['donor', 'admin']}>
                  <MyRequests />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="create-donation-request" 
              element={
                <ProtectedRoute allowedRoles={['donor', 'admin']}>
                  <CreateRequest />
                </ProtectedRoute>
              } 
            />
            
            {/* ========== ADMIN ROUTES ========== */}
            <Route 
              path="all-users" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AllUsers />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="all-blood-donation-request" 
              element={
                <ProtectedRoute allowedRoles={['admin', 'volunteer']}>
                  <AllDonationRequests />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="edit-request/:id" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <EditRequestAdmin />
                </ProtectedRoute>
              } 
            />
            
            {/* ========== VOLUNTEER ROUTES ========== */}
            <Route 
              path="volunteer-requests" 
              element={
                <ProtectedRoute allowedRoles={['volunteer', 'admin']}>
                  <VolunteerRequests />
                </ProtectedRoute>
              } 
            />
            
            {/* ========== COMMON ROUTES ========== */}
            <Route 
              path="funding" 
              element={
                <ProtectedRoute>
                  <Funding />
                </ProtectedRoute>
              } 
            />
          </Route>
          
          {/* ==================== ERROR ROUTES ==================== */}
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              style: {
                background: '#10B981',
              },
            },
            error: {
              style: {
                background: '#EF4444',
              },
            },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;