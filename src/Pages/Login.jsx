import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // 1. Import the hook
import '../App.css';
import bg from '../assets/bd.png';
import car from '../assets/car_transparent.gif';

const Login = () => {
  const { login } = useAuth(); // 2. Get the login function
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('signin');
  const [message, setMessage] = useState(null);
  
  const [formData, setFormData] = useState({ 
    username: '', 
    email: '', 
    password: '', 
    confirmPassword: '' 
  });

  // --- ANIMATION DATA ---
  const leaves = [
    { left: '20%', duration: '20s', delay: '0s' },
    { left: '50%', duration: '14s', delay: '0s' },
    { left: '70%', duration: '12s', delay: '0s' },
    { left: '5%',  duration: '15s', delay: '0s' },
    { left: '85%', duration: '18s', delay: '0s' },
    { left: '90%', duration: '12s', delay: '0s' },
    { left: '60%', duration: '14s', delay: '0s' },
    { left: '20%', duration: '15s', delay: '0s' },
  ];

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => { // 3. Make this async
    e.preventDefault();
    setMessage(null);

    try {
      if (activeTab === 'signin') {
        const payload = { email: formData.email, password: formData.password };
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Login failed');

        // 4. USE THE CONTEXT LOGIN
        login(data.user, data.token); 
        
        setMessage({ type: 'success', text: 'Login successful' });
        navigate('/');

      } else {
        // Sign up: ensure passwords match
        if (formData.password !== formData.confirmPassword) {
          setMessage({ type: 'error', text: 'Passwords do not match' });
          return;
        }

        const payload = { 
            name: formData.username, 
            email: formData.email, 
            password: formData.password, 
            role: 'customer' 
        };

        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Registration failed');

        // 5. USE THE CONTEXT LOGIN HERE TOO
        login(data.user, data.token);

        setMessage({ type: 'success', text: 'User registered' });
        navigate('/');
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
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
      <img src={bg} alt="background" className="absolute top-0 left-0 w-full h-full object-cover pointer-events-none z-0" />
      
      <div className="absolute w-full h-screen overflow-hidden flex justify-center items-center z-[1] pointer-events-none">
        <div className="absolute w-full h-full top-0 left-0">
          {leaves.map((leaf, index) => (
            <div 
              key={index} 
              className="absolute block animate-[animateLeaf_linear_infinite]"
              style={{ left: leaf.left, animationDuration: leaf.duration, animationDelay: leaf.delay }}
            >
              <img src="https://i.ibb.co/S0VnkZq/leaf-01.png" alt="leaf" className="border-0" />
            </div>
          ))}
        </div>
      </div>

      <img src={car} alt="car" className="absolute top-[150px] scale-[0.65] animate-[animateGirl_12s_linear_infinite] pointer-events-none z-[5]" />

      <img src="https://i.ibb.co/QrMyLYc/trees.png" alt="trees" className="absolute top-0 left-0 w-full h-full object-cover z-[100] pointer-events-none" />

      {/* MAIN FORM CARD */}
      <div className="relative w-[500px] rounded-[20px] bg-white/25 backdrop-blur-[15px] shadow-[0_25px_50px_rgba(0,0,0,0.1)] border border-white border-b-white/50 border-r-white/50 z-[201] overflow-hidden transition-all duration-300">
        
        {/* TAB HEADERS */}
        <div className="flex w-full cursor-pointer">
            <div onClick={() => setActiveTab('signin')} className={`flex-1 p-4 text-center text-xl font-semibold transition-colors duration-200 ${activeTab === 'signin' ? 'bg-white/40 text-[#8f2c24]' : 'bg-transparent text-white hover:bg-white/10'}`}>
              Sign In
            </div>
            <div onClick={() => setActiveTab('signup')} className={`flex-1 p-4 text-center text-xl font-semibold transition-colors duration-200 ${activeTab === 'signup' ? 'bg-white/40 text-[#8f2c24]' : 'bg-transparent text-white hover:bg-white/10'}`}>
              Sign Up
            </div>
        </div>

        {/* FORM CONTENT */}
        <form onSubmit={handleSubmit} className="p-[40px_60px_60px_60px] flex flex-col gap-[25px]">
          <h2 className="relative w-full text-center text-[2.5rem] font-semibold text-[#8f2c24] mb-[5px]">
            {activeTab === 'signin' ? 'Welcome Back' : 'Create Account'}
          </h2>

          {message && (
            <div className={`w-full p-3 rounded text-sm ${message.type === 'error' ? 'bg-red-100/80 text-red-800' : 'bg-green-100/80 text-green-800'}`}>
              {message.text}
            </div>
          )}

          {activeTab === 'signin' ? (
            <div className="relative w-full">
              <input type="email" name="email" placeholder="Email" value={formData.email} className="w-full p-[15px_20px] outline-none text-[1.25rem] text-[#8f2c24] rounded-[5px] bg-white border-none placeholder:text-[#db7770]" onChange={handleInputChange} required />
            </div>
          ) : (
            <div className="relative w-full">
              <input type="text" name="username" placeholder="Username" value={formData.username} className="w-full p-[15px_20px] outline-none text-[1.25rem] text-[#8f2c24] rounded-[5px] bg-white border-none placeholder:text-[#db7770]" onChange={handleInputChange} required />
            </div>
          )}

          {activeTab === 'signup' && (
            <div className="relative w-full">
                <input type="email" name="email" placeholder="Email Address" value={formData.email} className="w-full p-[15px_20px] outline-none text-[1.25rem] text-[#8f2c24] rounded-[5px] bg-white border-none placeholder:text-[#db7770]" onChange={handleInputChange} required />
            </div>
          )}

          <div className="relative w-full">
            <input type="password" name="password" placeholder="Password" value={formData.password} className="w-full p-[15px_20px] outline-none text-[1.25rem] text-[#8f2c24] rounded-[5px] bg-white border-none placeholder:text-[#db7770]" onChange={handleInputChange} required />
          </div>

          {activeTab === 'signup' && (
             <div className="relative w-full">
                <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} className="w-full p-[15px_20px] outline-none text-[1.25rem] text-[#8f2c24] rounded-[5px] bg-white border-none placeholder:text-[#db7770]" onChange={handleInputChange} required />
             </div>
          )}

          <div className="relative w-full mt-2">
            <button type="submit" className="w-full p-[15px_20px] text-[1.25rem] text-white rounded-[5px] bg-[#8f2c24] border-none cursor-pointer hover:bg-[#d64c42] font-medium shadow-md transition-all active:scale-95">
               {activeTab === 'signin' ? "Login" : "Register"} 
            </button>
          </div>

          <div className="flex justify-between items-center">
            {activeTab === 'signin' ? (
                <>
                    <a href="#" className="text-[1.1rem] text-[#ffffff] font-medium no-underline hover:text-[#d64c42]">Forgot Password?</a>
                    <span onClick={() => setActiveTab('signup')} className="text-[1.1rem] text-[#ffffff] font-medium cursor-pointer hover:text-[#d64c42]">Sign up</span>
                </>
            ) : (
                <div className="w-full text-center">
                    <span className="text-white text-[1.1rem]">Already have an account? </span>
                    <span onClick={() => setActiveTab('signin')} className="text-[1.1rem] text-[#8f2c24] font-bold cursor-pointer hover:text-[#d64c42] bg-white/60 px-2 py-1 rounded ml-2">Sign In</span>
                </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;