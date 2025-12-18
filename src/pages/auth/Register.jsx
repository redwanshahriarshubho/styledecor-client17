import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Helmet } from 'react-helmet-async';
import { User, Mail, Lock, Image, Eye, EyeOff, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [photoURL, setPhotoURL] = useState('');
  const { register, googleLogin } = useAuth();
  const navigate = useNavigate();

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      setUploading(true);
      const response = await axios.post(
        `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMAGEBB_API_KEY}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      setPhotoURL(response.data.data.url);
      toast.success('Image uploaded successfully!');
    } catch (error) {
      toast.error('Image upload failed. Please try again.');
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await googleLogin();
      toast.success('Google login successful!');
      navigate('/');
    } catch (error) {
      toast.error('Google login failed!');
      console.error('Google login error:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const form = e.target;
    const name = form.name.value;
    const email = form.email.value;
    const password = form.password.value;

    try {
      if (uploading) {
        toast.error('Please wait for image upload to complete.');
        return;
      }

      await register(email, password, name, photoURL);
      toast.success('Registration successful! Welcome to StyleDecor.');
      navigate('/');
    } catch (error) {
      toast.error(error.message || 'Registration failed!');
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Register - StyleDecor</title>
      </Helmet>

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-cyan-50 py-12">
        <div className="max-w-md w-full mx-auto px-4">
          <div className="card bg-base-100 shadow-2xl">
            <div className="card-body">
              <h2 className="card-title text-3xl font-bold text-center text-gray-800 mb-8">
                Join StyleDecor
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">
                      <User className="inline mr-2" size={18} />
                      Full Name
                    </span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    className="input input-bordered w-full"
                    required
                  />
                </div>

                {/* Email */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">
                      <Mail className="inline mr-2" size={18} />
                      Email
                    </span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    className="input input-bordered w-full"
                    required
                  />
                </div>

                {/* Password */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">
                      <Lock className="inline mr-2" size={18} />
                      Password
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      placeholder="Create a strong password"
                      className="input input-bordered w-full pr-10"
                      required
                      minLength="6"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  <label className="label">
                    <span className="label-text-alt text-sm">
                      Password must be at least 6 characters
                    </span>
                  </label>
                </div>

                {/* Photo Upload */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">
                      <Image className="inline mr-2" size={18} />
                      Profile Photo (Optional)
                    </span>
                  </label>
                  <input
                    type="file"
                    name="photo"
                    accept="image/*"
                    onChange={(e) => uploadImage(e.target.files[0])}
                    className="file-input file-input-bordered w-full"
                    disabled={uploading}
                  />
                  {uploading && <span className="text-sm text-gray-500 mt-1">Uploading...</span>}
                  {photoURL && (
                    <div className="mt-2">
                      <img
                        src={photoURL}
                        alt="Preview"
                        className="w-20 h-20 rounded-full object-cover border-2 border-primary"
                      />
                    </div>
                  )}
                </div>

                {/* Submit */}
                <div className="form-control mt-6">
                  <button
                    type="submit"
                    disabled={loading || uploading}
                    className="btn btn-primary w-full"
                  >
                    {loading ? <Loader className="animate-spin" size={20} /> : 'Register'}
                  </button>
                </div>
              </form>

              {/* Divider */}
              <div className="divider">OR</div>

              {/* Google Login */}
              <button
                onClick={handleGoogleLogin}
                className="btn btn-outline w-full gap-2"
                disabled={loading}
              >
                <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                Continue with Google
              </button>

              {/* Login Link */}
              <p className="text-center mt-6 text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="text-primary font-semibold hover:underline">
                  Login here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;