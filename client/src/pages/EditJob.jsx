import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';

const EditJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    type: 'Full-time',
    salaryMin: '',
    salaryMax: '',
    requirements: ''
  });

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const { data } = await api.get(`/jobs/${id}`);
        const job = data.job;
        setForm({
          title: job.title,
          description: job.description,
          location: job.location,
          type: job.type,
          salaryMin: job.salary?.min || '',
          salaryMax: job.salary?.max || '',
          requirements: (job.requirements || []).join('\n')
        });
      } catch (error) {
        toast.error('Job not found');
        navigate('/employer/dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await api.put(`/jobs/${id}`, {
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

      toast.success('Job updated successfully!');
      navigate('/employer/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update job');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="loading-container"><div className="spinner" /></div>;
  }

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: '750px' }}>
        <div className="page-header animate-fadeIn">
          <h1>Edit Job Listing</h1>
          <p>Update the details of your job posting</p>
        </div>

        <div className="glass-card animate-slideUp">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="edit-title">Job Title *</label>
              <input id="edit-title" name="title" type="text" className="form-control" value={form.title} onChange={handleChange} required />
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label htmlFor="edit-location">Location *</label>
                <input id="edit-location" name="location" type="text" className="form-control" value={form.location} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="edit-type">Job Type</label>
                <select id="edit-type" name="type" className="form-control" value={form.type} onChange={handleChange}>
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
                <label htmlFor="edit-salaryMin">Min Salary ($)</label>
                <input id="edit-salaryMin" name="salaryMin" type="number" className="form-control" value={form.salaryMin} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label htmlFor="edit-salaryMax">Max Salary ($)</label>
                <input id="edit-salaryMax" name="salaryMax" type="number" className="form-control" value={form.salaryMax} onChange={handleChange} />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="edit-description">Job Description *</label>
              <textarea id="edit-description" name="description" className="form-control" value={form.description} onChange={handleChange} rows={8} required />
            </div>

            <div className="form-group">
              <label htmlFor="edit-requirements">Requirements (one per line)</label>
              <textarea id="edit-requirements" name="requirements" className="form-control" value={form.requirements} onChange={handleChange} rows={5} />
            </div>

            <div className="flex gap-md">
              <button type="submit" className="btn btn-primary btn-lg" style={{ flex: 1 }} disabled={saving}>
                {saving ? 'Saving...' : '💾 Save Changes'}
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

export default EditJob;
