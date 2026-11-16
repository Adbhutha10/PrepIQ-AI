import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, CheckCircle2, AlertTriangle, ArrowRight, Copy,
  Check, FileText, Briefcase, RefreshCw, Layers, ShieldCheck,
  TrendingUp, Award, Zap
} from 'lucide-react';
import { resumeAPI } from '@/services/api';
import toast from 'react-hot-toast';

export default function AtsReviewerPage() {
  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState('');
  const [customResumeText, setCustomResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [useCustomText, setUseCustomText] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchingResumes, setFetchingResumes] = useState(true);
  const [analysis, setAnalysis] = useState(null);
  const [copiedIndex, setCopiedIndex] = useState(null);

  // Load existing resumes on mount
  useEffect(() => {
    resumeAPI.getAll()
      .then(({ data }) => {
        const list = data.resumes || [];
        setResumes(list);
        if (list.length > 0) {
          const defaultRes = list.find(r => r.isDefault) || list[0];
          setSelectedResumeId(defaultRes._id);
        } else {
          setUseCustomText(true);
        }
      })
      .catch((err) => {
        console.error('Failed to load resumes:', err);
      })
      .finally(() => setFetchingResumes(false));
  }, []);

  const handleAnalyze = async (e) => {
    e.preventDefault();

    if (!jobDescription.trim() || jobDescription.trim().length < 20) {
      toast.error('Please paste a target job description (at least 20 characters).');
      return;
    }

    if (useCustomText && (!customResumeText.trim() || customResumeText.trim().length < 50)) {
      toast.error('Please paste your resume content (at least 50 characters).');
      return;
    }

    if (!useCustomText && !selectedResumeId) {
      toast.error('Please select an uploaded resume or switch to paste mode.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        jobDescription: jobDescription.trim(),
        ...(useCustomText
          ? { resumeText: customResumeText.trim() }
          : { resumeId: selectedResumeId }),
      };

      const { data } = await resumeAPI.checkAts(payload);
      if (data?.analysis) {
        setAnalysis(data.analysis);
        toast.success('ATS Analysis complete!');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to analyze ATS match.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    toast.success('Copied bullet rewrite to clipboard!');
    setTimeout(() => setCopiedIndex(null), 2500);
  };

  const getScoreColor = (score) => {
    if (score >= 75) return '#10b981';
    if (score >= 50) return '#f59e0b';
    return '#ef4444';
  };

  const getScoreBadge = (score) => {
    if (score >= 80) return { label: 'High Match', cls: 'badge-success' };
    if (score >= 60) return { label: 'Moderate Match', cls: 'badge-warning' };
    return { label: 'Needs Tailoring', cls: 'badge-danger' };
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600">
              <Sparkles className="w-6 h-6" />
            </span>
            <h1 className="text-2xl font-bold font-display text-slate-900">
              ATS Resume Reviewer & Keyword Gap Matcher
            </h1>
          </div>
          <p className="text-slate-500 text-sm mt-1">
            Audit your resume against applicant tracking systems before applying. Get match scores, find missing keywords, and view tailored bullet rewrites.
          </p>
        </div>
      </div>

      {/* Input Form Card */}
      <div className="card p-6 shadow-sm border border-slate-200">
        <form onSubmit={handleAnalyze} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Resume Selection */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-600" /> 1. Select or Paste Resume
                </label>
                {resumes.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setUseCustomText(!useCustomText)}
                    className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold underline"
                  >
                    {useCustomText ? 'Use uploaded resume' : 'Paste raw text instead'}
                  </button>
                )}
              </div>

              {!useCustomText ? (
                <div>
                  <label className="form-label text-xs">Choose from Resume Vault</label>
                  {fetchingResumes ? (
                    <div className="h-10 animate-pulse bg-slate-100 rounded-lg" />
                  ) : resumes.length === 0 ? (
                    <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm">
                      No uploaded resumes found.{' '}
                      <button
                        type="button"
                        onClick={() => setUseCustomText(true)}
                        className="underline font-bold"
                      >
                        Paste resume text below
                      </button>
                    </div>
                  ) : (
                    <select
                      value={selectedResumeId}
                      onChange={(e) => setSelectedResumeId(e.target.value)}
                      className="form-input text-sm"
                    >
                      {resumes.map((res) => (
                        <option key={res._id} value={res._id}>
                          {res.originalName || 'Resume'} {res.isDefault ? '(Default)' : ''} — {new Date(res.createdAt).toLocaleDateString()}
                        </option>
                      ))}
                    </select>
                  )}
                  <p className="text-xs text-slate-400 mt-1.5">
                    Select the resume file you want to evaluate against the target job.
                  </p>
                </div>
              ) : (
                <div>
                  <label className="form-label text-xs">Paste Resume Content</label>
                  <textarea
                    rows={8}
                    value={customResumeText}
                    onChange={(e) => setCustomResumeText(e.target.value)}
                    placeholder="Paste the text of your resume (experience, skills, summary, education)..."
                    className="form-input text-xs font-mono"
                  />
                  <p className="text-xs text-slate-400 mt-1">
                    Paste raw text extracted from PDF or Word.
                  </p>
                </div>
              )}
            </div>

            {/* Right: Job Description */}
            <div className="space-y-4">
              <label className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-indigo-600" /> 2. Target Job Description
              </label>
              <div>
                <label className="form-label text-xs">Paste Job Requirements / Description</label>
                <textarea
                  rows={8}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the job posting description, required qualifications, and responsibilities here..."
                  className="form-input text-xs font-mono"
                />
                <p className="text-xs text-slate-400 mt-1">
                  Include role requirements and technical skills for optimal ATS keyword matching.
                </p>
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <div className="flex items-center justify-end pt-2 border-t border-slate-100">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary inline-flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Auditing ATS Compatibility...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Run ATS Match Analysis
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Results Section */}
      <AnimatePresence>
        {analysis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Score & Category Breakdown */}
            <div className="card p-6 bg-gradient-card">
              <div className="flex flex-col md:flex-row items-center gap-8">
                {/* Overall Score Circle */}
                <div className="flex flex-col items-center text-center">
                  <div
                    className="relative flex items-center justify-center w-32 h-32 rounded-full border-4"
                    style={{
                      borderColor: getScoreColor(analysis.matchScore),
                      boxShadow: `0 0 25px ${getScoreColor(analysis.matchScore)}35`,
                    }}
                  >
                    <div className="text-center">
                      <span
                        className="text-4xl font-extrabold font-display block"
                        style={{ color: getScoreColor(analysis.matchScore) }}
                      >
                        {analysis.matchScore}%
                      </span>
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                        ATS Score
                      </span>
                    </div>
                  </div>
                  <div className="mt-3">
                    <span className={`badge ${getScoreBadge(analysis.matchScore).cls}`}>
                      {getScoreBadge(analysis.matchScore).label}
                    </span>
                  </div>
                </div>

                {/* Executive Summary & Sub-scores */}
                <div className="flex-1 space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-indigo-600" />
                      ATS Diagnostic Overview
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">
                      {analysis.summary}
                    </p>
                  </div>

                  {/* Category Breakdown Progress */}
                  {analysis.categoryScores && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                      <div className="bg-white border border-slate-200 p-3 rounded-xl">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-slate-500 font-semibold">Skills Match</span>
                          <span className="font-bold text-slate-800">{analysis.categoryScores.skillsMatch}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2">
                          <div
                            className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${analysis.categoryScores.skillsMatch}%` }}
                          />
                        </div>
                      </div>

                      <div className="bg-white border border-slate-200 p-3 rounded-xl">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-slate-500 font-semibold">Experience Fit</span>
                          <span className="font-bold text-slate-800">{analysis.categoryScores.experienceMatch}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2">
                          <div
                            className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${analysis.categoryScores.experienceMatch}%` }}
                          />
                        </div>
                      </div>

                      <div className="bg-white border border-slate-200 p-3 rounded-xl">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-slate-500 font-semibold">Relevance & Scope</span>
                          <span className="font-bold text-slate-800">{analysis.categoryScores.relevanceScore}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2">
                          <div
                            className="bg-violet-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${analysis.categoryScores.relevanceScore}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Keyword Analysis: Matching vs Missing */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Matching Keywords */}
              <div className="card p-6 border-t-4 border-emerald-500">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-900 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    Matching Keywords ({analysis.matchingKeywords?.length || 0})
                  </h3>
                  <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold">
                    Detected in Resume
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {analysis.matchingKeywords?.length ? (
                    analysis.matchingKeywords.map((kw, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200"
                      >
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        {kw}
                      </span>
                    ))
                  ) : (
                    <p className="text-slate-400 text-sm">No direct keyword overlap detected.</p>
                  )}
                </div>
              </div>

              {/* Missing High-Priority Keywords */}
              <div className="card p-6 border-t-4 border-red-500">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-900 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    Missing Critical Keywords ({analysis.missingKeywords?.length || 0})
                  </h3>
                  <span className="text-xs text-red-700 bg-red-50 px-2 py-0.5 rounded font-semibold">
                    Add to Resume
                  </span>
                </div>
                <p className="text-xs text-slate-500 mb-3">
                  These keywords appear in the job posting but were not found on your resume. Incorporating them directly will increase ATS pass rates.
                </p>
                <div className="flex flex-wrap gap-2">
                  {analysis.missingKeywords?.length ? (
                    analysis.missingKeywords.map((kw, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-red-50 text-red-700 border border-red-200"
                      >
                        + {kw}
                      </span>
                    ))
                  ) : (
                    <p className="text-slate-400 text-sm">Great job! All critical job keywords match.</p>
                  )}
                </div>
              </div>
            </div>

            {/* High-Impact Bullet Rewrites */}
            {analysis.bulletSuggestions?.length > 0 && (
              <div className="card p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                      <Zap className="w-5 h-5 text-amber-500" />
                      ATS-Optimized Bullet Rewrites
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Replace vague descriptions with quantifiable results, action verbs, and relevant target keywords.
                    </p>
                  </div>
                </div>

                <div className="space-y-4 mt-4">
                  {analysis.bulletSuggestions.map((item, idx) => (
                    <div
                      key={idx}
                      className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-3 transition-colors hover:border-indigo-200"
                    >
                      {/* Original vs Improved */}
                      <div className="space-y-2">
                        <div className="text-xs text-slate-500 flex items-center gap-2 font-semibold">
                          <span className="w-2 h-2 rounded-full bg-slate-400" />
                          Original Resume Bullet:
                        </div>
                        <p className="text-sm text-slate-700 pl-4 border-l-2 border-slate-300 italic">
                          "{item.original}"
                        </p>
                      </div>

                      <div className="space-y-2 pt-2 border-t border-slate-200">
                        <div className="text-xs text-indigo-600 flex items-center justify-between font-bold">
                          <span className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-indigo-600" />
                            ATS-Optimized Rewrite:
                          </span>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(item.improved, idx)}
                            className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-semibold"
                          >
                            {copiedIndex === idx ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                <span className="text-emerald-600">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                Copy Rewrite
                              </>
                            )}
                          </button>
                        </div>
                        <p className="text-sm text-slate-900 pl-4 border-l-2 border-indigo-500 font-medium bg-indigo-50/40 p-2.5 rounded-r-lg">
                          {item.improved}
                        </p>
                      </div>

                      {item.reason && (
                        <div className="text-xs text-slate-500 bg-white p-2 rounded border border-slate-200">
                          <span className="font-semibold text-slate-700">Why this scores higher: </span>
                          {item.reason}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Strengths & Recommendations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Strengths */}
              <div className="card p-6">
                <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Award className="w-5 h-5 text-indigo-600" /> Top Candidate Strengths
                </h3>
                <ul className="space-y-2.5">
                  {analysis.strengths?.map((str, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-indigo-500 mt-0.5 flex-shrink-0" />
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommendations */}
              <div className="card p-6">
                <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-600" /> Optimization Checklist
                </h3>
                <ul className="space-y-2.5">
                  {analysis.recommendations?.map((rec, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                      <ArrowRight className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
