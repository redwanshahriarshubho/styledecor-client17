import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, DollarSign } from 'lucide-react';

const ServiceCard = ({ service }) => {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="card bg-base-100 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group"
    >
      <figure className="relative h-56 overflow-hidden">
        <img
          src={service.image}
          alt={service.service_name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold">
          {service.service_category}
        </div>
      </figure>
      
      <div className="card-body">
        <h2 className="card-title text-xl">{service.service_name}</h2>
        <p className="text-gray-600 text-sm line-clamp-2">{service.description}</p>
        
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-1">
            <DollarSign size={20} className="text-primary" />
            <span className="text-2xl font-bold text-primary">{service.cost}</span>
            <span className="text-sm text-gray-500">BDT/{service.unit}</span>
          </div>
        </div>

        <div className="card-actions mt-4">
          <Link to={`/services/${service._id}`} className="btn btn-primary btn-block group">
            View Details
            <ArrowRight size={18} className="group-hover:translate-x-1 transition" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default ServiceCard;