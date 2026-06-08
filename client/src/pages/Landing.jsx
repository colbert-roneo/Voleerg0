import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiSearch, HiBriefcase, HiChartBar, HiMail, HiShieldCheck, HiLightningBolt } from 'react-icons/hi';

const Landing = () => {
  const { user } = useAuth();

  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h1 className="animate-fadeIn">
            Find Your <span className="highlight">Dream Career</span><br />
            Start Today
          </h1>
          <p className="animate-slideUp">
            Connect with top employers, discover exciting opportunities, and track your
            applications — all in one powerful platform built for modern job seekers.
          </p>
          <div className="hero-buttons animate-slideUp">
            {!user ? (
              <>
                <Link to="/register" className="btn btn-primary btn-lg">
                  🚀 Get Started Free
                </Link>
                <Link to="/jobs" className="btn btn-secondary btn-lg">
                  Browse Jobs
                </Link>
              </>
            ) : user.role === 'candidate' ? (
              <>
                <Link to="/jobs" className="btn btn-primary btn-lg">
                  🔍 Browse Jobs
                </Link>
                <Link to="/dashboard" className="btn btn-secondary btn-lg">
                  My Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link to="/employer/create-job" className="btn btn-primary btn-lg">
                  📝 Post a Job
                </Link>
                <Link to="/employer/dashboard" className="btn btn-secondary btn-lg">
                  My Dashboard
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2>Why Choose <span style={{ background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Voleergo</span>?</h2>
          <div className="grid-3">
            <div className="feature-card animate-slideUp" style={{ animationDelay: '0.1s' }}>
              <div className="feature-icon">🔍</div>
              <h3>Smart Search</h3>
              <p>Filter jobs by role, location, salary range, and type. Find the perfect match instantly.</p>
            </div>
            <div className="feature-card animate-slideUp" style={{ animationDelay: '0.2s' }}>
              <div className="feature-icon">📊</div>
              <h3>Track Applications</h3>
              <p>Monitor every application from submission to offer with real-time status updates.</p>
            </div>
            <div className="feature-card animate-slideUp" style={{ animationDelay: '0.3s' }}>
              <div className="feature-icon">📧</div>
              <h3>Email Notifications</h3>
              <p>Receive instant email updates when your application status changes.</p>
            </div>
            <div className="feature-card animate-slideUp" style={{ animationDelay: '0.4s' }}>
              <div className="feature-icon">🛡️</div>
              <h3>Secure Platform</h3>
              <p>Your data is protected with JWT authentication and encrypted passwords.</p>
            </div>
            <div className="feature-card animate-slideUp" style={{ animationDelay: '0.5s' }}>
              <div className="feature-icon">⚡</div>
              <h3>Employer Dashboard</h3>
              <p>Post jobs, manage listings, review candidates, and update application statuses.</p>
            </div>
            <div className="feature-card animate-slideUp" style={{ animationDelay: '0.6s' }}>
              <div className="feature-icon">📄</div>
              <h3>Resume Upload</h3>
              <p>Upload and manage your resume directly on the platform for quick applications.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '80px 0', textAlign: 'center' }}>
        <div className="container">
          <div className="glass-card" style={{ maxWidth: '700px', margin: '0 auto', padding: '48px' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '16px' }}>
              Ready to Take the Next Step?
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '1.05rem' }}>
              Join thousands of professionals who found their dream job through Voleergo.
            </p>
            {!user && (
              <Link to="/register" className="btn btn-primary btn-lg">
                Create Your Account →
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
