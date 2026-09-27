import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BrainCircuit, Sparkles, FileText, BarChart3, ArrowRight,
  CheckCircle2, Zap, ShieldCheck, Play, MessageSquare, Award,
  ChevronRight, RefreshCw, Star, Mic, SkipForward, LayoutDashboard,
  ClipboardList, TrendingUp, Settings, User, Lightbulb, Volume2, Clock,
  ChevronDown
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

/* ─── Mock Interview UI Preview Component ─────────────────────── */
function InterviewMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.2, type: 'spring', bounce: 0.4 }}
      className="relative w-full max-w-[700px] mx-auto"
    >
      {/* Soft decorative blobs behind the card */}
      <div className="absolute -top-12 -right-12 w-72 h-72 bg-indigo-200/60 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-56 h-56 bg-violet-200/50 rounded-full blur-3xl pointer-events-none" />

      {/* Main mockup shell */}
      <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex">
        {/* Left sidebar */}
        <div className="w-48 bg-slate-50 border-r border-slate-200 flex flex-col py-5 px-3 flex-shrink-0">
          {/* Logo */}
          <div className="flex items-center gap-2 px-2 mb-6">
            <span className="font-display font-bold text-sm text-slate-900">PrepIQ <span className="text-indigo-600">AI</span></span>
          </div>

          {/* Nav Items */}
          {[
            { icon: LayoutDashboard, label: 'Dashboard' },
            { icon: MessageSquare, label: 'Practice Interview', active: true },
            { icon: FileText, label: 'Resume' },
            { icon: TrendingUp, label: 'Progress' },
            { icon: BarChart3, label: 'Reports' },
            { icon: Settings, label: 'Settings' },
          ].map(({ icon: Icon, label, active }) => (
            <div
              key={label}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-lg mb-1 cursor-pointer text-xs font-medium transition-colors ${
                active
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-slate-500 hover:bg-slate-200'
              }`}
            >
              <Icon className={`w-4 h-4 flex-shrink-0 ${active ? 'text-indigo-600' : ''}`} />
              <span className="truncate">{label}</span>
            </div>
          ))}

          {/* Bottom user */}
          <div className="mt-auto flex items-center gap-2 px-2 pt-4 border-t border-slate-200">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">A</div>
            <span className="text-xs text-slate-600 truncate font-medium">Adbhutha</span>
          </div>
        </div>

        {/* Right content */}
        <div className="flex-1 p-5 min-w-0 flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-100">
              <div>
                <p className="text-sm text-slate-700 font-bold">Software Engineer Interview</p>
                <p className="text-xs text-slate-400 mt-0.5">Question 3 of 5</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 text-xs font-mono bg-slate-100 px-2.5 py-1.5 rounded-lg text-slate-700 font-medium">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  00:24
                </div>
                <button className="bg-red-500 hover:bg-red-600 transition-colors text-white text-xs font-bold px-3 py-1.5 rounded-lg">End</button>
              </div>
            </div>

            {/* Question */}
            <div className="bg-indigo-50/70 border border-indigo-100 rounded-xl p-4 mb-4">
              <p className="text-sm text-slate-800 leading-relaxed font-medium">
                Can you explain the difference between inheritance and composition in object-oriented programming? When would you use each?
              </p>
            </div>

            {/* Live feedback panel */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 mb-4 shadow-sm">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> Live Feedback
              </div>
              <div className="space-y-2.5">
                {[
                  { color: 'bg-emerald-500', label: 'Good structure' },
                  { color: 'bg-amber-400', label: 'Explain with example' },
                  { color: 'bg-rose-400', label: 'Speak a bit slower' },
                ].map(({ color, label }, i) => (
                  <motion.div 
                    key={label}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + (i * 0.2) }}
                    className="flex items-center gap-2.5 text-xs text-slate-600 font-medium"
                  >
                    <div className={`w-2 h-2 rounded-full ${color}`} />
                    {label}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          <div>
            {/* Listening waveform */}
            <div className="flex items-center justify-between gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 mb-4 shadow-inner">
              <span className="text-xs text-slate-500 font-medium">Listening...</span>
              
              {/* Left Waveform */}
              <div className="flex items-center gap-1">
                {[3, 6, 8, 5, 10, 7, 4, 9, 6].map((h, i) => (
                  <motion.div
                    key={`l-${i}`}
                    className="w-1 bg-indigo-400 rounded-full"
                    animate={{ height: [`${h*1.5}px`, `${h*3}px`, `${h*1.5}px`] }}
                    transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.1, ease: "easeInOut" }}
                  />
                ))}
              </div>
              
              <motion.div 
                animate={{ scale: [1, 1.1, 1], boxShadow: ['0 0 0 rgba(79,70,229,0)', '0 0 15px rgba(79,70,229,0.5)', '0 0 0 rgba(79,70,229,0)'] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg"
              >
                <Mic className="w-4 h-4 text-white" />
              </motion.div>

              {/* Right Waveform */}
              <div className="flex items-center gap-1">
                {[6, 9, 4, 7, 11, 6, 3, 8, 5].map((h, i) => (
                  <motion.div
                    key={`r-${i}`}
                    className="w-1 bg-indigo-400 rounded-full"
                    animate={{ height: [`${h*1.5}px`, `${h*3}px`, `${h*1.5}px`] }}
                    transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
                  />
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3">
              <button className="flex items-center gap-1.5 text-xs text-slate-500 border border-slate-200 px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors font-medium">
                <SkipForward className="w-3.5 h-3.5" /> Skip
              </button>
              <button className="flex items-center gap-1.5 text-xs text-white bg-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-semibold shadow-md">
                Next <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating score badge */}
      <motion.div
        initial={{ opacity: 0, x: 30, y: -10 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ delay: 1.2, type: 'spring' }}
        className="absolute -top-5 -right-5 bg-white rounded-xl shadow-xl border border-slate-100 px-4 py-3 flex items-center gap-3 z-10"
      >
        <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center shadow-inner">
          <Star className="w-4 h-4 text-white fill-white" />
        </div>
        <div>
          <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">AI Score</p>
          <p className="text-base font-display font-black text-slate-900 leading-tight">92<span className="text-slate-400 text-xs">/100</span></p>
        </div>
      </motion.div>

      {/* Floating tag badge */}
      <motion.div
        initial={{ opacity: 0, x: -30, y: 10 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ delay: 1.5, type: 'spring' }}
        className="absolute -bottom-5 -left-5 bg-white rounded-xl shadow-xl border border-slate-100 px-4 py-3 flex items-center gap-3 z-10"
      >
        <div className="w-8 h-8 bg-gradient-to-br from-violet-400 to-purple-600 rounded-lg flex items-center justify-center shadow-inner">
          <Lightbulb className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Tip detected</p>
          <p className="text-sm font-bold text-slate-800 leading-tight">Use STAR method</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── FAQ Component ───────────────────────────────────────────── */
function FAQItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="border border-slate-200 rounded-xl mb-3 overflow-hidden bg-white hover:border-indigo-200 transition-colors shadow-sm">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-full text-left px-6 py-4 flex items-center justify-between focus:outline-none"
      >
        <span className="font-bold text-slate-800 pr-8">{question}</span>
        <div className={`p-1 rounded-full bg-slate-50 transition-transform duration-300 ${isOpen ? 'rotate-180 bg-indigo-50 text-indigo-600' : 'text-slate-400'}`}>
          <ChevronDown className="w-5 h-5" />
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-5 text-slate-600 text-sm leading-relaxed border-t border-slate-100 pt-3">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Data Arrays ─────────────────────────────────────────────── */
const FEATURE_STRIP = [
  { icon: Zap, label: 'Instant AI feedback', color: 'bg-indigo-100 text-indigo-600' },
  { icon: FileText, label: 'Resume-based questions', color: 'bg-violet-100 text-violet-600' },
  { icon: BarChart3, label: 'Detailed performance reports', color: 'bg-amber-100 text-amber-600' },
  { icon: ShieldCheck, label: 'Real-time voice input', color: 'bg-emerald-100 text-emerald-600' },
];

const FEATURES = [
  {
    icon: FileText,
    title: 'Resume-Aware Questions',
    desc: 'Get personalized interview questions tailored to your resume, target role, and experience.',
    gradient: 'from-indigo-500 to-violet-600',
  },
  {
    icon: MessageSquare,
    title: 'Real-Time AI Feedback',
    desc: 'Receive instant feedback on your answers, including clarity, content, and communication.',
    gradient: 'from-violet-500 to-purple-600',
  },
  {
    icon: BarChart3,
    title: 'Detailed Reports',
    desc: 'Track your progress with scores, strengths, and areas for improvement after every session.',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Lightbulb,
    title: 'Multiple Interview Formats',
    desc: 'Practice technical, behavioral, and situational questions across different domains.',
    gradient: 'from-amber-500 to-orange-500',
  },
];

const STEPS = [
  { step: '01', title: 'Upload Resume & Target Role', desc: 'Paste a job description and upload your resume PDF to prime the AI context engine.' },
  { step: '02', title: 'Conduct Interactive Session', desc: 'Answer tailored technical & behavioral questions in a realistic timed interview room.' },
  { step: '03', title: 'Review Scorecard & Insights', desc: 'Get a breakdown of your strong points, missing keywords, and recommended answers.' },
];

const FAQS = [
  { 
    question: "Is PrepIQ AI free to use?", 
    answer: "Yes! You can create an account and access basic mock interviews completely free. We also offer premium features for unlimited sessions and advanced analytics." 
  },
  { 
    question: "What types of roles does the AI support?", 
    answer: "Our AI is trained to handle a wide variety of roles including Software Engineering, Product Management, Data Science, Marketing, and Sales. Just paste the job description, and the AI adapts its questions accordingly." 
  },
  { 
    question: "How accurate is the AI feedback?", 
    answer: "We use state-of-the-art LLMs (like Groq) specifically tuned for technical and behavioral interviews. The feedback is highly accurate at identifying missing keywords, assessing technical depth, and evaluating communication clarity." 
  },
  { 
    question: "Can I practice with my own resume?", 
    answer: "Absolutely. When setting up an interview, you upload your actual PDF resume. The AI reads it and will ask deep dive questions about your specific past projects and experiences, just like a real human interviewer." 
  }
];

/* ─── Main Page ───────────────────────────────────────────────── */
export default function LandingPage() {
  const { isAuthenticated } = useAuthStore();
  const [scrolled, setScrolled] = useState(false);

  // Track scrolling for sticky CTA and navbar shadow
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-x-hidden relative">

      {/* ── Navbar ───────────────────────────────────────────────── */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-sm py-2' : 'bg-transparent py-4'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <span className="font-display font-bold text-xl text-slate-900 tracking-tight">
              PrepIQ <span className="text-indigo-600">AI</span>
            </span>
          </Link>

          {/* Center nav links */}
          <nav className="hidden md:flex items-center gap-1 bg-white/50 backdrop-blur-md px-2 py-1.5 rounded-full border border-slate-200/50 shadow-sm">
            {['Home', 'Features', 'How it Works', 'FAQ'].map((item, i) => (
              <a
                key={item}
                href={item === 'Home' ? '#' : `#${item.toLowerCase().replace(/ /g, '-')}`}
                className={`px-4 py-1.5 text-sm font-semibold rounded-full transition-colors relative ${
                  i === 0
                    ? 'text-indigo-600 bg-indigo-50'
                    : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
                }`}
              >
                {item}
              </a>
            ))}
          </nav>

          {/* Right CTA */}
          {isAuthenticated ? (
            <Link to="/dashboard" className="btn-primary shadow-md text-sm px-5 py-2">
              Dashboard <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors hidden sm:block px-2">
                Log In
              </Link>
              <Link to="/register" className="btn-primary text-sm shadow-md px-5 py-2">
                Get Started <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* ── Hero Section ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-28 pb-16 px-6">
        {/* Background accents */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[800px] h-[600px] bg-gradient-to-bl from-indigo-100/80 via-violet-50/50 to-transparent blur-3xl rounded-full" />
          <div className="absolute top-40 left-0 w-[400px] h-[400px] bg-indigo-50/80 blur-3xl rounded-full" />
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#4f46e5 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center py-8">

            {/* ── Left: Text ──────────────────── */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="flex flex-col gap-6 max-w-xl"
            >
              {/* Badge */}
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-indigo-100 shadow-sm text-indigo-700 text-xs font-bold w-fit cursor-default"
              >
                <div className="p-1 bg-indigo-100 rounded-full">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                </div>
                AI-Powered Interview Preparation
              </motion.div>

              {/* Headline */}
              <div>
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-extrabold text-slate-900 leading-[1.05] tracking-tight">
                  Practice Interviews.
                </h1>
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-extrabold leading-[1.05] tracking-tight bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent pb-2">
                  Build Confidence.
                </h1>
              </div>

              {/* Subtext */}
              <p className="text-slate-500 text-lg sm:text-xl leading-relaxed max-w-lg font-medium">
                PrepIQ AI is your personal interview coach. Upload your resume, practice with AI-generated questions, and get instant feedback to land your dream job.
              </p>

              {/* CTA buttons */}
              <div className="flex flex-wrap items-center gap-4 mt-2">
                <Link to="/register" className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base px-8 py-4 rounded-xl shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/40 active:scale-95 transition-all duration-200">
                  Start Practicing <ArrowRight className="w-5 h-5" />
                </Link>
                <a href="#interactive-demo" className="inline-flex items-center justify-center gap-2 bg-white border border-slate-200 hover:border-indigo-300 text-slate-700 hover:text-indigo-700 font-bold text-base px-8 py-4 rounded-xl shadow-sm hover:shadow-md active:scale-95 transition-all duration-200 group">
                  <div className="w-6 h-6 bg-slate-100 group-hover:bg-indigo-50 rounded-full flex items-center justify-center transition-colors">
                    <Play className="w-3 h-3 text-slate-600 group-hover:text-indigo-600 fill-current ml-0.5" />
                  </div>
                  Watch Demo
                </a>
              </div>

              {/* Feature badges */}
              <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-slate-100 mt-2">
                {FEATURE_STRIP.map(({ icon: Icon, label, color }) => (
                  <div key={label} className="flex items-center gap-2 text-xs text-slate-600 font-bold">
                    <div className={`p-1.5 rounded-md ${color}`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    {label}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* ── Right: Mockup ─────────────────── */}
            <div className="hidden lg:flex items-center justify-center w-full">
              <InterviewMockup />
            </div>
          </div>
        </div>
      </section>

      {/* ── Features Strip ───────────────────────────────────────── */}
      <motion.section 
        id="features" 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7 }}
        className="relative z-10 py-24 px-6 bg-slate-50 border-y border-slate-200"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900 mb-4">
              Everything you need to <span className="text-indigo-600">ace the interview</span>
            </h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto font-medium">
              Purpose-built tools designed to convert practice sessions into official offer letters.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc, gradient }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 hover:border-indigo-200 group"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-extrabold text-slate-900 mb-3 text-lg group-hover:text-indigo-700 transition-colors">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed font-medium">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ── How It Works ─────────────────────────────────────────── */}
      <motion.section 
        id="how-it-works" 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7 }}
        className="relative z-10 py-24 px-6"
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-20">
            <span className="text-indigo-600 text-sm font-black uppercase tracking-widest bg-indigo-50 px-4 py-1.5 rounded-full inline-block mb-4">3-Step Blueprint</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-slate-900">
              How <span className="bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent">PrepIQ AI</span> Works
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-indigo-100 via-indigo-200 to-indigo-100 z-0" />
            
            {STEPS.map(({ step, title, desc }, i) => (
              <motion.div 
                key={step} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2, duration: 0.5 }}
                className="bg-white border border-slate-200 rounded-3xl p-8 text-center relative z-10 hover:-translate-y-2 hover:shadow-xl hover:shadow-indigo-500/5 hover:border-indigo-200 transition-all duration-300"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-500/20 text-white font-display font-black text-2xl">
                  {step}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed font-medium">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ── FAQ Section ──────────────────────────────────────────── */}
      <motion.section 
        id="faq" 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7 }}
        className="relative z-10 py-24 px-6 bg-slate-50 border-t border-slate-200"
      >
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-500 font-medium">Got questions? We've got answers.</p>
          </div>
          
          <div>
            {FAQS.map((faq, i) => (
              <FAQItem key={i} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>
      </motion.section>

      {/* ── CTA Section ──────────────────────────────────────────── */}
      <section className="relative z-10 py-28 px-6 bg-slate-900 overflow-hidden text-center">
        {/* Dark theme styled CTA for high contrast punch at the end */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f46e515_1px,transparent_1px),linear-gradient(to_bottom,#4f46e515_1px,transparent_1px)] bg-[size:4rem_4rem]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/20 rounded-full blur-[120px] pointer-events-none" />
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto relative z-10"
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold text-white mb-6 leading-tight">
            Ready to Outshine <br className="hidden sm:block" /> Other Candidates?
          </h2>
          <p className="text-indigo-200 text-lg sm:text-xl mb-10 max-w-xl mx-auto font-medium">
            Join thousands of job seekers who landed their dream roles using PrepIQ AI.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center justify-center gap-2 px-10 py-5 bg-indigo-500 hover:bg-indigo-400 text-white font-extrabold text-lg rounded-2xl shadow-[0_0_40px_rgba(99,102,241,0.4)] hover:shadow-[0_0_60px_rgba(99,102,241,0.6)] active:scale-95 transition-all duration-300"
          >
            Create Your Free Account <ChevronRight className="w-6 h-6" />
          </Link>
          <p className="mt-6 text-sm text-indigo-300 font-medium flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> No credit card required to start
          </p>
        </motion.div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────── */}
      <footer className="relative z-10 bg-slate-950 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <span className="font-display font-bold text-xl text-white">
              PrepIQ <span className="text-indigo-400">AI</span>
            </span>
          </div>
          <p className="text-slate-500 text-sm font-medium text-center">
            © {new Date().getFullYear()} PrepIQ AI. All rights reserved. Powered by Groq LLM.
          </p>
          <div className="flex items-center gap-6 text-sm font-bold text-slate-400">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>

      {/* ── Sticky Floating CTA ──────────────────────────────────── */}
      <AnimatePresence>
        {scrolled && !isAuthenticated && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-6 right-6 z-50 hidden md:block"
          >
            <Link
              to="/register"
              className="flex items-center gap-2 px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl shadow-2xl hover:shadow-slate-900/50 transition-all border border-slate-700"
            >
              Get Started Free <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
