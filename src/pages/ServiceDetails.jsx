import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { DollarSign, Calendar, MapPin, Loader, X } from 'lucide-react';
import toast from 'react-hot-toast';

const ServiceDetails = () => {
  const { id } = useParams();
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    fetchServiceDetails();
  }, [id]);

  const fetchServiceDetails = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/services/${id}`);
      setService(response.data.data);
    } catch (error) {
      toast.error('Failed to load service details');
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = () => {
    if (!user) {
      toast.error('Please login to book a service');
      navigate('/login', { state: { from: { pathname: `/services/${id}` } } });
      return;
    }
    setShowModal(true);
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setBookingLoading(true);

    const form = e.target;
    const bookingData = {
      serviceId: service._id,
      serviceName: service.service_name,
      serviceCost: service.cost,
      bookingDate: form.bookingDate.value,
      location: form.location.value,
      notes: form.notes.value,
      userName: user.name
    };

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/bookings`,
        bookingData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      toast.success('Booking created successfully!');
      setShowModal(false);
      navigate('/dashboard/my-bookings');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Booking failed!');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700">Service not found</h2>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{service.service_name} - StyleDecor</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="grid md:grid-cols-2">
              {/* Image */}
              <div className="h-96 md:h-auto">
                <img
                  src={service.image}
                  alt={service.service_name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Details */}
              <div className="p-8">
                <div className="badge badge-primary mb-4">{service.service_category}</div>
                <h1 className="text-3xl font-bold mb-4">{service.service_name}</h1>
                
                <div className="flex items-center gap-2 mb-6">
                  <DollarSign className="text-primary" size={32} />
                  <span className="text-4xl font-bold text-primary">{service.cost}</span>
                  <span className="text-gray-500">BDT / {service.unit}</span>
                </div>

                <div className="prose max-w-none mb-6">
                  <h3 className="text-lg font-semibold mb-2">Description</h3>
                  <p className="text-gray-600">{service.description}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <h3 className="font-semibold mb-2">Service Details</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>✓ Professional team of decorators</li>
                    <li>✓ High-quality materials</li>
                    <li>✓ On-time service delivery</li>
                    <li>✓ Post-service support</li>
                  </ul>
                </div>

                <button
                  onClick={handleBookNow}
                  className="btn btn-primary btn-lg w-full"
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showModal && (
        <div className="modal modal-open">
          <div className="modal-box max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-2xl">Book Service</h3>
              <button onClick={() => setShowModal(false)} className="btn btn-sm btn-circle">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleBookingSubmit} className="space-y-4">
              {/* User Info (Read-only) */}
              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Your Name</span>
                  </label>
                  <input
                    type="text"
                    value={user?.name || ''}
                    className="input input-bordered"
                    disabled
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Your Email</span>
                  </label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    className="input input-bordered"
                    disabled
                  />
                </div>
              </div>

              {/* Service Info (Read-only) */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Service</span>
                </label>
                <input
                  type="text"
                  value={service.service_name}
                  className="input input-bordered"
                  disabled
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Cost</span>
                </label>
                <input
                  type="text"
                  value={`${service.cost} BDT / ${service.unit}`}
                  className="input input-bordered"
                  disabled
                />
              </div>

              {/* Booking Date */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Booking Date</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="date"
                    name="bookingDate"
                    min={new Date().toISOString().split('T')[0]}
                    className="input input-bordered w-full pl-10"
                    required
                  />
                </div>
              </div>

              {/* Location */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Location</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 text-gray-400" size={20} />
                  <textarea
                    name="location"
                    placeholder="Enter full address"
                    className="textarea textarea-bordered w-full pl-10"
                    rows="3"
                    required
                  ></textarea>
                </div>
              </div>

              {/* Notes */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Additional Notes (Optional)</span>
                </label>
                <textarea
                  name="notes"
                  placeholder="Any special requirements..."
                  className="textarea textarea-bordered"
                  rows="3"
                ></textarea>
              </div>

              {/* Submit */}
              <div className="modal-action">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn btn-ghost"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={bookingLoading}
                  className="btn btn-primary"
                >
                  {bookingLoading ? <Loader className="animate-spin" size={20} /> : 'Confirm Booking'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ServiceDetails;