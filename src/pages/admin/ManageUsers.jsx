import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { UserPlus, Shield, ShieldOff, Loader, X } from 'lucide-react';
import toast from 'react-hot-toast';

const ManageUsers = () => {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDecoratorModal, setShowDecoratorModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/users/all`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setUsers(response.data.data);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleMakeDecorator = (user) => {
    setSelectedUser(user);
    setShowDecoratorModal(true);
  };

  const handleDecoratorSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;

    const decoratorData = {
      specialty: form.specialty.value,
      experience: parseInt(form.experience.value),
      rating: parseFloat(form.rating.value)
    };

    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/users/${selectedUser._id}/make-decorator`,
        decoratorData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      toast.success('User promoted to decorator successfully!');
      setShowDecoratorModal(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to promote user');
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    const action = currentStatus === 'active' ? 'disable' : 'enable';
    if (!window.confirm(`Are you sure you want to ${action} this user?`)) return;

    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/users/${userId}/toggle-status`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      toast.success(`User ${action}d successfully!`);
      fetchUsers();
    } catch (error) {
      toast.error('Failed to update user status');
    }
  };

  const getRoleBadge = (role) => {
    const badges = {
      user: 'badge-ghost',
      decorator: 'badge-info',
      admin: 'badge-error'
    };
    return badges[role] || 'badge-ghost';
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
        <title>Manage Users - Admin Dashboard</title>
      </Helmet>

      <div>
        <h1 className="text-3xl font-bold mb-6">Manage Users</h1>

        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="w-12 h-12 rounded-full">
                          <img src={user.photoURL || 'https://via.placeholder.com/150'} alt={user.name} />
                        </div>
                      </div>
                      <div>
                        <div className="font-semibold">{user.name}</div>
                        {user.decoratorInfo && (
                          <div className="text-xs text-gray-500">{user.decoratorInfo.specialty}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td>{user.email}</td>
                  <td>
                    <div className={`badge ${getRoleBadge(user.role)}`}>
                      {user.role}
                    </div>
                  </td>
                  <td>
                    <div className={`badge ${user.status === 'active' ? 'badge-success' : 'badge-error'}`}>
                      {user.status}
                    </div>
                  </td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="flex gap-2">
                      {user.role === 'user' && (
                        <button
                          onClick={() => handleMakeDecorator(user)}
                          className="btn btn-primary btn-sm gap-2"
                        >
                          <UserPlus size={16} />
                          Make Decorator
                        </button>
                      )}
                      {user.role !== 'admin' && (
                        <button
                          onClick={() => handleToggleStatus(user._id, user.status)}
                          className={`btn btn-sm gap-2 ${
                            user.status === 'active' ? 'btn-error' : 'btn-success'
                          }`}
                        >
                          {user.status === 'active' ? (
                            <>
                              <ShieldOff size={16} />
                              Disable
                            </>
                          ) : (
                            <>
                              <Shield size={16} />
                              Enable
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Make Decorator Modal */}
      {showDecoratorModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-xl">Promote to Decorator</h3>
              <button
                onClick={() => {
                  setShowDecoratorModal(false);
                  setSelectedUser(null);
                }}
                className="btn btn-sm btn-circle"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleDecoratorSubmit} className="space-y-4">
              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="text-sm">User: <span className="font-semibold">{selectedUser?.name}</span></p>
                <p className="text-sm">Email: <span className="font-semibold">{selectedUser?.email}</span></p>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Specialty</span>
                </label>
                <input
                  type="text"
                  name="specialty"
                  placeholder="e.g., Wedding Decoration, Home Decoration"
                  className="input input-bordered"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Experience (years)</span>
                  </label>
                  <input
                    type="number"
                    name="experience"
                    min="0"
                    defaultValue="0"
                    className="input input-bordered"
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Initial Rating</span>
                  </label>
                  <input
                    type="number"
                    name="rating"
                    min="1"
                    max="5"
                    step="0.1"
                    defaultValue="5.0"
                    className="input input-bordered"
                    required
                  />
                </div>
              </div>

              <div className="modal-action">
                <button
                  type="button"
                  onClick={() => {
                    setShowDecoratorModal(false);
                    setSelectedUser(null);
                  }}
                  className="btn btn-ghost"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Promote to Decorator
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ManageUsers;