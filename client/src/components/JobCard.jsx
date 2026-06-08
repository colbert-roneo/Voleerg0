import React from 'react';
import { Link } from 'react-router-dom';
import { HiLocationMarker, HiCurrencyDollar, HiClock } from 'react-icons/hi';

const JobCard = ({ job, index }) => {
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
    <Link to={`/jobs/${job._id}`}>
      <div className="job-card" style={{ animationDelay: `${index * 0.05}s` }}>
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
  );
};

export default JobCard;
