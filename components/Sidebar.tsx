
import React from 'react';
import { View, UserProfile } from '../types';

interface SidebarProps {
  currentView: View;
  onViewChange: (view: View) => void;
  user: UserProfile;
  isMobile?: boolean;
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  currentView, 
  onViewChange, 
  user, 
  isMobile = false, 
  darkMode, 
  onToggleDarkMode 
}) => {
  const menuItems: { id: View; label: string; icon: React.ReactNode }[] = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg> 
    },
    { 
      id: 'calendar', 
      label: 'AI Calendar', 
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg> 
    },
    { 
      id: 'tasks', 
      label: 'My Tasks', 
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg> 
    },
    { 
      id: 'journal', 
      label: 'Journal', 
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg> 
    },
    { 
      id: 'suggestions', 
      label: 'Learning', 
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> 
    },
    { 
      id: 'analytics', 
      label: 'Stats', 
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg> 
    },
    { 
      id: 'settings', 
      label: 'Settings', 
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg> 
    }
  ];

  const getThemeClass = (color: string) => {
    switch (color) {
      case 'emerald': return 'bg-emerald-600 shadow-emerald-100';
      case 'rose': return 'bg-rose-600 shadow-rose-100';
      case 'amber': return 'bg-amber-600 shadow-amber-100';
      case 'violet': return 'bg-violet-600 shadow-violet-100';
      case 'cyan': return 'bg-cyan-600 shadow-cyan-100';
      case 'teal': return 'bg-teal-600 shadow-teal-100';
      case 'orange': return 'bg-orange-600 shadow-orange-100';
      case 'fuchsia': return 'bg-fuchsia-600 shadow-fuchsia-100';
      case 'sky': return 'bg-sky-600 shadow-sky-100';
      case 'slate': return 'bg-slate-700 shadow-slate-100';
      case 'lime': return 'bg-lime-600 shadow-lime-100';
      default: return 'bg-indigo-600 shadow-indigo-100';
    }
  };

  const getGradientClass = (color: string) => {
    switch (color) {
      case 'emerald': return 'from-emerald-600 to-teal-600';
      case 'rose': return 'from-rose-600 to-pink-600';
      case 'amber': return 'from-amber-600 to-orange-600';
      case 'violet': return 'from-violet-600 to-fuchsia-600';
      case 'cyan': return 'from-cyan-600 to-blue-600';
      case 'teal': return 'from-teal-600 to-emerald-600';
      case 'orange': return 'from-orange-600 to-amber-600';
      case 'fuchsia': return 'from-fuchsia-600 to-purple-600';
      case 'sky': return 'from-sky-600 to-cyan-600';
      case 'slate': return 'from-slate-700 to-slate-500';
      case 'lime': return 'from-lime-600 to-green-600';
      default: return 'from-indigo-600 to-violet-600';
    }
  };

  return (
    <aside className="flex flex-col h-full bg-white dark:bg-slate-900 transition-all duration-300 w-full overflow-y-auto no-scrollbar">
      <div className="p-6 flex-1">
        <div className="flex items-center justify-between mb-10">
          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-white font-black shadow-xl transition-all duration-300 ${getThemeClass(user.themeColor)}`}>P</div>
              <span className={`text-2xl font-black bg-gradient-to-r ${getGradientClass(user.themeColor)} bg-clip-text text-transparent tracking-tight uppercase`}>PLANOVA</span>
            </div>
            <p className="text-[9px] font-black text-slate-400 dark:text-slate-600 mt-1.5 ml-1 tracking-[0.25em] uppercase">Learn • Plan • Grow</p>
          </div>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`flex items-center gap-4 w-full px-5 py-4 text-sm font-black rounded-2xl transition-all ${
                currentView === item.id 
                  ? `${getThemeClass(user.themeColor)} text-white shadow-xl dark:shadow-none` 
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span className={`transition-colors ${currentView === item.id ? 'text-white' : 'text-slate-400'}`}>
                {item.icon}
              </span>
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="p-6 border-t border-slate-100 dark:border-slate-800">
        <button 
          onClick={onToggleDarkMode}
          className="w-full flex items-center gap-4 px-5 py-4 mb-6 text-sm font-black text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl transition-all"
        >
          {darkMode ? (
            <>
              <svg className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" /></svg>
              Light Mode
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
              Dark Mode
            </>
          )}
        </button>

        <div className="flex items-center gap-4 p-2 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
          <img src={`https://picsum.photos/seed/${user.name}/100/100`} alt="Profile" className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-700 object-cover" />
          <div className="flex-1 overflow-hidden">
            <p className="text-xs font-black truncate dark:text-white">{user.name}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{user.isPro ? 'Pro' : 'Free'}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
