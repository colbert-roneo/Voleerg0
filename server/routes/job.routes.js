const express = require('express');
const router = express.Router();
const { createJob, getJobs, getJob, updateJob, closeJob, getMyJobs } = require('../controllers/job.controller');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');

// Public routes
router.get('/', getJobs);
router.get('/employer/my-jobs', protect, authorize('employer'), getMyJobs);
router.get('/:id', getJob);

// Employer routes
router.post('/', protect, authorize('employer'), createJob);
router.put('/:id', protect, authorize('employer'), updateJob);
router.patch('/:id/close', protect, authorize('employer'), closeJob);

module.exports = router;
