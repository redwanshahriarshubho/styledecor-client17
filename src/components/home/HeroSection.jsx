import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';

const HeroSection = () => {
  return (
    <div className="relative bg-gradient-to-br from-pink-50 via-purple-50 to-cyan-50 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md mb-6"
            >
              <Sparkles className="text-accent" size={20} />
              <span className="text-sm font-medium">Professional Decoration Services</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl lg:text-6xl font-bold leading-tight mb-6"
            >
              Transform Your
              <span className="text-primary"> Special Moments</span> Into
              <span className="text-secondary"> Beautiful Memories</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-gray-600 mb-8"
            >
              Expert decoration services for homes, weddings, offices, and events. 
              Book online, track your project, and create stunning spaces effortlessly.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link to="/services" className="btn btn-primary btn-lg gap-2 group">
                Book Decoration Service
                <ArrowRight size={20} className="group-hover:translate-x-1 transition" />
              </Link>
              <Link to="/coverage-map" className="btn btn-outline btn-lg">
                View Coverage Map
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-12 grid grid-cols-3 gap-6"
            >
              <div>
                <h3 className="text-3xl font-bold text-primary">500+</h3>
                <p className="text-sm text-gray-600">Projects Completed</p>
              </div>
              <div>
                <h3 className="text-3xl font-bold text-secondary">50+</h3>
                <p className="text-sm text-gray-600">Expert Decorators</p>
              </div>
              <div>
                <h3 className="text-3xl font-bold text-accent">98%</h3>
                <p className="text-sm text-gray-600">Client Satisfaction</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Image Grid */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="grid grid-cols-2 gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="space-y-4"
              >
                <img
                  src="https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=300&fit=crop"
                  alt="Wedding decoration"
                  className="rounded-2xl shadow-xl w-full h-48 object-cover"
                />
                <img
                  src="https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400&h=250&fit=crop"
                  alt="Home decoration"
                  className="rounded-2xl shadow-xl w-full h-64 object-cover"
                />
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="space-y-4 mt-12"
              >
                <img
                  src="https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=250&fit=crop"
                  alt="Event decoration"
                  className="rounded-2xl shadow-xl w-full h-64 object-cover"
                />
                <img
                  src="https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=400&h=300&fit=crop"
                  alt="Office decoration"
                  className="rounded-2xl shadow-xl w-full h-48 object-cover"
                />
              </motion.div>
            </div>

            {/* Floating card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 }}
              className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-white p-6 rounded-2xl shadow-2xl"
            >
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Sparkles className="text-primary" size={24} />
                </div>
                <div>
                  <p className="font-semibold text-lg">Trusted by 1000+ Clients</p>
                  <p className="text-sm text-gray-600">Nationwide Coverage</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;