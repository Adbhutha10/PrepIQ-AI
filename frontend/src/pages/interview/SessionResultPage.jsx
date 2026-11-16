import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Trophy, TrendingUp, ThumbsUp, Target, Lightbulb,
  BookOpen, ChevronDown, ChevronUp, CheckCircle, XCircle,
  RotateCcw, ArrowLeft, Star, AlertTriangle, Download, Printer
} from 'lucide-react';
import { sessionAPI } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, Legend
} from 'recharts';

export default function SessionResultPage() {
  const { id } = useParams();
  const { user } = useAuthStore();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedAnswer, setExpandedAnswer] = useState(null);

  useEffect(() => {
    sessionAPI.getById(id)
      .then(({ data }) => setSession(data.session))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!session) return <p className="text-slate-500 text-center mt-20">Session not found.</p>;

  const perfScore = session.interviewPerformanceScore ?? session.overallScore ?? 0;
  const careerScore = session.careerReadinessScore ?? session.overallScore ?? 0;

  const getScoreColor = (s) => s >= 70 ? '#10b981' : s >= 40 ? '#f59e0b' : '#ef4444';
  const getScoreLabel = (s) => s >= 70 ? 'Excellent' : s >= 40 ? 'Good' : 'Needs Work';

  const perfColor = getScoreColor(perfScore);
  const careerColor = getScoreColor(careerScore);

  // Radar chart for Multimodal Metrics (Averaged across answers)
  let avgTech = 0, avgRel = 0, avgComm = 0, avgConf = 0;
  const answered = session.answers.filter(a => !a.skipped);
  if (answered.length > 0) {
    avgTech = Math.round(answered.reduce((sum, a) => sum + (a.technicalScore || 0), 0) / answered.length);
    avgRel = Math.round(answered.reduce((sum, a) => sum + (a.relevanceScore || 0), 0) / answered.length);
    avgComm = Math.round(answered.reduce((sum, a) => sum + (a.communicationScore || 0), 0) / answered.length);
    avgConf = Math.round(answered.reduce((sum, a) => sum + (a.confidenceScore || 0), 0) / answered.length);
  }

  const multimodalRadarData = [
    { subject: 'Technical Depth', score: avgTech },
    { subject: 'Relevance', score: avgRel },
    { subject: 'Communication', score: avgComm },
    { subject: 'Confidence', score: avgConf }
  ];

  const barData = session.answers.map((a, i) => ({
    name: `Q${i + 1}`,
    Technical: a.technicalScore ?? 0,
    Relevance: a.relevanceScore ?? 0,
    Communication: a.communicationScore ?? 0,
    Confidence: a.confidenceScore ?? 0,
    overall: a.aiScore ?? 0
  }));

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-12 print:pb-0 print:space-y-4">
      {/* Printable Executive Header (Visible only when generating PDF/Printing) */}
      <div className="hidden print:block border-b-2 border-slate-900 pb-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-tight text-indigo-600">PREPIQ.AI</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 uppercase">Assessment Report</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              AI-Powered Candidate Competency, Voice & Technical Diagnostic
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm font-bold text-slate-900">{user?.name || 'Evaluated Candidate'}</div>
            <div className="text-xs text-slate-600">{user?.email || ''}</div>
            <div className="text-xs text-slate-400 mt-0.5">
              {new Date(session.createdAt || Date.now()).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between text-xs bg-slate-50 border border-slate-200 p-2.5 rounded-lg">
          <span><strong>Target Job:</strong> {session.interviewId?.jobTitle || 'Custom Assessment'}</span>
          <span><strong>Assessment Type:</strong> {session.interviewId?.type || 'General'}</span>
          <span><strong>Total Questions:</strong> {session.answers?.length || 0}</span>
          <span><strong>Session ID:</strong> #{session._id?.slice(-8).toUpperCase()}</span>
        </div>
      </div>

      {/* Header Actions */}
      <div className="flex items-center justify-between print:hidden">
        <Link to="/sessions" className="btn-ghost inline-flex">
          <ArrowLeft className="w-4 h-4" /> Back to History
        </Link>
        <button 
          onClick={() => window.print()}
          className="btn-primary inline-flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
        >
          <Download className="w-4 h-4" /> Download PDF Report
        </button>
      </div>

      {/* Score Hero */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card p-8 text-center bg-gradient-card"
      >
        <h2 className="text-2xl font-display font-bold text-slate-900 mb-6">Final Assessment Results</h2>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mb-6">
          <div className="flex flex-col items-center">
            <div className="inline-flex items-center justify-center w-28 h-28 rounded-full border-4 mb-3"
              style={{ borderColor: perfColor, boxShadow: `0 0 30px ${perfColor}40` }}>
              <span className="text-4xl font-display font-bold" style={{ color: perfColor }}>{perfScore}%</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900">Interview Performance</h3>
            <p className="text-sm text-slate-500">{getScoreLabel(perfScore)}</p>
          </div>
          
          <div className="hidden sm:block w-px h-24 bg-surface-border"></div>

          <div className="flex flex-col items-center">
            <div className="inline-flex items-center justify-center w-28 h-28 rounded-full border-4 mb-3"
              style={{ borderColor: careerColor, boxShadow: `0 0 30px ${careerColor}40` }}>
              <span className="text-4xl font-display font-bold" style={{ color: careerColor }}>{careerScore}%</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900">Career Readiness</h3>
            <p className="text-sm text-slate-500">{getScoreLabel(careerScore)}</p>
          </div>
        </div>

        <p className="text-slate-500 mb-4">{session.interviewId?.jobTitle} • {session.answers.length} questions answered</p>

        {session.overallFeedback && (
          <p className="text-slate-700 text-sm bg-slate-50 rounded-xl p-4 max-w-2xl mx-auto leading-relaxed border border-indigo-200">
            {session.overallFeedback}
          </p>
        )}

        <div className="flex items-center justify-center gap-3 mt-6 print:hidden">
          <Link to="/interviews/new" className="btn-primary">
            <RotateCcw className="w-4 h-4" /> Practice Again
          </Link>
          <Link to="/dashboard" className="btn-secondary">Dashboard</Link>
        </div>
      </motion.div>

      {/* Strengths, Weaknesses, Skill Gaps */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="card p-6 border-t-4 border-emerald-500">
          <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <ThumbsUp className="w-5 h-5 text-emerald-400" /> Strengths
          </h3>
          {session.strengths?.length ? (
            <ul className="space-y-3">
              {session.strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                  <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  {s}
                </li>
              ))}
            </ul>
          ) : <p className="text-slate-500 text-sm">No specific strengths noted.</p>}
        </div>

        <div className="card p-6 border-t-4 border-amber-500">
          <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-amber-400" /> Areas to Improve
          </h3>
          {session.weaknesses?.length || session.areasForImprovement?.length ? (
            <ul className="space-y-3">
              {(session.weaknesses || session.areasForImprovement).map((a, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                  <Lightbulb className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                  {a}
                </li>
              ))}
            </ul>
          ) : <p className="text-slate-500 text-sm">Keep practicing!</p>}
        </div>

        <div className="card p-6 border-t-4 border-red-500">
          <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-400" /> Skill Gaps
          </h3>
          {session.skillGaps?.length ? (
            <ul className="space-y-3">
              {session.skillGaps.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                  <XCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                  {s}
                </li>
              ))}
            </ul>
          ) : <p className="text-slate-500 text-sm">No critical skill gaps detected.</p>}
        </div>
      </div>

      {/* Multimodal Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 print:break-inside-avoid">
        <div className="card p-6">
          <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-indigo-500" /> Multimodal Response Analysis
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart data={multimodalRadarData} outerRadius="70%">
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <Radar name="Score" dataKey="score" stroke="#6366f1" fill="#6366f1" fillOpacity={0.3} strokeWidth={2} />
              <Tooltip
                contentStyle={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px' }}
                labelStyle={{ color: '#0f172a' }}
                itemStyle={{ color: '#a5b4fc' }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-6">
          <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-violet-400" /> Metrics Per Question
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={barData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <YAxis domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <Tooltip
                contentStyle={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px' }}
                labelStyle={{ color: '#0f172a' }}
                itemStyle={{ fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Bar dataKey="Technical" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Relevance" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Communication" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Confidence" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recommended Resources */}
      {session.recommendedResources?.length > 0 && (
        <div className="card p-6">
          <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-500" /> Recommended Resources
          </h3>
          <ul className="space-y-2">
            {session.recommendedResources.map((r, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-slate-700">
                <span className="w-6 h-6 bg-indigo-100 text-indigo-500 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">{i + 1}</span>
                {r}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Detailed Answers */}
      <div className="card p-6">
        <h3 className="font-semibold text-slate-900 mb-5 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-400" /> Question-by-Question Review
        </h3>
        <div className="space-y-3">
          {session.answers.map((answer, i) => {
            const isExpanded = expandedAnswer === i;
            const score = answer.aiScore ?? 0;
            const color = score >= 7 ? 'text-emerald-400' : score >= 4 ? 'text-amber-400' : 'text-red-400';

            return (
              <div key={i} className="border border-slate-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setExpandedAnswer(isExpanded ? null : i)}
                  className="w-full flex items-center justify-between p-4 hover:bg-slate-100 transition-colors text-left"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-7 h-7 bg-indigo-100 text-indigo-500 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">{i + 1}</span>
                    <p className="text-sm text-slate-900 truncate">{answer.questionText}</p>
                    {answer.skipped && <span className="badge-warning badge flex-shrink-0">Skipped</span>}
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                    <span className={`text-sm font-bold ${color}`}>Avg: {score}/10</span>
                    <span className="print:hidden">
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                    </span>
                  </div>
                </button>

                <div
                  className={`border-t border-slate-200 bg-surface overflow-hidden print:!block print:!h-auto print:!opacity-100 ${
                    isExpanded ? 'block' : 'hidden print:block'
                  }`}
                >
                  <div className="p-4 space-y-4">
                    {!answer.skipped && (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                      <div className="bg-slate-100 rounded-lg p-3 text-center border border-slate-200">
                        <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Technical</p>
                        <p className="text-lg font-bold text-blue-400">{answer.technicalScore ?? 0}%</p>
                      </div>
                      <div className="bg-slate-100 rounded-lg p-3 text-center border border-slate-200">
                        <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Relevance</p>
                        <p className="text-lg font-bold text-emerald-400">{answer.relevanceScore ?? 0}%</p>
                      </div>
                      <div className="bg-slate-100 rounded-lg p-3 text-center border border-slate-200">
                        <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Communication</p>
                        <p className="text-lg font-bold text-amber-400">{answer.communicationScore ?? 0}%</p>
                      </div>
                      <div className="bg-slate-100 rounded-lg p-3 text-center border border-slate-200">
                        <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Confidence</p>
                        <p className="text-lg font-bold text-violet-400">{answer.confidenceScore ?? 0}%</p>
                      </div>
                    </div>
                  )}

                  {answer.answerText && (
                    <div>
                      <p className="text-xs text-slate-500 mb-1 uppercase tracking-wide">Your Answer Transcript</p>
                      <p className="text-slate-700 text-sm leading-relaxed bg-slate-100 p-3 rounded-lg">{answer.answerText}</p>
                    </div>
                  )}
                  {answer.aiFeedback && (
                      <div className="p-3 rounded-lg bg-brand-600/10 border border-indigo-200">
                        <p className="text-xs text-indigo-500 mb-1 uppercase tracking-wide">Multimodal AI Feedback</p>
                        <p className="text-brand-200 text-sm leading-relaxed">{answer.aiFeedback}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
