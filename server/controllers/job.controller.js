const Job = require('../models/Job');
const Application = require('../models/Application');

// @desc    Create job listing
// @route   POST /api/jobs
exports.createJob = async (req, res) => {
  try {
    const { title, description, location, salary, type, requirements } = req.body;

    const job = await Job.create({
      title,
      description,
      company: req.user.company || 'Unknown Company',
      location,
      salary: salary || { min: 0, max: 0 },
      type: type || 'Full-time',
      requirements: requirements || [],
      employer: req.user._id
    });

    res.status(201).json({ success: true, job });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Get all jobs (with search & filters)
// @route   GET /api/jobs
exports.getJobs = async (req, res) => {
  try {
    const { search, location, type, minSalary, maxSalary, status, page = 1, limit = 12 } = req.query;

    const query = {};

    // Text search
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Location filter
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    // Job type filter
    if (type) {
      query.type = type;
    }

    // Salary range filter
    if (minSalary) {
      query['salary.min'] = { $gte: parseInt(minSalary) };
    }
    if (maxSalary) {
      query['salary.max'] = { $lte: parseInt(maxSalary) };
    }

    // Status filter (default: open)
    query.status = status || 'open';

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [jobs, total] = await Promise.all([
      Job.find(query)
        .populate('employer', 'name email company')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Job.countDocuments(query)
    ]);

    res.json({
      success: true,
      jobs,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Get single job
// @route   GET /api/jobs/:id
exports.getJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('employer', 'name email company');

    if (!job) {
      return res.status(404).json({ 
        success: false, 
        message: 'Job not found' 
      });
    }

    res.json({ success: true, job });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Update job
// @route   PUT /api/jobs/:id
exports.updateJob = async (req, res) => {
  try {
    let job = await Job.findById(req.params.id);

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
        message: 'Not authorized to update this job' 
      });
    }

    const { title, description, location, salary, type, requirements } = req.body;

    job = await Job.findByIdAndUpdate(
      req.params.id,
      { title, description, location, salary, type, requirements },
      { new: true, runValidators: true }
    ).populate('employer', 'name email company');

    res.json({ success: true, job });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Close job
// @route   PATCH /api/jobs/:id/close
exports.closeJob = async (req, res) => {
  try {
    let job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ 
        success: false, 
        message: 'Job not found' 
      });
    }

    if (job.employer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized' 
      });
    }

    job.status = job.status === 'open' ? 'closed' : 'open';
    await job.save();

    res.json({ success: true, job });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Get employer's jobs
// @route   GET /api/jobs/employer/my-jobs
exports.getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ employer: req.user._id })
      .sort({ createdAt: -1 });

    // Get application counts for each job
    const jobsWithCounts = await Promise.all(
      jobs.map(async (job) => {
        const count = await Application.countDocuments({ job: job._id });
        return { ...job.toObject(), applicationsCount: count };
      })
    );

    res.json({ success: true, jobs: jobsWithCounts });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};
