import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import {
  BrainCircuit, LayoutDashboard, MessageSquarePlus,
  ClipboardList, FileText, History, User, LogOut, X, Briefcase, Sparkles
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

const NAV_ITEMS = [
  { to: '/dashboard',      icon: LayoutDashboard,   label: 'Dashboard' },
  { to: '/interviews',     icon: ClipboardList,      label: 'My Interviews' },
  { to: '/interviews/new', icon: MessageSquarePlus, label: 'New Interview' },
  { to: '/sessions',       icon: History,            label: 'Session History' },
  { to: '/resumes',        icon: FileText,           label: 'Resume Vault' },
  { to: '/resumes/ats',    icon: Sparkles,           label: 'ATS Reviewer' },
  { to: '/profile',        icon: User,               label: 'Profile & Settings' },
];

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-surface-card border-r border-surface-border">
        <SidebarContent user={user} onLogout={handleLogout} />
      </aside>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 z-30 h-full w-72 bg-surface-card border-r border-surface-border flex flex-col lg:hidden"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
            <SidebarContent user={user} onLogout={handleLogout} onNavClick={onClose} />
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}

function SidebarContent({ user, onLogout, onNavClick }) {
  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-slate-200">
        <span className="font-display font-bold text-lg gradient-text">PrepIQ AI</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onNavClick}
            end={to === '/dashboard'}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150',
                isActive
                  ? 'bg-indigo-100 text-indigo-700 border border-indigo-200 font-semibold'
                  : 'text-slate-600 hover:text-indigo-700 hover:bg-indigo-50'
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon className={clsx('w-5 h-5 transition-transform duration-200', isActive ? 'text-indigo-600' : 'text-slate-400')} />
                <span className="flex-1">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User */}
      <div className="px-4 py-4 border-t border-slate-200">
        <div className="flex items-center gap-3 mb-3 px-2">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-800 truncate">{user?.name}</p>
            <p className="text-xs text-slate-400 truncate">{user?.email}</p>
          </div>
        </div>
        <button onClick={onLogout} className="btn-ghost w-full text-red-500 hover:text-red-600 hover:bg-red-50">
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
