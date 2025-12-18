import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Loader } from 'lucide-react';
import toast from 'react-hot-toast';

const Analytics = () => {
  const { token } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/bookings/all?limit=1000`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setBookings(response.data.data);
    } catch (error) {
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  // Service Demand Data
  const serviceCounts = bookings.reduce((acc, booking) => {
    acc[booking.serviceName] = (acc[booking.serviceName] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.entries(serviceCounts).map(([name, count]) => ({
    service: name.length > 20 ? name.substring(0, 20) + '...' : name,
    bookings: count
  }));

  // Status Distribution
  const statusCounts = bookings.reduce((acc, booking) => {
    acc[booking.status] = (acc[booking.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <>
      <Helmet>
        <title>Analytics - Admin Dashboard</title>
      </Helmet>

      <div>
        <h1 className="text-3xl font-bold mb-6">Analytics Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="stats shadow">
            <div className="stat">
              <div className="stat-title">Total Bookings</div>
              <div className="stat-value text-primary">{bookings.length}</div>
            </div>
          </div>
          <div className="stats shadow">
            <div className="stat">
              <div className="stat-title">Confirmed</div>
              <div className="stat-value text-success">{statusCounts.confirmed || 0}</div>
            </div>
          </div>
          <div className="stats shadow">
            <div className="stat">
              <div className="stat-title">Pending</div>
              <div className="stat-value text-warning">{statusCounts.pending || 0}</div>
            </div>
          </div>
          <div className="stats shadow">
            <div className="stat">
              <div className="stat-title">Cancelled</div>
              <div className="stat-value text-error">{statusCounts.cancelled || 0}</div>
            </div>
          </div>
        </div>

        {/* Service Demand Chart */}
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h2 className="card-title mb-4">Service Demand Chart</h2>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="service" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="bookings" fill="#f43f5e" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  );
};

export default Analytics;