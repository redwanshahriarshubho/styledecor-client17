import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Star, Award, Briefcase, Loader } from 'lucide-react';
import toast from 'react-hot-toast';

const TopDecoratorsSection = () => {
  const [decorators, setDecorators] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTopDecorators();
  }, []);

  const fetchTopDecorators = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/decorators/top?limit=6`);
      setDecorators(response.data.data);
    } catch (error) {
      toast.error('Failed to load decorators');
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
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            Meet Our <span className="text-secondary">Top Decorators</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Experienced professionals dedicated to bringing your vision to life
          </p>
        </div>

        {/* Decorators Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {decorators.map((decorator, index) => (
            <motion.div
              key={decorator._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <figure className="px-6 pt-6">
                <div className="avatar">
                  <div className="w-32 h-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                    <img
                      src={decorator.photoURL || 'https://via.placeholder.com/150'}
                      alt={decorator.name}
                    />
                  </div>
                </div>
              </figure>
              
              <div className="card-body items-center text-center">
                <h3 className="card-title text-xl">{decorator.name}</h3>
                
                <div className="badge badge-secondary badge-outline">
                  {decorator.decoratorInfo?.specialty || 'General Decorator'}
                </div>

                <div className="flex items-center gap-4 mt-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="text-accent fill-accent" size={16} />
                    <span className="font-semibold">{decorator.decoratorInfo?.rating || 5.0}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Briefcase className="text-primary" size={16} />
                    <span>{decorator.decoratorInfo?.experience || 0}+ years</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Award className="text-secondary" size={16} />
                    <span>{decorator.decoratorInfo?.totalProjects || 0} projects</span>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mt-2">
                  Specialized in creating memorable experiences
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopDecoratorsSection;