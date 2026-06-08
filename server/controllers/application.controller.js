const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User');
const { sendEmail, getStatusEmailHtml } = require('../utils/sendEmail');

// @desc    Apply for a job
// @route   POST /api/applications
exports.applyForJob = async (req, res) => {
  try {
    const { jobId, coverLetter } = req.body;

    // Check job exists and is open
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ 
        success: false, 
        message: 'Job not found' 
      });
    }

    if (job.status !== 'open') {
      return res.status(400).json({ 
        success: false, 
        message: 'This job is no longer accepting applications' 
      });
    }

    // Check if already applied
    const existingApplication = await Application.findOne({
      job: jobId,
      candidate: req.user._id
    });

    if (existingApplication) {
      return res.status(400).json({ 
        success: false, 
        message: 'You have already applied for this job' 
      });
    }

    // Create application
    const application = await Application.create({
      job: jobId,
      candidate: req.user._id,
      coverLetter,
      resume: req.user.resume || '',
      status: 'Applied',
      statusHistory: [{
        status: 'Applied',
        date: new Date(),
        note: 'Application submitted'
      }]
    });

    // Increment application count
    await Job.findByIdAndUpdate(jobId, { $inc: { applicationsCount: 1 } });

    // Send confirmation email to candidate
    const html = getStatusEmailHtml(
      req.user.name,
      job.title,
      job.company,
      'Applied',
      'Your application has been submitted successfully.'
    );

    await sendEmail({
      email: req.user.email,
      subject: `Application Submitted - ${job.title} at ${job.company}`,
      html
    });

    const populatedApp = await Application.findById(application._id)
      .populate('job', 'title company location type salary')
      .populate('candidate', 'name email');

    res.status(201).json({ success: true, application: populatedApp });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ 
        success: false, 
        message: 'You have already applied for this job' 
      });
    }
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Get candidate's applications
// @route   GET /api/applications/my
exports.getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ candidate: req.user._id })
      .populate('job', 'title company location type salary status')
      .sort({ appliedAt: -1 });

    res.json({ success: true, applications });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Get applicants for a job (employer)
// @route   GET /api/applications/job/:jobId
exports.getJobApplications = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    
    if (!job) {
      return res.status(404).json({ 
        success: false, 
        message: 'Job not found' 
      });
    }

    // Check ownership
    if (job.employer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to view these applications' 
      });
    }

    const applications = await Application.find({ job: req.params.jobId })
      .populate('candidate', 'name email phone skills bio resume')
      .sort({ appliedAt: -1 });

    res.json({ success: true, applications, job });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Update application status (employer)
// @route   PATCH /api/applications/:id/status
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status, note } = req.body;

    const validStatuses = ['Applied', 'Reviewing', 'Shortlisted', 'Interview', 'Offered', 'Rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid status' 
      });
    }

    const application = await Application.findById(req.params.id)
      .populate('job')
      .populate('candidate', 'name email');

    if (!application) {
      return res.status(404).json({ 
        success: false, 
        message: 'Application not found' 
      });
    }

    // Check employer owns the job
    if (application.job.employer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to update this application' 
      });
    }

    // Update status
    application.status = status;
    application.statusHistory.push({
      status,
      date: new Date(),
      note: note || `Status updated to ${status}`
    });

    await application.save();

    // Send email notification
    const html = getStatusEmailHtml(
      application.candidate.name,
      application.job.title,
      application.job.company,
      status,
      note
    );

    await sendEmail({
      email: application.candidate.email,
      subject: `Application Update - ${application.job.title} at ${application.job.company}`,
      html
    });

    const updatedApp = await Application.findById(req.params.id)
      .populate('job', 'title company location type salary')
      .populate('candidate', 'name email phone skills bio resume');

    res.json({ success: true, application: updatedApp });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};
