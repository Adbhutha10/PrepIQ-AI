const User = require('../models/User.model');
const Session = require('../models/Session.model');
const AppError = require('../utils/AppError');

// ─── GET /api/users/profile ───────────────────────────────────────
exports.getProfile = async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate({ path: 'resumes', select: 'fileName originalName isDefault parseStatus createdAt' });

  res.status(200).json({ success: true, user });
};

// ─── PUT /api/users/profile ───────────────────────────────────────
exports.updateProfile = async (req, res, next) => {
  const {
    name,
    avatar,
    headline,
    bio,
    phone,
    location,
    targetRole,
    experienceLevel,
    skills,
    github,
    linkedin,
    portfolio,
  } = req.body;

  const allowedFields = {};
  if (name !== undefined) allowedFields.name = name;
  if (avatar !== undefined) allowedFields.avatar = avatar;
  if (headline !== undefined) allowedFields.headline = headline;
  if (bio !== undefined) allowedFields.bio = bio;
  if (phone !== undefined) allowedFields.phone = phone;
  if (location !== undefined) allowedFields.location = location;
  if (targetRole !== undefined) allowedFields.targetRole = targetRole;
  if (experienceLevel !== undefined) allowedFields.experienceLevel = experienceLevel;
  if (github !== undefined) allowedFields.github = github;
  if (linkedin !== undefined) allowedFields.linkedin = linkedin;
  if (portfolio !== undefined) allowedFields.portfolio = portfolio;

  if (skills !== undefined) {
    if (Array.isArray(skills)) {
      allowedFields.skills = skills.map((s) => String(s).trim()).filter(Boolean);
    } else if (typeof skills === 'string') {
      allowedFields.skills = skills.split(',').map((s) => s.trim()).filter(Boolean);
    } else {
      allowedFields.skills = [];
    }
  }

  const user = await User.findByIdAndUpdate(req.user._id, allowedFields, {
    new: true,
    runValidators: true,
  }).populate({ path: 'resumes', select: 'fileName originalName isDefault parseStatus createdAt' });

  res.status(200).json({ success: true, user });
};

// ─── PUT /api/users/change-password ───────────────────────────────
exports.changePassword = async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select('+password');
  if (!(await user.comparePassword(currentPassword))) {
    return next(new AppError('Current password is incorrect.', 401));
  }

  user.password = newPassword;
  user.passwordChangedAt = new Date();
  await user.save();

  res.status(200).json({ success: true, message: 'Password updated successfully.' });
};

// ─── GET /api/users/dashboard ─────────────────────────────────────
exports.getDashboard = async (req, res) => {
  const userId = req.user._id;

  const [totalSessions, completedSessions, recentSessions] = await Promise.all([
    Session.countDocuments({ userId }),
    Session.countDocuments({ userId, status: 'completed' }),
    Session.find({ userId, status: 'completed' })
      .sort('-createdAt')
      .limit(5)
      .populate({ path: 'interviewId', select: 'jobTitle company experienceLevel' }),
  ]);

  const scoreAgg = await Session.aggregate([
    { $match: { userId, status: 'completed', overallScore: { $ne: null } } },
    { $group: { _id: null, avgScore: { $avg: '$overallScore' }, maxScore: { $max: '$overallScore' } } },
  ]);

  const historicalSessions = await Session.find({ userId, status: 'completed', overallScore: { $ne: null } })
    .sort('createdAt')
    .limit(10)
    .select('overallScore createdAt');

  res.status(200).json({
    success: true,
    data: {
      totalSessions,
      completedSessions,
      averageScore: scoreAgg[0]?.avgScore?.toFixed(1) ?? 0,
      bestScore: scoreAgg[0]?.maxScore ?? 0,
      recentSessions,
      historicalSessions,
    },
  });
};
