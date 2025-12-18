import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { Calendar, MapPin, DollarSign, Trash2, CreditCard, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const MyBookings = () => {
  const { token } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    fetchBookings();
  }, [page]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/bookings/my-bookings?page=${page}&limit=10`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setBookings(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/bookings/${bookingId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      toast.success('Booking cancelled successfully!');
      fetchBookings();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel booking');
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
        <title>My Bookings - Dashboard</title>
      </Helmet>

      <div>
        <h1 className="text-3xl font-bold mb-6">My Bookings</h1>

        {bookings.length === 0 ? (
          <div className="text-center py-20">
            <Calendar className="mx-auto text-gray-400 mb-4" size={64} />
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">No bookings yet</h3>
            <p className="text-gray-500 mb-6">Start booking our services!</p>
            <Link to="/services" className="btn btn-primary">
              Browse Services
            </Link>
          </div>
        ) : (
          <>
            <div className="grid gap-6">
              {bookings.map((booking) => (
                <div key={booking._id} className="card bg-base-100 shadow-lg">
                  <div className="card-body">
                    <div className="flex flex-col lg:flex-row justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="card-title text-xl mb-2">{booking.serviceName}</h3>
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Calendar size={16} />
                            <span>{format(new Date(booking.bookingDate), 'PPP')}</span>
                          </div>
                          <div className="flex items-start gap-2 text-gray-600">
                            <MapPin size={16} className="mt-1" />
                            <span>{booking.location}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <DollarSign size={16} />
                            <span className="font-semibold">{booking.serviceCost} BDT</span>
                          </div>
                        </div>

                        {booking.projectStatus && (
                          <div className="mt-4">
                            <p className="text-sm font-semibold mb-2">Project Status:</p>
                            <div className="badge badge-info">{booking.projectStatus}</div>
                          </div>
                        )}

                        {booking.assignedDecorator && (
                          <div className="mt-4">
                            <p className="text-sm font-semibold mb-1">Assigned Decorator:</p>
                            <p className="text-sm text-gray-600">{booking.assignedDecorator.name}</p>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-2 lg:items-end">
                        <div className="flex gap-2">
                          <div className={`badge ${getStatusBadge(booking.status)}`}>
                            {booking.status}
                          </div>
                          <div className={`badge ${getPaymentBadge(booking.paymentStatus)}`}>
                            {booking.paymentStatus}
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 mt-4">
                          {booking.paymentStatus === 'unpaid' && booking.status !== 'cancelled' && (
                            <Link
                              to={`/dashboard/payment/${booking._id}`}
                              className="btn btn-primary btn-sm gap-2"
                            >
                              <CreditCard size={16} />
                              Pay Now
                            </Link>
                          )}
                          
                          {booking.paymentStatus === 'unpaid' && booking.status !== 'cancelled' && (
                            <button
                              onClick={() => handleCancelBooking(booking._id)}
                              className="btn btn-error btn-outline btn-sm gap-2"
                            >
                              <Trash2 size={16} />
                              Cancel
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <div className="join">
                  <button
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                    className="join-item btn"
                  >
                    Previous
                  </button>
                  <button className="join-item btn btn-disabled">
                    Page {page} of {pagination.totalPages}
                  </button>
                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={page === pagination.totalPages}
                    className="join-item btn"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default MyBookings;