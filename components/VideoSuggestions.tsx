
import React, { useState, useEffect } from 'react';
import { Task, UserProfile } from '../types';
import { geminiService } from '../geminiService';
import { motion, AnimatePresence } from 'framer-motion';

interface VideoSuggestionsProps {
  tasks: Task[];
  user?: UserProfile;
}

const VideoSuggestions: React.FC<VideoSuggestionsProps> = ({ tasks, user }) => {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (tasks.length > 0) {
      loadSuggestions();
    }
  }, [tasks.length]);

  const loadSuggestions = async () => {
    setLoading(true);
    setLoadedImages({}); // Reset image tracking on new suggestions
    try {
      const data = await geminiService.getYouTubeSuggestions(tasks);
      setSuggestions(data);
    } catch (e) {
      console.error("Failed to load video suggestions:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleImageLoad = (idx: number) => {
    setLoadedImages(prev => ({ ...prev, [idx]: true }));
  };

  const isPro = user?.isPro || false;

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Learning Hub</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">AI-curated content matching your active missions.</p>
        </div>
        <button 
          onClick={loadSuggestions}
          disabled={loading || tasks.length === 0}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 px-6 py-3 rounded-2xl font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center gap-2 shadow-sm disabled:opacity-50 active:scale-95"
        >
          <svg className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh Library
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white dark:bg-slate-900 rounded-[2.5rem] h-96 border border-slate-100 dark:border-slate-800 animate-pulse" />
          ))}
        </div>
      ) : suggestions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {suggestions.map((video, idx) => (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.4 }}
              key={idx}
              className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-indigo-500/5 transition-all group border-b-4 border-b-rose-50 dark:border-b-rose-900/20 flex flex-col"
            >
              <div className="p-8 flex flex-col h-full">
                {/* Title Section */}
                <div className="mb-4">
                  <h3 className="font-black text-xl text-slate-900 dark:text-white leading-tight line-clamp-2 group-hover:text-rose-600 transition-colors">
                    {video.title}
                  </h3>
                </div>

                {/* Thumbnail Section - Positioned below title and above channel name */}
                <div className="relative aspect-video bg-slate-50 dark:bg-slate-950 overflow-hidden rounded-2xl mb-6 shadow-inner group-hover:scale-[1.02] transition-transform duration-500">
                  {/* Skeleton Loader Overlay */}
                  {!loadedImages[idx] && (
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-100 via-slate-50 to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 animate-pulse flex items-center justify-center">
                      <svg className="w-12 h-12 text-slate-200 dark:text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  
                  <img 
                    src={`https://picsum.photos/seed/${encodeURIComponent(video.title)}/800/450`} 
                    alt={video.title} 
                    onLoad={() => handleImageLoad(idx)}
                    className={`w-full h-full object-cover transition-opacity duration-500 ${loadedImages[idx] ? 'opacity-100' : 'opacity-0'}`} 
                  />
                  
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
                  
                  {loadedImages[idx] && (
                    <div className="absolute bottom-3 right-3 bg-black/90 backdrop-blur-md text-white text-[10px] px-2 py-1 rounded-lg font-black tracking-widest uppercase shadow-lg">
                      {video.duration}
                    </div>
                  )}
                </div>

                {/* Channel Section */}
                <div className="flex items-center gap-3 mb-8 mt-auto">
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-900/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-black text-xs border border-indigo-100 dark:border-indigo-800 shadow-sm">
                    {video.channelName.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-700 dark:text-slate-200">{video.channelName}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Verified Educator</p>
                  </div>
                </div>

                {/* Action Section */}
                <a 
                  href={video.searchUrl || `https://www.youtube.com/results?search_query=${encodeURIComponent(video.title)}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-3 py-4 bg-slate-900 dark:bg-indigo-600 text-white rounded-2xl text-sm font-black hover:bg-rose-600 transition-all shadow-lg active:scale-95"
                >
                  Watch Now
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </a>
              </div>
            </motion.div>
          ))}

          {/* Pro Plan Teaser Card */}
          {!isPro && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-indigo-600 via-violet-700 to-fuchsia-800 rounded-[2.5rem] p-10 text-white flex flex-col justify-between shadow-2xl shadow-indigo-200 dark:shadow-none min-h-[450px]"
            >
              <div>
                <div className="bg-white/20 w-14 h-14 rounded-3xl flex items-center justify-center mb-8 backdrop-blur-md border border-white/20 animate-float">
                   <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                </div>
                <h3 className="text-3xl font-black mb-4 leading-tight tracking-tight">Expand Your Knowledge Horizon</h3>
                <p className="text-indigo-100 font-medium mb-8 leading-relaxed opacity-90">
                  You've reached your free content limit for today. Upgrade to PLANOVA Pro to unlock personalized skill roadmaps and 100+ daily AI-curated tutorials.
                </p>
                <div className="grid grid-cols-1 gap-3 mb-10">
                  <div className="flex items-center gap-3 text-sm font-bold bg-white/10 p-3 rounded-2xl backdrop-blur-sm border border-white/5">
                    <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    Infinite AI Suggestions
                  </div>
                  <div className="flex items-center gap-3 text-sm font-bold bg-white/10 p-3 rounded-2xl backdrop-blur-sm border border-white/5">
                    <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    Skill Progression Analytics
                  </div>
                </div>
              </div>
              <button className="w-full py-5 bg-white text-indigo-700 rounded-3xl font-black text-lg hover:shadow-2xl transition-all shadow-xl active:scale-95 group">
                <span className="group-hover:scale-105 transition-transform inline-block">Upgrade to Pro</span>
              </button>
            </motion.div>
          )}
        </div>
      ) : (
        <div className="text-center py-24 bg-white dark:bg-slate-900 rounded-[3rem] border-2 border-dashed border-slate-100 dark:border-slate-800 px-6 max-w-2xl mx-auto">
          <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-slate-300 dark:text-slate-600 shadow-inner">
             <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">Feed the AI Brain</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium mb-8 max-w-sm mx-auto leading-relaxed">Add active projects or study goals to your Task Manager to receive personalized learning content.</p>
          <button className="bg-indigo-600 text-white px-10 py-5 rounded-[2rem] font-black hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all active:scale-95">
            Open Task Manager
          </button>
        </div>
      )}
    </div>
  );
};

export default VideoSuggestions;
