import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { HiBriefcase, HiDocumentText, HiCheckCircle, HiClock } from 'react-icons/hi';

const CandidateDashboard = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const stats = {
    total: applications.length,
    applied: applications.filter(a => a.status === 'Applied').length,
    reviewing: applications.filter(a => ['Reviewing', 'Shortlisted', 'Interview'].includes(a.status)).length,
    offered: applications.filter(a => a.status === 'Offered').length,
    rejected: applications.filter(a => a.status === 'Rejected').length
  };

  return (
    <div className="page">
      <div className="container">
        <div className="dashboard-header animate-fadeIn">
          <div>
            <h1>Welcome, {user?.name}! 👋</h1>
            <p className="welcome-text">Here's an overview of your job search progress</p>
          </div>
          <Link to="/jobs" className="btn btn-primary">
            🔍 Browse Jobs
          </Link>
        </div>

        {/* Stats */}
        <div className="stats-grid animate-slideUp">
          <div className="stat-card">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total Applications</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ background: 'linear-gradient(135deg, #3b82f6, #60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{stats.applied}</div>
            <div className="stat-label">Applied</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ background: 'linear-gradient(135deg, #f59e0b, #fbbf24)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{stats.reviewing}</div>
            <div className="stat-label">In Progress</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ background: 'linear-gradient(135deg, #10b981, #34d399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{stats.offered}</div>
            <div className="stat-label">Offers</div>
          </div>
        </div>

        {/* Recent Applications */}
        <div className="animate-slideUp">
          <div className="flex-between mb-3">
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700 }}>Recent Applications</h2>
            <Link to="/my-applications" className="btn btn-outline btn-sm">View All →</Link>
          </div>

          {loading ? (
            <div className="loading-container"><div className="spinner" /></div>
          ) : applications.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <h3>No applications yet</h3>
              <p>Start browsing jobs and submit your first application!</p>
              <Link to="/jobs" className="btn btn-primary">Browse Jobs</Link>
            </div>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Position</th>
                    <th>Company</th>
                    <th>Status</th>
                    <th>Applied</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.slice(0, 5).map(app => (
                    <tr key={app._id}>
                      <td style={{ fontWeight: 600 }}>
                        <Link to={`/jobs/${app.job?._id}`} style={{ color: 'var(--text-primary)' }}>
                          {app.job?.title || 'Position Removed'}
                        </Link>
                      </td>
                      <td style={{ color: 'var(--accent-primary)' }}>{app.job?.company || '-'}</td>
                      <td>
                        <span className={`badge badge-${app.status.toLowerCase()}`}>
                          {app.status}
                        </span>
                      </td>
                      <td style={{ color: 'var(--text-muted)' }}>
                        {new Date(app.appliedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CandidateDashboard;
