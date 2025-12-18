import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import { User, Mail, Edit, Save, Camera, Loader, X } from 'lucide-react';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, token, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [name, setName] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [uploading, setUploading] = useState(false);
  const [bookingsCount, setBookingsCount] = useState(0);

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchBookingsCount();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(response.data.data);
      setName(response.data.data.name || '');
      setPhotoURL(response.data.data.photoURL || '');
    } catch (error) {
      toast.error('Failed to load profile');
      console.error('Profile fetch error:', error);
    }
  };

  const fetchBookingsCount = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/bookings/my-bookings?limit=1`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBookingsCount(response.data.pagination.total);
    } catch (error) {
      console.error('Bookings count error:', error);
    }
  };

  const handleUpdate = async () => {
    try {
      setUpdating(true);
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/users/${user.userId}`,
        { name, photoURL },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditing(false);
      toast.success('Profile updated successfully!');
      fetchProfile();  // Refresh
    } catch (error) {
      toast.error('Failed to update profile');
      console.error('Update error:', error);
    } finally {
      setUpdating(false);
    }
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      setUploading(true);
      const response = await axios.post(
        `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMAGEBB_API_KEY}`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      setPhotoURL(response.data.data.url);
      toast.success('Image uploaded!');
    } catch (error) {
      toast.error('Image upload failed');
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Profile - StyleDecor Dashboard</title>
      </Helmet>

      <div className="min-h-screen bg-base-100 p-6">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center">
                {photoURL ? (
                  <img src={photoURL} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="text-primary" size={32} />
                )}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">{name || 'User'}</h1>
                <p className="text-gray-600">{user.role}</p>
              </div>
            </div>
            <button
              onClick={() => setEditing(!editing)}
              className="btn btn-outline gap-2"
              disabled={updating}
            >
              <Edit size={18} />
              {editing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card bg-base-200 text-center p-6">
              <div className="text-3xl font-bold text-primary">{bookingsCount}</div>
              <p className="text-gray-600">Total Bookings</p>
            </div>
            <div className="card bg-base-200 text-center p-6">
              <div className="text-3xl font-bold text-secondary">Active</div>
              <p className="text-gray-600">Status</p>
            </div>
            <div className="card bg-base-200 text-center p-6">
              <div className="text-3xl font-bold text-success">{user.role === 'admin' ? 'Full' : 'Standard'}</div>
              <p className="text-gray-600">Access Level</p>
            </div>
          </div>

          {/* Edit Form */}
          {editing && (
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <h2 className="card-title mb-4">Edit Profile</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Full Name</span>
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="input input-bordered"
                      placeholder="Enter your name"
                    />
                  </div>

                  {/* Photo Upload */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Profile Photo</span>
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => uploadImage(e.target.files[0])}
                      className="file-input file-input-bordered"
                      disabled={uploading}
                    />
                    {uploading && <span className="text-sm text-warning mt-1">Uploading...</span>}
                  </div>
                </div>

                {/* Email (Read-Only) */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Email</span>
                  </label>
                  <input
                    type="email"
                    value={user.email}
                    className="input input-bordered bg-base-200"
                    readOnly
                  />
                </div>

                {/* Actions */}
                <div className="card-actions justify-end mt-6">
                  <button
                    onClick={() => {
                      setEditing(false);
                      setName(profile?.name || '');
                      setPhotoURL(profile?.photoURL || '');
                    }}
                    className="btn btn-ghost"
                  >
                    <X size={18} />
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdate}
                    disabled={updating || !name}
                    className="btn btn-primary gap-2"
                  >
                    {updating ? <Loader className="animate-spin" size={18} /> : <Save size={18} />}
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Additional Info */}
          {!editing && (
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <h2 className="card-title mb-4">Account Details</h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail size={20} className="text-primary" />
                    <span className="font-medium">{user.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <User size={20} className="text-secondary" />
                    <span className="font-medium">Role: {user.role}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Camera size={20} className="text-accent" />
                    <span className="font-medium">Joined: {new Date(user.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Profile;