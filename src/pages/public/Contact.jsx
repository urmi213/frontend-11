// pages/public/Contact.jsx
import React, { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  AlertCircle,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  MessageSquare,
  Users,
  Heart
} from 'lucide-react';
import toast from 'react-hot-toast';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const contactInfo = [
    {
      icon: <Phone className="h-6 w-6 text-blue-600" />,
      title: 'Phone Number',
      details: ['+880 1234 567890', '+880 9876 543210'],
      description: 'Call us for emergency blood requests'
    },
    {
      icon: <Mail className="h-6 w-6 text-red-600" />,
      title: 'Email Address',
      details: ['support@bloodflow.com', 'emergency@bloodflow.com'],
      description: 'Email us for general inquiries'
    },
    {
      icon: <MapPin className="h-6 w-6 text-green-600" />,
      title: 'Office Address',
      details: ['123 Blood Donation Street', 'Dhaka 1207, Bangladesh'],
      description: 'Visit our headquarters'
    },
    {
      icon: <Clock className="h-6 w-6 text-purple-600" />,
      title: 'Working Hours',
      details: ['Monday - Friday: 9:00 AM - 6:00 PM', 'Saturday: 10:00 AM - 4:00 PM'],
      description: '24/7 emergency support available'
    }
  ];

  const socialLinks = [
    { icon: <Facebook className="h-5 w-5" />, name: 'Facebook', url: 'https://facebook.com/bloodflow', color: 'bg-blue-600 hover:bg-blue-700' },
    { icon: <Twitter className="h-5 w-5" />, name: 'Twitter', url: 'https://twitter.com/bloodflow', color: 'bg-sky-500 hover:bg-sky-600' },
    { icon: <Instagram className="h-5 w-5" />, name: 'Instagram', url: 'https://instagram.com/bloodflow', color: 'bg-pink-600 hover:bg-pink-700' },
    { icon: <Linkedin className="h-5 w-5" />, name: 'LinkedIn', url: 'https://linkedin.com/company/bloodflow', color: 'bg-blue-700 hover:bg-blue-800' }
  ];

  const faqs = [
    {
      question: 'How can I register as a blood donor?',
      answer: 'Click on "Register" button at the top, fill out the registration form with your details including blood group and location. Once verified, you can start receiving donation requests.'
    },
    {
      question: 'How quickly can I get blood in emergency?',
      answer: 'In emergency cases, we try to connect you with donors within 30 minutes. Please call our emergency hotline for immediate assistance.'
    },
    {
      question: 'Is my personal information safe?',
      answer: 'Yes, we take privacy seriously. Your contact information is only shared with verified users when you accept a donation request.'
    },
    {
      question: 'Can I donate if I have recently been vaccinated?',
      answer: 'You can donate blood 24 hours after receiving most vaccines. Please consult with our medical team for specific cases.'
    }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('Message sent successfully! We\'ll get back to you soon.');
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      
      // Reset submitted state after 5 seconds
      setTimeout(() => {
        setSubmitted(false);
      }, 5000);
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-red-600 to-red-800">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              We're Here to Help Save Lives
            </h1>
            <p className="text-xl text-red-100 max-w-3xl mx-auto">
              Have questions about blood donation? Need emergency assistance? Contact our team 24/7.
            </p>
            <div className="mt-8 flex justify-center space-x-4">
              <a
                href="tel:+8801234567890"
                className="inline-flex items-center px-6 py-3 bg-white text-red-600 font-semibold rounded-lg hover:bg-red-50 transition duration-300"
              >
                <Phone className="mr-2 h-5 w-5" />
                Emergency Call
              </a>
              <a
                href="#contact-form"
                className="inline-flex items-center px-6 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-red-600 transition duration-300"
              >
                <MessageSquare className="mr-2 h-5 w-5" />
                Send Message
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Contact Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {contactInfo.map((info, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border border-gray-100"
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    {info.icon}
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg mb-2">{info.title}</h3>
                  {info.details.map((detail, idx) => (
                    <p key={idx} className="text-gray-700 mb-1">{detail}</p>
                  ))}
                  <p className="text-sm text-gray-500 mt-2">{info.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Contact Form */}
          <div id="contact-form">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center mb-8">
                <div className="p-3 bg-red-100 rounded-lg mr-4">
                  <MessageSquare className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Send Us a Message</h2>
                  <p className="text-gray-600">We typically respond within 24 hours</p>
                </div>
              </div>

              {submitted ? (
                <div className="text-center py-12">
                  <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle className="h-10 w-10 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Message Sent Successfully!</h3>
                  <p className="text-gray-600 mb-6">
                    Thank you for contacting us. Our team will get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-medium"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
                        placeholder="+880 1234 567890"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Subject
                      </label>
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
                      >
                        <option value="">Select a subject</option>
                        <option value="donor_registration">Become a Donor</option>
                        <option value="blood_request">Blood Request</option>
                        <option value="emergency">Emergency</option>
                        <option value="partnership">Partnership/Volunteer</option>
                        <option value="feedback">Feedback & Suggestions</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows="6"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition resize-none"
                      placeholder="Tell us how we can help you..."
                      required
                    ></textarea>
                  </div>

                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="terms"
                        type="checkbox"
                        required
                        className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                      />
                    </div>
                    <div className="ml-3">
                      <label htmlFor="terms" className="text-sm text-gray-600">
                        I agree to the{' '}
                        <a href="/privacy" className="text-red-600 hover:underline">
                          Privacy Policy
                        </a>{' '}
                        and allow BloodFlow to contact me regarding my inquiry.
                      </label>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-6 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-lg hover:from-red-700 hover:to-red-800 transition duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending Message...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-5 w-5" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* FAQ & Social Section */}
          <div className="space-y-8">
            {/* FAQ Section */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center mb-8">
                <div className="p-3 bg-blue-100 rounded-lg mr-4">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Frequently Asked Questions</h2>
                  <p className="text-gray-600">Quick answers to common questions</p>
                </div>
              </div>

              <div className="space-y-6">
                {faqs.map((faq, index) => (
                  <div key={index} className="border-b border-gray-200 pb-6 last:border-0">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                      <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                      {faq.question}
                    </h3>
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg">
                <h4 className="font-semibold text-red-800 mb-2 flex items-center">
                  <Heart className="h-5 w-5 mr-2" />
                  Emergency Support
                </h4>
                <p className="text-red-700 text-sm">
                  For life-threatening emergencies requiring immediate blood transfusion, 
                  please call our 24/7 emergency hotline: 
                  <a href="tel:+8801234567890" className="font-bold ml-2 hover:underline">
                    +880 1234 567890
                  </a>
                </p>
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Connect With Us</h3>
              <p className="text-gray-600 mb-6">
                Follow us on social media for updates, success stories, and community events.
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${social.color} text-white rounded-lg p-4 flex flex-col items-center justify-center hover:scale-105 transition-transform duration-300`}
                  >
                    {social.icon}
                    <span className="mt-2 text-sm font-medium">{social.name}</span>
                  </a>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-4">Subscribe to Newsletter</h4>
                <div className="flex">
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                  <button className="px-6 py-3 bg-red-500 text-white font-medium rounded-r-lg hover:bg-red-600 transition">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-16">
          <div className="p-8 border-b border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900">Find Our Office</h3>
            <p className="text-gray-600">Visit us at our headquarters in Dhaka</p>
          </div>
          <div className="h-96 bg-gray-200 relative">
            {/* Google Map Placeholder */}
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
              <div className="text-center">
                <MapPin className="h-16 w-16 text-red-500 mx-auto mb-4" />
                <h4 className="text-xl font-bold text-gray-800">Dhaka, Bangladesh</h4>
                <p className="text-gray-600 mt-2">123 Blood Donation Street, Dhaka 1207</p>
                <a
                  href="https://maps.google.com/?q=Dhaka,Bangladesh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-4 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                  Open in Google Maps
                </a>
              </div>
            </div>
          </div>
          <div className="p-6 bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Parking</h4>
                <p className="text-gray-600 text-sm">Free parking available in front of the building</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Public Transport</h4>
                <p className="text-gray-600 text-sm">5 min walk from metro station, multiple bus routes</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Accessibility</h4>
                <p className="text-gray-600 text-sm">Wheelchair accessible with ramp and elevator</p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-red-600 to-red-800 rounded-2xl shadow-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Make a Difference?</h2>
          <p className="text-xl text-red-100 mb-8 max-w-2xl mx-auto">
            Join thousands of life-savers in our community. Your single donation can save up to 3 lives.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <a
              href="/register"
              className="px-8 py-4 bg-white text-red-600 font-bold rounded-lg hover:bg-red-50 transition duration-300 text-lg"
            >
              Become a Donor
            </a>
            <a
              href="/requests"
              className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-red-600 transition duration-300 text-lg"
            >
              Request Blood
            </a>
          </div>
          <p className="mt-8 text-red-100">
            Need help immediately? Call our emergency line: 
            <a href="tel:+8801234567890" className="font-bold ml-2 hover:underline">
              +880 1234 567890
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Contact;