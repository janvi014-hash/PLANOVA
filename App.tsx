
import React, { useState, useEffect } from 'react';
import { Task, TaskStatus, JournalEntry, UserProfile, View } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import TaskManager from './components/TaskManager';
import Journal from './components/Journal';
import VideoSuggestions from './components/VideoSuggestions';
import Analytics from './components/Analytics';
import Settings from './components/Settings';
import Calendar from './components/Calendar';
import { geminiService } from './geminiService';
import { motion, AnimatePresence } from 'framer-motion';

const STORAGE_KEY = 'planova_app_data_v1';
const THEME_KEY = 'planova_theme_preference';

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem(THEME_KEY);
    return saved ? JSON.parse(saved) : false;
  });
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [user, setUser] = useState<UserProfile>({
    name: 'Alex Rivera',
    email: 'alex@example.com',
    isPro: false,
    streak: 5,
    joinedDate: new Date().toISOString(),
    themeColor: 'indigo'
  });
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [dailyQuote, setDailyQuote] = useState<string>('');
  const [loadingQuote, setLoadingQuote] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      setTasks(parsed.tasks || []);
      setJournalEntries(parsed.journalEntries || []);
      setUser(prev => ({ ...prev, ...parsed.user }));
    }
    fetchQuote();
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ tasks, journalEntries, user }));
  }, [tasks, journalEntries, user]);

  useEffect(() => {
    localStorage.setItem(THEME_KEY, JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const fetchQuote = async () => {
    setLoadingQuote(true);
    try {
      const quote = await geminiService.getDailyQuote();
      setDailyQuote(quote);
    } catch (err) {
      setDailyQuote("Small steps in the right direction can turn into the biggest steps of your life.");
    } finally {
      setLoadingQuote(false);
    }
  };

  const addTask = (task: Task) => setTasks([...tasks, task]);
  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, ...updates } : t));
  };
  const deleteTask = (id: string) => setTasks(tasks.filter(t => t.id !== id));
  const addJournalEntry = (entry: JournalEntry) => setJournalEntries([entry, ...journalEntries]);

  const toggleView = (view: View) => {
    setCurrentView(view);
    setIsMobileSidebarOpen(false);
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <Dashboard tasks={tasks} user={user} quote={dailyQuote} loadingQuote={loadingQuote} onTaskUpdate={updateTask} />;
      case 'tasks': return <TaskManager tasks={tasks} user={user} onAdd={addTask} onUpdate={updateTask} onDelete={deleteTask} />;
      case 'calendar': return <Calendar tasks={tasks} user={user} onAddTask={addTask} />;
      case 'journal': return <Journal entries={journalEntries} user={user} onAdd={addJournalEntry} />;
      case 'suggestions': return <VideoSuggestions tasks={tasks} user={user} />;
      case 'analytics': return <Analytics tasks={tasks} journal={journalEntries} user={user} />;
      case 'settings': return <Settings user={user} onUpdateUser={setUser} />;
      default: return <Dashboard tasks={tasks} user={user} quote={dailyQuote} loadingQuote={loadingQuote} onTaskUpdate={updateTask} />;
    }
  };

  return (
    <div className={`flex h-screen overflow-hidden transition-colors duration-300 ${darkMode ? 'dark bg-slate-950' : 'bg-[#F8FAFC]'}`}>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex h-full border-r border-slate-200 dark:border-slate-800 w-72 shrink-0">
        <Sidebar 
          currentView={currentView} 
          onViewChange={toggleView} 
          user={user} 
          darkMode={darkMode} 
          onToggleDarkMode={() => setDarkMode(!darkMode)} 
        />
      </div>
      
      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileSidebarOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] md:hidden"
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-72 bg-white dark:bg-slate-900 z-[110] md:hidden shadow-2xl"
            >
              <Sidebar 
                currentView={currentView} 
                onViewChange={toggleView} 
                user={user} 
                isMobile 
                darkMode={darkMode} 
                onToggleDarkMode={() => setDarkMode(!darkMode)}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Mobile Top Header */}
        <header className="md:hidden flex items-center justify-between p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 sticky top-0 z-[50]">
          <button 
            onClick={() => setIsMobileSidebarOpen(true)}
            className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-lg transition-colors duration-300 ${
              user.themeColor === 'emerald' ? 'bg-emerald-600' :
              user.themeColor === 'rose' ? 'bg-rose-600' :
              user.themeColor === 'amber' ? 'bg-amber-600' :
              user.themeColor === 'violet' ? 'bg-violet-600' :
              user.themeColor === 'cyan' ? 'bg-cyan-600' : 'bg-indigo-600'
            }`}>P</div>
            <span className="font-bold dark:text-white tracking-tight text-lg">PLANOVA</span>
          </div>

          <button 
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            {darkMode ? (
              <svg className="w-6 h-6 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" /></svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
            )}
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-10 no-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.02, y: -10 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="max-w-6xl mx-auto h-full"
            >
              {renderView()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default App;
