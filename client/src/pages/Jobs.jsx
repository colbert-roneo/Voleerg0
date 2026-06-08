import { useState, useEffect } from 'react';
import api from '../api/axios';
import JobCard from '../components/JobCard';
import SearchFilters from '../components/SearchFilters';

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

  return (
    <div className="page">
      <div className="container">
        <div className="page-header animate-fadeIn">
          <h1>Explore Opportunities</h1>
          <p>Discover {pagination.total} open positions waiting for you</p>
        </div>

        {/* Search & Filters */}
        <SearchFilters 
          filters={filters} 
          onChange={setFilters} 
          onSubmit={handleSearch} 
          onClear={handleClear} 
        />

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
                <JobCard key={job._id} job={job} index={i} />
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

