
import React, { useState, useMemo } from 'react';
import { Task, Priority, Category, TaskStatus, UserProfile } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { geminiService } from '../geminiService';

// Fix: Added user prop to interface to match App.tsx usage
interface CalendarProps {
  tasks: Task[];
  user: UserProfile;
  onAddTask: (task: Task) => void;
}

// Fix: Destructured user from props
const Calendar: React.FC<CalendarProps> = ({ tasks, user, onAddTask }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<number | null>(new Date().getDate());
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [isInsightLoading, setIsInsightLoading] = useState(false);
  const [isSuggestingTask, setIsSuggestingTask] = useState(false);
  const [suggestedTask, setSuggestedTask] = useState<{ title: string; category: Category; priority: Priority } | null>(null);

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
  const daysInMonth = useMemo(() => {
    return new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  }, [currentDate]);

  const firstDayOfMonth = useMemo(() => {
    return new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  }, [currentDate]);

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    setSelectedDay(null);
    setAiInsight(null);
    setSuggestedTask(null);
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    setSelectedDay(null);
    setAiInsight(null);
    setSuggestedTask(null);
  };

  const tasksByDay = useMemo(() => {
    const map: Record<number, Task[]> = {};
    tasks.forEach(task => {
      const taskDate = new Date(task.dueDate);
      if (taskDate.getMonth() === currentDate.getMonth() && taskDate.getFullYear() === currentDate.getFullYear()) {
        const day = taskDate.getDate();
        if (!map[day]) map[day] = [];
        map[day].push(task);
      }
    });
    return map;
  }, [tasks, currentDate]);

  const handleGetAiInsight = async () => {
    if (!selectedDay) return;
    setIsInsightLoading(true);
    const dayTasks = tasksByDay[selectedDay] || [];
    const dateStr = `${monthNames[currentDate.getMonth()]} ${selectedDay}, ${currentDate.getFullYear()}`;
    
    try {
      const insight = await geminiService.optimizeDay(dateStr, dayTasks);
      setAiInsight(insight);
    } catch (e) {
      setAiInsight("Unable to generate schedule strategy.");
    } finally {
      setIsInsightLoading(false);
    }
  };

  const handleSuggestTask = async () => {
    setIsSuggestingTask(true);
    try {
      const suggestion = await geminiService.suggestTask(tasks);
      setSuggestedTask(suggestion);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSuggestingTask(false);
    }
  };

  const handleAddSuggested = () => {
    if (!suggestedTask || !selectedDay) return;
    
    const d = new Date(currentDate.getFullYear(), currentDate.getMonth(), selectedDay);
    const newTask: Task = {
      id: Math.random().toString(36).substr(2, 9),
      title: suggestedTask.title,
      description: 'Suggested by AI',
      category: suggestedTask.category,
      priority: suggestedTask.priority,
      status: TaskStatus.PENDING,
      dueDate: d.toISOString(),
      subTasks: [],
      createdAt: Date.now()
    };
    onAddTask(newTask);
    setSuggestedTask(null);
  };

  const selectedDayTasks = selectedDay ? tasksByDay[selectedDay] || [] : [];

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">AI Calendar</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Strategically mapping your journey.</p>
        </div>
        <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-2 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
          <button onClick={prevMonth} className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors dark:text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <span className="font-black text-slate-700 dark:text-slate-200 min-w-[140px] text-center">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </span>
          <button onClick={nextMonth} className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors dark:text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-[3rem] p-8 shadow-sm border border-slate-100 dark:border-slate-800">
          <div className="grid grid-cols-7 gap-1 mb-4 text-center">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-600 py-2">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {[...Array(firstDayOfMonth)].map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square" />
            ))}
            {[...Array(daysInMonth)].map((_, i) => {
              const day = i + 1;
              const hasTasks = tasksByDay[day] && tasksByDay[day].length > 0;
              const isToday = day === new Date().getDate() && currentDate.getMonth() === new Date().getMonth() && currentDate.getFullYear() === new Date().getFullYear();
              const isSelected = selectedDay === day;

              return (
                <button
                  key={day}
                  onClick={() => {
                    setSelectedDay(day);
                    setAiInsight(null);
                    setSuggestedTask(null);
                  }}
                  className={`relative aspect-square rounded-2xl flex flex-col items-center justify-center transition-all border-2 ${
                    isSelected 
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-200 dark:shadow-none scale-105 z-10' 
                      : isToday 
                        ? 'bg-indigo-50 dark:bg-indigo-900/40 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-400' 
                        : 'bg-transparent border-transparent text-slate-700 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <span className="text-lg font-black">{day}</span>
                  {hasTasks && (
                    <div className="absolute bottom-2 flex gap-1">
                      {tasksByDay[day].slice(0, 3).map((t, idx) => (
                        <div 
                          key={idx} 
                          className={`w-1 h-1 rounded-full ${
                            isSelected ? 'bg-white' : 
                            t.priority === Priority.HIGH ? 'bg-rose-500' : 
                            t.priority === Priority.MEDIUM ? 'bg-amber-500' : 'bg-blue-500'
                          }`} 
                        />
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {selectedDay ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white dark:bg-slate-900 rounded-[3rem] p-8 shadow-sm border border-slate-100 dark:border-slate-800 h-full flex flex-col"
              >
                <div className="mb-8">
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">
                    {monthNames[currentDate.getMonth()]} {selectedDay}
                  </h2>
                  <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">Daily Mission Overview</p>
                </div>

                <div className="flex-1 space-y-4 mb-8 overflow-y-auto max-h-[400px] no-scrollbar">
                  {selectedDayTasks.length > 0 ? (
                    selectedDayTasks.map(task => (
                      <div key={task.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${
                            task.priority === Priority.HIGH ? 'bg-rose-500' : 
                            task.priority === Priority.MEDIUM ? 'bg-amber-500' : 'bg-blue-500'
                          }`} />
                          <span className="text-sm font-bold text-slate-700 dark:text-slate-300 line-clamp-1">{task.title}</span>
                        </div>
                        <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{task.category}</span>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full space-y-6 py-10">
                      <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-3xl flex items-center justify-center text-slate-300 dark:text-slate-600">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                      </div>
                      <div className="text-center">
                        <p className="text-slate-500 dark:text-slate-400 font-bold mb-4">No tasks scheduled.</p>
                        
                        {!suggestedTask ? (
                          <button 
                            onClick={handleSuggestTask}
                            disabled={isSuggestingTask}
                            className="text-indigo-600 dark:text-indigo-400 font-black text-sm hover:underline flex items-center gap-2 mx-auto disabled:opacity-50"
                          >
                            {isSuggestingTask ? '✨ Thinking...' : '✨ Suggest a task for this day'}
                          </button>
                        ) : (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-indigo-50 dark:bg-indigo-900/30 p-6 rounded-3xl border border-indigo-100 dark:border-indigo-800/50 text-left"
                          >
                            <p className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-2">AI Suggestion</p>
                            <h4 className="text-slate-900 dark:text-white font-black mb-1">{suggestedTask.title}</h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">{suggestedTask.category} • {suggestedTask.priority} Priority</p>
                            <button 
                              onClick={handleAddSuggested}
                              className="w-full py-3 bg-indigo-600 text-white rounded-xl font-black text-xs hover:bg-indigo-700 shadow-lg shadow-indigo-100 dark:shadow-none transition-all"
                            >
                              Add to Calendar
                            </button>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {selectedDayTasks.length > 0 && (
                  <div className="mt-auto pt-6 border-t border-slate-100 dark:border-slate-800">
                    {!aiInsight ? (
                      <button 
                        onClick={handleGetAiInsight}
                        disabled={isInsightLoading}
                        className="w-full py-4 bg-slate-900 dark:bg-indigo-600 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-xl shadow-slate-100 dark:shadow-none disabled:opacity-50"
                      >
                        {isInsightLoading ? '✨ Thinking...' : '✨ Optimize Day Strategy'}
                      </button>
                    ) : (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-indigo-50 dark:bg-indigo-900/30 p-5 rounded-2xl border border-indigo-100 dark:border-indigo-800"
                      >
                        <h4 className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                          AI Strategy
                        </h4>
                        <p className="text-xs text-indigo-800 dark:text-indigo-300 font-medium leading-relaxed italic">
                          "{aiInsight}"
                        </p>
                      </motion.div>
                    )}
                  </div>
                )}
              </motion.div>
            ) : (
              <div className="bg-slate-50 dark:bg-slate-900/40 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-center h-full min-h-[400px]">
                <p className="text-slate-400 dark:text-slate-600 font-bold">Select a date to view missions</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
