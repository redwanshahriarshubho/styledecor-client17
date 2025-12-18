import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';

// Layouts
import MainLayout from './components/layout/MainLayout';
import DashboardLayout from './components/dashboard/DashboardLayout';

// Public Pages
import Home from './pages/Home';
import Services from './pages/Services';
import ServiceDetails from './pages/ServiceDetails';
import About from './pages/About';
import Contact from './pages/Contact';
import CoverageMap from './pages/CoverageMap';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ErrorPage from './pages/ErrorPage';

// User Pages
import MyBookings from './pages/user/MyBookings';
import Payment from './pages/user/Payment';
import PaymentHistory from './pages/user/PaymentHistory';

// Dashboard Shared
import Profile from './components/dashboard/Profile';

// Admin Pages
import ManageBookings from './pages/admin/ManageBookings';
import ManageServices from './pages/admin/ManageServices';
import ManageUsers from './pages/admin/ManageUsers';
import Revenue from './pages/admin/Revenue';
import Analytics from './pages/admin/Analytics';

// Decorator Pages
import AssignedProjects from './pages/decorator/AssignedProjects';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: 'services', element: <Services /> },
      { path: 'services/:id', element: <ServiceDetails /> },
      { path: 'about', element: <About /> },
      { path: 'contact', element: <Contact /> },
      { path: 'coverage-map', element: <CoverageMap /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
    ],
  },
  {
    path: '/dashboard',
    element: (
      <PrivateRoute allowedRoles={['user', 'admin', 'decorator']}>
        <DashboardLayout />
      </PrivateRoute>
    ),
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Profile /> },
      { path: 'profile', element: <Profile /> },
      { path: 'my-bookings', element: <MyBookings /> },
      { path: 'payment-history', element: <PaymentHistory /> },
      { path: 'payments/:bookingId', element: <Payment /> },
      { path: 'manage-bookings', element: <ManageBookings /> },
      { path: 'manage-services', element: <ManageServices /> },
      { path: 'manage-users', element: <ManageUsers /> },
      { path: 'revenue', element: <Revenue /> },
      { path: 'analytics', element: <Analytics /> },
      { path: 'assigned-projects', element: <AssignedProjects /> },
    ],
  },
]);

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <RouterProvider router={router} />
        <Toaster position="top-right" />
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
