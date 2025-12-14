import React, { useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import CountUp from 'react-countup';
import Navbar from '../Components/Navbar';
import CertificationsStandards from '../Components/CertificationsStandards';
import Footer from '../Components/Footer';
import aam from '../assets/AAM.jpg';
import aowfi from '../assets/Aowfi.jpg';
import arnab from '../assets/arnab.jpg';
import akib from '../assets/akib.jpg'
import { 
  Users, 
  Target, 
  Eye, 
  Heart, 
  Globe, 
  Award,
  ArrowRight,
  ChevronRight,
  Calendar,
  Trophy,
  MapPin,
  UserCheck
} from 'lucide-react';

const AboutPage = () => {
  // Brand colors
  const primaryColor = '#90281F';
  const darkColor = '#000000';
  const lightColor = '#FFFFFF';
  
  const teamMembers = [
    { id: 1, name: 'Md. Abdullah Al Mamun', role: 'CEO & Founder', img: aam },
    { id: 2, name: 'Aowfi Adon Foraejy', role: 'CTO', img: aowfi },
    { id: 3, name: 'Arnab Anthony Gomes', role: 'Head of Design', img: arnab },
    { id: 4, name: 'Akib Istiak', role: 'Lead Developer', img: akib },
  ];

  const milestones = [
    { year: '2018', title: 'Company Founded', description: 'Started with just 3 passionate team members' },
    { year: '2019', title: 'First Major Client', description: 'Landed our first enterprise client' },
    { year: '2020', title: 'Product Launch', description: 'Released our flagship product' },
    { year: '2022', title: 'Global Expansion', description: 'Opened international offices' },
    { year: '2023', title: 'Award Recognition', description: 'Received industry excellence award' },
  ];

  const values = [
    { icon: <Heart className="w-6 h-6" />, title: 'Integrity', description: 'We do what is right, not what is easy.' },
    { icon: <Users className="w-6 h-6" />, title: 'Collaboration', description: 'Great achievements come from teamwork.' },
    { icon: <Target className="w-6 h-6" />, title: 'Excellence', description: 'We strive for excellence in all we do.' },
    { icon: <Globe className="w-6 h-6" />, title: 'Impact', description: 'Creating meaningful change in our industry.' },
  ];

  // Stats configuration with CountUp
  const stats = [
    { icon: <Users className="w-8 h-8" />, end: 50, suffix: '+', label: 'Team Members' },
    { icon: <UserCheck className="w-8 h-8" />, end: 200, suffix: '+', label: 'Happy Clients' },
    { icon: <MapPin className="w-8 h-8" />, end: 15, suffix: '+', label: 'Countries' },
    { icon: <Trophy className="w-8 h-8" />, end: 5, suffix: '', label: 'Awards Won' },
  ];

  return (
    <div>
        <Navbar></Navbar>
    <div className="min-h-screen bg-white">
      <div className='pt-24'>
        <section 
        className="relative text-white py-20 md:py-28"
        style={{ backgroundColor: primaryColor }}
      >
        <div className="absolute inset-0 opacity-10 bg-black"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl my-auto mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              About AutoPartZone
            </h1>
            <p className="text-xl md:text-2xl opacity-90">
              Driven by Passion, Built for the Road
            </p>
          </div>
        </div>
      </section>
      </div>
      

      {/* Mission & Vision */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Mission */}
            <div 
              className="bg-white rounded-2xl shadow-lg p-8 transform hover:-translate-y-1 transition-all duration-300 border border-gray-200"
            >
              <div className="flex items-center mb-6">
                <div 
                  className="p-3 rounded-lg mr-4"
                  style={{ backgroundColor: `${primaryColor}15` }}
                >
                  <Target className="w-8 h-8" style={{ color: primaryColor }} />
                </div>
                <h2 className="text-2xl font-bold" style={{ color: darkColor }}>Our Mission</h2>
              </div>
              <p className="text-gray-700 text-lg leading-relaxed">
                Our mission is to empower every driver, enthusiast, and DIY mechanic with access to high-quality auto parts that are reliable, affordable, and easy to find. We are committed to eliminating delays, reducing frustration, and simplifying the repair and upgrade process—so every journey, from routine maintenance to full restorations, is smooth, efficient, and rewarding.
              </p>
            </div>

            {/* Vision */}
            <div 
              className="bg-white rounded-2xl shadow-lg p-8 transform hover:-translate-y-1 transition-all duration-300 border border-gray-200"
            >
              <div className="flex items-center mb-6">
                <div 
                  className="p-3 rounded-lg mr-4"
                  style={{ backgroundColor: `${primaryColor}15` }}
                >
                  <Eye className="w-8 h-8" style={{ color: primaryColor }} />
                </div>
                <h2 className="text-2xl font-bold" style={{ color: darkColor }}>Our Vision</h2>
              </div>
              <p className="text-gray-700 text-lg leading-relaxed">
                Our vision is to become a trusted global destination for auto parts, where passion for vehicles meets innovation and reliability. We strive to build a future where every driver can confidently maintain and enhance their vehicle, supported by seamless service, dependable products, and a community that shares the same love for the road.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: darkColor }}>Our Story</h2>
              <p className="text-gray-600 text-lg">From humble beginnings to industry leader</p>
            </div>

            {/* Timeline */}
            <div className="relative">
              {/* Vertical Line */}
              <div 
                className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 h-full w-0.5"
                style={{ backgroundColor: `${primaryColor}30` }}
              ></div>

              {milestones.map((milestone, index) => (
                <div
                  key={milestone.year}
                  className={`relative mb-12 ${index % 2 === 0 ? 'md:pr-12 md:pl-0 md:text-right' : 'md:pl-12'}`}
                >
                  <div className="flex items-center md:block">
                    {/* Dot */}
                    <div 
                      className="absolute left-2 md:left-1/2 transform md:-translate-x-1/2 w-4 h-4 rounded-full z-10 border-2 border-white shadow"
                      style={{ backgroundColor: primaryColor }}
                    ></div>
                    
                    {/* Content */}
                    <div className={`ml-10 md:ml-0 ${index % 2 === 0 ? 'md:mr-8' : 'md:ml-8'}`}>
                      <div 
                        className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200"
                      >
                        <div 
                          className="inline-block px-4 py-1 rounded-full text-sm font-semibold mb-3 text-white"
                          style={{ backgroundColor: primaryColor }}
                        >
                          {milestone.year}
                        </div>
                        <h3 className="text-xl font-bold mb-2" style={{ color: darkColor }}>{milestone.title}</h3>
                        <p className="text-gray-600">{milestone.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: darkColor }}>Our Values</h2>
            <p className="text-gray-600 text-lg">The principles that define who we are</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-200"
              >
                <div 
                  className="inline-flex items-center justify-center w-12 h-12 rounded-lg mb-4"
                  style={{ backgroundColor: `${primaryColor}15` }}
                >
                  <div style={{ color: primaryColor }}>
                    {value.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3" style={{ color: darkColor }}>{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: darkColor }}>Meet Our Team</h2>
            <p className="text-gray-600 text-lg">The brilliant minds behind our success</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-200"
              >
                <div className="relative overflow-hidden h-64">
                  <img
                    src={member.img}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ backgroundColor: `${primaryColor}20` }}
                  ></div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-1" style={{ color: darkColor }}>{member.name}</h3>
                  <p style={{ color: primaryColor }} className="font-medium">{member.role}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button 
              className="inline-flex items-center px-6 py-3 font-semibold rounded-lg transition-colors duration-300 text-white hover:opacity-90"
              style={{ backgroundColor: primaryColor }}
            >
              View All Team Members
              <ArrowRight className="ml-2 w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section 
        className="py-16 md:py-24 text-white"
        style={{ backgroundColor: darkColor }}
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => {
              const { ref, inView } = useInView({
                triggerOnce: true,
                threshold: 0.3,
              });

              return (
                <div key={index} ref={ref} className="group">
                  <div className="flex justify-center mb-4">
                    <div 
                      className="p-4 rounded-full transition-transform duration-300 group-hover:scale-110"
                      style={{ backgroundColor: `${primaryColor}30` }}
                    >
                      <div style={{ color: primaryColor }}>
                        {stat.icon}
                      </div>
                    </div>
                  </div>
                  <div className="text-4xl md:text-5xl font-bold mb-2">
                    {inView ? (
                      <CountUp
                        start={0}
                        end={stat.end}
                        duration={2.5}
                        suffix={stat.suffix}
                      />
                    ) : (
                      '0' + stat.suffix
                    )}
                  </div>
                  <div className="opacity-90">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div 
              className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6"
              style={{ backgroundColor: `${primaryColor}15` }}
            >
              <Award className="w-8 h-8" style={{ color: primaryColor }} />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: darkColor }}>
              Ready to Collaborate?
            </h2>
            <p className="text-gray-700 text-lg mb-8">
              Join our growing list of satisfied clients who have transformed their businesses with our solutions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                className="px-8 py-4 font-semibold rounded-lg transition-colors duration-300 text-white hover:opacity-90 flex items-center justify-center"
                style={{ backgroundColor: primaryColor }}
              >
                Get in Touch
                <ChevronRight className="ml-2 w-5 h-5" />
              </button>
              <button 
                className="px-8 py-4 bg-white font-semibold rounded-lg border-2 transition-colors duration-300 hover:bg-gray-50"
                style={{ borderColor: primaryColor, color: primaryColor }}
              >
                View Our Work
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
    <CertificationsStandards></CertificationsStandards>
    <Footer></Footer>
    </div>
  );
};

export default AboutPage;