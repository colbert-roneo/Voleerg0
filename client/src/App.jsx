import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Import pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Jobs from './pages/Jobs';
import JobDetail from './pages/JobDetail';
import Profile from './pages/Profile';
import CandidateDashboard from './pages/CandidateDashboard';
import MyApplications from './pages/MyApplications';
import EmployerDashboard from './pages/EmployerDashboard';
import CreateJob from './pages/CreateJob';
import EditJob from './pages/EditJob';
import JobApplications from './pages/JobApplications';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Navbar />
          <main className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/jobs/:id" element={<JobDetail />} />

              {/* Shared Protected Routes */}
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />

              {/* Candidate Only Routes */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute roles={['candidate']}>
                    <CandidateDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/my-applications" 
                element={
                  <ProtectedRoute roles={['candidate']}>
                    <MyApplications />
                  </ProtectedRoute>
                } 
              />

              {/* Employer Only Routes */}
              <Route 
                path="/employer/dashboard" 
                element={
                  <ProtectedRoute roles={['employer']}>
                    <EmployerDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/employer/create-job" 
                element={
                  <ProtectedRoute roles={['employer']}>
                    <CreateJob />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/employer/edit-job/:id" 
                element={
                  <ProtectedRoute roles={['employer']}>
                    <EditJob />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/employer/jobs/:id/applications" 
                element={
                  <ProtectedRoute roles={['employer']}>
                    <JobApplications />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
          <Footer />
        </div>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1e1b4b',
              color: '#fff',
              border: '1px solid rgba(99, 102, 241, 0.2)',
            },
          }}
        />
      </Router>
    </AuthProvider>
  );
}

export default App;

