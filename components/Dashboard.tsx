
import React, { useMemo } from 'react';
import { Task, UserProfile, TaskStatus } from '../types';
import { motion } from 'framer-motion';

interface DashboardProps {
  tasks: Task[];
  user: UserProfile;
  quote: string;
  loadingQuote: boolean;
  onTaskUpdate: (id: string, updates: Partial<Task>) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ tasks, user, quote, loadingQuote, onTaskUpdate }) => {
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Rise & Shine";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  }, []);

  const todayTasks = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return tasks.filter(t => t.dueDate.startsWith(today));
  }, [tasks]);

  const completedCount = todayTasks.filter(t => t.status === TaskStatus.COMPLETED).length;
  const progressPercent = todayTasks.length > 0 ? (completedCount / todayTasks.length) * 100 : 0;

  const getThemeText = (color: string) => {
    switch (color) {
      case 'emerald': return 'text-emerald-600 dark:text-emerald-400';
      case 'rose': return 'text-rose-600 dark:text-rose-400';
      case 'amber': return 'text-amber-600 dark:text-amber-400';
      case 'violet': return 'text-violet-600 dark:text-violet-400';
      case 'cyan': return 'text-cyan-600 dark:text-cyan-400';
      case 'teal': return 'text-teal-600 dark:text-teal-400';
      case 'orange': return 'text-orange-600 dark:text-orange-400';
      case 'fuchsia': return 'text-fuchsia-600 dark:text-fuchsia-400';
      case 'sky': return 'text-sky-600 dark:text-sky-400';
      case 'slate': return 'text-slate-700 dark:text-slate-300';
      case 'lime': return 'text-lime-600 dark:text-lime-400';
      default: return 'text-indigo-600 dark:text-indigo-400';
    }
  };

  const getThemeGradient = (color: string) => {
    switch (color) {
      case 'emerald': return 'from-emerald-500 to-teal-600';
      case 'rose': return 'from-rose-500 to-pink-600';
      case 'amber': return 'from-amber-500 to-orange-600';
      case 'violet': return 'from-violet-500 to-fuchsia-600';
      case 'cyan': return 'from-cyan-500 to-blue-600';
      case 'teal': return 'from-teal-500 to-emerald-600';
      case 'orange': return 'from-orange-500 to-amber-600';
      case 'fuchsia': return 'from-fuchsia-500 to-purple-600';
      case 'sky': return 'from-sky-500 to-cyan-600';
      case 'slate': return 'from-slate-700 to-slate-500';
      case 'lime': return 'from-lime-500 to-green-600';
      default: return 'from-indigo-500 to-violet-600';
    }
  };

  const getThemeBg = (color: string) => {
    switch (color) {
      case 'emerald': return 'bg-emerald-100 dark:bg-emerald-900/40';
      case 'rose': return 'bg-rose-100 dark:bg-rose-900/40';
      case 'amber': return 'bg-amber-100 dark:bg-amber-900/40';
      case 'violet': return 'bg-violet-100 dark:bg-violet-900/40';
      case 'cyan': return 'bg-cyan-100 dark:bg-cyan-900/40';
      case 'teal': return 'bg-teal-100 dark:bg-teal-900/40';
      case 'orange': return 'bg-orange-100 dark:bg-orange-900/40';
      case 'fuchsia': return 'bg-fuchsia-100 dark:bg-fuchsia-900/40';
      case 'sky': return 'bg-sky-100 dark:bg-sky-900/40';
      case 'slate': return 'bg-slate-100 dark:bg-slate-800';
      case 'lime': return 'bg-lime-100 dark:bg-lime-900/40';
      default: return 'bg-indigo-100 dark:bg-indigo-900/40';
    }
  };

  return (
    <div className="space-y-10 pb-10">
      <header className="flex items-center justify-between">
        <div>
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-black text-slate-900 dark:text-white tracking-tight transition-colors"
          >
            {greeting}, <span className={getThemeText(user.themeColor)}>{user.name.split(' ')[0]}</span>
          </motion.h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium italic transition-colors">"Your future is created by what you do today."</p>
        </div>
        <div className="hidden md:block">
           <div className={`w-14 h-14 ${getThemeBg(user.themeColor)} rounded-3xl flex items-center justify-center ${getThemeText(user.themeColor)} shadow-inner transition-colors duration-300`}>
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
           </div>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-orange-500 via-rose-500 to-pink-600 p-8 rounded-[2.5rem] text-white shadow-2xl shadow-rose-200/50 dark:shadow-rose-900/20"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-white/80 font-bold uppercase tracking-widest text-[10px]">Active Streak</p>
              <h2 className="text-5xl font-black mt-2 tracking-tighter">{user.streak}</h2>
              <p className="text-xl font-bold opacity-90">Days strong!</p>
            </div>
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/30">
              <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1014 0c0-1.187-.249-2.315-.699-3.334a1 1 0 00-1.04-.577c-1.25.193-2.38.643-3.336 1.325-.436.312-.782.687-1.051 1.077-.27.39-.44.823-.532 1.251-.082.383-.11.751-.11 1.076 0 .426.04.832.11 1.218.069.385.176.745.313 1.076.137.33.313.626.52.88a1 1 0 01-1.54 1.28c-.295-.355-.544-.766-.74-1.222a7.01 7.01 0 01-.435-1.521 8.94 8.94 0 01-.157-1.742c0-.528.053-1.072.158-1.616.105-.544.275-1.091.503-1.637.456-1.092 1.116-2.14 1.905-3.085a10.96 10.96 0 012.348-2.185z" clipRule="evenodd" /></svg>
            </div>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ scale: 1.01 }}
          className={`md:col-span-2 bg-gradient-to-br ${getThemeGradient(user.themeColor)} p-8 rounded-[2.5rem] text-white shadow-2xl shadow-indigo-200/50 dark:shadow-indigo-900/20 flex flex-col justify-between transition-all duration-300`}
        >
          <div>
            <div className="flex items-center gap-2 mb-4">
               <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
               <span className="text-white/70 text-[10px] font-bold uppercase tracking-widest">AI Insights</span>
            </div>
            <p className="text-2xl font-semibold leading-snug tracking-tight">
              {loadingQuote ? 'Consulting the oracle...' : `"${quote}"`}
            </p>
          </div>
          <div className="mt-6 pt-6 border-t border-white/10 flex justify-between items-center">
            <p className="text-white/60 text-xs font-medium">Daily Wisdom for {user.name.split(' ')[0]}</p>
            <div className="flex -space-x-2">
               {[1,2,3].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-white/20 bg-white/10 overflow-hidden shadow-sm backdrop-blur-sm">
                  <img src={`https://i.pravatar.cc/150?u=${i*123}`} alt="" />
               </div>)}
            </div>
          </div>
        </motion.div>
      </section>

      <section className="bg-white dark:bg-slate-900 p-6 md:p-10 rounded-[3rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-slate-100 dark:border-slate-800 transition-colors duration-300">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Today's Missions</h2>
            <p className="text-slate-400 dark:text-slate-500 mt-1 font-medium">You've completed <span className={`${getThemeText(user.themeColor)} font-bold`}>{completedCount}</span> of your <span className="text-slate-900 dark:text-slate-300 font-bold">{todayTasks.length}</span> goals.</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-4">
               <span className={`text-3xl font-black ${getThemeText(user.themeColor)}`}>{progressPercent.toFixed(0)}%</span>
               <div className="w-48 h-4 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-50 dark:border-slate-700">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`h-full bg-gradient-to-r ${getThemeGradient(user.themeColor)} shadow-inner`}
                  />
               </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {todayTasks.length > 0 ? (
            todayTasks.map((task) => (
              <motion.div 
                layout
                key={task.id} 
                className={`group flex items-center justify-between p-6 rounded-[2rem] border transition-all ${
                  task.status === TaskStatus.COMPLETED 
                  ? 'bg-slate-50/50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800 opacity-75' 
                  : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 hover:shadow-xl'
                }`}
              >
                <div className="flex items-center gap-5">
                  <button 
                    onClick={() => onTaskUpdate(task.id, { status: task.status === TaskStatus.COMPLETED ? TaskStatus.PENDING : TaskStatus.COMPLETED })}
                    className={`w-8 h-8 rounded-2xl border-2 flex items-center justify-center transition-all ${
                      task.status === TaskStatus.COMPLETED 
                        ? 'bg-emerald-500 border-emerald-500 text-white rotate-0' 
                        : `border-slate-200 dark:border-slate-700 group-hover:border-indigo-400 rotate-12 group-hover:rotate-0`
                    }`}
                  >
                    {task.status === TaskStatus.COMPLETED && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                  </button>
                  <div>
                    <h3 className={`font-bold text-lg leading-tight transition-all ${task.status === TaskStatus.COMPLETED ? 'line-through text-slate-400 dark:text-slate-600' : 'text-slate-900 dark:text-slate-200'}`}>{task.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                       <span className={`text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-tighter ${
                          task.priority === 'High' ? 'bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400' : 
                          task.priority === 'Medium' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                       }`}>
                          {task.priority}
                       </span>
                       <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest">{task.category}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-20 bg-slate-50/50 dark:bg-slate-800/20 rounded-[2.5rem] border-4 border-dashed border-slate-100 dark:border-slate-800">
              <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300 dark:text-slate-600 shadow-sm">
                 <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
              </div>
              <p className="text-slate-400 dark:text-slate-500 font-bold">Your agenda is clear. Enjoy the peace!</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
