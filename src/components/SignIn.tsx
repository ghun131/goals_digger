import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import EyeIcon from '../assets/icons/EyeIcon';

export default function SignIn() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    try {
      setError('');
      setLoading(true);
      await signIn(formData.email, formData.password);
      navigate('/goals');
    } catch (err) {
      console.error(err);
      if (err instanceof Error) {
        // Handle specific Firebase auth errors
        if (err.message.includes("auth/invalid-credential")) {
          setError("Invalid email or password");
        } else if (err.message.includes("auth/user-not-found")) {
          setError("No account found with this email");
        } else if (err.message.includes("auth/wrong-password")) {
          setError("Incorrect password");
        } else {
          setError("Failed to sign in");
        }
      } else {
        setError("Failed to sign in");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex items-center justify-center bg-black p-4">
      <div className="w-full max-w-[440px] p-6 sm:p-8 rounded-3xl bg-zinc-900">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
          Welcome back
        </h1>
        <p className="text-base sm:text-lg text-gray-400 mb-8">
          Enter your email to sign in to your account
        </p>

        {error && (
          <div className="bg-red-500 bg-opacity-10 text-red-500 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="text-left">
            <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              className="w-full px-4 py-3 bg-black rounded-lg border border-zinc-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="m@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="text-left">
            <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                className="w-full px-4 py-3 bg-black rounded-lg border border-zinc-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                onClick={() => setShowPassword(!showPassword)}
              >
                <EyeIcon isVisible={showPassword} />
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-white w-full mt-6 py-3 px-4 rounded-lg font-medium transition-colors hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>

          <p className="text-center text-sm text-gray-400 mt-4">
            Don't have an account?{' '}
            <Link to="/sign-up" className="text-white hover:text-gray-200">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
} 