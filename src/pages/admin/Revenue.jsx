import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { DollarSign, TrendingUp, CreditCard, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const Revenue = () => {
  const { token } = useAuth();
  const [payments, setPayments] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRevenue();
  }, []);

  const fetchRevenue = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/payments/all`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setPayments(response.data.data);
      setTotalRevenue(response.data.totalRevenue);
    } catch (error) {
      toast.error('Failed to load revenue data');
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

  const thisMonthRevenue = payments
    .filter(p => new Date(p.createdAt).getMonth() === new Date().getMonth())
    .reduce((sum, p) => sum + p.amount, 0);

  const todayRevenue = payments
    .filter(p => new Date(p.createdAt).toDateString() === new Date().toDateString())
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <>
      <Helmet>
        <title>Revenue - Admin Dashboard</title>
      </Helmet>

      <div>
        <h1 className="text-3xl font-bold mb-6">Revenue Monitoring</h1>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-primary">
                <DollarSign size={32} />
              </div>
              <div className="stat-title">Total Revenue</div>
              <div className="stat-value text-primary">{totalRevenue.toLocaleString()} BDT</div>
              <div className="stat-desc">All time earnings</div>
            </div>
          </div>

          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-secondary">
                <TrendingUp size={32} />
              </div>
              <div className="stat-title">This Month</div>
              <div className="stat-value text-secondary">{thisMonthRevenue.toLocaleString()} BDT</div>
              <div className="stat-desc">{new Date().toLocaleString('default', { month: 'long' })}</div>
            </div>
          </div>

          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-accent">
                <CreditCard size={32} />
              </div>
              <div className="stat-title">Today</div>
              <div className="stat-value text-accent">{todayRevenue.toLocaleString()} BDT</div>
              <div className="stat-desc">Total transactions: {payments.filter(p => new Date(p.createdAt).toDateString() === new Date().toDateString()).length}</div>
            </div>
          </div>
        </div>

        {/* Payment History */}
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h2 className="card-title mb-4">Payment History</h2>
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Customer</th>
                    <th>Transaction ID</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment) => (
                    <tr key={payment._id}>
                      <td>{format(new Date(payment.createdAt), 'PPp')}</td>
                      <td>{payment.userEmail}</td>
                      <td className="font-mono text-sm">{payment.transactionId}</td>
                      <td className="font-semibold">{payment.amount} BDT</td>
                      <td>
                        <div className="badge badge-success">{payment.status}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Revenue;