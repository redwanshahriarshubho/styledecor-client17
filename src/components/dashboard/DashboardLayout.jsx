import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  LayoutDashboard,
  User,
  Calendar,
  CreditCard,
  Package,
  Users,
  Settings,
  LogOut,
  Palette,
  ClipboardList,
  DollarSign,
  BarChart
} from 'lucide-react';
import toast from 'react-hot-toast';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully!');
      navigate('/');
    } catch (error) {
      toast.error('Logout failed!');
    }
  };

  // User Menu Items
  const userMenuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Overview' },
    { path: '/dashboard/profile', icon: User, label: 'My Profile' },
    { path: '/dashboard/my-bookings', icon: Calendar, label: 'My Bookings' },
    { path: '/dashboard/payment-history', icon: CreditCard, label: 'Payment History' },
  ];

  // Admin Menu Items
  const adminMenuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Overview' },
    { path: '/dashboard/manage-services', icon: Package, label: 'Manage Services' },
    { path: '/dashboard/manage-bookings', icon: ClipboardList, label: 'Manage Bookings' },
    { path: '/dashboard/manage-users', icon: Users, label: 'Manage Users' },
    { path: '/dashboard/revenue', icon: DollarSign, label: 'Revenue' },
    { path: '/dashboard/analytics', icon: BarChart, label: 'Analytics' },
  ];

  // Decorator Menu Items
  const decoratorMenuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Overview' },
    { path: '/dashboard/assigned-projects', icon: Calendar, label: 'Assigned Projects' },
    { path: '/dashboard/schedule', icon: ClipboardList, label: 'Today\'s Schedule' },
    { path: '/dashboard/earnings', icon: DollarSign, label: 'Earnings' },
  ];

  const getMenuItems = () => {
    if (user?.role === 'admin') return adminMenuItems;
    if (user?.role === 'decorator') return decoratorMenuItems;
    return userMenuItems;
  };

  const menuItems = getMenuItems();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="drawer lg:drawer-open">
        <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />
        
        {/* Main Content */}
        <div className="drawer-content flex flex-col">
          {/* Mobile Header */}
          <div className="lg:hidden navbar bg-base-100 shadow-md">
            <div className="flex-none">
              <label htmlFor="dashboard-drawer" className="btn btn-square btn-ghost">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-5 h-5 stroke-current">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              </label>
            </div>
            <div className="flex-1">
              <Link to="/" className="flex items-center gap-2 px-2">
                <Palette className="text-primary" size={24} />
                <span className="text-xl font-bold">StyleDecor</span>
              </Link>
            </div>
          </div>

          {/* Page Content */}
          <div className="p-4 lg:p-8">
            <Outlet />
          </div>
        </div>

        {/* Sidebar */}
        <div className="drawer-side">
          <label htmlFor="dashboard-drawer" className="drawer-overlay"></label>
          <div className="min-h-full w-80 bg-base-100 text-base-content">
            {/* Logo */}
            <div className="p-4 border-b">
              <Link to="/" className="flex items-center gap-2">
                <Palette className="text-primary" size={32} />
                <span className="text-2xl font-bold">
                  <span className="text-primary">Style</span>
                  <span className="text-secondary">Decor</span>
                </span>
              </Link>
            </div>

            {/* User Info */}
            <div className="p-4 bg-gradient-to-r from-primary/10 to-secondary/10">
              <div className="flex items-center gap-3">
                <div className="avatar">
                  <div className="w-12 h-12 rounded-full ring ring-primary ring-offset-2">
                    <img src={user?.photoURL || 'https://via.placeholder.com/150'} alt={user?.name} />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold">{user?.name}</h3>
                  <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <ul className="menu p-4 space-y-2">
              {menuItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="flex items-center gap-3 py-3 hover:bg-primary/10 rounded-lg transition"
                  >
                    <item.icon size={20} />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
              
              <div className="divider"></div>
              
              <li>
                <Link to="/" className="flex items-center gap-3 py-3">
                  <Settings size={20} />
                  <span>Back to Home</span>
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 py-3 text-error hover:bg-error/10"
                >
                  <LogOut size={20} />
                  <span>Logout</span>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;