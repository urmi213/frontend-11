// pages/public/About.jsx
import React from 'react';
import { Heart, Users, Shield, Globe, Award, Clock } from 'lucide-react';

const About = () => {
  const features = [
    { icon: <Heart className="h-8 w-8" />, title: "Save Lives", description: "Every donation can save up to 3 lives" },
    { icon: <Users className="h-8 w-8" />, title: "Community", description: "50,000+ registered donors across Bangladesh" },
    { icon: <Shield className="h-8 w-8" />, title: "Verified Donors", description: "All donors are medically verified" },
    { icon: <Globe className="h-8 w-8" />, title: "Nationwide", description: "Covering all 64 districts of Bangladesh" },
    { icon: <Award className="h-8 w-8" />, title: "Award Winning", description: "Best Health Tech Award 2023" },
    { icon: <Clock className="h-8 w-8" />, title: "24/7 Support", description: "Emergency helpline available round the clock" },
  ];

  const stats = [
    { number: "50K+", label: "Registered Donors" },
    { number: "10K+", label: "Lives Saved" },
    { number: "64", label: "Districts Covered" },
    { number: "24/7", label: "Emergency Support" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">About BloodLink</h1>
            <p className="text-xl mb-8">
              Connecting blood donors with patients in need across Bangladesh since 2020
            </p>
          </div>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Mission</h2>
            <p className="text-gray-600 mb-4">
              To create a reliable, efficient, and accessible blood donation network that 
              ensures no patient in Bangladesh dies due to lack of blood.
            </p>
            <p className="text-gray-600">
              We bridge the gap between voluntary blood donors and patients in emergency 
              situations through technology and community engagement.
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Vision</h2>
            <p className="text-gray-600 mb-4">
              To build the largest blood donation community in South Asia where 
              every blood request is fulfilled within 2 hours.
            </p>
            <p className="text-gray-600">
              We envision a Bangladesh where blood shortage becomes history and 
              every citizen has access to safe blood when needed.
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-4xl font-bold text-red-600 mb-2">{stat.number}</p>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-center mb-12">Why Choose BloodLink?</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-lg">
              <div className="text-red-600 mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Team Section (Optional) */}
      <div className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Our Story</h2>
          <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-lg">
            <p className="text-gray-600 mb-4">
              BloodLink was founded in 2020 when our founder witnessed a family struggling 
              to find a blood donor during a medical emergency. This experience highlighted 
              the critical need for a centralized platform connecting donors with patients.
            </p>
            <p className="text-gray-600 mb-4">
              Starting as a small WhatsApp group with 50 donors, we have grown into 
              Bangladesh's largest blood donation platform with over 50,000 registered donors.
            </p>
            <p className="text-gray-600">
              Today, we partner with major hospitals, medical colleges, and NGOs across 
              the country to ensure timely access to safe blood.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;