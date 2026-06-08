import React from 'react';
import { HiSearch } from 'react-icons/hi';

const SearchFilters = ({ filters, onChange, onSubmit, onClear }) => {
  return (
    <form onSubmit={onSubmit} className="search-bar animate-slideUp">
      <div className="search-bar-row">
        <input
          type="text"
          className="form-control"
          placeholder="🔍 Search by title, company, or keywords..."
          value={filters.search}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
        />
        <input
          type="text"
          className="form-control"
          placeholder="📍 Location"
          value={filters.location}
          onChange={(e) => onChange({ ...filters, location: e.target.value })}
          style={{ maxWidth: '200px' }}
        />
        <select
          className="form-control"
          value={filters.type}
          onChange={(e) => onChange({ ...filters, type: e.target.value })}
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
          onChange={(e) => onChange({ ...filters, minSalary: e.target.value })}
          style={{ maxWidth: '180px' }}
        />
        <input
          type="number"
          className="form-control"
          placeholder="Max Salary ($)"
          value={filters.maxSalary}
          onChange={(e) => onChange({ ...filters, maxSalary: e.target.value })}
          style={{ maxWidth: '180px' }}
        />
        <button type="submit" className="btn btn-primary">
          <HiSearch /> Search
        </button>
        <button type="button" className="btn btn-secondary" onClick={onClear}>
          Clear
        </button>
      </div>
    </form>
  );
};

export default SearchFilters;
