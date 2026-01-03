import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const BentoHero = () => {
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleQuickSearch = (tag) => {
    navigate(`/shop?search=${encodeURIComponent(tag)}`);
  };

  const features = [
    {
      icon: "🚗",
      title: "Premium Parts",
      description: "Quality components for every vehicle",
      gradient: "from-rose-400 to-pink-600"
    },
    {
      icon: "🚚",
      title: "Fast Delivery",
      description: "Free shipping on orders over ৳140",
      gradient: "from-blue-400 to-indigo-600"
    },
    {
      icon: "🛡️",
      title: "Warranty",
      description: "2-year warranty on all products",
      gradient: "from-emerald-400 to-teal-600"
    },
    {
      icon: "💬",
      title: "Expert Support",
      description: "24/7 assistance for automotive needs",
      gradient: "from-amber-400 to-orange-600"
    }
  ];

  const stats = [
    { number: "50K+", label: "Parts Available" },
    { number: "100+", label: "Brands" },
    { number: "24/7", label: "Support" },
    { number: "99%", label: "Customer Satisfaction" }
  ];

  if (!mounted) return null;

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-white to-rose-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-rose-100/20 via-transparent to-transparent" />
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-rose-200/20 rounded-full blur-xl animate-pulse-soft" />
      <div className="absolute top-40 right-20 w-32 h-32 bg-blue-200/20 rounded-full blur-2xl animate-pulse-soft" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-emerald-200/20 rounded-full blur-xl animate-pulse-soft" style={{ animationDelay: '2s' }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column - Main Content */}
          <div className="lg:col-span-6 space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-rose-50 rounded-full border border-rose-200">
              <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span>
              <span className="text-sm font-semibold text-rose-700">Premium Auto Parts Marketplace</span>
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-7xl font-bold text-slate-900 leading-tight tracking-tight">
                Quality Parts for
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-pink-600">
                  Every Drive
                </span>
              </h1>
              <p className="text-xl text-slate-600 leading-relaxed max-w-lg">
                Discover premium automotive parts with expert recommendations, fast delivery, and unmatched quality assurance.
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-2xl" ref={searchRef}>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for parts, brands, or categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full px-6 py-4 pr-14 text-slate-900 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl shadow-inner-soft focus:outline-none focus:ring-4 focus:ring-rose-500/20 focus:border-rose-400 transition-all duration-300 text-lg placeholder-slate-400"
                />
                <button 
                  onClick={handleSearch}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-gradient-to-r from-rose-500 to-pink-600 rounded-xl flex items-center justify-center text-white shadow-soft hover:shadow-soft-lg transition-all duration-300 hover:scale-105"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
              {/* Quick Search Tags */}
              <div className="flex flex-wrap gap-2 mt-3">
                {['Brake Pads', 'Engine Oil', 'Filters', 'Battery'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleQuickSearch(tag)}
                    className="px-3 py-1.5 text-sm font-medium text-slate-600 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors duration-200"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Bento Grid */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-3xl bg-white p-6 shadow-soft hover:shadow-soft-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                
                <div className="relative z-10 space-y-3">
                  <div className="text-3xl">{feature.icon}</div>
                  <h3 className="text-lg font-semibold text-slate-900">{feature.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight">
                {stat.number}
              </div>
              <div className="text-sm lg:text-base text-slate-600 mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Parallax Image */}
        <div className="absolute bottom-0 right-0 w-96 h-96 opacity-30 pointer-events-none transform translate-x-32 translate-y-32">
          <img
            src="/src/assets/car_transparent.gif"
            alt="Premium Car"
            className="w-full h-full object-contain animate-pulse-soft"
          />
        </div>
      </div>
    </div>
  );
};

export default BentoHero;