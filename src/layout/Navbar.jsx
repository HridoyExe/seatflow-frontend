
import { Link, useLocation } from "react-router-dom";
import { Utensils, Search, ShoppingBag, LogOut, User, LayoutDashboard, Armchair } from "lucide-react";
import { useAuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout, isAdmin } = useAuthContext();
  const location = useLocation();

  const baseNavItems = [
    { path: "/", label: "Home" },
    { path: "/menu", label: "Menu" },
    { path: "/seats", label: "Booking" },
  ];

  const dashboardPath = isAdmin ? "/admin-dashboard" : "/member-dashboard";

  const navItems = user 
    ? [...baseNavItems, { path: dashboardPath, label: "Dashboard" }]
    : baseNavItems;

  return (
    <div className="sticky top-0 z-50 bg-slate-50/90 backdrop-blur-md border-b border-primary-500/10 font-sans">
      <div className="container mx-auto max-w-7xl flex items-center justify-between px-4 py-3 md:py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <Utensils className="text-primary-600 w-6 h-6 md:w-8 md:h-8" />
          <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-slate-900">
            Seat<span className="text-primary-600">Flow</span>
          </h1>
        </Link>

        {/* Desktop Nav Items */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => {
            const isActive =
              location.pathname === item.path ||
              (item.path === "/seats" && location.pathname.includes("/booking")) ||
              (item.path === "/menu" && location.pathname.includes("/menu"));

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`font-semibold md:text-lg relative group`}
              >
                <span
                  className={
                    isActive
                      ? "text-primary-600"
                      : "text-slate-600 group-hover:text-primary-600"
                  }
                >
                  {item.label}
                </span>
                <span
                  className={`absolute -bottom-1 left-0 w-full h-0.5 bg-primary-600 transition-transform origin-left ${
                    isActive
                      ? "scale-x-100"
                      : "scale-x-0 group-hover:scale-x-100"
                  }`}
                ></span>
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-4 md:gap-6">
          <button className="text-slate-700 hover:text-primary-600 transition-colors hidden sm:block">
            <Search className="w-5 h-5 md:w-6 md:h-6" />
          </button>

          <Link
            to="/orders"
            className="text-slate-700 hover:text-primary-600 transition-colors"
          >
            <ShoppingBag className="w-5 h-5 md:w-6 md:h-6" />
          </Link>

          {user ? (
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost btn-circle avatar border-slate-200">
                <div className="w-10 rounded-full bg-primary-100 flex items-center justify-center">
                  {user.profile_image ? (
                    <img src={user.profile_image} alt="Profile" />
                  ) : (
                    <span className="text-primary-700 font-bold uppercase">{user.first_name?.charAt(0) || user.identifier?.charAt(0) || "U"}</span>
                  )}
                </div>
              </label>
              <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow-xl menu menu-sm dropdown-content bg-white rounded-2xl w-52 border border-slate-100">
                <div className="px-4 py-3 border-b border-slate-50 mb-2">
                  <p className="font-bold text-slate-900 truncate capitalize">{user.first_name ? `${user.first_name} ${user.last_name || ''}` : "Guest"}</p>
                  <p className="text-xs text-slate-500 truncate">{user.email || user.identifier}</p>
                </div>
                <li>
                  <Link to={dashboardPath} className="flex items-center gap-3 py-3 px-4 hover:bg-slate-50 text-orange-600 rounded-xl font-bold transition-all">
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Link>
                </li>
                {!isAdmin && (
                  <>
                    <li>
                      <Link to="/my-bookings" className="flex items-center gap-3 py-3 px-4 hover:bg-slate-50 text-slate-700 rounded-xl font-bold transition-all">
                        <Armchair className="w-4 h-4 text-primary-600" />
                        My Bookings
                      </Link>
                    </li>
                    <li>
                      <Link to="/my-orders" className="flex items-center gap-3 py-3 px-4 hover:bg-slate-50 text-slate-700 rounded-xl font-bold transition-all">
                        <ShoppingBag className="w-4 h-4 text-primary-600" />
                        My Orders
                      </Link>
                    </li>
                  </>
                )}
                <li>
                  <Link to="/profile" className="flex items-center gap-3 py-3 px-4 hover:bg-slate-50 rounded-xl font-medium transition-colors">
                    <User className="w-4 h-4 text-primary-600" />
                    My Profile
                  </Link>
                </li>
                <li>
                  <button onClick={logout} className="flex items-center gap-3 py-3 px-4 hover:bg-red-50 text-red-600 rounded-xl font-medium transition-colors w-full text-left">
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-6 rounded-full shadow-md transition-all active:scale-95"
            >
              Login
            </Link>
          )}
        </div>
      </div>

      <div className="md:hidden px-4 overflow-x-auto scrollbar-hide border-b border-slate-100 bg-white">
        <div className="flex gap-6 py-3 min-w-max">
          {navItems.map((item) => {
            const isActive =
              location.pathname === item.path ||
              (item.path === "/seats" && location.pathname.includes("/booking")) ||
              (item.path === "/menu" && location.pathname.includes("/menu"));

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`text-xs uppercase tracking-widest font-black ${
                  isActive
                    ? "text-primary-600"
                    : "text-slate-400 hover:text-primary-600"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Navbar;