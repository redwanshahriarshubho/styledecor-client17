import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { CreditCard, Download, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const PaymentHistory = () => {
  const { token } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/payments/history`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setPayments(response.data.data);
    } catch (error) {
      toast.error('Failed to load payment history');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReceipt = (payment) => {
    toast.success('Receipt downloaded!');
    // Implement receipt download logic here
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Payment History - Dashboard</title>
      </Helmet>

      <div>
        <h1 className="text-3xl font-bold mb-6">Payment History</h1>

        {payments.length === 0 ? (
          <div className="text-center py-20">
            <CreditCard className="mx-auto text-gray-400 mb-4" size={64} />
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">No payments yet</h3>
            <p className="text-gray-500">Your payment history will appear here</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Transaction ID</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment._id}>
                    <td>{format(new Date(payment.createdAt), 'PPP')}</td>
                    <td className="font-mono text-sm">{payment.transactionId}</td>
                    <td className="font-semibold">{payment.amount} BDT</td>
                    <td>
                      <div className="badge badge-success">{payment.status}</div>
                    </td>
                    <td>
                      <button
                        onClick={() => handleDownloadReceipt(payment)}
                        className="btn btn-ghost btn-sm gap-2"
                      >
                        <Download size={16} />
                        Receipt
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default PaymentHistory;