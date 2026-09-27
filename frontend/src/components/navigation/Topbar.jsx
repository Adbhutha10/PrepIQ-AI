import { Menu, Bell } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useLocation } from 'react-router-dom';

const PAGE_TITLES = {
  '/dashboard': 'Dashboard',
  '/interviews': 'My Interviews',
  '/interviews/new': 'Create New Interview',
  '/sessions': 'Session History',
  '/resumes': 'Resume Vault',
  '/profile': 'My Account',
};

export default function Topbar({ onMenuClick }) {
  const { user } = useAuthStore();
  const { pathname } = useLocation();
  const title = PAGE_TITLES[pathname] || 'PrepIQ AI';

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 flex-shrink-0 shadow-sm">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-lg text-slate-500 hover:text-indigo-700 hover:bg-indigo-50 lg:hidden transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-display font-semibold text-slate-900">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        <button className="p-2 rounded-lg text-slate-500 hover:text-indigo-700 hover:bg-indigo-50 transition-colors relative">
          <Bell className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-xs">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <span className="text-sm text-slate-700 font-medium hidden sm:block">{user?.name}</span>
        </div>
      </div>
    </header>
  );
}
