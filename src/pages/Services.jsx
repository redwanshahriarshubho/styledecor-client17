import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import ServiceCard from '../components/home/ServiceCard';
import { Search, Filter, Loader, X } from 'lucide-react';
import toast from 'react-hot-toast';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchServices();
  }, [searchTerm, category, minPrice, maxPrice, page]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/services/meta/categories`);
      setCategories(response.data.data);
    } catch (error) {
      console.error('Failed to fetch categories');
    }
  };

  const fetchServices = async () => {
    try {
      setLoading(true);
      const params = {
        search: searchTerm,
        category: category !== 'all' ? category : '',
        minPrice: minPrice || 0,
        maxPrice: maxPrice || 1000000,
        page,
        limit: 9
      };

      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/services`, { params });
      setServices(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      toast.error('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSearchTerm('');
    setCategory('all');
    setMinPrice('');
    setMaxPrice('');
    setPage(1);
  };

  return (
    <>
      <Helmet>
        <title>Services - StyleDecor</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary to-secondary text-white py-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Decoration Services</h1>
            <p className="text-lg opacity-90">
              Browse through our wide range of professional decoration services
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white shadow-md sticky top-16 z-40">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search services..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input input-bordered w-full pl-10"
                />
              </div>

              {/* Category Filter */}
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="select select-bordered w-full"
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              {/* Price Range */}
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min Price"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="input input-bordered w-full"
                />
                <input
                  type="number"
                  placeholder="Max Price"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="input input-bordered w-full"
                />
              </div>

              {/* Reset Button */}
              <button onClick={handleReset} className="btn btn-outline gap-2">
                <X size={18} />
                Reset Filters
              </button>
            </div>
          </div>
        </div>

        {/* Services Grid */}
        <div className="max-w-7xl mx-auto px-4 py-12">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader className="animate-spin text-primary" size={40} />
            </div>
          ) : services.length === 0 ? (
            <div className="text-center py-20">
              <Filter className="mx-auto text-gray-400 mb-4" size={64} />
              <h3 className="text-2xl font-semibold text-gray-700 mb-2">No services found</h3>
              <p className="text-gray-500">Try adjusting your filters</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service) => (
                  <ServiceCard key={service._id} service={service} />
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex justify-center mt-12">
                  <div className="join">
                    <button
                      onClick={() => setPage(page - 1)}
                      disabled={page === 1}
                      className="join-item btn"
                    >
                      Previous
                    </button>
                    {[...Array(pagination.totalPages)].map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setPage(index + 1)}
                        className={`join-item btn ${page === index + 1 ? 'btn-primary' : ''}`}
                      >
                        {index + 1}
                      </button>
                    ))}
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
      </div>
    </>
  );
};

export default Services;