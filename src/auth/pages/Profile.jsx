import React, { useState, useEffect } from 'react';
import { User, Mail, Shield, Settings, CreditCard, LogOut, Upload, Lock, Phone, Camera, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import BookingList from '../../components/booking/BookingList';
import { CalendarDays } from 'lucide-react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout, loading: authLoading, updateMe, setPassword } = useAuthContext();
  
  const [activeTab, setActiveTab] = useState('personal');
  const [isUpdating, setIsUpdating] = useState(false);
  const [passData, setPassData] = useState({ current: '', new: '', confirm: '' });
  const [imagePreview, setImagePreview] = useState(null);
  const [phone, setPhone] = useState('');

  useEffect(() => {
     if (user?.profile_image) {
       setImagePreview(user.profile_image);
     }
     if (user?.phone) {
       setPhone(user.phone);
     }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);

      setIsUpdating(true);
      const formData = new FormData();
      formData.append('profile_image', file);
      
      const result = await updateMe(formData);
      setIsUpdating(false);
      
      if (result.success) {
        toast.success("Profile picture updated successfully!");
      } else {
        toast.error(result.message);
      }
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    
    const formData = new FormData(e.target);
    const finalPhone = phone.startsWith('+') ? phone : `+${phone}`;
    
    const payload = {
      first_name: formData.get('first_name'),
      last_name: formData.get('last_name'),
      phone: finalPhone
    };

    const result = await updateMe(payload);
    setIsUpdating(false);
    
    if (result.success) {
      toast.success("Profile information updated!");
    } else {
      toast.error(result.message);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (passData.new !== passData.confirm) {
        toast.error("New passwords do not match.");
        return;
    }

    setIsUpdating(true);
    const result = await setPassword(passData.new, passData.current);
    setIsUpdating(false);

    if (result.success) {
      toast.success("Password changed successfully!");
      setPassData({ current: '', new: '', confirm: '' });
    } else {
      toast.error(result.message);
    }
  };

  if (authLoading && !user) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <span className="loading loading-spinner loading-lg text-primary-600"></span>
    </div>
  );

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 font-sans text-slate-800">
      <div className="container mx-auto max-w-5xl">
        
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Account Settings</h1>
          <p className="text-slate-500 mt-2">Manage your account information and security preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col items-center text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-24 bg-slate-900 mb-6"></div>
              
              <div className="relative group mb-6 mt-4">
                <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden relative bg-slate-100 ring-4 ring-slate-50">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-slate-400 bg-slate-100 uppercase">
                      {user.first_name?.charAt(0) || 'U'}
                    </div>
                  )}
                  
                  {isUpdating && activeTab === 'personal' && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                       <span className="loading loading-spinner text-white"></span>
                    </div>
                  )}
                </div>
                <label className="absolute bottom-1 right-1 bg-primary-600 text-white p-2.5 rounded-2xl shadow-xl border-2 border-white cursor-pointer hover:scale-110 active:scale-95 transition-all">
                  <Camera size={18} />
                  <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                </label>
              </div>

              <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-900 capitalize">
                  {user.first_name} {user.last_name}
                </h2>
                <p className="text-slate-500 font-medium">{user.email}</p>
              </div>

              <div className="w-full pt-6 border-t border-slate-100 flex flex-col gap-2">
                <button 
                  onClick={() => setActiveTab('personal')}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl font-bold transition-all ${activeTab === 'personal' ? 'bg-primary-50 text-primary-700 shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  <div className="flex items-center gap-3">
                    <User size={20} className={activeTab === 'personal' ? 'text-primary-600' : 'text-slate-400'} />
                    Personal Info
                  </div>
                  {activeTab === 'personal' && <div className="w-1.5 h-1.5 rounded-full bg-primary-600"></div>}
                </button>
                
                <button 
                   onClick={() => setActiveTab('reservations')}
                   className={`w-full flex items-center justify-between p-4 rounded-2xl font-bold transition-all ${activeTab === 'reservations' ? 'bg-primary-50 text-primary-700 shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}
                 >
                   <div className="flex items-center gap-3">
                     <CalendarDays size={20} className={activeTab === 'reservations' ? 'text-primary-600' : 'text-slate-400'} />
                     My Reservations
                   </div>
                   {activeTab === 'reservations' && <div className="w-1.5 h-1.5 rounded-full bg-primary-600"></div>}
                 </button>

                <button 
                  onClick={() => setActiveTab('security')}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl font-bold transition-all ${activeTab === 'security' ? 'bg-primary-50 text-primary-700 shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  <div className="flex items-center gap-3">
                    <Shield size={20} className={activeTab === 'security' ? 'text-primary-600' : 'text-slate-400'} />
                    Security
                  </div>
                  {activeTab === 'security' && <div className="w-1.5 h-1.5 rounded-full bg-primary-600"></div>}
                </button>


                <button onClick={handleLogout} className="w-full flex items-center gap-3 p-4 rounded-2xl font-bold text-red-600 hover:bg-red-50 transition-all mt-4">
                  <LogOut size={20} /> Logout
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="bg-white p-8 lg:p-10 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
              

              {activeTab === 'personal' ? (
                <div>
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold text-slate-900">Personal Information</h3>
                    <p className="text-slate-500 text-sm mt-1">Update your basic profile details</p>
                  </div>
                  
                  <form onSubmit={handleProfileUpdate} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 ml-1">First Name</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <User className="h-5 w-5 text-slate-400" />
                          </div>
                          <input name="first_name" type="text" defaultValue={user.first_name || ''} className="input input-bordered w-full pl-11 h-14 bg-slate-50 border-slate-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all font-medium rounded-2xl" placeholder="John" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 ml-1">Last Name</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <User className="h-5 w-5 text-slate-400" />
                          </div>
                          <input name="last_name" type="text" defaultValue={user.last_name || ''} className="input input-bordered w-full pl-11 h-14 bg-slate-50 border-slate-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all font-medium rounded-2xl" placeholder="Doe" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Mail className="h-5 w-5 text-slate-400" />
                        </div>
                        <input type="email" readOnly value={user.email} className="input input-bordered w-full pl-11 h-14 bg-slate-100 text-slate-500 border-slate-200 cursor-not-allowed font-medium rounded-2xl" />
                      </div>
                      <p className="text-xs text-slate-400 mt-2 px-1 italic">Contact support if you need to change your primary email address.</p>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">Phone Number</label>
                      <div className="relative">
                        <PhoneInput 
                          country={'bd'} 
                          value={phone} 
                          onChange={setPhone} 
                          inputClass="!w-full !h-14 !bg-slate-50 !border-slate-200 !rounded-2xl !pl-14 !text-base focus:!border-primary-500 focus:!ring-primary-500 transition-all font-medium"
                          containerClass="!w-full"
                          buttonClass="!bg-transparent !border-none !pl-3"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-4">
                      <button type="submit" disabled={isUpdating} className="btn btn-primary h-14 px-10 rounded-2xl font-bold shadow-xl shadow-primary-500/30 flex items-center gap-3 active:scale-95 transition-all disabled:opacity-70">
                        {isUpdating ? (
                           <>
                             <span className="loading loading-spinner"></span>
                             <span>Updating...</span>
                           </>
                        ) : 'Save Changes'}
                      </button>
                    </div>
                  </form>
                </div>
              ) : activeTab === 'reservations' ? (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                   <BookingList />
                </div>
              ) : (
                <div>
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold text-slate-900">Security & Privacy</h3>
                    <p className="text-slate-500 text-sm mt-1">Keep your account safe and secure</p>
                  </div>
                  
                  <form onSubmit={handlePasswordChange} className="space-y-8">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">Current Password</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-slate-400" />
                        </div>
                        <input 
                          type="password" 
                          required
                          value={passData.current}
                          onChange={(e) => setPassData({...passData, current: e.target.value})}
                          className="input input-bordered w-full pl-11 h-14 bg-slate-50 border-slate-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all font-medium rounded-2xl" 
                          placeholder="Current password"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-slate-100">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 ml-1">New Password</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-slate-400" />
                          </div>
                          <input 
                            type="password" 
                            required
                            value={passData.new}
                            onChange={(e) => setPassData({...passData, new: e.target.value})}
                            className="input input-bordered w-full pl-11 h-14 bg-slate-50 border-slate-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all font-medium rounded-2xl" 
                            placeholder="Min 8 characters"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 ml-1">Confirm New Password</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-slate-400" />
                          </div>
                          <input 
                            type="password" 
                            required
                            value={passData.confirm}
                            onChange={(e) => setPassData({...passData, confirm: e.target.value})}
                            className="input input-bordered w-full pl-11 h-14 bg-slate-50 border-slate-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all font-medium rounded-2xl" 
                            placeholder="Repeat new password"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end pt-4">
                      <button type="submit" disabled={isUpdating} className="btn btn-primary h-14 px-10 rounded-2xl font-bold shadow-xl shadow-primary-500/30 flex items-center gap-3 active:scale-95 transition-all disabled:opacity-70">
                        {isUpdating ? (
                           <>
                             <span className="loading loading-spinner"></span>
                             <span>Changing...</span>
                           </>
                        ) : 'Update Password'}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;
