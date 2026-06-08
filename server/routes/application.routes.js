const express = require('express');
const router = express.Router();
const { applyForJob, getMyApplications, getJobApplications, updateApplicationStatus } = require('../controllers/application.controller');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');

// Candidate routes
router.post('/', protect, authorize('candidate'), applyForJob);
router.get('/my', protect, authorize('candidate'), getMyApplications);

// Employer routes
router.get('/job/:jobId', protect, authorize('employer'), getJobApplications);
router.patch('/:id/status', protect, authorize('employer'), updateApplicationStatus);

module.exports = router;
