import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home as HomeIcon, BookOpen, CalendarHeart, User, Facebook, Instagram, Twitter, Utensils } from 'lucide-react';

const Footer = () => {
  const hideOnPaths = ['/checkout', '/admin-dashboard', '/member-dashboard'];
  const shouldHide = hideOnPaths.some(path => location.pathname.startsWith(path));

  if (shouldHide) return null;

  const navItems = [
    { path: '/', label: 'Home', icon: HomeIcon },
    { path: '/menu', label: 'Menu', icon: BookOpen },
    { path: '/seats', label: 'Booking', icon: CalendarHeart },
    { path: '/profile', label: 'Profile', icon: User }
  ];

  return (
    <>
      <div className="h-20 md:h-0"></div>
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t border-slate-100 shadow-[0_-4px_20px_-15px_rgba(0,0,0,0.1)]">
        <div className="flex items-center justify-around py-2 px-2 pb-safe-bottom">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || 
                             (item.path === '/seats' && location.pathname.includes('/booking')) ||
                             (item.path === '/menu' && location.pathname.includes('/menu'));

            const Icon = item.icon;
            
            return (
              <Link 
                key={item.path}
                to={item.path} 
                className={`flex flex-col items-center gap-1 p-2 transition-all w-20 ${
                  isActive ? 'text-primary-600' : 'text-slate-400'
                }`}
              >
                <div className="relative">
                  <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                  {isActive && <div className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-primary-600 rounded-full"></div>}
                </div>
                <span className="text-[10px] font-black uppercase tracking-tighter">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      <footer className="hidden md:block bg-slate-900 text-slate-300 py-16 mt-20">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            
            <div className="space-y-4">
              <Link to="/" className="flex items-center gap-2">
                <Utensils className="text-primary-600 w-8 h-8" />
                <span className="text-2xl font-extrabold tracking-tight text-white">
                  Seat<span className="text-primary-600">Flow</span>
                </span>
              </Link>
              <p className="text-sm leading-relaxed text-slate-400">
                Premium restaurant management and seamless seat booking. Providing reliable tech since 2023.
              </p>
              <div className="flex gap-4 pt-2">
                <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary-600 text-white transition-colors"><Twitter size={18} /></a>
                <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary-600 text-white transition-colors"><Instagram size={18} /></a>
                <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary-600 text-white transition-colors"><Facebook size={18} /></a>
              </div>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6">Services</h4>
              <ul className="space-y-3">
                <li><Link to="/seats" className="text-slate-400 hover:text-primary-500 transition-colors">Seat Booking</Link></li>
                <li><Link to="/menu" className="text-slate-400 hover:text-primary-500 transition-colors">Menu Pre-ordering</Link></li>
                <li><a href="#" className="text-slate-400 hover:text-primary-500 transition-colors">Private Events</a></li>
                <li><a href="#" className="text-slate-400 hover:text-primary-500 transition-colors">Catering</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6">Company</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-slate-400 hover:text-primary-500 transition-colors">About Us</a></li>
                <li><a href="#" className="text-slate-400 hover:text-primary-500 transition-colors">Contact</a></li>
                <li><a href="#" className="text-slate-400 hover:text-primary-500 transition-colors">Careers</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6">Legal</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-slate-400 hover:text-primary-500 transition-colors">Terms of Use</a></li>
                <li><a href="#" className="text-slate-400 hover:text-primary-500 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-slate-400 hover:text-primary-500 transition-colors">Cookie Policy</a></li>
              </ul>
            </div>

          </div>
          <div className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} SeatFlow. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
