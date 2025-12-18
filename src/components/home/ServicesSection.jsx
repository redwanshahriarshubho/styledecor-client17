import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ServiceCard from './ServiceCard';
import { ArrowRight, Loader } from 'lucide-react';
import toast from 'react-hot-toast';

const ServicesSection = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/services?limit=6`);
      setServices(response.data.data);
    } catch (error) {
      toast.error('Failed to load services');
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

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            Our <span className="text-primary">Decoration</span> Services
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our wide range of professional decoration services tailored for every occasion
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {services.map((service) => (
            <ServiceCard key={service._id} service={service} />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Link to="/services" className="btn btn-primary btn-lg gap-2 group">
            View All Services
            <ArrowRight size={20} className="group-hover:translate-x-1 transition" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;