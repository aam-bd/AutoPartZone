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
  const brandColor = "#dc2626";

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
        scrolled 
          ? "glass-card shadow-lg py-3 border-b border-red-200/30" 
          : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* --- LOGO --- */}
          <NavLink to="/" className="flex-shrink-0 flex items-center gap-3 group">
            <div className="relative overflow-hidden rounded-2xl shadow-soft group-hover:shadow-soft-lg transition-all duration-300">
              <img
                className="h-14 w-auto transition-transform group-hover:scale-105"
                src={logo}
                alt="Logo"
              />
            </div>
            <span className="text-3xl font-extrabold tracking-tight text-red-800 group-hover:text-red-600 transition-colors duration-300">
              AutoPartZone
            </span>
          </NavLink>

          {/* --- DESKTOP NAVIGATION --- */}
          <div className="hidden lg:flex items-center space-x-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `relative px-4 py-2 text-sm font-semibold transition-all duration-300 rounded-full
                  hover:bg-red-50 hover:text-red-600
                  ${
                    isActive
                      ? "text-red-600 bg-red-100 shadow-inner"
                      : "text-red-700"
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>

          {/* --- RIGHT SIDE: USER PROFILE / LOGIN --- */}
          <div className="hidden md:flex items-center space-x-3">
          {user ? (
              <div className="flex items-center gap-3">
                <NavLink
                  to="/profile"
                   className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-red-700 hover:bg-red-50 hover:text-red-800 transition-all duration-300"
                >
                  <div className="p-0.5 rounded-full border-2 border-brand/30">
                    <img
                      className="h-7 w-7 rounded-full object-cover"
                      src={user.photoURL || noprofile}
                      alt="Profile"
                      onError={(e) => (e.target.src = noprofile)}
                    />
                  </div>
                  <span className="hidden xl:block">Profile</span>
                </NavLink>
                 
                {user.role === 'admin' && (
                  <NavLink
                    to="/admin"
                  className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-red-700 hover:bg-red-50 hover:text-red-800 transition-all duration-300"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5M15 19.128a9.019 9.019 0 00-2.25 1.394m-4.5 0A9.02 9.02 0 016 19.128m9.75 0a9.02 9.02 0 002.25-1.394" />
                    </svg>
                    <span className="hidden xl:block">Dashboard</span>
                  </NavLink>
                )}
                 
                <div className="text-right hidden lg:block">
                   <p className="text-sm font-semibold text-red-800 leading-tight tracking-tight">{user.name || "User"}</p>
                   <p className="text-xs text-red-600 truncate max-w-32">{user.email}</p>
                </div>
                <div className="relative group cursor-pointer">
                  <div className="p-0.5 rounded-full border-2 border-brand shadow-soft group-hover:shadow-soft-lg transition-all duration-300">
                    <img
                      className="h-10 w-10 rounded-full object-cover"
                      src={user.photoURL || noprofile}
                      alt="Profile"
                      onError={(e) => (e.target.src = noprofile)}
                    />
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="btn-premium text-sm px-4 py-2 flex items-center gap-2 hover:scale-105 active:scale-95"
                >
                  <LogoutIcon />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <NavLink
                to="/login"
                className="btn-premium text-sm px-6 py-2.5 hover:scale-105 active:scale-95"
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
          className={`md:hidden absolute w-full glass-card shadow-2xl border-t border-red-200/30 transition-all duration-300 ease-in-out overflow-hidden ${
            isMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
          }`}
        >
        <div className="px-6 pt-6 pb-8 space-y-3">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              onClick={() => setIsMenuOpen(false)}
               className={({ isActive }) =>
                 `block px-5 py-3 rounded-2xl text-base font-medium transition-all duration-300 ${
                   isActive 
                     ? "text-red-600 bg-red-100 shadow-inner" 
                     : "text-red-700 hover:bg-red-50 hover:text-red-800"
                 }`
               }
            >
              {link.name}
            </NavLink>
          ))}

          <div className="pt-6 border-t border-slate-200">
            {user ? (
              <div className="space-y-3">
                <NavLink
                  to="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-4 px-5 py-3 rounded-2xl text-base font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-all duration-300"
                >
                  <div className="p-0.5 rounded-full border-2 border-brand/30">
                    <img
                      src={user.photoURL || noprofile}
                      className="h-10 w-10 rounded-full object-cover"
                      alt="Profile"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{user.name || "User"}</p>
                    <p className="text-xs text-slate-500 truncate max-w-48">{user.email}</p>
                  </div>
                </NavLink>
                
                {user.role === 'admin' && (
                  <NavLink
                    to="/admin"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-4 px-5 py-3 rounded-2xl text-base font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-all duration-300"
                  >
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-slate-600">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5M15 19.128a9.019 9.019 0 00-2.25 1.394m-4.5 0A9.02 9.02 0 016 19.128m9.75 0a9.02 9.02 0 002.25-1.394" />
                      </svg>
                    </div>
                    <span>Admin Dashboard</span>
                  </NavLink>
                )}
                
                <button 
                  onClick={() => { handleLogout(); setIsMenuOpen(false); }} 
                  className="flex items-center gap-4 w-full px-5 py-3 rounded-2xl text-base font-medium text-red-600 hover:bg-red-50 transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                    <LogoutIcon />
                  </div>
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <NavLink
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className="block w-full text-center py-4 rounded-2xl font-semibold text-white btn-premium"
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
