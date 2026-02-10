
import React, { useState } from 'react';
import { Task, TaskStatus, Priority, Category, SubTask, UserProfile } from '../types';
import { geminiService } from '../geminiService';
import { motion, AnimatePresence } from 'framer-motion';

// Fix: Added user prop to interface to match App.tsx usage
interface TaskManagerProps {
  tasks: Task[];
  user: UserProfile;
  onAdd: (task: Task) => void;
  onUpdate: (id: string, updates: Partial<Task>) => void;
  onDelete: (id: string) => void;
}

// Fix: Destructured user from props
const TaskManager: React.FC<TaskManagerProps> = ({ tasks, user, onAdd, onUpdate, onDelete }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [isBreakingDown, setIsBreakingDown] = useState<string | null>(null);
  const [filter, setFilter] = useState<Category | 'All'>('All');
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<Category>(Category.WORK);
  const [newPriority, setNewPriority] = useState<Priority>(Priority.MEDIUM);

  const handleAddTask = () => {
    if (!newTitle.trim()) return;
    const task: Task = {
      id: Math.random().toString(36).substr(2, 9),
      title: newTitle,
      description: '',
      category: newCategory,
      priority: newPriority,
      status: TaskStatus.PENDING,
      dueDate: new Date().toISOString(),
      subTasks: [],
      createdAt: Date.now()
    };
    onAdd(task);
    setNewTitle('');
    setIsAdding(false);
  };

  const handleBreakdown = async (taskId: string, title: string) => {
    setIsBreakingDown(taskId);
    try {
      const subTasks = await geminiService.breakdownTask(title);
      const subTaskObjects: SubTask[] = subTasks.map(t => ({
        id: Math.random().toString(36).substr(2, 5),
        title: t,
        completed: false
      }));
      onUpdate(taskId, { subTasks: subTaskObjects });
    } catch (e) { console.error(e); } finally { setIsBreakingDown(null); }
  };

  const filteredTasks = tasks.filter(t => filter === 'All' || t.category === filter);

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight transition-colors">Tasks</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Turn your "To-Do" into "Done".</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-indigo-600 text-white px-8 py-4 rounded-3xl font-black hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 dark:shadow-indigo-900/20 flex items-center gap-3 active:scale-95"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
          New Project
        </button>
      </div>

      <div className="flex items-center gap-3 overflow-x-auto pb-4 no-scrollbar">
        {['All', ...Object.values(Category)].map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat as any)}
            className={`px-6 py-3 rounded-2xl text-sm font-black whitespace-nowrap transition-all ${
              filter === cat 
              ? 'bg-slate-900 dark:bg-indigo-600 text-white shadow-lg' 
              : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence>
          {filteredTasks.map((task) => (
            <motion.div
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              key={task.id}
              className={`bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border-2 transition-all relative group flex flex-col justify-between h-full ${
                task.priority === 'High' ? 'border-rose-50 dark:border-rose-900/20' : 
                task.priority === 'Medium' ? 'border-amber-50 dark:border-amber-900/20' : 'border-blue-50 dark:border-blue-900/20'
              } hover:shadow-2xl hover:-translate-y-1`}
            >
              <div>
                <div className="flex justify-between items-center mb-6">
                  <div className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                    task.priority === 'High' ? 'bg-rose-600 text-white' : 
                    task.priority === 'Medium' ? 'bg-amber-500 text-white' : 'bg-blue-500 text-white'
                  }`}>
                    {task.priority}
                  </div>
                  <button onClick={() => onDelete(task.id)} className="text-slate-300 dark:text-slate-600 hover:text-rose-500 transition-colors p-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
                
                <h3 className={`text-2xl font-black mb-2 tracking-tight leading-tight transition-colors ${task.status === TaskStatus.COMPLETED ? 'line-through text-slate-300 dark:text-slate-700' : 'text-slate-900 dark:text-slate-100'}`}>
                  {task.title}
                </h3>
                <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-6">{task.category}</p>

                {task.subTasks.length > 0 && (
                  <div className="mb-8 space-y-3 bg-slate-50/50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 transition-colors">
                    {task.subTasks.map(st => (
                      <div key={st.id} className="flex items-center gap-3">
                        <input 
                          type="checkbox" 
                          checked={st.completed} 
                          onChange={() => {
                            const newSt = task.subTasks.map(s => s.id === st.id ? { ...s, completed: !s.completed } : s);
                            onUpdate(task.id, { subTasks: newSt });
                          }}
                          className="w-4 h-4 rounded-lg border-slate-300 dark:border-slate-700 text-indigo-600 focus:ring-indigo-500" 
                        />
                        <span className={`text-[11px] font-bold ${st.completed ? 'line-through text-slate-300 dark:text-slate-600 italic' : 'text-slate-600 dark:text-slate-400'}`}>{st.title}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-3 mt-auto">
                {!task.subTasks.length && (
                  <button 
                    disabled={isBreakingDown === task.id}
                    onClick={() => handleBreakdown(task.id, task.title)}
                    className="w-full py-4 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-black hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-all flex items-center justify-center gap-2"
                  >
                    {isBreakingDown === task.id ? '✨ Thinking...' : '✨ Auto-Breakdown'}
                  </button>
                )}
                <button 
                  onClick={() => onUpdate(task.id, { status: task.status === TaskStatus.COMPLETED ? TaskStatus.PENDING : TaskStatus.COMPLETED })}
                  className={`w-full py-4 rounded-[1.5rem] text-sm font-black transition-all ${
                    task.status === TaskStatus.COMPLETED 
                    ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400' 
                    : 'bg-slate-900 dark:bg-indigo-600 text-white shadow-xl shadow-slate-200 dark:shadow-none'
                  }`}
                >
                  {task.status === TaskStatus.COMPLETED ? 'Task Mastered' : 'Finish Task'}
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {isAdding && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-lg z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[3rem] shadow-2xl p-10 border border-slate-200 dark:border-slate-800"
          >
            <h2 className="text-3xl font-black mb-8 tracking-tight dark:text-white">Start New Project</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Project Title</label>
                <input 
                  type="text" 
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="What's the big idea?"
                  className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-0 outline-none transition-all font-bold text-lg dark:text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Category</label>
                  <select 
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as Category)}
                    className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 font-bold outline-none dark:text-white"
                  >
                    {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Priority</label>
                  <select 
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as Priority)}
                    className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 font-bold outline-none dark:text-white"
                  >
                    {Object.values(Priority).map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>
            </div>
            <div className="flex gap-4 mt-12">
              <button onClick={() => setIsAdding(false)} className="flex-1 py-5 rounded-2xl text-slate-500 dark:text-slate-400 font-black hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Discard</button>
              <button onClick={handleAddTask} className="flex-1 py-5 bg-indigo-600 text-white rounded-3xl font-black hover:bg-indigo-700 shadow-xl shadow-indigo-100 dark:shadow-none transition-all active:scale-95">Launch Project</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default TaskManager;
