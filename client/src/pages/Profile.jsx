import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';

const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
    skills: user?.skills?.join(', ') || '',
    company: user?.company || ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updateData = {
        name: form.name,
        phone: form.phone,
        bio: form.bio
      };

      if (user.role === 'candidate') {
        updateData.skills = form.skills;
      }
      if (user.role === 'employer') {
        updateData.company = form.company;
      }

      const { data } = await api.put('/auth/profile', updateData);
      updateUser(data.user);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      return toast.error('File too large. Max 5MB allowed.');
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('resume', file);

    try {
      const { data } = await api.put('/auth/resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      updateUser(data.user);
      toast.success('Resume uploaded successfully! 📄');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upload resume');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: '700px' }}>
        <div className="page-header animate-fadeIn">
          <h1>My Profile</h1>
          <p>Manage your personal information</p>
        </div>

        {/* Profile Card */}
        <div className="glass-card animate-slideUp" style={{ marginBottom: '24px', textAlign: 'center', padding: '40px' }}>
          <div className="navbar-avatar" style={{ width: '80px', height: '80px', fontSize: '2rem', margin: '0 auto 16px' }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>{user?.name}</h2>
          <p style={{ color: 'var(--text-muted)' }}>{user?.email}</p>
          <span className="badge" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', marginTop: '8px' }}>
            {user?.role === 'employer' ? '🏢 Employer' : '🎯 Candidate'}
          </span>
        </div>

        {/* Resume Upload (Candidate only) */}
        {user?.role === 'candidate' && (
          <div className="glass-card animate-slideUp" style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px' }}>📄 Resume</h3>
            
            {user?.resume && (
              <div className="flex-between" style={{ marginBottom: '16px', padding: '12px', background: 'var(--bg-input)', borderRadius: 'var(--radius-md)' }}>
                <span style={{ color: 'var(--success)' }}>✅ Resume uploaded</span>
                <a 
                  href={`${API_BASE}${user.resume}`} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="btn btn-outline btn-sm"
                >
                  View Resume
                </a>
              </div>
            )}

            <label className="btn btn-secondary" style={{ cursor: 'pointer', width: '100%', textAlign: 'center' }}>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleResumeUpload}
                style={{ display: 'none' }}
              />
              {uploading ? 'Uploading...' : user?.resume ? '🔄 Replace Resume' : '📤 Upload Resume'}
            </label>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '8px', textAlign: 'center' }}>
              Accepted: PDF, DOC, DOCX (max 5MB)
            </p>
          </div>
        )}

        {/* Edit Form */}
        <div className="glass-card animate-slideUp">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '20px' }}>Edit Profile</h3>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="profile-name">Full Name</label>
              <input id="profile-name" name="name" type="text" className="form-control" value={form.name} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label htmlFor="profile-phone">Phone Number</label>
              <input id="profile-phone" name="phone" type="tel" className="form-control" placeholder="+1 (555) 123-4567" value={form.phone} onChange={handleChange} />
            </div>

            {user?.role === 'employer' && (
              <div className="form-group">
                <label htmlFor="profile-company">Company Name</label>
                <input id="profile-company" name="company" type="text" className="form-control" value={form.company} onChange={handleChange} />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="profile-bio">Bio</label>
              <textarea id="profile-bio" name="bio" className="form-control" placeholder="Tell us about yourself..." value={form.bio} onChange={handleChange} rows={4} />
            </div>

            {user?.role === 'candidate' && (
              <div className="form-group">
                <label htmlFor="profile-skills">Skills (comma separated)</label>
                <input id="profile-skills" name="skills" type="text" className="form-control" placeholder="React, Node.js, Python, AWS..." value={form.skills} onChange={handleChange} />
              </div>
            )}

            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Saving...' : '💾 Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
