import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { HiLocationMarker, HiCurrencyDollar, HiClock, HiBriefcase, HiSearch } from 'react-icons/hi';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    type: '',
    minSalary: '',
    maxSalary: ''
  });

  const fetchJobs = async (page = 1) => {
    setLoading(true);
    try {
      const params = { page, limit: 12 };
      if (filters.search) params.search = filters.search;
      if (filters.location) params.location = filters.location;
      if (filters.type) params.type = filters.type;
      if (filters.minSalary) params.minSalary = filters.minSalary;
      if (filters.maxSalary) params.maxSalary = filters.maxSalary;

      const { data } = await api.get('/jobs', { params });
      setJobs(data.jobs);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs(1);
  };

  const handleClear = () => {
    setFilters({ search: '', location: '', type: '', minSalary: '', maxSalary: '' });
    setTimeout(() => fetchJobs(1), 0);
  };

  const formatSalary = (salary) => {
    if (!salary || (!salary.min && !salary.max)) return 'Not specified';
    if (salary.min && salary.max) return `$${salary.min.toLocaleString()} - $${salary.max.toLocaleString()}`;
    if (salary.min) return `From $${salary.min.toLocaleString()}`;
    return `Up to $${salary.max.toLocaleString()}`;
  };

  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`;
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="page">
      <div className="container">
        <div className="page-header animate-fadeIn">
          <h1>Explore Opportunities</h1>
          <p>Discover {pagination.total} open positions waiting for you</p>
        </div>

        {/* Search & Filters */}
        <form onSubmit={handleSearch} className="search-bar animate-slideUp">
          <div className="search-bar-row">
            <input
              type="text"
              className="form-control"
              placeholder="🔍 Search by title, company, or keywords..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
            <input
              type="text"
              className="form-control"
              placeholder="📍 Location"
              value={filters.location}
              onChange={(e) => setFilters({ ...filters, location: e.target.value })}
              style={{ maxWidth: '200px' }}
            />
            <select
              className="form-control"
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              style={{ maxWidth: '180px' }}
            >
              <option value="">All Types</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
              <option value="Remote">Remote</option>
            </select>
          </div>
          <div className="search-bar-row" style={{ marginTop: '12px' }}>
            <input
              type="number"
              className="form-control"
              placeholder="Min Salary ($)"
              value={filters.minSalary}
              onChange={(e) => setFilters({ ...filters, minSalary: e.target.value })}
              style={{ maxWidth: '180px' }}
            />
            <input
              type="number"
              className="form-control"
              placeholder="Max Salary ($)"
              value={filters.maxSalary}
              onChange={(e) => setFilters({ ...filters, maxSalary: e.target.value })}
              style={{ maxWidth: '180px' }}
            />
            <button type="submit" className="btn btn-primary">
              <HiSearch /> Search
            </button>
            <button type="button" className="btn btn-secondary" onClick={handleClear}>
              Clear
            </button>
          </div>
        </form>

        {/* Jobs Grid */}
        {loading ? (
          <div className="loading-container">
            <div className="spinner" />
          </div>
        ) : jobs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <h3>No jobs found</h3>
            <p>Try adjusting your search filters or check back later for new opportunities.</p>
          </div>
        ) : (
          <>
            <div className="grid-3">
              {jobs.map((job, i) => (
                <Link to={`/jobs/${job._id}`} key={job._id}>
                  <div className="job-card" style={{ animationDelay: `${i * 0.05}s` }}>
                    <div className="job-card-header">
                      <div>
                        <div className="job-card-title">{job.title}</div>
                        <div className="job-card-company">{job.company}</div>
                      </div>
                      <span className={`badge badge-${job.type?.toLowerCase().replace('-', '')}`} style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', flexShrink: 0 }}>
                        {job.type}
                      </span>
                    </div>

                    <div className="job-card-meta">
                      <span><HiLocationMarker /> {job.location}</span>
                      <span><HiClock /> {timeAgo(job.createdAt)}</span>
                    </div>

                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: '1.5', flex: 1 }}>
                      {job.description?.substring(0, 120)}...
                    </p>

                    <div className="job-card-footer">
                      <span className="job-card-salary">
                        <HiCurrencyDollar style={{ verticalAlign: 'middle' }} /> {formatSalary(job.salary)}
                      </span>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                        {job.applicationsCount || 0} applicants
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="pagination">
                <button
                  disabled={pagination.page === 1}
                  onClick={() => fetchJobs(pagination.page - 1)}
                >
                  ← Previous
                </button>
                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    className={pagination.page === p ? 'active' : ''}
                    onClick={() => fetchJobs(p)}
                  >
                    {p}
                  </button>
                ))}
                <button
                  disabled={pagination.page === pagination.pages}
                  onClick={() => fetchJobs(pagination.page + 1)}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Jobs;
