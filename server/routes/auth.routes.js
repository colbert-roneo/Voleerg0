const express = require('express');
const router = express.Router();
const { register, login, getMe, updateProfile, uploadResume } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');
const upload = require('../middleware/upload');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/resume', protect, authorize('candidate'), upload.single('resume'), uploadResume);

module.exports = router;
