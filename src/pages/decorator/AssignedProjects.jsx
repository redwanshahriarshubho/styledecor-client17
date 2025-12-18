import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { Calendar, MapPin, DollarSign, Loader, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const AssignedProjects = () => {
  const { token } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [newStatus, setNewStatus] = useState('');

  const projectStatuses = [
    'Assigned',
    'Planning Phase',
    'Materials Prepared',
    'On the Way to Venue',
    'Setup in Progress',
    'Completed'
  ];

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/bookings/decorator/assigned`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setProjects(response.data.data);
    } catch (error) {
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = (project) => {
    setSelectedProject(project);
    setNewStatus(project.projectStatus);
    setShowStatusModal(true);
  };

  const handleStatusSubmit = async () => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/bookings/${selectedProject._id}/project-status`,
        { projectStatus: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      toast.success('Project status updated successfully!');
      setShowStatusModal(false);
      setSelectedProject(null);
      fetchProjects();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update status');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'Assigned': 'badge-info',
      'Planning Phase': 'badge-warning',
      'Materials Prepared': 'badge-secondary',
      'On the Way to Venue': 'badge-primary',
      'Setup in Progress': 'badge-accent',
      'Completed': 'badge-success'
    };
    return colors[status] || 'badge-ghost';
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
        <title>Assigned Projects - Decorator Dashboard</title>
      </Helmet>

      <div>
        <h1 className="text-3xl font-bold mb-6">My Assigned Projects</h1>

        {projects.length === 0 ? (
          <div className="text-center py-20">
            <Calendar className="mx-auto text-gray-400 mb-4" size={64} />
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">No projects assigned yet</h3>
            <p className="text-gray-500">Projects assigned to you will appear here</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {projects.map((project) => (
              <div key={project._id} className="card bg-base-100 shadow-lg">
                <div className="card-body">
                  <div className="flex flex-col lg:flex-row justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="card-title text-xl mb-2">{project.serviceName}</h3>
                      
                      <div className="space-y-2 text-sm mb-4">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar size={16} />
                          <span>{format(new Date(project.bookingDate), 'PPP')}</span>
                        </div>
                        <div className="flex items-start gap-2 text-gray-600">
                          <MapPin size={16} className="mt-1" />
                          <span>{project.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <DollarSign size={16} />
                          <span className="font-semibold">{project.serviceCost} BDT</span>
                        </div>
                      </div>

                      <div className="bg-gray-100 p-3 rounded-lg">
                        <p className="text-sm font-semibold mb-1">Customer:</p>
                        <p className="text-sm">{project.userName}</p>
                        <p className="text-sm text-gray-500">{project.userEmail}</p>
                      </div>

                      {project.notes && (
                        <div className="mt-3">
                          <p className="text-sm font-semibold">Notes:</p>
                          <p className="text-sm text-gray-600">{project.notes}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 lg:items-end">
                      <div className={`badge ${getStatusColor(project.projectStatus)} badge-lg`}>
                        {project.projectStatus}
                      </div>

                      {project.projectStatus !== 'Completed' && (
                        <button
                          onClick={() => handleUpdateStatus(project)}
                          className="btn btn-primary btn-sm mt-4"
                        >
                          Update Status
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Update Status Modal */}
      {showStatusModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-xl">Update Project Status</h3>
              <button
                onClick={() => {
                  setShowStatusModal(false);
                  setSelectedProject(null);
                }}
                className="btn btn-sm btn-circle"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-100 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Project Details</h4>
                <p className="text-sm">Service: {selectedProject?.serviceName}</p>
                <p className="text-sm">Customer: {selectedProject?.userName}</p>
                <p className="text-sm">Current Status: <span className="font-semibold">{selectedProject?.projectStatus}</span></p>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">New Status</span>
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="select select-bordered w-full"
                >
                  {projectStatuses.map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>

              <div className="alert alert-info">
                <div className="text-sm">
                  <p className="font-semibold">Status Flow:</p>
                  <p className="text-xs mt-1">
                    Assigned → Planning → Materials → On the Way → Setup → Completed
                  </p>
                </div>
              </div>

              <div className="modal-action">
                <button
                  onClick={() => {
                    setShowStatusModal(false);
                    setSelectedProject(null);
                  }}
                  className="btn btn-ghost"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStatusSubmit}
                  className="btn btn-primary"
                >
                  Update Status
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AssignedProjects;