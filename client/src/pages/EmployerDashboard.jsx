import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';

const EmployerDashboard = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const { data } = await api.get('/jobs/employer/my-jobs');
      setJobs(data.jobs);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (jobId) => {
    try {
      await api.patch(`/jobs/${jobId}/close`);
      toast.success('Job status updated');
      fetchJobs();
    } catch (error) {
      toast.error('Failed to update job status');
    }
  };

  const stats = {
    total: jobs.length,
    open: jobs.filter(j => j.status === 'open').length,
    closed: jobs.filter(j => j.status === 'closed').length,
    totalApplicants: jobs.reduce((sum, j) => sum + (j.applicationsCount || 0), 0)
  };

  return (
    <div className="page">
      <div className="container">
        <div className="dashboard-header animate-fadeIn">
          <div>
            <h1>Employer Dashboard 🏢</h1>
            <p className="welcome-text">Welcome back, {user?.name}! Manage your job listings here.</p>
          </div>
          <Link to="/employer/create-job" className="btn btn-primary">
            ➕ Post New Job
          </Link>
        </div>

        {/* Stats */}
        <div className="stats-grid animate-slideUp">
          <div className="stat-card">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total Jobs</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ background: 'linear-gradient(135deg, #10b981, #34d399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{stats.open}</div>
            <div className="stat-label">Open</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ background: 'linear-gradient(135deg, #ef4444, #f87171)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{stats.closed}</div>
            <div className="stat-label">Closed</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ background: 'linear-gradient(135deg, #f59e0b, #fbbf24)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{stats.totalApplicants}</div>
            <div className="stat-label">Total Applicants</div>
          </div>
        </div>

        {/* Jobs List */}
        <div className="animate-slideUp">
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '20px' }}>Your Job Listings</h2>

          {loading ? (
            <div className="loading-container"><div className="spinner" /></div>
          ) : jobs.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📝</div>
              <h3>No jobs posted yet</h3>
              <p>Create your first job listing to start receiving applications.</p>
              <Link to="/employer/create-job" className="btn btn-primary">Post a Job</Link>
            </div>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Location</th>
                    <th>Type</th>
                    <th>Applicants</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map(job => (
                    <tr key={job._id}>
                      <td style={{ fontWeight: 600 }}>{job.title}</td>
                      <td style={{ color: 'var(--text-secondary)' }}>{job.location}</td>
                      <td>
                        <span className="badge" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' }}>
                          {job.type}
                        </span>
                      </td>
                      <td>
                        <Link to={`/employer/jobs/${job._id}/applications`} style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>
                          {job.applicationsCount || 0} applicants
                        </Link>
                      </td>
                      <td>
                        <span className={`badge badge-${job.status}`}>
                          {job.status}
                        </span>
                      </td>
                      <td>
                        <div className="flex gap-sm">
                          <Link to={`/employer/edit-job/${job._id}`} className="btn btn-secondary btn-sm">
                            Edit
                          </Link>
                          <button
                            className={`btn btn-sm ${job.status === 'open' ? 'btn-danger' : 'btn-success'}`}
                            onClick={() => handleToggleStatus(job._id)}
                          >
                            {job.status === 'open' ? 'Close' : 'Reopen'}
                          </button>
                        </div>
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

export default EmployerDashboard;
