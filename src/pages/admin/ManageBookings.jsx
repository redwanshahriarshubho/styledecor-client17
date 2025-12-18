import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { Calendar, User, DollarSign, Loader, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const ManageBookings = () => {
  const { token } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [decorators, setDecorators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedDecorator, setSelectedDecorator] = useState('');

  useEffect(() => {
    fetchBookings();
    fetchDecorators();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/bookings/all?limit=100`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setBookings(response.data.data);
    } catch (error) {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const fetchDecorators = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/decorators`);
      setDecorators(response.data.data);
    } catch (error) {
      console.error('Failed to load decorators');
    }
  };

  const handleAssignDecorator = (booking) => {
    if (booking.paymentStatus !== 'paid') {
      toast.error('Cannot assign decorator to unpaid booking!');
      return;
    }
    setSelectedBooking(booking);
    setShowAssignModal(true);
  };

  const handleAssignSubmit = async () => {
    if (!selectedDecorator) {
      toast.error('Please select a decorator');
      return;
    }

    const decorator = decorators.find(d => d._id === selectedDecorator);

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/bookings/${selectedBooking._id}/assign-decorator`,
        {
          decoratorId: decorator._id,
          decoratorName: decorator.name,
          decoratorEmail: decorator.email
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      toast.success('Decorator assigned successfully!');
      setShowAssignModal(false);
      setSelectedBooking(null);
      setSelectedDecorator('');
      fetchBookings();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to assign decorator');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'badge-warning',
      confirmed: 'badge-success',
      cancelled: 'badge-error'
    };
    return badges[status] || 'badge-ghost';
  };

  const getPaymentBadge = (status) => {
    return status === 'paid' ? 'badge-success' : 'badge-warning';
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
        <title>Manage Bookings - Admin Dashboard</title>
      </Helmet>

      <div>
        <h1 className="text-3xl font-bold mb-6">Manage Bookings</h1>

        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Service</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Decorator</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking._id}>
                  <td>
                    <div>
                      <div className="font-semibold">{booking.userName}</div>
                      <div className="text-sm text-gray-500">{booking.userEmail}</div>
                    </div>
                  </td>
                  <td className="font-semibold">{booking.serviceName}</td>
                  <td>{format(new Date(booking.bookingDate), 'PP')}</td>
                  <td className="font-semibold">{booking.serviceCost} BDT</td>
                  <td>
                    <div className={`badge ${getPaymentBadge(booking.paymentStatus)}`}>
                      {booking.paymentStatus}
                    </div>
                  </td>
                  <td>
                    <div className={`badge ${getStatusBadge(booking.status)}`}>
                      {booking.status}
                    </div>
                  </td>
                  <td>
                    {booking.assignedDecorator ? (
                      <div>
                        <div className="font-semibold text-sm">{booking.assignedDecorator.name}</div>
                        {booking.projectStatus && (
                          <div className="badge badge-info badge-sm mt-1">{booking.projectStatus}</div>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-400">Not assigned</span>
                    )}
                  </td>
                  <td>
                    {!booking.assignedDecorator && booking.paymentStatus === 'paid' && (
                      <button
                        onClick={() => handleAssignDecorator(booking)}
                        className="btn btn-primary btn-sm"
                      >
                        Assign
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assign Decorator Modal */}
      {showAssignModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-xl">Assign Decorator</h3>
              <button
                onClick={() => {
                  setShowAssignModal(false);
                  setSelectedBooking(null);
                  setSelectedDecorator('');
                }}
                className="btn btn-sm btn-circle"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-100 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Booking Details</h4>
                <p className="text-sm">Service: {selectedBooking?.serviceName}</p>
                <p className="text-sm">Customer: {selectedBooking?.userName}</p>
                <p className="text-sm">Date: {format(new Date(selectedBooking?.bookingDate), 'PPP')}</p>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Select Decorator</span>
                </label>
                <select
                  value={selectedDecorator}
                  onChange={(e) => setSelectedDecorator(e.target.value)}
                  className="select select-bordered w-full"
                >
                  <option value="">Choose a decorator...</option>
                  {decorators.map((decorator) => (
                    <option key={decorator._id} value={decorator._id}>
                      {decorator.name} - {decorator.decoratorInfo?.specialty} (Rating: {decorator.decoratorInfo?.rating})
                    </option>
                  ))}
                </select>
              </div>

              <div className="modal-action">
                <button
                  onClick={() => {
                    setShowAssignModal(false);
                    setSelectedBooking(null);
                    setSelectedDecorator('');
                  }}
                  className="btn btn-ghost"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAssignSubmit}
                  disabled={!selectedDecorator}
                  className="btn btn-primary"
                >
                  Assign Decorator
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ManageBookings;