import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { CreditCard, Loader } from 'lucide-react';
import toast from 'react-hot-toast';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CheckoutForm = ({ booking }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    createPaymentIntent();
  }, []);

  const createPaymentIntent = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/payments/create-payment-intent`,
        {
          amount: booking.serviceCost,
          bookingId: booking._id
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setClientSecret(response.data.clientSecret);
    } catch (error) {
      toast.error('Failed to initialize payment');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });

    if (error) {
      toast.error(error.message);
      setProcessing(false);
      return;
    }

    if (paymentIntent.status === 'succeeded') {
      try {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/payments/confirm`,
          {
            bookingId: booking._id,
            paymentIntentId: paymentIntent.id,
            amount: booking.serviceCost,
            transactionId: paymentIntent.id
          },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        toast.success('Payment successful!');
        navigate('/dashboard/my-bookings');
      } catch (error) {
        toast.error('Payment confirmation failed!');
      }
    }

    setProcessing(false);
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="form-control">
        <label className="label">
          <span className="label-text font-semibold">Card Details</span>
        </label>
        <div className="p-4 border rounded-lg bg-white">
          <CardElement options={cardElementOptions} />
        </div>
      </div>

      <button
        type="submit"
        disabled={!stripe || processing}
        className="btn btn-primary w-full"
      >
        {processing ? (
          <>
            <Loader className="animate-spin" size={20} />
            Processing...
          </>
        ) : (
          <>
            <CreditCard size={20} />
            Pay {booking.serviceCost} BDT
          </>
        )}
      </button>
    </form>
  );
};

const Payment = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBooking();
  }, [id]);

  const fetchBooking = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/bookings/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setBooking(response.data.data);
    } catch (error) {
      toast.error('Failed to load booking details');
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

  if (!booking) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold">Booking not found</h2>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Payment - Dashboard</title>
      </Helmet>

      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Complete Payment</h1>

        <div className="grid gap-6">
          {/* Booking Summary */}
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <h2 className="card-title">Booking Summary</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Service:</span>
                  <span className="font-semibold">{booking.serviceName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Location:</span>
                  <span className="font-semibold">{booking.location}</span>
                </div>
                <div className="divider"></div>
                <div className="flex justify-between text-lg">
                  <span className="font-semibold">Total Amount:</span>
                  <span className="text-primary font-bold">{booking.serviceCost} BDT</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <h2 className="card-title mb-4">Payment Details</h2>
              <Elements stripe={stripePromise}>
                <CheckoutForm booking={booking} />
              </Elements>
              <div className="mt-4 text-sm text-gray-500 text-center">
                <p>🔒 Your payment is secure and encrypted</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Payment;