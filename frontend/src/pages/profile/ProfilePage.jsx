import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Lock,
  Save,
  Loader2,
  CheckCircle,
  Briefcase,
  MapPin,
  Phone,
  Globe,
  Github,
  Linkedin,
  Sparkles,
  Shield,
  Layers,
  FileText,
} from 'lucide-react';
import { userAPI } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

const EXPERIENCE_LEVELS = [
  { value: 'entry', label: 'Entry Level (0 - 2 yrs)' },
  { value: 'mid', label: 'Mid Level (2 - 5 yrs)' },
  { value: 'senior', label: 'Senior Level (5 - 8 yrs)' },
  { value: 'lead', label: 'Lead / Principal (8+ yrs)' },
  { value: 'executive', label: 'Director / Executive' },
];

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingPwd, setSavingPwd] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      headline: user?.headline || '',
      targetRole: user?.targetRole || '',
      experienceLevel: user?.experienceLevel || 'mid',
      phone: user?.phone || '',
      location: user?.location || '',
      bio: user?.bio || '',
      skills: Array.isArray(user?.skills) ? user.skills.join(', ') : '',
      github: user?.github || '',
      linkedin: user?.linkedin || '',
      portfolio: user?.portfolio || '',
    },
  });

  const watchedSkills = watch('skills');
  const parsedSkillBadges = (watchedSkills || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  const {
    register: regPwd,
    handleSubmit: handlePwd,
    watch: watchPwd,
    reset: resetPwd,
    formState: { errors: pwdErrors },
  } = useForm();
  const newPassword = watchPwd('newPassword');

  // Load fresh profile details on mount
  useEffect(() => {
    let isMounted = true;
    const fetchProfile = async () => {
      try {
        const { data } = await userAPI.getProfile();
        if (data?.user && isMounted) {
          updateUser(data.user);
          reset({
            name: data.user.name || '',
            email: data.user.email || '',
            headline: data.user.headline || '',
            targetRole: data.user.targetRole || '',
            experienceLevel: data.user.experienceLevel || 'mid',
            phone: data.user.phone || '',
            location: data.user.location || '',
            bio: data.user.bio || '',
            skills: Array.isArray(data.user.skills) ? data.user.skills.join(', ') : '',
            github: data.user.github || '',
            linkedin: data.user.linkedin || '',
            portfolio: data.user.portfolio || '',
          });
        }
      } catch (err) {
        console.warn('Could not fetch fresh profile:', err?.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchProfile();
    return () => {
      isMounted = false;
    };
  }, [reset, updateUser]);

  const onProfileSave = async (formData) => {
    setSaving(true);
    try {
      const payload = {
        name: formData.name,
        headline: formData.headline,
        targetRole: formData.targetRole,
        experienceLevel: formData.experienceLevel,
        phone: formData.phone,
        location: formData.location,
        bio: formData.bio,
        skills: formData.skills
          ? formData.skills.split(',').map((s) => s.trim()).filter(Boolean)
          : [],
        github: formData.github,
        linkedin: formData.linkedin,
        portfolio: formData.portfolio,
      };

      const { data: res } = await userAPI.updateProfile(payload);
      if (res?.user) {
        updateUser(res.user);
      }
      toast.success('Profile details saved successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const onPasswordSave = async (data) => {
    setSavingPwd(true);
    try {
      await userAPI.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      toast.success('Password updated successfully!');
      resetPwd();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Password update failed');
    } finally {
      setSavingPwd(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-12">
      {/* ── User Overview Banner Card ────────────────────────────────────── */}
      <div className="card p-6 md:p-8 bg-gradient-to-br from-white via-indigo-50/20 to-purple-50/20">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 text-white font-display font-bold text-3xl flex items-center justify-center shadow-lg shadow-indigo-100 flex-shrink-0">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-display font-bold text-slate-900">
                  {user?.name || 'Your Profile'}
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 capitalize">
                  <Shield className="w-3 h-3" />
                  {user?.role || 'candidate'}
                </span>
              </div>
              <p className="text-slate-500 text-sm mt-0.5">
                {user?.headline || user?.targetRole || 'Ready to ace your next technical interview'}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-2">
                {user?.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {user.location}
                  </span>
                )}
                {user?.email && (
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    {user.email}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                  <span className="capitalize">{user?.experienceLevel || 'mid'} Level</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-200">
            <span className="text-xs text-slate-400">Total Practice Sessions</span>
            <span className="text-2xl font-bold font-display text-indigo-600">
              {user?.totalSessions ?? 0}
            </span>
          </div>
        </div>
      </div>

      {/* ── Navigation Tabs ──────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-1 overflow-x-auto">
        {[
          { id: 'profile', label: 'Professional Profile', icon: User },
          { id: 'contact', label: 'Contact & Links', icon: Globe },
          { id: 'security', label: 'Security & Password', icon: Lock },
          { id: 'account', label: 'Account Summary', icon: Layers },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setActiveTab(id)}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all whitespace-nowrap ${
              activeTab === id
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* ── Tab 1: Professional Profile ───────────────────────────────────── */}
      {activeTab === 'profile' && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6 md:p-8"
        >
          <div className="mb-6 pb-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-indigo-600" />
                Career & Role Alignment
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                These fields help the AI customize mock interviews specifically to your target roles and experience.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onProfileSave)} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. John Doe"
                  {...register('name', { required: 'Name is required' })}
                />
                {errors.name && <p className="form-error">{errors.name.message}</p>}
              </div>

              <div>
                <label className="form-label">Target Role / Job Title</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Senior Frontend Engineer"
                  {...register('targetRole')}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="form-label">Professional Headline</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Full-Stack Developer specializing in React, Node.js & Cloud"
                  {...register('headline')}
                />
              </div>

              <div>
                <label className="form-label">Experience Level</label>
                <select className="form-input" {...register('experienceLevel')}>
                  {EXPERIENCE_LEVELS.map((lvl) => (
                    <option key={lvl.value} value={lvl.value}>
                      {lvl.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="form-label">
                Key Skills & Technologies (Comma-Separated)
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. React, Node.js, TypeScript, PostgreSQL, Docker, AWS"
                {...register('skills')}
              />
              <p className="text-xs text-slate-400 mt-1">
                Type technologies separated by commas. These will be highlighted during technical questioning.
              </p>

              {parsedSkillBadges.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                  {parsedSkillBadges.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-white text-indigo-700 text-xs font-semibold rounded-lg border border-indigo-100 shadow-2xs"
                    >
                      <Sparkles className="w-3 h-3 text-indigo-500" />
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="form-label">Professional Bio / Executive Summary</label>
              <textarea
                rows={4}
                className="form-input resize-y"
                placeholder="Summarize your professional background, key achievements, and what makes you stand out..."
                {...register('bio')}
              />
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button type="submit" disabled={saving || loading} className="btn-primary">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {saving ? 'Saving Changes...' : 'Save Profile Details'}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* ── Tab 2: Contact & Social Links ─────────────────────────────────── */}
      {activeTab === 'contact' && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6 md:p-8"
        >
          <div className="mb-6 pb-4 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Globe className="w-5 h-5 text-indigo-600" />
              Contact & Online Presence
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Add your portfolio and social links so feedback and resume context can be enriched.
            </p>
          </div>

          <form onSubmit={handleSubmit(onProfileSave)} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="form-label">Email Address (Account ID)</label>
                <div className="relative">
                  <input
                    type="email"
                    className="form-input bg-slate-50 text-slate-500 cursor-not-allowed pl-10"
                    disabled
                    {...register('email')}
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                </div>
                <p className="text-xs text-slate-400 mt-1">Used for sign-in; cannot be edited.</p>
              </div>

              <div>
                <label className="form-label">Phone Number</label>
                <div className="relative">
                  <input
                    type="tel"
                    className="form-input pl-10"
                    placeholder="+1 (555) 000-0000"
                    {...register('phone')}
                  />
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                </div>
              </div>
            </div>

            <div>
              <label className="form-label">Current Location / Timezone</label>
              <div className="relative">
                <input
                  type="text"
                  className="form-input pl-10"
                  placeholder="e.g. San Francisco, CA (or Remote)"
                  {...register('location')}
                />
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
              <div>
                <label className="form-label">GitHub Profile</label>
                <div className="relative">
                  <input
                    type="url"
                    className="form-input pl-10"
                    placeholder="https://github.com/username"
                    {...register('github')}
                  />
                  <Github className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                </div>
              </div>

              <div>
                <label className="form-label">LinkedIn Profile</label>
                <div className="relative">
                  <input
                    type="url"
                    className="form-input pl-10"
                    placeholder="https://linkedin.com/in/username"
                    {...register('linkedin')}
                  />
                  <Linkedin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                </div>
              </div>

              <div>
                <label className="form-label">Personal Website / Portfolio</label>
                <div className="relative">
                  <input
                    type="url"
                    className="form-input pl-10"
                    placeholder="https://yourportfolio.dev"
                    {...register('portfolio')}
                  />
                  <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button type="submit" disabled={saving || loading} className="btn-primary">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {saving ? 'Saving Changes...' : 'Save Contact Details'}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* ── Tab 3: Security & Password ────────────────────────────────────── */}
      {activeTab === 'security' && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6 md:p-8"
        >
          <div className="mb-6 pb-4 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Lock className="w-5 h-5 text-indigo-600" />
              Change Account Password
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Ensure your account uses a secure password containing uppercase, lowercase, and numeric characters.
            </p>
          </div>

          <form onSubmit={handlePwd(onPasswordSave)} className="space-y-4 max-w-lg">
            <div>
              <label className="form-label">Current Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                {...regPwd('currentPassword', { required: 'Current password is required' })}
              />
              {pwdErrors.currentPassword && (
                <p className="form-error">{pwdErrors.currentPassword.message}</p>
              )}
            </div>

            <div>
              <label className="form-label">New Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                {...regPwd('newPassword', {
                  required: 'New password is required',
                  minLength: { value: 8, message: 'Password must be at least 8 characters' },
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                    message: 'Must include uppercase, lowercase, and a number',
                  },
                })}
              />
              {pwdErrors.newPassword && (
                <p className="form-error">{pwdErrors.newPassword.message}</p>
              )}
            </div>

            <div>
              <label className="form-label">Confirm New Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                {...regPwd('confirmPassword', {
                  required: 'Please confirm your new password',
                  validate: (v) => v === newPassword || 'Passwords do not match',
                })}
              />
              {pwdErrors.confirmPassword && (
                <p className="form-error">{pwdErrors.confirmPassword.message}</p>
              )}
            </div>

            <div className="pt-2">
              <button type="submit" disabled={savingPwd} className="btn-primary">
                {savingPwd ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCircle className="w-4 h-4" />
                )}
                {savingPwd ? 'Updating Password...' : 'Update Password'}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* ── Tab 4: Account Summary ────────────────────────────────────────── */}
      {activeTab === 'account' && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6 md:p-8"
        >
          <div className="mb-6 pb-4 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-600" />
              Account & Subscription Overview
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Details and practice quota metrics for your candidate profile.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                label: 'Account Role',
                value: user?.role ? user.role.toUpperCase() : 'CANDIDATE',
                badge: 'badge-brand',
              },
              {
                label: 'Account Status',
                value: user?.isActive ? 'Active & Good Standing' : 'Inactive',
                color: user?.isActive ? 'text-emerald-600' : 'text-red-500',
              },
              {
                label: 'Membership Since',
                value: user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })
                  : 'Recent Member',
              },
              {
                label: 'Available Practice Credits',
                value: `${user?.credits ?? 10} Credits Remaining`,
              },
              {
                label: 'Completed Mock Interviews',
                value: `${user?.totalSessions ?? 0} Sessions`,
              },
              {
                label: 'Linked Primary Resume',
                value: user?.resumes?.find((r) => r.isDefault)?.originalName || 'No default resume set',
              },
            ].map(({ label, value, badge, color }) => (
              <div
                key={label}
                className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-3 border-b border-slate-100 last:border-0 gap-1"
              >
                <span className="text-slate-500 text-sm font-medium">{label}</span>
                <span
                  className={`text-sm font-semibold ${
                    color || 'text-slate-900'
                  } ${badge ? 'px-2.5 py-0.5 rounded-full text-xs bg-indigo-50 text-indigo-700 border border-indigo-200' : ''}`}
                >
                  {value}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
