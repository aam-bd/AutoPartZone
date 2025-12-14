import React from 'react';
import { Shield, Award, CheckCircle, Globe, Star } from 'lucide-react';

const CertificationsStandards = () => {
  const primaryColor = '#90281F';
  const darkColor = '#000000';

  const certifications = [
    {
      icon: <Shield className="w-6 h-6" />,
      name: 'ISO 9001',
      description: 'Quality Management System',
      year: '2022'
    },
    {
      icon: <Award className="w-6 h-6" />,
      name: 'Industry Excellence',
      description: 'Award Winner',
      year: '2023'
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      name: 'GDPR Compliant',
      description: 'Data Protection',
      year: '2022'
    },
    {
      icon: <Globe className="w-6 h-6" />,
      name: 'Global Standards',
      description: 'International Compliance',
      year: '2023'
    },
  ];

  return (
    <div className="py-12 px-4 bg-gray-50">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: darkColor }}>
            Certifications & Standards
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We adhere to the highest industry standards and hold key certifications 
            that demonstrate our commitment to excellence and quality.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {certifications.map((cert, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 text-center group hover:-translate-y-1"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-4 mx-auto"
                style={{ 
                  backgroundColor: `${primaryColor}10`,
                  color: primaryColor
                }}
              >
                {cert.icon}
              </div>
              <div className="font-bold text-lg mb-1" style={{ color: darkColor }}>
                {cert.name}
              </div>
              <div className="text-gray-600 text-sm mb-2">{cert.description}</div>
              <div className="text-xs font-medium px-3 py-1 rounded-full inline-block"
                style={{ 
                  backgroundColor: `${primaryColor}10`,
                  color: primaryColor
                }}
              >
                {cert.year}
              </div>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        {/* <div className="mt-12 pt-8 border-t border-gray-300">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Star className="w-5 h-5 mr-2" style={{ color: primaryColor }} />
                <span className="font-medium" style={{ color: darkColor }}>Industry Leader</span>
              </div>
              <div className="hidden md:block w-px h-6 bg-gray-300"></div>
              <div className="flex items-center">
                <Star className="w-5 h-5 mr-2" style={{ color: primaryColor }} />
                <span className="font-medium" style={{ color: darkColor }}>Quality Certified</span>
              </div>
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-gray-600 text-sm">
                All our processes and deliverables meet or exceed industry standards.
              </p>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default CertificationsStandards;