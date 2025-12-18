import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { HelpCircle } from "lucide-react";

import "../App.css";
import bg from "../assets/bd.png";
import car from "../assets/car_transparent.gif";
import { Link } from "react-router-dom";

const Login = () => {
  const { login } = useAuth(); // 2. Get the login function
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("signin");
  const [showAdminRegister, setShowAdminRegister] = useState(false);
  const [message, setMessage] = useState(null);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    adminKey: "",
    name: "",
  });

  // --- ANIMATION DATA ---
  const leaves = [
    { left: "20%", duration: "20s", delay: "0s" },
    { left: "50%", duration: "14s", delay: "0s" },
    { left: "70%", duration: "12s", delay: "0s" },
    { left: "5%", duration: "15s", delay: "0s" },
    { left: "85%", duration: "18s", delay: "0s" },
    { left: "90%", duration: "12s", delay: "0s" },
    { left: "60%", duration: "14s", delay: "0s" },
    { left: "20%", duration: "15s", delay: "0s" },
  ];

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAdminRegister = async (e) => {
    e.preventDefault();
    setMessage(null);

    try {
      if (!formData.adminKey || !formData.name || !formData.email || !formData.password) {
        setMessage({ type: "error", text: "Please fill in all fields" });
        return;
      }

      console.log("Attempting admin registration with:", { 
        name: formData.name, 
        email: formData.email, 
        password: formData.password,
        adminKey: formData.adminKey 
      });
      
      const requestBody = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        adminKey: formData.adminKey,
      };
      
      console.log("Request body:", JSON.stringify(requestBody));
      
      const response = await fetch("/api/auth/register-admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      console.log("Admin response status:", response.status);
      console.log("Admin response headers:", response.headers);
      
      const data = await response.json();
      console.log("Admin response data:", data);

      if (!response.ok) {
        console.error("Admin registration failed:", response.status, response.statusText);
        setMessage({ type: "error", text: data.message || "Admin registration failed" });
        return;
      }

      login(data.user, data.token);
      setMessage({ type: "success", text: "Admin registration successful! Redirecting to dashboard..." });
      
      setTimeout(() => {
        navigate("/admin");
      }, 1500);

    } catch (err) {
      console.error("Admin registration error:", err);
      setMessage({ type: "error", text: err.message || "Network error. Please try again." });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    try {
      if (activeTab === "admin") {
        // Admin registration is handled separately
        return;
      }

      if (activeTab === "signin") {
        // Real API login
        if (!formData.email || !formData.password) {
          setMessage({ type: "error", text: "Please fill in all fields" });
          return;
        }

        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          setMessage({ type: "error", text: data.message || "Login failed" });
          return;
        }

        // Use context login with real data
        login(data.user, data.token);

        const successMessage = data.user.role === "admin" 
          ? "Admin login successful! Welcome to Admin Dashboard."
          : "Login successful! Welcome to AutoPartZone.";
        setMessage({ type: "success", text: successMessage });
        
        if (data.user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      } else {
        // Sign up: ensure passwords match
        if (formData.password !== formData.confirmPassword) {
          setMessage({ type: "error", text: "Passwords do not match" });
          return;
        }

        if (!formData.username || !formData.email || !formData.password) {
          setMessage({ type: "error", text: "Please fill in all fields" });
          return;
        }

        console.log("Attempting registration with:", { name: formData.username, email: formData.email });
        
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.username,
            email: formData.email,
            password: formData.password,
          }),
        });

        console.log("Response status:", response.status);
        
        const data = await response.json();
        console.log("Response data:", data);

        if (!response.ok) {
          setMessage({ type: "error", text: data.message || "Registration failed" });
          return;
        }

        // Use context login with real data
        login(data.user, data.token);

        setMessage({ type: "success", text: "Registration successful" });
        navigate("/");
      }
    } catch (err) {
      console.error("Registration error:", err);
      setMessage({ type: "error", text: err.message || "Network error. Please try again." });
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    
    const email = prompt("Please enter your email address for password reset:");
    if (!email) return;

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to send password reset email");
        return;
      }

      alert("Password reset instructions have been sent to your email (check console for token in development)");
      if (data.resetToken) {
        console.log("Password reset token (development):", data.resetToken);
      }
    } catch (err) {
      console.error("Forgot password error:", err);
      alert("Network error. Please try again.");
    }
  };

  return (
    <div className="relative flex justify-center items-center w-full min-h-screen overflow-hidden">
      <style>{`        
        @keyframes animateGirl {
          0% { transform: translateX(calc(-100% - 100vw)); }
          50% { transform: translateX(calc(100% + 100vw)); }
          50.01% { transform: translateX(calc(100% + 100vw)) rotateY(180deg); }
          100% { transform: translateX(calc(-100% - 100vw)) rotateY(180deg); }
        }

        @keyframes animateLeaf {
          0% { opacity: 0; top: -10%; transform: translateX(20px) rotate(0deg); }
          10% { opacity: 1; }
          20% { transform: translateX(-20px) rotate(45deg); }
          40% { transform: translateX(-20px) rotate(90deg); }
          60% { transform: translateX(20px) rotate(180deg); }
          80% { transform: translateX(-20px) rotate(45deg); }
          100% { top: 110%; transform: translateX(20px) rotate(225deg); }
        }
      `}</style>

      {/* BACKGROUND LAYERS */}
      <img
        src={bg}
        alt="background"
        className="absolute top-0 left-0 w-full h-full object-cover pointer-events-none z-0"
      />

      <div className="fixed right-0 top-1/2 transform -translate-y-1/2 z-50 group">
        <Link
          to="/contact"
          className="flex items-center justify-center p-4 transition-all duration-300 group-hover:pr-6"
          style={{
            backgroundColor: "#90281F",
            borderRadius: "8px 0 0 8px",
          }}
          aria-label="Need Help? Contact Support"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-white opacity-20 rounded-full animate-ping"></div>
            <HelpCircle className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-300" />
          </div>

          {/* Tooltip */}
          <div className="absolute right-full top-1/2 transform -translate-y-1/2 mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div className="bg-gray-900 text-white px-3 py-2 rounded-lg shadow-lg whitespace-nowrap">
              <div className="text-sm font-medium">Need Help?</div>
              <div className="text-xs opacity-80">Contact Support</div>
            </div>
            <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2">
              <div className="w-2 h-2 bg-gray-900 rotate-45"></div>
            </div>
          </div>
        </Link>
      </div>

      <div className="absolute w-full h-screen overflow-hidden flex justify-center items-center z-[1] pointer-events-none">
        <div className="absolute w-full h-full top-0 left-0">
          {leaves.map((leaf, index) => (
            <div
              key={index}
              className="absolute block animate-[animateLeaf_linear_infinite]"
              style={{
                left: leaf.left,
                animationDuration: leaf.duration,
                animationDelay: leaf.delay,
              }}
            >
              <img
                src="https://i.ibb.co/S0VnkZq/leaf-01.png"
                alt="leaf"
                className="border-0"
              />
            </div>
          ))}
        </div>
      </div>

      <img
        src={car}
        alt="car"
        className="absolute top-[150px] scale-[0.65] animate-[animateGirl_12s_linear_infinite] pointer-events-none z-[5]"
      />

      <img
        src="https://i.ibb.co/QrMyLYc/trees.png"
        alt="trees"
        className="absolute top-0 left-0 w-full h-full object-cover z-[100] pointer-events-none"
      />

      {/* MAIN FORM CARD */}
      <div className="relative w-[500px] rounded-[20px] bg-white/25 backdrop-blur-[15px] shadow-[0_25px_50px_rgba(0,0,0,0.1)] border border-white border-b-white/50 border-r-white/50 z-[201] overflow-hidden transition-all duration-300">
        {/* TAB HEADERS */}
        <div className="flex w-full cursor-pointer">
          <div
            onClick={() => { setActiveTab("signin"); setShowAdminRegister(false); }}
            className={`flex-1 p-4 text-center text-xl font-semibold transition-colors ${
              activeTab === "signin"
                ? "bg-white/40 text-[#8f2c24]"
                : "bg-transparent text-white hover:bg-white/10"
            }`}
          >
            Sign In
          </div>
          <div
            onClick={() => { setActiveTab("signup"); setShowAdminRegister(false); }}
            className={`flex-1 p-4 text-center text-xl font-semibold transition-colors ${
              activeTab === "signup"
                ? "bg-white/40 text-[#8f2c24]"
                : "bg-transparent text-white hover:bg-white/10"
            }`}
          >
            Sign Up
          </div>
          <div
            onClick={() => { setActiveTab("admin"); setShowAdminRegister(true); }}
            className={`flex-1 p-4 text-center text-xl font-semibold transition-colors ${
              activeTab === "admin"
                ? "bg-white/40 text-[#8f2c24]"
                : "bg-transparent text-white hover:bg-white/10"
            }`}
          >
            Admin
          </div>
        </div>

        {/* FORM CONTENT */}
        <form
          onSubmit={handleSubmit}
          className="p-[40px_60px_60px_60px] flex flex-col gap-[25px]"
        >
          <h2 className="relative w-full text-center text-[2.5rem] font-semibold text-[#8f2c24] mb-[5px]">
            {activeTab === "admin" ? "Admin Registration" : 
             activeTab === "signin" ? "Welcome Back" : "Create Account"}
          </h2>

          {message && (
            <div
              className={`w-full p-3 rounded text-sm ${
                message.type === "error"
                  ? "bg-red-100/80 text-red-800"
                  : "bg-green-100/80 text-green-800"
              }`}
            >
              {message.text}
            </div>
          )}

          {activeTab === "admin" ? (
            <>
              <div className="relative w-full">
                <input
                  type="text"
                  name="adminKey"
                  placeholder="Admin Registration Key"
                  value={formData.adminKey || ""}
                  className="w-full p-[15px_20px] outline-none text-[1.25rem] text-[#8f2c24] rounded-[5px] bg-white border-none placeholder:text-[#db7770]"
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="relative w-full">
                <input
                  type="text"
                  name="name"
                  placeholder="Admin Name"
                  value={formData.name || ""}
                  className="w-full p-[15px_20px] outline-none text-[1.25rem] text-[#8f2c24] rounded-[5px] bg-white border-none placeholder:text-[#db7770]"
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="relative w-full">
                <input
                  type="email"
                  name="email"
                  placeholder="Admin Email"
                  value={formData.email || ""}
                  className="w-full p-[15px_20px] outline-none text-[1.25rem] text-[#8f2c24] rounded-[5px] bg-white border-none placeholder:text-[#db7770]"
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="relative w-full">
                <input
                  type="password"
                  name="password"
                  placeholder="Admin Password"
                  value={formData.password || ""}
                  className="w-full p-[15px_20px] outline-none text-[1.25rem] text-[#8f2c24] rounded-[5px] bg-white border-none placeholder:text-[#db7770]"
                  onChange={handleInputChange}
                  required
                  formNoValidate
                />
              </div>
            </>
          ) : activeTab === "signin" ? (
            <div className="relative w-full">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                className="w-full p-[15px_20px] outline-none text-[1.25rem] text-[#8f2c24] rounded-[5px] bg-white border-none placeholder:text-[#db7770]"
                onChange={handleInputChange}
                required
              />
            </div>
          ) : (
            <div className="relative w-full">
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                className="w-full p-[15px_20px] outline-none text-[1.25rem] text-[#8f2c24] rounded-[5px] bg-white border-none placeholder:text-[#db7770]"
                onChange={handleInputChange}
                required
              />
            </div>
          )}

          {activeTab === "signup" && (
            <div className="relative w-full">
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                className="w-full p-[15px_20px] outline-none text-[1.25rem] text-[#8f2c24] rounded-[5px] bg-white border-none placeholder:text-[#db7770]"
                onChange={handleInputChange}
                required
              />
            </div>
          )}

          <div className="relative w-full">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              className="w-full p-[15px_20px] outline-none text-[1.25rem] text-[#8f2c24] rounded-[5px] bg-white border-none placeholder:text-[#db7770]"
              onChange={handleInputChange}
              required
              formNoValidate
            />
          </div>

          {activeTab === "signup" && (
            <div className="relative w-full">
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                className="w-full p-[15px_20px] outline-none text-[1.25rem] text-[#8f2c24] rounded-[5px] bg-white border-none placeholder:text-[#db7770]"
                onChange={handleInputChange}
                required
                formNoValidate
              />
            </div>
          )}

          <div className="relative w-full mt-2">
            <button
              type={activeTab === "admin" ? "button" : "submit"}
              onClick={activeTab === "admin" ? handleAdminRegister : undefined}
              className="w-full p-[15px_20px] text-[1.25rem] text-white rounded-[5px] bg-[#8f2c24] border-none cursor-pointer hover:bg-[#d64c42] font-medium shadow-md transition-all active:scale-95"
            >
              {activeTab === "admin" ? "Register as Admin" : 
               activeTab === "signin" ? "Login" : "Register"}
            </button>
          </div>

          <div className="flex justify-between items-center">
            {activeTab !== "admin" && (
              <>
                {activeTab === "signin" && (
                  <button
                    onClick={handleForgotPassword}
                    className="text-[1.1rem] text-[#ffffff] font-medium no-underline hover:text-[#d64c42] bg-transparent border-none cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                )}
                {activeTab !== "signin" && (
                  <span
                    onClick={() => setActiveTab("signin")}
                    className="text-[1.1rem] text-[#8f2c24] font-bold cursor-pointer hover:text-[#d64c42] bg-white/60 px-2 py-1 rounded ml-2"
                  >
                    Sign In
                  </span>
                )}
                <span
                  onClick={() => activeTab === "signin" ? setActiveTab("signup") : setActiveTab("signin")}
                  className="text-[1.1rem] text-[#ffffff] font-medium cursor-pointer hover:text-[#d64c42]"
                >
                  {activeTab === "signin" ? "Sign up" : "Sign in"}
                </span>
              </>
            )}
          </div>
        </form>
        <div className="w-full flex justify-center pb-8">
          <Link
            to="/"
            className="px-6 py-2 mt-2 bg-transparent text-white font-bold text-xl rounded shadow shadow-[#d64c42] hover:bg-[#8f2c24] transition"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
