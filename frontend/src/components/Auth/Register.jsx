import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { UserPlus } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError('');

    const result = await register(
      formData.username,
      formData.email,
      formData.password
    );

    if (result.success) {
      navigate('/chat');
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-zinc-950 to-zinc-900 flex items-center justify-center">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-violet-600 rounded-full mb-4">
              <span className="text-white font-bold text-xl">💬</span>
            </div>
            <h1 className="text-white font-bold text-2xl">Join Now</h1>
            <p className="text-zinc-400 text-sm mt-2">Create your Chat account in seconds</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-zinc-100 text-sm font-medium mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                minLength="3"
                placeholder="Choose a username"
                className="w-full bg-zinc-800 text-zinc-100 rounded-lg px-4 py-2.5 border border-zinc-700 focus:outline-none focus:border-violet-500 transition-colors"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-zinc-100 text-sm font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="your@email.com"
                className="w-full bg-zinc-800 text-zinc-100 rounded-lg px-4 py-2.5 border border-zinc-700 focus:outline-none focus:border-violet-500 transition-colors"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-zinc-100 text-sm font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength="6"
                placeholder="At least 6 characters"
                className="w-full bg-zinc-800 text-zinc-100 rounded-lg px-4 py-2.5 border border-zinc-700 focus:outline-none focus:border-violet-500 transition-colors"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-zinc-100 text-sm font-medium mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Re-enter your password"
                className="w-full bg-zinc-800 text-zinc-100 rounded-lg px-4 py-2.5 border border-zinc-700 focus:outline-none focus:border-violet-500 transition-colors"
              />
            </div>

            {/* Register Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-violet-600 hover:bg-violet-500 disabled:bg-zinc-700 text-white font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 mt-6"
            >
              <UserPlus className="w-4 h-4" />
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="h-px bg-zinc-700 flex-1"></div>
            <span className="text-zinc-500 text-xs">OR</span>
            <div className="h-px bg-zinc-700 flex-1"></div>
          </div>

          {/* Login Link */}
          <p className="text-center text-zinc-400 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-violet-500 hover:text-violet-400 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-zinc-500 text-xs mt-6">
          By registering, you agree to our Terms & Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default Register;
