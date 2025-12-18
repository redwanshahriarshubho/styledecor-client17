import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { Plus, Edit, Trash2, X, Loader, Upload } from 'lucide-react';
import toast from 'react-hot-toast';

const ManageServices = () => {
  const { token } = useAuth();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/services?limit=100`);
      setServices(response.data.data);
    } catch (error) {
      toast.error('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      setUploading(true);
      const response = await axios.post(
        `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMAGEBB_API_KEY}`,
        formData
      );
      return response.data.data.url;
    } catch (error) {
      toast.error('Image upload failed!');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleImageChange = async (e, setFieldValue) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = await uploadImage(file);
      if (imageUrl) {
        setFieldValue(imageUrl);
        toast.success('Image uploaded!');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    
    const serviceData = {
      service_name: form.service_name.value,
      cost: parseFloat(form.cost.value),
      unit: form.unit.value,
      service_category: form.service_category.value,
      description: form.description.value,
      image: form.image.value
    };

    try {
      if (editingService) {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/api/services/${editingService._id}`,
          serviceData,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        toast.success('Service updated successfully!');
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/services`,
          serviceData,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        toast.success('Service created successfully!');
      }
      setShowModal(false);
      setEditingService(null);
      fetchServices();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed!');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/services/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      toast.success('Service deleted successfully!');
      fetchServices();
    } catch (error) {
      toast.error('Failed to delete service');
    }
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setShowModal(true);
  };

  const handleAddNew = () => {
    setEditingService(null);
    setShowModal(true);
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
        <title>Manage Services - Admin Dashboard</title>
      </Helmet>

      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Manage Services</h1>
          <button onClick={handleAddNew} className="btn btn-primary gap-2">
            <Plus size={20} />
            Add New Service
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Image</th>
                <th>Service Name</th>
                <th>Category</th>
                <th>Cost</th>
                <th>Unit</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr key={service._id}>
                  <td>
                    <div className="avatar">
                      <div className="w-16 h-16 rounded">
                        <img src={service.image} alt={service.service_name} />
                      </div>
                    </div>
                  </td>
                  <td className="font-semibold">{service.service_name}</td>
                  <td>
                    <div className="badge badge-primary">{service.service_category}</div>
                  </td>
                  <td className="font-semibold">{service.cost} BDT</td>
                  <td>{service.unit}</td>
                  <td>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(service)}
                        className="btn btn-ghost btn-sm gap-2"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(service._id)}
                        className="btn btn-error btn-ghost btn-sm gap-2"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal modal-open">
          <div className="modal-box max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-2xl">
                {editingService ? 'Edit Service' : 'Add New Service'}
              </h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingService(null);
                }}
                className="btn btn-sm btn-circle"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Service Name</span>
                </label>
                <input
                  type="text"
                  name="service_name"
                  defaultValue={editingService?.service_name}
                  className="input input-bordered"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Cost (BDT)</span>
                  </label>
                  <input
                    type="number"
                    name="cost"
                    defaultValue={editingService?.cost}
                    className="input input-bordered"
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Unit</span>
                  </label>
                  <input
                    type="text"
                    name="unit"
                    placeholder="e.g., per sq-ft, per floor"
                    defaultValue={editingService?.unit}
                    className="input input-bordered"
                    required
                  />
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Category</span>
                </label>
                <select
                  name="service_category"
                  defaultValue={editingService?.service_category}
                  className="select select-bordered"
                  required
                >
                  <option value="">Select Category</option>
                  <option value="home">Home</option>
                  <option value="wedding">Wedding</option>
                  <option value="office">Office</option>
                  <option value="seminar">Seminar</option>
                  <option value="meeting">Meeting</option>
                  <option value="event">Event</option>
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Description</span>
                </label>
                <textarea
                  name="description"
                  defaultValue={editingService?.description}
                  className="textarea textarea-bordered"
                  rows="4"
                  required
                ></textarea>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Image URL</span>
                </label>
                <input
                  type="text"
                  name="image"
                  id="imageUrl"
                  defaultValue={editingService?.image}
                  className="input input-bordered"
                  required
                />
                <label className="label">
                  <span className="label-text-alt">Or upload image:</span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    handleImageChange(e, (url) => {
                      document.getElementById('imageUrl').value = url;
                    });
                  }}
                  className="file-input file-input-bordered"
                  disabled={uploading}
                />
                {uploading && <span className="text-sm text-gray-500 mt-1">Uploading...</span>}
              </div>

              <div className="modal-action">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingService(null);
                  }}
                  className="btn btn-ghost"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingService ? 'Update Service' : 'Create Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ManageServices;