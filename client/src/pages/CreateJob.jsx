import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';

const CreateJob = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    type: 'Full-time',
    salaryMin: '',
    salaryMax: '',
    requirements: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/jobs', {
        title: form.title,
        description: form.description,
        location: form.location,
        type: form.type,
        salary: {
          min: parseInt(form.salaryMin) || 0,
          max: parseInt(form.salaryMax) || 0
        },
        requirements: form.requirements.split('\n').filter(r => r.trim())
      });

      toast.success('Job posted successfully! 🎉');
      navigate('/employer/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: '750px' }}>
        <div className="page-header animate-fadeIn">
          <h1>Post a New Job</h1>
          <p>Create a job listing to attract top talent</p>
        </div>

        <div className="glass-card animate-slideUp">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">Job Title *</label>
              <input
                id="title"
                name="title"
                type="text"
                className="form-control"
                placeholder="e.g. Senior React Developer"
                value={form.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label htmlFor="location">Location *</label>
                <input
                  id="location"
                  name="location"
                  type="text"
                  className="form-control"
                  placeholder="e.g. New York, NY"
                  value={form.location}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="type">Job Type</label>
                <select
                  id="type"
                  name="type"
                  className="form-control"
                  value={form.type}
                  onChange={handleChange}
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                  <option value="Remote">Remote</option>
                </select>
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label htmlFor="salaryMin">Min Salary ($)</label>
                <input
                  id="salaryMin"
                  name="salaryMin"
                  type="number"
                  className="form-control"
                  placeholder="e.g. 60000"
                  value={form.salaryMin}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="salaryMax">Max Salary ($)</label>
                <input
                  id="salaryMax"
                  name="salaryMax"
                  type="number"
                  className="form-control"
                  placeholder="e.g. 120000"
                  value={form.salaryMax}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="description">Job Description *</label>
              <textarea
                id="description"
                name="description"
                className="form-control"
                placeholder="Describe the role, responsibilities, and what you're looking for..."
                value={form.description}
                onChange={handleChange}
                rows={8}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="requirements">Requirements (one per line)</label>
              <textarea
                id="requirements"
                name="requirements"
                className="form-control"
                placeholder={"3+ years React experience\nProficient in TypeScript\nExperience with REST APIs"}
                value={form.requirements}
                onChange={handleChange}
                rows={5}
              />
            </div>

            <div className="flex gap-md">
              <button type="submit" className="btn btn-primary btn-lg" style={{ flex: 1 }} disabled={loading}>
                {loading ? 'Posting...' : '📝 Post Job'}
              </button>
              <button type="button" className="btn btn-secondary btn-lg" onClick={() => navigate('/employer/dashboard')}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateJob;
