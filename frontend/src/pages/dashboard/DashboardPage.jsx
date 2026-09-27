import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Trophy, ClipboardList, TrendingUp, Star,
  Plus, ChevronRight, Clock, Building2, Flame,
  Sparkles, Target, Calendar
} from 'lucide-react';
import { userAPI } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import {
  RadialBarChart, RadialBar, ResponsiveContainer,
  AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid
} from 'recharts';

const StatCard = ({ icon: Icon, label, value, sub, color, iconColor, delay = 0, loading }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4 }}
    className="card-hover p-6 flex items-start gap-4"
  >
    <div className={`p-3 rounded-xl ${color}`}>
      <Icon className={`w-6 h-6 ${iconColor}`} />
    </div>
    <div className="flex-1">
      <p className="text-slate-500 text-sm font-medium">{label}</p>
      {loading ? (
        <div className="h-8 w-24 bg-slate-100 rounded-lg animate-pulse mt-1" />
      ) : (
        <p className="text-3xl font-display font-bold text-slate-900 mt-1">{value}</p>
      )}
      {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
    </div>
  </motion.div>
);

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
};

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('all');

  useEffect(() => {
    userAPI.getDashboard()
      .then(({ data }) => setStats(data.data))
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  const scoreData = [
    { name: 'Score', value: stats?.averageScore ?? 0, fill: '#6366f1' },
  ];

  const rawSessions = stats?.historicalSessions || [];

  const filteredSessions = rawSessions.filter((s) => {
    if (timeRange === '7d') {
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return new Date(s.createdAt) >= sevenDaysAgo;
    }
    if (timeRange === '30d') {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      return new Date(s.createdAt) >= thirtyDaysAgo;
    }
    return true;
  });

  const chartData = filteredSessions.map((s) => ({
    name: new Date(s.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    score: s.overallScore,
  }));

  const streakDays = stats?.completedSessions ? Math.min(stats.completedSessions, 7) : 0;
  const readinessScore = Math.min(Math.round(((stats?.averageScore || 0) * 0.7) + ((stats?.completedSessions || 0) * 6)), 100);

  return (
    <div className="space-y-8 animate-fade-in relative">
      {/* Subtle background accent */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-100/60 rounded-full blur-[100px] pointer-events-none animate-pulse-slow"></div>

      {/* Greeting & Motivation Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="badge badge-brand text-xs">
              <Sparkles className="w-3 h-3 text-indigo-600" /> AI Interview Prep
            </span>
            {streakDays > 0 && (
              <span className="badge bg-amber-100 text-amber-700 border border-amber-200 text-xs flex items-center gap-1">
                <Flame className="w-3 h-3 fill-amber-500 text-amber-500" /> {streakDays} Day Streak!
              </span>
            )}
          </div>
          <h2 className="text-3xl font-display font-bold text-slate-900 tracking-tight">
            {getGreeting()}, <span className="gradient-text">{user?.name?.split(' ')[0]}</span> 👋
          </h2>
          <p className="text-slate-500 mt-1">Ready to practice? Let&apos;s crush your next interview session.</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Readiness Meter Badge */}
          <div className="hidden lg:flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white border border-slate-200 shadow-sm">
            <Target className="w-5 h-5 text-indigo-500" />
            <div>
              <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Interview Readiness</p>
              <p className="text-sm font-bold text-emerald-600">{readinessScore}% Match</p>
            </div>
          </div>

          <Link to="/interviews/new" className="btn-primary shadow-md group">
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
            New Interview
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 relative z-10">
        <StatCard
          icon={ClipboardList} label="Total Interviews"
          color="bg-indigo-100" iconColor="text-indigo-600"
          value={stats?.totalSessions ?? 0}
          sub="All time sessions"
          delay={0.1} loading={loading}
        />
        <StatCard
          icon={Trophy} label="Completed"
          color="bg-violet-100" iconColor="text-violet-600"
          value={stats?.completedSessions ?? 0}
          sub="Finished sessions"
          delay={0.2} loading={loading}
        />
        <StatCard
          icon={TrendingUp} label="Avg. Score"
          color="bg-cyan-100" iconColor="text-cyan-600"
          value={`${stats?.averageScore ?? 0}%`}
          sub="Across all sessions"
          delay={0.3} loading={loading}
        />
        <StatCard
          icon={Star} label="Best Score"
          color="bg-amber-100" iconColor="text-amber-600"
          value={`${stats?.bestScore ?? 0}%`}
          sub="Personal best"
          delay={0.4} loading={loading}
        />
      </div>

      {/* Analytics Chart */}
      <div className="card p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <h3 className="font-semibold text-slate-800 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-500" /> Performance History
          </h3>

          {/* Time Range Selector */}
          <div className="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200 gap-1 self-start sm:self-auto">
            {[
              { id: '7d', label: '7 Days' },
              { id: '30d', label: '30 Days' },
              { id: 'all', label: 'All Time' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTimeRange(t.id)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${timeRange === t.id
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                  }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="h-64">
          {loading ? (
            <div className="h-full w-full bg-slate-100 rounded-xl animate-pulse flex items-center justify-center text-slate-400 text-sm">
              Loading analytics trajectory...
            </div>
          ) : chartData.length > 1 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '0.75rem', color: '#0f172a', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                  itemStyle={{ color: '#4f46e5', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#colorScore)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-slate-50 rounded-xl border border-slate-200 border-dashed">
              <div className="p-3 bg-indigo-100 text-indigo-600 rounded-full mb-3">
                <Calendar className="w-6 h-6" />
              </div>
              <p className="text-slate-700 font-medium text-sm mb-1">Track your progress over time</p>
              <p className="text-slate-400 text-xs max-w-sm mb-4">Complete at least two interview sessions to unlock detailed performance trends &amp; historical graphs.</p>
              <Link to="/interviews/new" className="btn-primary text-xs py-2 px-4 shadow-none">
                Start Next Interview <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Charts + Recent */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Score Gauge */}
        <div className="card p-6 flex flex-col items-center justify-center">
          <h3 className="text-sm font-medium text-slate-500 mb-4">Average Performance</h3>
          {loading ? (
            <div className="w-32 h-32 rounded-full border-4 border-slate-200 animate-pulse mb-4" />
          ) : (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <RadialBarChart innerRadius="60%" outerRadius="90%" data={scoreData} startAngle={90} endAngle={-270}>
                  <RadialBar background={{ fill: '#e2e8f0' }} dataKey="value" cornerRadius={8} />
                </RadialBarChart>
              </ResponsiveContainer>
              <p className="text-4xl font-display font-bold gradient-text -mt-4">
                {stats?.averageScore ?? 0}%
              </p>
              <p className="text-slate-400 text-xs mt-1">Overall score</p>
            </>
          )}
        </div>

        {/* Recent Sessions */}
        <div className="card p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-slate-800">Recent Sessions</h3>
            <Link to="/sessions" className="btn-ghost text-xs">View all <ChevronRight className="w-3 h-3" /></Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-slate-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : !stats?.recentSessions?.length ? (
            <div className="text-center py-10">
              <ClipboardList className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-400">No sessions yet</p>
              <Link to="/interviews/new" className="btn-primary mt-4 inline-flex">Start practicing</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {stats.recentSessions.map((session) => (
                <Link
                  key={session._id}
                  to={`/sessions/${session._id}/results`}
                  className="flex items-center justify-between p-4 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 rounded-lg group-hover:bg-indigo-200 transition-colors">
                      <Building2 className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-800">{session.interviewId?.jobTitle}</p>
                      <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3" />
                        {new Date(session.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`badge ${session.overallScore >= 70 ? 'badge-success' : session.overallScore >= 40 ? 'badge-warning' : 'badge-danger'}`}>
                      {session.overallScore}%
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card p-6">
        <h3 className="font-semibold text-slate-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { to: '/interviews/new', icon: Plus, label: 'Create Interview', desc: 'Setup a new mock session', color: 'from-indigo-500 to-violet-500' },
            { to: '/resumes', icon: ClipboardList, label: 'Upload Resume', desc: 'Add your latest resume', color: 'from-emerald-500 to-teal-500' },
            { to: '/sessions', icon: TrendingUp, label: 'View Progress', desc: 'Review past performance', color: 'from-amber-500 to-orange-500' },
          ].map(({ to, icon: Icon, label, desc, color }, idx) => (
            <Link key={to} to={to}
              className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 hover:-translate-y-1 hover:shadow-md transition-all duration-300 group"
              style={{ animation: `slideUp 0.5s ease-out forwards ${0.5 + (idx * 0.1)}s`, opacity: 0 }}
            >
              <div className={`p-3 rounded-xl bg-gradient-to-br ${color} flex-shrink-0 shadow-md group-hover:scale-110 transition-transform`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800 group-hover:text-indigo-700 transition-colors">{label}</p>
                <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
