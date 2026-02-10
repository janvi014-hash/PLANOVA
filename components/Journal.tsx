
import React, { useState } from 'react';
import { JournalEntry, UserProfile } from '../types';
import { geminiService } from '../geminiService';
import { motion, AnimatePresence } from 'framer-motion';

// Fix: Added user prop to interface to match App.tsx usage
interface JournalProps {
  entries: JournalEntry[];
  user: UserProfile;
  onAdd: (entry: JournalEntry) => void;
}

// Fix: Destructured user from props
const Journal: React.FC<JournalProps> = ({ entries, user, onAdd }) => {
  const [content, setContent] = useState('');
  const [learnings, setLearnings] = useState('');
  const [mood, setMood] = useState('😊');
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [activeTab, setActiveTab] = useState<'write' | 'history'>('write');

  const handleSubmit = async () => {
    if (!content.trim() && !learnings.trim()) return;

    setIsSummarizing(true);
    let summary = '';
    try {
      summary = await geminiService.summarizeJournal(content, learnings);
    } catch (e) {
      summary = "Reflected on the day's achievements.";
    }

    const entry: JournalEntry = {
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString(),
      content,
      learnings,
      mood,
      aiSummary: summary
    };

    onAdd(entry);
    setContent('');
    setLearnings('');
    setIsSummarizing(false);
    setActiveTab('history');
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Journal</h1>
        <p className="text-slate-500">Document your growth and insights.</p>
      </div>

      <div className="flex bg-white p-1 rounded-2xl w-fit shadow-sm border border-slate-200">
        <button 
          onClick={() => setActiveTab('write')}
          className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'write' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-900'}`}
        >
          Daily Log
        </button>
        <button 
          onClick={() => setActiveTab('history')}
          className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'history' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-900'}`}
        >
          History
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'write' ? (
          <motion.div 
            key="write"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            <div className="bg-white p-8 rounded-3xl border border-slate-200 space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Reflections</label>
                <textarea 
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="How was your day? What's on your mind?"
                  className="w-full h-40 px-4 py-3 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Key Learnings</label>
                <textarea 
                  value={learnings}
                  onChange={(e) => setLearnings(e.target.value)}
                  placeholder="What did you learn today?"
                  className="w-full h-32 px-4 py-3 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase mb-2">Current Mood</p>
                  <div className="flex gap-2">
                    {['😊', '🚀', '🧘', '😴', '💪'].map(m => (
                      <button 
                        key={m}
                        onClick={() => setMood(m)}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all ${mood === m ? 'bg-indigo-100 scale-110' : 'bg-slate-50 hover:bg-slate-100'}`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
                <button 
                  onClick={handleSubmit}
                  disabled={isSummarizing || (!content && !learnings)}
                  className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 disabled:opacity-50 flex items-center gap-2"
                >
                  {isSummarizing ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Analyzing...
                    </>
                  ) : 'Save Reflection'}
                </button>
              </div>
            </div>

            <div className="bg-indigo-50 p-8 rounded-3xl border border-indigo-100 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-indigo-100 rounded-3xl flex items-center justify-center text-indigo-600 mb-6">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-indigo-900 mb-2">The Power of Reflection</h3>
              <p className="text-indigo-700 text-sm leading-relaxed">
                Regular journaling improves mental clarity, boosts productivity by 25%, and helps solidify new neural pathways for learning. Our AI will help summarize your journey.
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="history"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {entries.length > 0 ? (
              entries.map(entry => (
                <div key={entry.id} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-xl font-bold">{new Date(entry.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h3>
                      <span className="text-2xl">{entry.mood}</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-6">
                      <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Thoughts</h4>
                        <p className="text-slate-700 whitespace-pre-wrap">{entry.content}</p>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Learnings</h4>
                        <p className="text-indigo-700 font-medium">{entry.learnings}</p>
                      </div>
                    </div>
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                      <h4 className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-3 flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.3 1.047a1 1 0 01.897.95l.136 2.625c.163.036.323.076.48.118l1.716-2.022a1 1 0 011.517.072l1.623 2.164a1 1 0 01-.154 1.392l-2.074 1.645c.08.187.15.378.21.572l2.601.37a1 1 0 01.859.991l.032 2.709a1 1 0 01-.937.994l-2.613.256c-.05.198-.108.393-.175.584l1.867 1.884a1 1 0 01.037 1.41l-1.916 1.915a1 1 0 01-1.41.038l-1.884-1.868c-.19.066-.385.124-.583.174l-.256 2.614a1 1 0 01-.994.937l-2.709-.032a1 1 0 01-.991-.859l-.37-2.601c-.194-.06-.385-.13-.572-.21L5.94 18.94a1 1 0 01-1.392.154l-2.164-1.623a1 1 0 01-.072-1.517l2.022-1.716a5.253 5.253 0 01-.118-.48l-2.625-.136a1 1 0 01-.95-.897l-.032-2.709a1 1 0 01.937-.994l2.614-.256c.05-.198.108-.393.174-.583L2.468 6.468a1 1 0 01-.038-1.41l1.915-1.916a1 1 0 011.41-.037l1.884 1.867c.19-.067.385-.125.584-.175l.256-2.613a1 1 0 01.994-.937l2.709.032zM10 12a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
                        AI Summary
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed italic">
                        "{entry.aiSummary}"
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20 bg-white rounded-3xl border border-slate-200">
                <p className="text-slate-400">No memories recorded yet.</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Journal;
