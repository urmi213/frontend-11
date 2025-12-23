import React from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import { 
  HeartIcon, 
  UserGroupIcon, 
  ClockIcon, 
  ShieldCheckIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  ArrowRightIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleJoinAsDonor = () => {
    navigate('/register');
  };

  const handleSearchDonors = () => {
    navigate('/search');
  };

  return (
    <div className="min-h-screen">
      {/* ==================== HERO BANNER ==================== */}
      <section className="relative bg-gradient-to-r from-red-700 to-red-800 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-white rounded-full translate-x-1/3 translate-y-1/3"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Save Lives With 
              <span className="block text-yellow-300">Every Drop</span>
            </h1>
            <p className="text-xl mb-10 max-w-2xl opacity-90">
              Join our community of lifesavers. Your single donation can save up to 3 lives. 
              Register as a donor or find donors in your area.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <button
                onClick={handleJoinAsDonor}
                className="px-8 py-4 bg-yellow-400 text-red-900 font-bold text-lg rounded-xl hover:bg-yellow-500 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
              >
                <HeartIcon className="w-5 h-5" />
                Join as a Donor
              </button>
              <button
                onClick={handleSearchDonors}
                className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold text-lg rounded-xl hover:bg-white/10 transition-all transform hover:scale-105 flex items-center justify-center gap-2"
              >
                <UserGroupIcon className="w-5 h-5" />
                Search Donors
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== FEATURED SECTION ==================== */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose BloodLink?
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              We make blood donation simple, safe, and impactful
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="bg-gradient-to-br from-red-50 to-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-red-100">
              <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mb-6">
                <HeartIcon className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Save Lives</h3>
              <p className="text-gray-600">
                Every donation can save up to 3 lives. Join our mission to make blood available for everyone in need.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-blue-100">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                <UserGroupIcon className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Large Community</h3>
              <p className="text-gray-600">
                Connect with thousands of verified donors across the country. Find the right match quickly.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gradient-to-br from-green-50 to-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-green-100">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6">
                <ClockIcon className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Quick Process</h3>
              <p className="text-gray-600">
                From registration to donation, our streamlined process makes it easy to donate blood.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-gradient-to-br from-purple-50 to-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-purple-100">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-6">
                <ShieldCheckIcon className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Safe & Secure</h3>
              <p className="text-gray-600">
                Your privacy and safety are our priority. All donors are verified and hospitals are trusted.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== STATISTICS SECTION ==================== */}
      <section className="py-16 bg-gradient-to-br from-red-600 to-red-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="p-6">
              <div className="text-4xl md:text-5xl font-bold mb-2">5000+</div>
              <div className="text-red-100">Active Donors</div>
            </div>
            <div className="p-6">
              <div className="text-4xl md:text-5xl font-bold mb-2">1000+</div>
              <div className="text-red-100">Lives Saved</div>
            </div>
            <div className="p-6">
              <div className="text-4xl md:text-5xl font-bold mb-2">50+</div>
              <div className="text-red-100">Cities Covered</div>
            </div>
            <div className="p-6">
              <div className="text-4xl md:text-5xl font-bold mb-2">24/7</div>
              <div className="text-red-100">Emergency Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== HOW IT WORKS ==================== */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-gray-600 text-lg">
              Three simple steps to become a lifesaver
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center bg-white p-8 rounded-2xl shadow-lg">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                <span className="text-3xl font-bold text-red-600">1</span>
                <div className="absolute -right-10 top-1/2 transform -translate-y-1/2 w-20 h-1 bg-red-200 hidden md:block"></div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Register</h3>
              <p className="text-gray-600">
                Create your donor profile with blood group and location information.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center bg-white p-8 rounded-2xl shadow-lg">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                <span className="text-3xl font-bold text-red-600">2</span>
                <div className="absolute -right-10 top-1/2 transform -translate-y-1/2 w-20 h-1 bg-red-200 hidden md:block"></div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Get Notified</h3>
              <p className="text-gray-600">
                Receive alerts when someone needs your blood type in your area.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center bg-white p-8 rounded-2xl shadow-lg">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-red-600">3</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Donate & Save</h3>
              <p className="text-gray-600">
                Visit the hospital and donate blood. Track your impact on our platform.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== CONTACT US SECTION ==================== */}
      <section className="py-16 bg-white" id="contact">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Contact Us
              </h2>
              <p className="text-gray-600 mb-8">
                Have questions? Need assistance? Our team is here to help you 24/7.
              </p>
              
              <div className="space-y-6">
                {/* Phone */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <PhoneIcon className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Emergency Hotline</h4>
                    <p className="text-gray-600 text-lg font-medium">+880 1711-234567</p>
                    <p className="text-sm text-gray-500">24/7 Available</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <EnvelopeIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Email Us</h4>
                    <p className="text-gray-600 text-lg font-medium">support@bloodlink.org</p>
                    <p className="text-sm text-gray-500">Response within 24 hours</p>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPinIcon className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Head Office</h4>
                    <p className="text-gray-600 font-medium">123/A, Dhanmondi, Dhaka-1205</p>
                    <p className="text-sm text-gray-500">Bangladesh</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h3>
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                    placeholder="Enter your name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                    placeholder="you@example.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                    placeholder="Tell us how we can help..."
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors shadow-sm"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== CTA SECTION ==================== */}
      <section className="py-16 bg-gradient-to-r from-red-700 to-red-800 text-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <div className="inline-block p-3 bg-white/10 rounded-2xl backdrop-blur-sm mb-6">
            <CheckCircleIcon className="w-12 h-12 text-yellow-300" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of lifesavers today. Your donation can save multiple lives.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="px-8 py-4 bg-white text-red-700 font-bold rounded-xl hover:bg-gray-100 transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  <ArrowRightIcon className="w-5 h-5" />
                  Go to Dashboard
                </Link>
                <Link
                  to="/search"
                  className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                >
                  <UserGroupIcon className="w-5 h-5" />
                  Find Donors
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/register"
                  className="px-8 py-4 bg-yellow-400 text-red-900 font-bold rounded-xl hover:bg-yellow-500 transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  <HeartIcon className="w-5 h-5" />
                  Become a Donor
                </Link>
                <Link
                  to="/search"
                  className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                >
                  <UserGroupIcon className="w-5 h-5" />
                  Search Donors
                </Link>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;