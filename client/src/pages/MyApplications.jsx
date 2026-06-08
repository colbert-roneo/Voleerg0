import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const { data } = await api.get('/applications/my');
        setApplications(data.applications);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const formatSalary = (salary) => {
    if (!salary || (!salary.min && !salary.max)) return 'Not specified';
    if (salary.min && salary.max) return `$${salary.min.toLocaleString()} - $${salary.max.toLocaleString()}`;
    if (salary.min) return `From $${salary.min.toLocaleString()}`;
    return `Up to $${salary.max.toLocaleString()}`;
  };

  return (
    <div className="page">
      <div className="container">
        <div className="page-header animate-fadeIn">
          <h1>My Applications</h1>
          <p>Track the progress of all your job applications</p>
        </div>

        {loading ? (
          <div className="loading-container"><div className="spinner" /></div>
        ) : applications.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3>No applications yet</h3>
            <p>Browse open positions and start applying!</p>
            <Link to="/jobs" className="btn btn-primary">Browse Jobs</Link>
          </div>
        ) : (
          <div className="grid-2" style={{ alignItems: 'start' }}>
            {/* Applications List */}
            <div>
              {applications.map(app => (
                <div
                  key={app._id}
                  className="glass-card"
                  style={{ 
                    marginBottom: '16px', 
                    cursor: 'pointer',
                    borderColor: selectedApp?._id === app._id ? 'var(--accent-primary)' : 'var(--border)'
                  }}
                  onClick={() => setSelectedApp(app)}
                >
                  <div className="flex-between">
                    <div>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '4px' }}>
                        {app.job?.title || 'Position Removed'}
                      </h3>
                      <p style={{ color: 'var(--accent-primary)', fontSize: '0.9rem' }}>
                        {app.job?.company || '-'}
                      </p>
                    </div>
                    <span className={`badge badge-${app.status.toLowerCase()}`}>
                      {app.status}
                    </span>
                  </div>

                  <div className="job-card-meta" style={{ marginTop: '12px' }}>
                    <span>📍 {app.job?.location || '-'}</span>
                    <span>💰 {formatSalary(app.job?.salary)}</span>
                    <span>📅 {new Date(app.appliedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Application Detail / Timeline */}
            <div>
              {selectedApp ? (
                <div className="glass-card" style={{ position: 'sticky', top: '96px' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '4px' }}>
                    {selectedApp.job?.title}
                  </h3>
                  <p style={{ color: 'var(--accent-primary)', marginBottom: '20px' }}>
                    {selectedApp.job?.company}
                  </p>

                  <div className="flex-between mb-2">
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Current Status</span>
                    <span className={`badge badge-${selectedApp.status.toLowerCase()}`} style={{ fontSize: '0.85rem', padding: '6px 16px' }}>
                      {selectedApp.status}
                    </span>
                  </div>

                  <div className="divider" />

                  <h4 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '16px', color: 'var(--text-secondary)' }}>
                    Status History
                  </h4>

                  <div className="timeline">
                    {selectedApp.statusHistory?.map((entry, i) => (
                      <div key={i} className="timeline-item">
                        <div className="timeline-status">{entry.status}</div>
                        <div className="timeline-date">
                          {new Date(entry.date).toLocaleString()}
                        </div>
                        {entry.note && (
                          <div className="timeline-note">{entry.note}</div>
                        )}
                      </div>
                    ))}
                  </div>

                  {selectedApp.coverLetter && (
                    <>
                      <div className="divider" />
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '8px', color: 'var(--text-secondary)' }}>
                        Cover Letter
                      </h4>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                        {selectedApp.coverLetter}
                      </p>
                    </>
                  )}

                  <div className="mt-3">
                    <Link to={`/jobs/${selectedApp.job?._id}`} className="btn btn-outline" style={{ width: '100%' }}>
                      View Job Posting →
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="glass-card" style={{ textAlign: 'center', padding: '60px 20px' }}>
                  <p style={{ color: 'var(--text-muted)' }}>
                    👈 Select an application to view details
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyApplications;
