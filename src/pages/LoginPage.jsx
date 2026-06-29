import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../services/apiClient.js';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !secretKey) {
      setError('Please provide email and secret key.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await apiClient.post('/auth/login', {
        email,
        password: secretKey
      });

      if (response.data && response.data.success) {
        const { token, user } = response.data.data;
        localStorage.setItem('nexus_token', token);
        localStorage.setItem('nexus_user', JSON.stringify(user));
        navigate('/overview');
      } else {
        setError(response.data.error || 'Authentication failed');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Unable to connect to simulation server.');
    } finally {
      setLoading(false);
    }
  };

  const handleBiometricBypass = async () => {
    // For demo/bypass: automatically logs in as a default admin
    setEmail('admin@omniverse.nexus');
    setSecretKey('admin123');
    setError('');
    setLoading(true);

    try {
      // First ensure the default admin user exists
      await apiClient.post('/auth/register', {
        email: 'admin@omniverse.nexus',
        password: 'admin123',
        name: 'Jane Doe',
        organizationName: 'Nexus Operations Group',
        roleName: 'Admin'
      }).catch(() => {
        // Silently skip if user is already registered
      });

      const response = await apiClient.post('/auth/login', {
        email: 'admin@omniverse.nexus',
        password: 'admin123'
      });

      if (response.data && response.data.success) {
        const { token, user } = response.data.data;
        localStorage.setItem('nexus_token', token);
        localStorage.setItem('nexus_user', JSON.stringify(user));
        navigate('/overview');
      }
    } catch (err) {
      setError('Biometric gateway handshake failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between select-none">
      {/* Main Content Wrapper */}
      <main className="flex-grow flex flex-col md:flex-row">
        {/* Left Panel: Hero Illustration/Typography */}
        <section className="hidden md:flex md:w-3/5 lg:w-2/3 bg-surface-container-low relative items-center justify-center overflow-hidden p-3xl md:p-3xl">
          <div className="relative z-10 max-w-2xl">
            <div className="mb-lg">
              <span className="font-label-md text-label-md text-primary tracking-widest px-md py-xs bg-primary/10 rounded-full border border-primary/20">SYSTEM ACCESS</span>
            </div>
            <h1 className="font-display text-display text-on-background mb-md leading-none mb-lg">
              Unified Control.<br />
              <span className="text-primary">Absolute Precision.</span>
            </h1>
            <p className="font-body-lg text-body-lg text-secondary mb-xl max-w-lg">
              The next evolution in digital twin orchestration. Enter your credentials to interface with the OmniVerse Nexus infrastructure.
            </p>
            <div className="grid grid-cols-2 gap-md mt-3xl opacity-80">
              <div className="flex items-center space-x-sm">
                <span className="material-symbols-outlined text-primary">security</span>
                <span className="font-label-md text-label-md text-on-background">End-to-End Encryption</span>
              </div>
              <div className="flex items-center space-x-sm">
                <span className="material-symbols-outlined text-primary">verified_user</span>
                <span className="font-label-md text-label-md text-on-background">Biometric Gateways</span>
              </div>
            </div>
          </div>
        </section>

        {/* Right Panel: Authentication Form */}
        <section className="flex-grow flex items-center justify-center p-md md:p-3xl bg-background bg-surface-container-lowest">
          <div className="w-full max-w-md">
            {/* Mobile Branding */}
            <div className="md:hidden mb-xl text-center">
              <h2 className="font-headline-sm text-headline-sm font-bold text-primary">OmniVerse Nexus</h2>
            </div>
            <div className="bg-white p-xl rounded-2xl border border-outline-variant/20 shadow-sm max-w-md w-full">
              <header className="mb-lg">
                <h2 className="font-headline-md text-headline-md text-on-background mb-xs">Secure Authentication</h2>
                <p className="font-body-sm text-body-sm text-secondary">Authorized personnel access only.</p>
              </header>

              {error && (
                <div className="mb-md p-sm text-xs bg-error-container text-on-error-container rounded-lg border border-error/20 flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">error</span>
                  <span>{error}</span>
                </div>
              )}

              <form className="space-y-lg" onSubmit={handleLogin}>
                {/* Email Field */}
                <div className="space-y-xs">
                  <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="email">Admin Email</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-secondary text-lg">alternate_email</span>
                    <input
                      className="w-full pl-xl pr-md py-md bg-surface-container-lowest border border-outline-variant rounded-lg font-body-md text-body-md focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all"
                      id="email"
                      placeholder="admin@omniverse.nexus"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                {/* Secret Key Field */}
                <div className="space-y-xs">
                  <div className="flex justify-between items-center">
                    <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="secret-key">Secret Key</label>
                    <a className="font-label-sm text-label-sm text-primary hover:underline" href="#">Forgot?</a>
                  </div>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-secondary text-lg">key</span>
                    <input
                      className="w-full pl-xl pr-md py-md bg-surface-container-lowest border border-outline-variant rounded-lg font-body-md text-body-md focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all"
                      id="secret-key"
                      placeholder="••••••••••••"
                      type={showKey ? 'text' : 'password'}
                      value={secretKey}
                      onChange={(e) => setSecretKey(e.target.value)}
                    />
                    <button
                      className="absolute right-md top-1/2 -translate-y-1/2 text-secondary hover:text-primary transition-colors"
                      type="button"
                      onClick={() => setShowKey(!showKey)}
                    >
                      <span className="material-symbols-outlined text-lg">{showKey ? 'visibility_off' : 'visibility'}</span>
                    </button>
                  </div>
                </div>

                {/* Primary CTA */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-md bg-[#D53F8C] hover:bg-[#B8327B] text-white font-label-md text-label-md rounded-lg shadow-[#D53F8C]/20 transition-all active:scale-[0.98] flex justify-center items-center gap-sm shadow-md"
                >
                  {loading ? 'Initializing Connection...' : 'Initialize Access'}
                  <span className="material-symbols-outlined text-sm">login</span>
                </button>

                {/* Biometric Section */}
                <div className="pt-xl mt-xl border-t border-outline-variant">
                  <p className="font-label-sm text-label-sm text-center text-secondary mb-md">Secure Biometric Gateway</p>
                  <div className="flex justify-center space-x-lg">
                    <button
                      type="button"
                      onClick={handleBiometricBypass}
                      className="group flex flex-col items-center space-y-xs transition-all hover:-translate-y-1"
                    >
                      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-surface-container hover:bg-primary/10 border border-outline-variant group-hover:border-primary transition-colors">
                        <span className="material-symbols-outlined text-secondary group-hover:text-primary">face</span>
                      </div>
                      <span className="font-label-sm text-label-sm text-secondary group-hover:text-primary">FaceID</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleBiometricBypass}
                      className="group flex flex-col items-center space-y-xs transition-all hover:-translate-y-1"
                    >
                      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-surface-container hover:bg-primary/10 border border-outline-variant group-hover:border-primary transition-colors">
                        <span className="material-symbols-outlined text-secondary group-hover:text-primary">fingerprint</span>
                      </div>
                      <span className="font-label-sm text-label-sm text-secondary group-hover:text-primary">TouchID</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-md px-lg flex flex-col md:flex-row justify-between items-center bg-transparent border-t border-outline-variant/30">
        <div className="flex items-center space-x-md mb-md md:mb-0">
          <span className="font-label-sm text-label-sm font-bold text-primary">© 2026 OmniVerse Nexus</span>
          <div className="flex items-center space-x-xs">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="font-label-sm text-label-sm text-secondary">Systems Operational</span>
          </div>
        </div>
        <div className="flex space-x-lg">
          <a className="font-label-sm text-label-sm text-secondary hover:text-primary transition-colors" href="#">Privacy Policy</a>
          <a className="font-label-sm text-label-sm text-secondary hover:text-primary transition-colors" href="#">Terms of Service</a>
          <a className="font-label-sm text-label-sm text-secondary hover:text-primary transition-colors" href="#">Support</a>
        </div>
      </footer>
    </div>
  );
}
