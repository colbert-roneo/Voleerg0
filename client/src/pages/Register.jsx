import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Register = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'candidate',
    company: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      return toast.error('Passwords do not match');
    }

    if (form.password.length < 6) {
      return toast.error('Password must be at least 6 characters');
    }

    if (form.role === 'employer' && !form.company) {
      return toast.error('Company name is required for employers');
    }

    setLoading(true);

    try {
      const data = await register({
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
        company: form.company,
        phone: form.phone
      });
      toast.success('Account created successfully!');
      
      if (data.user.role === 'employer') {
        navigate('/employer/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card animate-slideUp" style={{ maxWidth: '520px' }}>
        <h1>Create Account</h1>
        <p className="auth-subtitle">Join Voleergo and start your journey</p>

        {/* Role Tabs */}
        <div className="role-tabs">
          <div
            className={`role-tab ${form.role === 'candidate' ? 'active' : ''}`}
            onClick={() => setForm({ ...form, role: 'candidate' })}
          >
            🎯 Job Seeker
          </div>
          <div
            className={`role-tab ${form.role === 'employer' ? 'active' : ''}`}
            onClick={() => setForm({ ...form, role: 'employer' })}
          >
            🏢 Employer
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              name="name"
              type="text"
              className="form-control"
              placeholder="John Doe"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="reg-email">Email Address</label>
            <input
              id="reg-email"
              name="email"
              type="email"
              className="form-control"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          {form.role === 'employer' && (
            <div className="form-group">
              <label htmlFor="company">Company Name</label>
              <input
                id="company"
                name="company"
                type="text"
                className="form-control"
                placeholder="Your Company Inc."
                value={form.company}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="phone">Phone Number (Optional)</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              className="form-control"
              placeholder="+1 (555) 123-4567"
              value={form.phone}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="reg-password">Password</label>
            <input
              id="reg-password"
              name="password"
              type="password"
              className="form-control"
              placeholder="Min. 6 characters"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              className="form-control"
              placeholder="Re-enter password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
