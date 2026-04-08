import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UtensilsCrossed, User, Mail, Lock, Phone, Upload, CheckCircle2, Image as ImageIcon } from 'lucide-react';
import { useAuthContext } from '../../context/AuthContext';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const Register = () => {
  const navigate = useNavigate();
  const { registerUser, sendOTP, loading } = useAuthContext();
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    re_password: ''
  });
  
  const [phone, setPhone] = useState('');
  const [regType, setRegType] = useState('email');
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.re_password) {
      setError("Passwords do not match.");
      return;
    }
    if (regType === 'phone' && !phone) {
      setError("Please enter a valid phone number.");
      return;
    }

    const payload = new FormData();
    payload.append('first_name', formData.first_name);
    payload.append('last_name', formData.last_name);
    payload.append('password', formData.password);
    payload.append('re_password', formData.re_password);

    const finalPhone = phone.startsWith('+') ? phone : `+${phone}`;
    if (regType === 'email') {
      payload.append('email', formData.email);
    } else {
      payload.append('phone', finalPhone);
    }

    if (profileImage) payload.append('profile_image', profileImage);

    const result = await registerUser(payload);

    if (result.success) {
      if (regType === 'email') {
        const emailToVerify = formData.email;
        navigate('/verify-otp', { state: { email: emailToVerify } });
      } else {
        // Phone registration -> No OTP, direct Home/Login
        navigate('/');
      }
    } else {
      setError(result.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center bg-slate-50 px-4 py-12 text-slate-800 font-sans">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
        
        <div className="bg-slate-900 p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-primary-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="relative z-10 flex flex-col items-center text-slate-100">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-4 transition-transform hover:scale-110 duration-300">
              <UtensilsCrossed className="text-primary-400 w-8 h-8" />
            </div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">Create Account</h2>
            <p className="text-slate-400 text-sm mt-2 max-w-xs mx-auto">Join the SeatFlow community for an elite dining experience</p>
          </div>
        </div>

        <div className="p-8 lg:p-10">
          <div className="flex p-1.5 bg-slate-100 rounded-2xl mb-8 border border-slate-200/50 shadow-inner">
            <button 
              type="button"
              onClick={() => setRegType('email')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${regType === 'email' ? 'bg-white text-primary-600 shadow-lg shadow-slate-200/50' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}>
              <Mail size={18} /> Email
            </button>
            <button 
              type="button"
              onClick={() => setRegType('phone')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${regType === 'phone' ? 'bg-white text-primary-600 shadow-lg shadow-slate-200/50' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}>
              <Phone size={18} /> Phone
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col items-center mb-6">
              <div className="relative group">
                <div className="w-24 h-24 rounded-2xl bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden transition-all group-hover:border-primary-400">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center text-slate-400 group-hover:text-primary-500 transition-colors">
                      <ImageIcon size={24} />
                      <span className="text-[10px] uppercase font-bold mt-1">Avatar</span>
                    </div>
                  )}
                </div>
                <label className="absolute -bottom-2 -right-2 bg-white text-primary-600 p-2 rounded-xl shadow-lg border border-slate-100 cursor-pointer hover:bg-primary-600 hover:text-white transition-all active:scale-90">
                  <Upload size={16} />
                  <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                </label>
              </div>
              <p className="text-[11px] text-slate-400 mt-3 font-medium">Upload profile picture (optional)</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">First Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-slate-400" />
                  </div>
                  <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} required placeholder="John" className="input input-bordered w-full pl-11 h-12 bg-slate-50 border-slate-200 focus:border-primary-500 focus:ring-primary-500 rounded-xl transition-all"/>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Last Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-slate-400" />
                  </div>
                  <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} required placeholder="Doe" className="input input-bordered w-full pl-11 h-12 bg-slate-50 border-slate-200 focus:border-primary-500 focus:ring-primary-500 rounded-xl transition-all"/>
                </div>
              </div>
            </div>

            {regType === 'email' ? (
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="you@example.com" className="input input-bordered w-full pl-11 h-12 bg-slate-50 border-slate-200 focus:border-primary-500 focus:ring-primary-500 rounded-xl transition-all"/>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Phone Number</label>
                <div className="relative">
                  <PhoneInput 
                    country={'bd'} 
                    value={phone} 
                    onChange={setPhone} 
                    inputClass="!w-full !h-12 !bg-slate-50 !border-slate-200 !rounded-xl !pl-12 !text-base focus:!border-primary-500 focus:!ring-primary-500"
                    containerClass="!w-full"
                    buttonClass="!bg-transparent !border-none !pl-2"
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input type="password" name="password" value={formData.password} onChange={handleChange} required placeholder="••••••••" className="input input-bordered w-full pl-11 h-12 bg-slate-50 border-slate-200 focus:border-primary-500 focus:ring-primary-500 rounded-xl transition-all"/>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Confirm Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input type="password" name="re_password" value={formData.re_password} onChange={handleChange} required placeholder="••••••••" className="input input-bordered w-full pl-11 h-12 bg-slate-50 border-slate-200 focus:border-primary-500 focus:ring-primary-500 rounded-xl transition-all"/>
                </div>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-4 rounded-2xl bg-red-50 text-red-600 text-sm border border-red-100 animate-in fade-in slide-in-from-top-2">
                <p className="font-semibold">{error}</p>
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading} 
              className="btn btn-primary w-full h-14 rounded-2xl font-bold text-base flex items-center justify-center gap-3 shadow-xl shadow-primary-500/30 hover:shadow-primary-500/40 active:scale-[0.98] transition-all duration-300 disabled:bg-slate-400 disabled:cursor-not-allowed mt-4"
            >
              {loading ? (
                <>
                  <span className="loading loading-spinner loading-md"></span>
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 size={24} />
                  Create My Account
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-100 text-center">
            <p className="text-slate-600 font-medium">
              Already a member?{' '}
              <Link to="/login" className="font-extrabold text-primary-600 hover:text-primary-700 transition-colors inline-flex items-center gap-1 group">
                Sign In Now
                <span className="block w-0 h-0.5 bg-primary-600 transition-all group-hover:w-full"></span>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;