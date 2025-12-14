import React, { useState, useEffect } from 'react';
import { 
  Facebook, 
  Twitter, 
  Linkedin, 
  Instagram,
  Mail,
  Phone,
  MapPin,
  Send,
  ChevronUp,
  ArrowUp,
  Award
} from 'lucide-react';

const Footer = () => {
  // Brand colors
  const primaryColor = '#90281F';
  const darkColor = '#000000';
  
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Back to top visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const quickLinks = [
    { name: 'About Us', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'Our Team', href: '/team' },
    { name: 'Contact', href: '/contact' },
    { name: 'Careers', href: '/careers' },
    { name: 'Blog', href: '/blog' },
  ];

  const socialLinks = [
    { icon: <Facebook className="w-4 h-4" />, name: 'Facebook', href: '#' },
    { icon: <Twitter className="w-4 h-4" />, name: 'Twitter', href: '#' },
    { icon: <Linkedin className="w-4 h-4" />, name: 'LinkedIn', href: '#' },
    { icon: <Instagram className="w-4 h-4" />, name: 'Instagram', href: '#' },
  ];

  return (
    <>
      {/* Floating Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
          style={{ 
            backgroundColor: primaryColor,
            color: '#FFFFFF'
          }}
          aria-label="Back to top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}

      {/* Footer Component */}
      <footer className="bg-white border-t border-gray-200">
        {/* Main Footer */}
        <div className="py-10 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="grid md:grid-cols-3 gap-8">
              {/* Company Info */}
              <div>
                <div className="flex items-center mb-4">
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center mr-3"
                    style={{ backgroundColor: primaryColor }}
                  >
                    <Award className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold" style={{ color: darkColor }}>
                    AutoPartZone
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-6">
                  We deliver exceptional solutions that drive growth and innovation, building the future, one innovative solution at a time.
                </p>
                
                {/* Contact Info */}
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Phone className="w-4 h-4 mr-2" style={{ color: primaryColor }} />
                    <span className="text-gray-700">+880 (152) 179-9483</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Mail className="w-4 h-4 mr-2" style={{ color: primaryColor }} />
                    <span className="text-gray-700">info@autopartzone.com</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <MapPin className="w-4 h-4 mr-2" style={{ color: primaryColor }} />
                    <span className="text-gray-700">111 Bijoy Sarani, Dhaka-1215, Bangladesh.</span>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="font-semibold text-lg mb-4" style={{ color: darkColor }}>
                  Quick Links
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {quickLinks.map((link) => (
                    <a
                      key={link.name}
                      href={link.href}
                      className="text-gray-600 hover:text-gray-900 transition-colors duration-200 text-sm"
                      style={{ 
                        ':hover': { color: primaryColor }
                      }}
                    >
                      {link.name}
                    </a>
                  ))}
                </div>
              </div>

              {/* Newsletter */}
              <div>
                <h4 className="font-semibold text-lg mb-4" style={{ color: darkColor }}>
                  Newsletter
                </h4>
                <p className="text-gray-600 text-sm mb-4">
                  Subscribe for updates and insights.
                </p>
                <form className="space-y-3">
                  <input
                    type="email"
                    placeholder="Your email"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 text-sm"
                    style={{ 
                      focusRingColor: primaryColor,
                      '&:focus': { borderColor: primaryColor }
                    }}
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center w-full px-4 py-2 font-medium rounded-lg transition-colors duration-300 text-white hover:opacity-90 text-sm"
                    style={{ backgroundColor: primaryColor }}
                  >
                    Subscribe
                    <Send className="ml-2 w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>

            {/* Social Links & Copyright */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="flex flex-col md:flex-row justify-between items-center">
                {/* Social Links */}
                <div className="flex items-center space-x-4 mb-4 md:mb-0">
                  <span className="text-gray-600 text-sm">Follow us:</span>
                  <div className="flex space-x-3">
                    {socialLinks.map((social) => (
                      <a
                        key={social.name}
                        href={social.href}
                        className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                        style={{ 
                          backgroundColor: `${primaryColor}10`,
                          color: primaryColor
                        }}
                        aria-label={social.name}
                      >
                        {social.icon}
                      </a>
                    ))}
                  </div>
                </div>
                
                {/* Copyright */}
                <div>
                  <p className="text-gray-600 text-sm">
                    © {new Date().getFullYear()} AutoPartZone. All rights reserved.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;