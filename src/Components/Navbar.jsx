// --- src/Components/Navbar.jsx ---
import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png";
import noprofile from "../assets/noprofile.png";

// --- ICONS ---
const MenuIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-6 h-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
    />
  </svg>
);

const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-6 h-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

const LogoutIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
    />
  </svg>
);

const Navbar = () => {
  const { user, logout, loading } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const brandColor = "#90281F";

  // --- Scroll effect ---
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate("/");
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/shop" },
    { name: "About Us", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  if (loading)
    return <div className="h-20 bg-white border-b w-full fixed top-0 z-50" />;

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ease-in-out ${
        scrolled ? "bg-white/95 backdrop-blur-md shadow-md py-2" : "bg-white py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* --- LOGO --- */}
          <NavLink to="/" className="flex-shrink-0 flex items-center gap-2 group">
            <img
              className="h-12 w-auto transition-transform group-hover:scale-105"
              src={logo}
              alt="Logo"
            />
            <span className="text-2xl font-extrabold tracking-tight" style={{ color: brandColor }}>
              AutoPartZone
            </span>
          </NavLink>

          {/* --- DESKTOP NAVIGATION --- */}
          <div className="hidden md:flex space-x-8 items-center">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `relative px-1 py-2 text-lg font-bold transition-colors duration-200
                  after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px] 
                  after:transition-transform after:duration-300 after:scale-x-0 hover:after:scale-x-100
                  ${
                    isActive
                      ? "text-[#90281F] after:scale-x-100 after:bg-[#90281F]"
                      : "text-gray-700 hover:text-[#90281F] after:bg-[#90281F]"
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>

          {/* --- RIGHT SIDE: USER PROFILE / LOGIN --- */}
          <div className="hidden md:flex items-center space-x-4">
          {user ? (
              <div className="flex items-center gap-4">
                <NavLink
                  to="/profile"
                  className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <div className="p-[2px] rounded-full border-2" style={{ borderColor: brandColor }}>
                    <img
                      className="h-6 w-6 rounded-full object-cover"
                      src={user.photoURL || noprofile}
                      alt="Profile"
                      onError={(e) => (e.target.src = noprofile)}
                    />
                  </div>
                  <span>Profile</span>
                </NavLink>
                
                {user.role === 'admin' && (
                  <NavLink
                    to="/admin"
                    className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5M15 19.128a9.019 9.019 0 00-2.25 1.394m-4.5 0A9.02 9.02 0 016 19.128m9.75 0a9.02 9.02 0 002.25-1.394" />
                    </svg>
                    <span>Dashboard</span>
                  </NavLink>
                )}
                
                <div className="text-right hidden lg:block">
                  <p className="text-sm font-bold text-gray-900 leading-none">{user.name || "User"}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                <div className="relative group cursor-pointer">
                  <div className="p-[2px] rounded-full border-2" style={{ borderColor: brandColor }}>
                    <img
                      className="h-9 w-9 rounded-full object-cover"
                      src={user.photoURL || noprofile}
                      alt="Profile"
                      onError={(e) => (e.target.src = noprofile)}
                    />
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium text-white transition-all shadow-sm hover:bg-opacity-90 active:scale-95"
                  style={{ backgroundColor: brandColor }}
                >
                  <LogoutIcon />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <NavLink
                to="/login"
                className="px-6 py-2 rounded-full text-sm font-bold text-white transition-all shadow-md hover:brightness-110 active:scale-95"
                style={{ backgroundColor: brandColor }}
              >
                Login
              </NavLink>
            )}
          </div>

          {/* --- MOBILE TOGGLE --- */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-gray-700">
              {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </div>

      {/* --- MOBILE MENU --- */}
      <div
        className={`md:hidden absolute w-full bg-white shadow-xl border-t transition-all duration-300 ease-in-out overflow-hidden ${
          isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 pt-4 pb-6 space-y-2">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              onClick={() => setIsMenuOpen(false)}
              className={({ isActive }) =>
                `block px-4 py-3 rounded-lg text-base font-medium ${
                  isActive ? "bg-red-50 text-[#90281F]" : "text-gray-700 hover:bg-gray-50"
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}

          <div className="pt-4 border-t border-gray-100">
            {user ? (
              <div>
                <NavLink
                  to="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-50"
                >
                  <img
                    src={user.photoURL || noprofile}
                    className="h-10 w-10 rounded-full object-cover"
                    alt="Profile"
                  />
                  <div>
                    <p className="text-sm font-bold">{user.name || "User"}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </NavLink>
                
                {user.role === 'admin' && (
                  <NavLink
                    to="/admin"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5M15 19.128a9.019 9.019 0 00-2.25 1.394m-4.5 0A9.02 9.02 0 016 19.128m9.75 0a9.02 9.02 0 002.25-1.394" />
                    </svg>
                    <span>Admin Dashboard</span>
                  </NavLink>
                )}
                
                <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium text-red-600 hover:bg-red-50 w-full">
                  <LogoutIcon />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <NavLink
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className="block w-full text-center py-3 rounded-lg font-bold text-white"
                style={{ backgroundColor: brandColor }}
              >
                Login Account
              </NavLink>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
