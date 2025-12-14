import React, { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Menu,
  X,
  ChevronRight,
  Navigation,
} from "lucide-react";
import Footer from "../Components/Footer";
import Navbar from "../Components/Navbar";
import CertificationsStandards from "../Components/CertificationsStandards";

// Google Maps Component using iframe (no API key required)
const GoogleMapSection = () => {
  const primaryColor = "#90281F";
  const darkColor = "#000000";

  // Dhaka, Bangladesh coordinates
  const mapUrl =
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.5197830350126!2d90.3881159747924!3d23.764498188235994!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c75f12593707%3A0x7893c5f89cc38b83!2s111%20Bijoy%20Sarani%20-%20Tejgaon%20Link%20Rd%2C%20Dhaka%201215!5e0!3m2!1sen!2sbd!4v1765747252740!5m2!1sen!2sbd";

  return (
    <div className="mt-12 bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="grid md:grid-cols-3">
        <div className="md:col-span-2 h-64 md:h-80">
          <iframe
            title="AutoPartZone Dhaka Office Location"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            src={mapUrl}
            className="rounded-l-xl"
          />
        </div>

        <div className="p-6 md:p-8">
          <h3 className="font-bold text-xl mb-4" style={{ color: darkColor }}>
            Visit Our Office
          </h3>
          <div className="space-y-3">
            <div className="flex items-start">
              <MapPin
                className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0"
                style={{ color: primaryColor }}
              />
              <div>
                <p className="font-medium text-gray-800">Main Headquarters</p>
                <p className="text-gray-600 text-sm mt-1">
                  111 Bijoy Sarani
                  <br />
                  Dhaka 1215
                  <br />
                  Bangladesh
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <div className="flex items-center mb-2">
                <Clock
                  className="w-4 h-4 mr-2 flex-shrink-0"
                  style={{ color: primaryColor }}
                />
                <span className="text-sm font-medium text-gray-800">
                  Business Hours:
                </span>
              </div>
              <p className="text-gray-600 text-sm">
                Sun-Thu: 9:00 AM - 6:00 PM
                <br />
                Sat: 10:00 AM - 4:00 PM
                <br />
                Fri: Closed
              </p>
            </div>

            <div className="pt-4">
              <a
                href="https://maps.app.goo.gl/zULNeUwafA2gcUdp9"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm font-medium transition-colors duration-200 hover:underline"
                style={{ color: primaryColor }}
              >
                <Navigation className="w-4 h-4 mr-2" />
                Get Directions
              </a>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <p className="text-gray-600 text-sm">
                Parking available. Easily accessible from Farmgate and Shahbagh
                areas.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ContactPage = () => {
  const primaryColor = "#90281F";
  const darkColor = "#000000";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' or 'error'

  const contactInfo = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email Us",
      details: ["info@autopartzone.com", "support@autopartzone.com"],
      color: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Call Us",
      details: ["+880 (152) 179-9483", "+880 (153) 952-0719"],
      color: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Visit Us",
      details: ["111 Bijoy Sarani", "Dhaka, Bangladesh"],
      color: "bg-red-50",
      iconColor: "text-red-600",
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Working Hours",
      details: ["Sun-Thu: 9:00 AM - 6:00 PM", "Sat: 10:00 AM - 4:00 PM"],
      color: "bg-purple-50",
      iconColor: "text-purple-600",
    },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate network delay

      // Here you would typically make an API call
      console.log("Form submitted:", formData);

      setSubmitStatus("success");
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);

      // Clear status message after 5 seconds
      setTimeout(() => {
        setSubmitStatus(null);
      }, 5000);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="pt-24 min-h-screen bg-white">
        {/* Hero Section */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1
                className="text-3xl md:text-4xl font-bold mb-4"
                style={{ color: darkColor }}
              >
                Get in Touch
              </h1>
              <p className="text-gray-600 text-lg">
                Have questions about auto parts? We'd love to hear from you.
                Send us a message and we'll respond as soon as possible.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Content */}
        <section className="py-8 md:py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Contact Form */}
              <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
                <div className="mb-8">
                  <h2
                    className="text-2xl font-bold mb-2"
                    style={{ color: darkColor }}
                  >
                    Send us a Message
                  </h2>
                  <p className="text-gray-600">
                    Fill out the form below and our team will get back to you
                    within 24 hours.
                  </p>
                </div>

                {/* Status Messages */}
                {submitStatus === "success" && (
                  <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-200 flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-green-800">
                        Message sent successfully!
                      </p>
                      <p className="text-green-700 text-sm mt-1">
                        We'll get back to you soon.
                      </p>
                    </div>
                  </div>
                )}

                {submitStatus === "error" && (
                  <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 flex items-start">
                    <AlertCircle className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-red-800">
                        Something went wrong!
                      </p>
                      <p className="text-red-700 text-sm mt-1">
                        Please try again or contact us directly.
                      </p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
                        style={{
                          "--tw-ring-color": `${primaryColor}20`,
                          "--tw-border-opacity": 1,
                        }}
                        placeholder="Kim Jong Un"
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
                        required
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
                        style={{
                          "--tw-ring-color": `${primaryColor}20`,
                        }}
                        placeholder="kimjong@missile.com"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
                        style={{
                          "--tw-ring-color": `${primaryColor}20`,
                        }}
                        placeholder="+880 (153) 952-0719"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Subject *
                      </label>
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 bg-white"
                        style={{
                          "--tw-ring-color": `${primaryColor}20`,
                        }}
                      >
                        <option value="">Select a subject</option>
                        <option value="Parts Inquiry">Parts Inquiry</option>
                        <option value="Pricing">Pricing</option>
                        <option value="Technical Support">
                          Technical Support
                        </option>
                        <option value="Bulk Order">Bulk Order</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 resize-none"
                      style={{
                        "--tw-ring-color": `${primaryColor}20`,
                      }}
                      placeholder="Tell us about your auto parts needs..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-3 font-medium rounded-lg transition-colors duration-300 text-white flex items-center justify-center ${
                      isSubmitting
                        ? "opacity-70 cursor-not-allowed"
                        : "hover:opacity-90"
                    }`}
                    style={{ backgroundColor: primaryColor }}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <Send className="ml-2 w-5 h-5" />
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Contact Information & FAQ */}
              <div className="space-y-8">
                {/* Contact Cards */}
                <div className="grid sm:grid-cols-2 gap-6">
                  {contactInfo.map((info, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-300"
                    >
                      <div
                        className={`inline-flex items-center justify-center w-12 h-12 rounded-lg mb-4 ${info.color}`}
                      >
                        <div className={info.iconColor}>{info.icon}</div>
                      </div>
                      <h3
                        className="font-bold text-lg mb-3"
                        style={{ color: darkColor }}
                      >
                        {info.title}
                      </h3>
                      <div className="space-y-1">
                        {info.details.map((detail, idx) => (
                          <p key={idx} className="text-gray-600 text-sm">
                            {detail}
                          </p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* FAQ / Quick Help */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3
                    className="font-bold text-lg mb-4"
                    style={{ color: darkColor }}
                  >
                    Frequently Asked Questions
                  </h3>
                  <div className="space-y-2">
                    {[
                      {
                        q: "What is your typical response time?",
                        a: "We respond within 24 hours on business days.",
                      },
                      {
                        q: "Do you offer emergency support?",
                        a: "Yes, we offer 24/7 emergency support for premium clients.",
                      },
                      {
                        q: "Do you ship internationally?",
                        a: "Yes, we ship auto parts worldwide with DHL, FedEx, and UPS partnerships.",
                      },
                      {
                        q: "Can I schedule a meeting?",
                        a: "Absolutely! Use our calendar link or contact us to schedule.",
                      },
                    ].map((faq, idx) => (
                      <div
                        key={idx}
                        className="collapse collapse-arrow bg-base-500 border border-base-300"
                      >
                        <input
                          type="radio"
                          name="faq-accordion"
                          defaultChecked={idx === 0}
                        />
                        <div className="collapse-title bg-white font-semibold text-gray-800">
                          {faq.q}
                        </div>
                        <div className="collapse-content bg-white text-sm text-gray-600">
                          {faq.a}
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    className="mt-6 inline-flex items-center text-sm font-medium transition-colors duration-200"
                    style={{ color: primaryColor }}
                  >
                    View all FAQs
                    <ChevronRight className="ml-1 w-4 h-4" />
                  </button>
                </div>

                {/* Social Media */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3
                    className="font-bold text-lg mb-4"
                    style={{ color: darkColor }}
                  >
                    Connect With Us
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Follow us on social media for updates and automotive
                    insights.
                  </p>
                  <div className="flex space-x-4">
                    {[
                      {
                        icon: <Facebook className="w-5 h-5" />,
                        label: "Facebook",
                        href: "https://facebook.com/autopartzone",
                      },
                      {
                        icon: <Twitter className="w-5 h-5" />,
                        label: "Twitter",
                        href: "https://twitter.com/autopartzone",
                      },
                      {
                        icon: <Linkedin className="w-5 h-5" />,
                        label: "LinkedIn",
                        href: "https://linkedin.com/company/autopartzone",
                      },
                      {
                        icon: <Instagram className="w-5 h-5" />,
                        label: "Instagram",
                        href: "https://instagram.com/autopartzone",
                      },
                    ].map((social, idx) => (
                      <a
                        key={idx}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                        style={{
                          backgroundColor: `${primaryColor}10`,
                          color: primaryColor,
                        }}
                        aria-label={social.label}
                      >
                        {social.icon}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Google Maps Section */}
            <GoogleMapSection />
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default ContactPage;
