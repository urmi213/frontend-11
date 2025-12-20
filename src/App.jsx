// App.jsx - Complete with all routes
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './routes/PrivateRoute';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/public/Home';
import Register from './pages/public/Register';
import Login from './pages/public/Login';
import SearchDonors from './pages/public/Search';
import BloodRequests from './pages/public/Requests';
import About from './pages/public/About';
import DashboardLayout from './pages/dashboard/DashboardLayout';
import Profile from './pages/dashboard/Profile';
import MyRequests from './pages/dashboard/donor/MyRequests';
import CreateRequest from './pages/dashboard/donor/CreateRequest';
import Funding from './pages/dashboard/admin/Funding'; // ✅ Add this import
import AdminDashboard from './components/dashboard/AdminDashboard';
import AdminAllRequests from './pages/dashboard/admin/AllRequests';
import AdminReports from './pages/dashboard/admin/AdminReports'; // ✅ Add this import
import AdminUsers from './pages/dashboard/admin/AdminUsers'; // ✅ Add this import
import NotFound from './pages/errors/NotFound';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/search" element={<SearchDonors />} />
              <Route path="/requests" element={<BloodRequests />} />
              <Route path="/about" element={<About />} />
 
              
              {/* Dashboard Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }>
                <Route index element={<Profile />} />
                <Route path="profile" element={<Profile />} />
                <Route path="my-requests" element={<MyRequests />} />
                <Route path="create-request" element={<CreateRequest />} />
                <Route path="funding" element={<Funding />} /> {/* ✅ Add this */}
              </Route>
              
              {/* ✅ Admin Routes */}
              <Route path="/admin/dashboard" element={
                <ProtectedRoute adminOnly>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/admin/all-requests" element={
                <ProtectedRoute adminOnly>
                  <AdminAllRequests />
                </ProtectedRoute>
              } />
              
              <Route path="/admin/reports" element={
                <ProtectedRoute adminOnly>
                  <AdminReports />
                </ProtectedRoute>
              } />
              
              <Route path="/admin/users" element={
                <ProtectedRoute adminOnly>
                  <AdminUsers />
                </ProtectedRoute>
              } />
              
              {/* Default Route */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              
              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          
          <Footer />
          <Toaster position="top-right" />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;