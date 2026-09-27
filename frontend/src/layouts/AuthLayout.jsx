import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BrainCircuit, Sparkles, Target, TrendingUp } from 'lucide-react';

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 flex">
      {/* ── Left Brand Panel ─────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 via-violet-600 to-blue-700
                      flex-col items-center justify-center p-12 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-indigo-200 rounded-full blur-3xl" />
        </div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-10" 
          style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-10 text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-8">
            <span className="text-3xl font-display font-bold text-white tracking-tight">PrepIQ AI</span>
          </div>

          <h1 className="text-4xl font-display font-bold text-white mb-4 leading-tight">
            Ace your next<br />
            <span className="text-indigo-200">interview</span> with AI
          </h1>
          <p className="text-indigo-100 text-lg max-w-sm leading-relaxed">
            Upload your resume, set the role, and get AI-powered mock interviews with instant feedback.
          </p>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-3 gap-6">
            {[
              { label: 'Questions Generated', value: '50K+', icon: Sparkles },
              { label: 'Mock Interviews', value: '12K+', icon: Target },
              { label: 'Success Rate', value: '87%', icon: TrendingUp },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="text-center bg-white/10 rounded-xl p-3 backdrop-blur-sm border border-white/20">
                <Icon className="w-5 h-5 text-indigo-200 mx-auto mb-1" />
                <div className="text-2xl font-bold text-white">{value}</div>
                <div className="text-indigo-200 text-xs mt-1">{label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── Right Form Panel ──────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <span className="text-xl font-display font-bold gradient-text">PrepIQ AI</span>
          </div>

          <Outlet />
        </motion.div>
      </div>
    </div>
  );
}
