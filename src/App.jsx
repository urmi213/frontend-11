// App.jsx - Simplified Version (Remove missing components)
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
import AdminDashboard from './components/dashboard/AdminDashboard';
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
              </Route>
              
              {/* ✅ Admin Dashboard Only - Simple Version */}
              <Route path="/admin/dashboard" element={
                <ProtectedRoute adminOnly>
                  <AdminDashboard />
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