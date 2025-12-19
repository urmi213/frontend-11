import React, { useEffect } from 'react';
import { Link } from 'react-router';  // নিশ্চিত করুন react-router-dom ব্যবহার করছেন কিনা
import { motion } from 'framer-motion';
import { 
  Heart, 
  Users, 
  Shield, 
  Clock, 
  Phone, 
  Mail, 
  MapPin,
  ArrowRight,
  Droplet
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import AOS from 'aos';
import 'aos/dist/aos.css';



const Home = () => {
  const { user } = useAuth();

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  const features = [
    // ... আপনার existing features array
  ];

  const stats = [
    // ... আপনার existing stats array
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* ✅ Navbar যোগ করুন */}
    
      
      {/* Main Content */}
      <main className="flex-grow">
        {/* Hero Banner */}
        <section className="relative bg-gradient-to-r from-primary/10 to-secondary/10 py-20">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-5xl md:text-6xl font-bold mb-6">
                  Donate <span className="text-primary">Blood</span>, 
                  <br />Save <span className="text-secondary">Lives</span>
                </h1>
                <p className="text-lg text-gray-600 mb-8">
                  Join Bangladesh's largest blood donation community. 
                  Connect donors with patients in need. Every drop counts.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link 
                    to="/register" 
                    className="btn btn-primary btn-lg"
                  >
                    <Heart className="mr-2" />
                    Join as Donor
                  </Link>
                  <Link 
                    to="/search" 
                    className="btn btn-outline btn-secondary btn-lg"
                  >
                    <Users className="mr-2" />
                    Search Donors
                  </Link>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="relative"
              >
                <img 
                  src="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                  alt="Blood Donation"
                  className="rounded-2xl shadow-2xl"
                />
                <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <Droplet className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-primary">500+</p>
                      <p className="text-gray-600">Requests Today</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-base-100">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div 
                  key={index} 
                  className="text-center"
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <p className="text-4xl font-bold text-primary mb-2">{stat.number}</p>
                  <p className="text-gray-600">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-base-200">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Why Choose BloodLife?</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                We make blood donation simple, safe, and accessible for everyone across Bangladesh
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow"
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <div className="card-body items-center text-center">
                    <div className="text-primary mb-4">
                      {feature.icon}
                    </div>
                    <h3 className="card-title mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 bg-base-100">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">How It Works</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Simple steps to save lives. Join our community today.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { step: "01", title: "Register", desc: "Create your donor profile with blood group and location" },
                { step: "02", title: "Get Matched", desc: "Receive notifications for matching blood requests" },
                { step: "03", title: "Donate", desc: "Visit the hospital and save lives" }
              ].map((item, index) => (
                <div 
                  key={index}
                  className="relative"
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <div className="card bg-base-100 shadow-lg">
                    <div className="card-body">
                      <div className="absolute -top-4 -left-4 bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl">
                        {item.step}
                      </div>
                      <h3 className="card-title mt-4">{item.title}</h3>
                      <p className="text-gray-600">{item.desc}</p>
                    </div>
                  </div>
                  {index < 2 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 w-8 border-t-2 border-dashed border-gray-300"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Emergency Section */}
        <section className="py-20 bg-gradient-to-r from-primary to-secondary text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-6">Need Blood Urgently?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Post your requirement and get immediate help from nearby donors
            </p>
            {user ? (
              <Link to="/dashboard/create-request" className="btn btn-lg btn-accent">
                Post Blood Request <ArrowRight className="ml-2" />
              </Link>
            ) : (
              <Link to="/login" className="btn btn-lg btn-accent">
                Login to Post Request <ArrowRight className="ml-2" />
              </Link>
            )}
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-20 bg-base-100">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Contact Us</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Have questions? We're here to help 24/7
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="card bg-base-200">
                <div className="card-body items-center text-center">
                  <Phone className="h-12 w-12 text-primary mb-4" />
                  <h3 className="card-title">Emergency Helpline</h3>
                  <p className="text-2xl font-bold">16263</p>
                  <p className="text-gray-600">24/7 Available</p>
                </div>
              </div>
              
              <div className="card bg-base-200">
                <div className="card-body items-center text-center">
                  <Mail className="h-12 w-12 text-primary mb-4" />
                  <h3 className="card-title">Email Support</h3>
                  <p className="text-xl font-bold">support@bloodlife.org</p>
                  <p className="text-gray-600">Response within 2 hours</p>
                </div>
              </div>
              
              <div className="card bg-base-200">
                <div className="card-body items-center text-center">
                  <MapPin className="h-12 w-12 text-primary mb-4" />
                  <h3 className="card-title">Head Office</h3>
                  <p className="text-xl font-bold">Dhaka, Bangladesh</p>
                  <p className="text-gray-600">64 Districts Coverage</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

     
    </div>
  );
};

export default Home;