import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Home, Palette, Info, Mail, LayoutDashboard, LogOut, User } from 'lucide-react';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully!');
    } catch (error) {
      toast.error('Logout failed!');
    }
  };

  const navLinks = (
    <>
      <li>
        <NavLink 
          to="/" 
          className={({ isActive }) => 
            isActive ? 'text-primary font-semibold' : ''
          }
        >
          <Home size={18} />
          Home
        </NavLink>
      </li>
      <li>
        <NavLink 
          to="/services" 
          className={({ isActive }) => 
            isActive ? 'text-primary font-semibold' : ''
          }
        >
          <Palette size={18} />
          Services
        </NavLink>
      </li>
      <li>
        <NavLink 
          to="/about" 
          className={({ isActive }) => 
            isActive ? 'text-primary font-semibold' : ''
          }
        >
          <Info size={18} />
          About
        </NavLink>
      </li>
      <li>
        <NavLink 
          to="/contact" 
          className={({ isActive }) => 
            isActive ? 'text-primary font-semibold' : ''
          }
        >
          <Mail size={18} />
          Contact
        </NavLink>
      </li>
    </>
  );

  return (
    <div className="navbar bg-base-100 shadow-md px-4 lg:px-8 sticky top-0 z-50">
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </label>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
            {navLinks}
          </ul>
        </div>
        <Link to="/" className="flex items-center gap-2">
          <Palette className="text-primary" size={32} />
          <span className="text-2xl font-bold">
            <span className="text-primary">Style</span>
            <span className="text-secondary">Decor</span>
          </span>
        </Link>
      </div>
      
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-2">
          {navLinks}
        </ul>
      </div>
      
      <div className="navbar-end gap-2">
        {user ? (
          <>
            <Link to="/dashboard" className="btn btn-primary btn-sm">
              <LayoutDashboard size={18} />
              Dashboard
            </Link>
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full">
                  <img src={user.photoURL || 'https://via.placeholder.com/150'} alt={user.name} />
                </div>
              </label>
              <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                <li className="menu-title">
                  <span>{user.name}</span>
                  <span className="text-xs text-gray-500">{user.role}</span>
                </li>
                <li>
                  <Link to="/dashboard/profile">
                    <User size={16} />
                    Profile
                  </Link>
                </li>
                <li>
                  <button onClick={handleLogout}>
                    <LogOut size={16} />
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </>
        ) : (
          <Link to="/login" className="btn btn-primary btn-sm">
            Login
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;