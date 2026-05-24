import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import { Icon } from '../components/ui/Icon';
import ThemeToggle from '../components/ui/ThemeToggle';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, fullName, role } = response.data;
      login(token, { fullName, email, role }, rememberMe);
      navigate('/admin/dashboard');
    } catch (err: unknown) {
      const error_obj = err as { response?: { data?: { message?: string } } };
      setError(error_obj.response?.data?.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background min-h-screen flex items-center justify-center relative">
      <div className="absolute top-6 left-8">
        <Link to="/" className="flex items-center gap-2 text-on-surface hover:text-primary transition-colors font-bold group">
          <Icon name="arrow_back" className="group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>
      </div>
      <div className="absolute top-6 right-8">
        <ThemeToggle />
      </div>
      
      <div className="max-w-md w-full p-space-6 sm:p-space-8">
        
        {/* LOGO AREA */}
        <div className="flex flex-col items-center mb-space-8">
          <div className="w-16 h-16 bg-primary rounded-lg neo-border neo-shadow flex items-center justify-center mb-4">
             <Icon name="bolt" fill size={32} className="text-on-primary" />
          </div>
          <h1 className="font-display-hero text-headline-2xl text-on-background text-center uppercase tracking-tighter">
            Partner Portal
          </h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant text-center mt-space-2 font-bold">
            Sign in to manage offers and bookings
          </p>
        </div>

        {/* LOGIN CARD */}
        <div className="bg-surface rounded-lg neo-border neo-shadow p-space-6 sm:p-space-8">
          <form onSubmit={handleSubmit} className="space-y-space-6">
            
            {error && (
              <div className="bg-error text-on-error neo-border rounded-lg p-3 font-body-sm flex items-center gap-2 font-bold">
                <Icon name="error" size={20} />
                {error}
              </div>
            )}

            {/* EMAIL FIELD */}
            <div>
              <label className="font-label-xs text-label-xs text-on-surface-variant uppercase tracking-wider block mb-space-2 font-bold">
                EMAIL ADDRESS
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-space-3 flex items-center pointer-events-none">
                  <Icon name="mail" className="text-on-surface-variant" size={20} />
                </div>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@slotspark.com"
                  className="w-full pl-10 pr-space-3 py-space-3 h-[44px] bg-surface-container-low neo-border rounded text-on-surface placeholder-outline focus:outline-none focus:neo-shadow transition-all duration-200 font-bold"
                />
              </div>
            </div>

            {/* PASSWORD FIELD */}
            <div>
              <div className="flex items-center justify-between mb-space-2">
                <label className="font-label-xs text-label-xs text-on-surface-variant uppercase tracking-wider block font-bold">
                  PASSWORD
                </label>
                <a href="#" className="font-body-sm text-primary hover:text-primary-container font-bold transition-colors underline">
                  Forgot Password?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-space-3 flex items-center pointer-events-none">
                  <Icon name="lock" className="text-on-surface-variant" size={20} />
                </div>
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-space-3 py-space-3 h-[44px] bg-surface-container-low neo-border rounded text-on-surface placeholder-outline focus:outline-none focus:neo-shadow transition-all duration-200 font-bold"
                />
              </div>
            </div>

            {/* REMEMBER ME */}
            <div className="flex items-center">
              <input 
                type="checkbox" 
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded-sm neo-border text-primary cursor-pointer"
              />
              <label htmlFor="remember" className="ml-2 block font-body-sm text-body-sm text-on-surface-variant font-bold cursor-pointer">
                Remember Me
              </label>
            </div>

            {/* SUBMIT BUTTON */}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full flex justify-center items-center py-space-3 px-space-4 rounded bg-primary text-on-primary font-bold neo-border neo-shadow hover:neo-shadow-hover hover:-translate-y-1 active:translate-y-0 active:neo-shadow transition-all duration-200 uppercase tracking-widest disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Icon name="progress_activity" size={20} className="animate-spin" />
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>

        {/* FOOTER */}
        <div className="mt-space-8 text-center">
          <p className="font-body-sm text-body-sm text-outline font-bold">
            Secure connection to SlotSpark Partner Portal
          </p>
        </div>

      </div>
    </div>
  );
}
