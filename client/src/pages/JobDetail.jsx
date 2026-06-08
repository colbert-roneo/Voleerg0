import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { HiLocationMarker, HiCurrencyDollar, HiBriefcase, HiCalendar, HiUsers } from 'react-icons/hi';

const JobDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const { data } = await api.get(`/jobs/${id}`);
        setJob(data.job);

        // Check if candidate has already applied
        if (user?.role === 'candidate') {
          try {
            const appsRes = await api.get('/applications/my');
            const applied = appsRes.data.applications.some(app => app.job?._id === id);
            setHasApplied(applied);
          } catch {}
        }
      } catch (error) {
        toast.error('Job not found');
        navigate('/jobs');
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleApply = async (e) => {
    e.preventDefault();
    setApplying(true);

    try {
      await api.post('/applications', { jobId: id, coverLetter });
      toast.success('Application submitted successfully! 🎉');
      setShowApplyModal(false);
      setHasApplied(true);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to apply');
    } finally {
      setApplying(false);
    }
  };

  const formatSalary = (salary) => {
    if (!salary || (!salary.min && !salary.max)) return 'Not specified';
    if (salary.min && salary.max) return `$${salary.min.toLocaleString()} - $${salary.max.toLocaleString()}`;
    if (salary.min) return `From $${salary.min.toLocaleString()}`;
    return `Up to $${salary.max.toLocaleString()}`;
  };

  if (loading) {
    return <div className="loading-container"><div className="spinner" /></div>;
  }

  if (!job) return null;

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: '900px' }}>
        <div className="animate-slideUp">
          {/* Job Header */}
          <div className="glass-card" style={{ marginBottom: '24px' }}>
            <div className="flex-between" style={{ flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '8px' }}>{job.title}</h1>
                <p style={{ color: 'var(--accent-primary)', fontSize: '1.1rem', fontWeight: 600 }}>{job.company}</p>
              </div>
              <span className={`badge badge-${job.status}`} style={{ fontSize: '0.85rem', padding: '8px 20px' }}>
                {job.status === 'open' ? '✅ Open' : '🔴 Closed'}
              </span>
            </div>

            <div className="divider" />

            <div className="job-card-meta" style={{ fontSize: '0.95rem', gap: '24px' }}>
              <span><HiLocationMarker /> {job.location}</span>
              <span><HiCurrencyDollar /> {formatSalary(job.salary)}</span>
              <span><HiBriefcase /> {job.type}</span>
              <span><HiCalendar /> Posted {new Date(job.createdAt).toLocaleDateString()}</span>
              <span><HiUsers /> {job.applicationsCount || 0} applicants</span>
            </div>

            <div className="divider" />

            {/* Apply Button */}
            {user?.role === 'candidate' && job.status === 'open' && (
              <div>
                {hasApplied ? (
                  <button className="btn btn-secondary" disabled style={{ width: '100%' }}>
                    ✅ Already Applied
                  </button>
                ) : (
                  <button className="btn btn-primary btn-lg" style={{ width: '100%' }} onClick={() => setShowApplyModal(true)}>
                    🚀 Apply Now
                  </button>
                )}
              </div>
            )}

            {!user && job.status === 'open' && (
              <button className="btn btn-primary btn-lg" style={{ width: '100%' }} onClick={() => navigate('/login')}>
                Sign In to Apply
              </button>
            )}
          </div>

          {/* Description */}
          <div className="glass-card" style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '1.3rem', marginBottom: '16px' }}>Job Description</h2>
            <div style={{ color: 'var(--text-secondary)', lineHeight: '1.8', whiteSpace: 'pre-wrap' }}>
              {job.description}
            </div>
          </div>

          {/* Requirements */}
          {job.requirements && job.requirements.length > 0 && (
            <div className="glass-card">
              <h2 style={{ fontSize: '1.3rem', marginBottom: '16px' }}>Requirements</h2>
              <ul style={{ paddingLeft: '20px' }}>
                {job.requirements.map((req, i) => (
                  <li key={i} style={{ color: 'var(--text-secondary)', marginBottom: '8px', listStyle: 'disc', lineHeight: '1.6' }}>
                    {req}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Apply Modal */}
        {showApplyModal && (
          <div className="modal-backdrop" onClick={() => setShowApplyModal(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h2>Apply for {job.title}</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>at {job.company}</p>

              <form onSubmit={handleApply}>
                <div className="form-group">
                  <label htmlFor="coverLetter">Cover Letter (Optional)</label>
                  <textarea
                    id="coverLetter"
                    className="form-control"
                    placeholder="Tell the employer why you're a great fit for this role..."
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    rows={6}
                  />
                </div>

                {user?.resume && (
                  <p style={{ color: 'var(--success)', fontSize: '0.9rem', marginBottom: '16px' }}>
                    📄 Your resume will be attached automatically
                  </p>
                )}

                {!user?.resume && (
                  <p style={{ color: 'var(--warning)', fontSize: '0.9rem', marginBottom: '16px' }}>
                    ⚠️ No resume uploaded. Consider uploading one in your profile.
                  </p>
                )}

                <div className="flex gap-md">
                  <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={applying}>
                    {applying ? 'Submitting...' : 'Submit Application'}
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={() => setShowApplyModal(false)}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobDetail;
