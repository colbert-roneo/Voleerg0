import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';

const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

const JobApplications = () => {
  const { jobId } = useParams();
  const [applications, setApplications] = useState([]);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [statusModal, setStatusModal] = useState(null);
  const [statusNote, setStatusNote] = useState('');
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    fetchApplications();
  }, [jobId]);

  const fetchApplications = async () => {
    try {
      const { data } = await api.get(`/applications/job/${jobId}`);
      setApplications(data.applications);
      setJob(data.job);
    } catch (error) {
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (appId) => {
    if (!newStatus) return toast.error('Please select a status');
    
    setUpdating(appId);
    try {
      await api.patch(`/applications/${appId}/status`, {
        status: newStatus,
        note: statusNote
      });
      toast.success(`Status updated to ${newStatus}`);
      setStatusModal(null);
      setStatusNote('');
      setNewStatus('');
      fetchApplications();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdating(null);
    }
  };

  const statuses = ['Applied', 'Reviewing', 'Shortlisted', 'Interview', 'Offered', 'Rejected'];

  if (loading) {
    return <div className="loading-container"><div className="spinner" /></div>;
  }

  return (
    <div className="page">
      <div className="container">
        <div className="page-header animate-fadeIn">
          <h1>Applications for {job?.title}</h1>
          <p>{applications.length} candidate(s) have applied</p>
        </div>

        <Link to="/employer/dashboard" className="btn btn-secondary btn-sm mb-3" style={{ display: 'inline-flex' }}>
          ← Back to Dashboard
        </Link>

        {applications.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">👥</div>
            <h3>No applicants yet</h3>
            <p>Share your job posting to attract candidates.</p>
          </div>
        ) : (
          <div className="animate-slideUp">
            {applications.map(app => (
              <div key={app._id} className="glass-card" style={{ marginBottom: '16px' }}>
                <div className="flex-between" style={{ flexWrap: 'wrap', gap: '16px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '4px' }}>
                      {app.candidate?.name || 'Unknown'}
                    </h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                      {app.candidate?.email}
                    </p>
                    {app.candidate?.phone && (
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        📞 {app.candidate.phone}
                      </p>
                    )}
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span className={`badge badge-${app.status.toLowerCase()}`} style={{ fontSize: '0.85rem', padding: '6px 16px' }}>
                      {app.status}
                    </span>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '4px' }}>
                      Applied: {new Date(app.appliedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Skills */}
                {app.candidate?.skills?.length > 0 && (
                  <div style={{ marginTop: '12px' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Skills: </span>
                    {app.candidate.skills.map((skill, i) => (
                      <span key={i} className="badge" style={{ background: 'rgba(99, 102, 241, 0.1)', color: '#a5b4fc', marginRight: '6px', marginBottom: '4px' }}>
                        {skill}
                      </span>
                    ))}
                  </div>
                )}

                {/* Cover Letter */}
                {app.coverLetter && (
                  <div style={{ marginTop: '12px', padding: '12px', background: 'var(--bg-input)', borderRadius: 'var(--radius-md)' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600 }}>Cover Letter:</span>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px', lineHeight: '1.6' }}>
                      {app.coverLetter}
                    </p>
                  </div>
                )}

                <div className="divider" />

                <div className="flex gap-sm" style={{ flexWrap: 'wrap' }}>
                  {app.candidate?.resume && (
                    <a href={`${API_BASE}${app.candidate.resume}`} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm">
                      📄 View Resume
                    </a>
                  )}
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => {
                      setStatusModal(app._id);
                      setNewStatus(app.status);
                    }}
                  >
                    ✏️ Update Status
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Status Update Modal */}
        {statusModal && (
          <div className="modal-backdrop" onClick={() => setStatusModal(null)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h2>Update Application Status</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
                The candidate will be notified via email.
              </p>

              <div className="form-group">
                <label htmlFor="status-select">New Status</label>
                <select
                  id="status-select"
                  className="form-control"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                >
                  {statuses.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="status-note">Note (Optional)</label>
                <textarea
                  id="status-note"
                  className="form-control"
                  placeholder="Add a note for the candidate..."
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="flex gap-md">
                <button
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                  onClick={() => handleStatusUpdate(statusModal)}
                  disabled={updating === statusModal}
                >
                  {updating === statusModal ? 'Updating...' : 'Update & Notify'}
                </button>
                <button className="btn btn-secondary" onClick={() => setStatusModal(null)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobApplications;
