import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './routes/PrivateRoute';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Public Pages
import Home from './pages/public/Home';
import Register from './pages/public/Register';
import Login from './pages/public/Login';
import SearchDonors from './pages/public/Search';
import BloodRequests from './pages/public/Requests';
import About from './pages/public/About';

// Dashboard Layout and Pages
import DashboardLayout from './pages/dashboard/DashboardLayout';
import DashboardHome from './pages/dashboard/DashboardHome'; // ✅ Role-based dashboard
import Profile from './pages/dashboard/Profile';

// Donor Pages
import MyRequests from './pages/dashboard/donor/MyRequests';
import CreateRequest from './pages/dashboard/donor/CreateRequest';

// Admin Pages
import AllUsers from './pages/dashboard/admin/AllUsers';
import AllDonationRequests from './pages/dashboard/admin/AllRequests';
import EditRequestAdmin from './pages/dashboard/admin/EditRequestAdmin';

// Volunteer Pages
// import VolunteerRequests from './pages/dashboard/volunteer/VolunteerRequests';

// Common Pages
import Funding from './pages/dashboard/admin/Funding';

// Error Pages
import NotFound from './pages/errors/NotFound';
import Unauthorized from './pages/errors/Unauthorized';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          
          <main className="flex-grow">
            <Routes>
              {/* ==================== PUBLIC ROUTES ==================== */}
              <Route path="/" element={<Home />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/search" element={<SearchDonors />} />
              <Route path="/requests" element={<BloodRequests />} />
              <Route path="/about" element={<About />} />
              
              {/* ==================== DASHBOARD ROUTES (সবাই একই Layout) ==================== */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                {/* ✅ Dashboard Home (Role-based দেখাবে) */}
                <Route index element={<DashboardHome />} />
                
                {/* ✅ Profile (সবার জন্য) */}
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
                
                {/* ========== COMMON ROUTES (সবার জন্য) ========== */}
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
              <Route path="/unauthorized" element={<Unauthorized />} />
              <Route path="/404" element={<NotFound />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          
          <Footer />
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;