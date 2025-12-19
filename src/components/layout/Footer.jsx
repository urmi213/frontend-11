import { FaHeartbeat, FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaMapMarkerAlt, FaPhone, FaEnvelope, FaShieldAlt, FaAmbulance } from 'react-icons/fa'
import { Link } from 'react-router'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          
          {/* Brand Section */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="relative">
                <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center animate-pulse">
                  <FaHeartbeat className="text-white text-2xl" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-400 rounded-full"></div>
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
                  BloodLink
                </h2>
                <p className="text-sm text-gray-400">Saving Lives Together</p>
              </div>
            </div>
            <p className="text-gray-300 mb-6">
              We connect blood donors with recipients in need. Join our mission to save lives across Bangladesh.
            </p>
            <div className="flex gap-4">
              {[
                { icon: <FaFacebook />, color: 'bg-blue-600', href: '#' },
                { icon: <FaTwitter />, color: 'bg-blue-400', href: '#' },
                { icon: <FaInstagram />, color: 'bg-pink-600', href: '#' },
                { icon: <FaLinkedin />, color: 'bg-blue-700', href: '#' }
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className={`${social.color} w-10 h-10 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform duration-300`}
                  aria-label={`Follow us on ${social.icon.type.displayName}`}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <FaShieldAlt className="text-red-500" />
              Quick Links
            </h3>
            <ul className="space-y-3">
              {[
                { to: '/', label: 'Home' },
                { to: '/search', label: 'Find Donors' },
                { to: '/requests', label: 'Blood Requests' },
                { to: '/register', label: 'Become Donor' },
                { to: '/about', label: 'About Us' },
                { to: '/contact', label: 'Contact' }
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-gray-300 hover:text-red-400 hover:pl-2 transition-all duration-300 flex items-center gap-2"
                  >
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Dashboard Links */}
          <div>
            <h3 className="text-xl font-bold mb-6">Dashboard</h3>
            <ul className="space-y-3">
              {[
                { to: '/dashboard', label: 'My Dashboard' },
                { to: '/dashboard/profile', label: 'Profile Settings' },
                { to: '/dashboard/donations', label: 'My Donations' },
                { to: '/dashboard/requests', label: 'My Requests' },
                { to: '/dashboard/notifications', label: 'Notifications' },
                { to: '/dashboard/settings', label: 'Account Settings' }
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-gray-300 hover:text-red-400 transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <FaAmbulance className="text-red-500" />
              Contact Info
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-red-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                  <FaMapMarkerAlt className="text-red-400" />
                </div>
                <div>
                  <p className="font-medium">Office Address</p>
                  <p className="text-gray-300 text-sm">123 Health Complex, Dhaka 1212, Bangladesh</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                  <FaPhone className="text-red-400" />
                </div>
                <div>
                  <p className="font-medium">Emergency Helpline</p>
                  <a href="tel:16263" className="text-2xl font-bold text-red-400 hover:text-red-300">
                    16263
                  </a>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                  <FaEnvelope className="text-red-400" />
                </div>
                <div>
                  <p className="font-medium">Email Support</p>
                  <a href="mailto:support@bloodlink.com" className="text-red-400 hover:text-red-300">
                    support@bloodlink.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 my-8"></div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <p className="text-gray-400">
              &copy; {currentYear} BloodLink Bangladesh. All rights reserved.
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Made with ❤️ for saving lives
            </p>
          </div>
          
          <div className="flex gap-6 text-sm">
            <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-gray-400 hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link to="/faq" className="text-gray-400 hover:text-white transition-colors">
              FAQ
            </Link>
          </div>
        </div>

        {/* Blood Groups Status */}
        <div className="mt-8 p-4 bg-gray-800/50 rounded-lg">
          <p className="text-center text-gray-400 mb-2">
            <span className="text-red-400 font-bold">Urgent Need:</span> 
            {' '}O+, B+, A-, AB-
          </p>
          <div className="flex justify-center gap-2">
            {['O+', 'B+', 'A-', 'AB-', 'O-', 'A+', 'B-', 'AB+'].map((group) => (
              <span
                key={group}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  ['O+', 'B+', 'A-', 'AB-'].includes(group)
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-700 text-gray-300'
                }`}
              >
                {group}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer