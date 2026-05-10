
import React, { useState } from 'react';
import { UserProfile } from '../types';
import { motion } from 'framer-motion';
import { ToastType } from './Toast';
import UpgradeModal from './UpgradeModal';

interface SettingsProps {
  user: UserProfile;
  onUpdateUser: (user: UserProfile) => void;
  onNotify?: (message: string, type: ToastType) => void;
}

const Settings: React.FC<SettingsProps> = ({ user, onUpdateUser, onNotify }) => {
  const [testStatus, setTestStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  const freeThemes: { id: UserProfile['themeColor']; color: string; label: string }[] = [
    { id: 'indigo', color: 'bg-indigo-600', label: 'Indigo' },
    { id: 'emerald', color: 'bg-emerald-600', label: 'Emerald' },
    { id: 'rose', color: 'bg-rose-600', label: 'Rose' },
    { id: 'amber', color: 'bg-amber-600', label: 'Amber' },
    { id: 'violet', color: 'bg-violet-600', label: 'Violet' },
    { id: 'cyan', color: 'bg-cyan-600', label: 'Cyan' },
    { id: 'teal', color: 'bg-teal-600', label: 'Teal' },
    { id: 'orange', color: 'bg-orange-600', label: 'Orange' },
    { id: 'fuchsia', color: 'bg-fuchsia-600', label: 'Fuchsia' },
    { id: 'sky', color: 'bg-sky-600', label: 'Sky' },
    { id: 'lime', color: 'bg-lime-600', label: 'Lime' },
    { id: 'slate', color: 'bg-slate-700', label: 'Slate' },
  ];

  const proThemes: { id: UserProfile['themeColor']; color: string; label: string }[] = [
    { id: 'lavender', color: 'bg-[#c4b5fd]', label: 'Lavender' },
    { id: 'matcha', color: 'bg-[#a3e635]', label: 'Matcha' },
    { id: 'peach', color: 'bg-[#fdba74]', label: 'Peach' },
    { id: 'pastelPink', color: 'bg-[#fbcfe8]', label: 'Pastel Pink' },
  ];

  const handleTestNotification = async () => {
    setTestStatus('loading');
    
    if (!("Notification" in window)) {
      alert("This browser does not support desktop notifications.");
      setTestStatus('error');
      return;
    }

    let permission = Notification.permission;
    if (permission !== "granted") {
      permission = await Notification.requestPermission();
    }

    if (permission === "granted") {
      new Notification("PLANOVA AI", {
        body: "Success! Your notification system is correctly configured. 🚀",
        icon: `https://picsum.photos/seed/planova/100/100`
      });
      setTestStatus('success');
      setTimeout(() => setTestStatus('idle'), 3000);
    } else {
      setTestStatus('error');
      alert("Notification permission denied. Please enable them in your browser settings.");
    }
  };

  const getThemeAccent = (color: string) => {
    switch (color) {
      case 'emerald': return 'text-emerald-600';
      case 'rose': return 'text-rose-600';
      case 'amber': return 'text-amber-600';
      case 'violet': return 'text-violet-600';
      case 'cyan': return 'text-cyan-600';
      case 'teal': return 'text-teal-600';
      case 'orange': return 'text-orange-600';
      case 'fuchsia': return 'text-fuchsia-600';
      case 'slate': return 'text-slate-700';
      case 'lime': return 'text-lime-600';
      case 'lavender': return 'text-[#c4b5fd]';
      case 'matcha': return 'text-[#a3e635]';
      case 'peach': return 'text-[#fdba74]';
      case 'pastelPink': return 'text-[#fbcfe8]';
      default: return 'text-indigo-600';
    }
  };

  const getButtonBg = (color: string) => {
    switch (color) {
      case 'emerald': return 'bg-emerald-600 hover:bg-emerald-700';
      case 'rose': return 'bg-rose-600 hover:bg-rose-700';
      case 'amber': return 'bg-amber-600 hover:bg-amber-700';
      case 'violet': return 'bg-violet-600 hover:bg-violet-700';
      case 'cyan': return 'bg-cyan-600 hover:bg-cyan-700';
      case 'teal': return 'bg-teal-600 hover:bg-teal-700';
      case 'orange': return 'bg-orange-600 hover:bg-orange-700';
      case 'fuchsia': return 'bg-fuchsia-600 hover:bg-fuchsia-700';
      case 'slate': return 'bg-slate-700 hover:bg-slate-800';
      case 'lime': return 'bg-lime-600 hover:bg-lime-700';
      case 'lavender': return 'bg-[#c4b5fd] hover:opacity-80';
      case 'matcha': return 'bg-[#a3e635] hover:opacity-80';
      case 'peach': return 'bg-[#fdba74] hover:opacity-80';
      case 'pastelPink': return 'bg-[#fbcfe8] hover:opacity-80';
      default: return 'bg-indigo-600 hover:bg-indigo-700';
    }
  };

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Settings</h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium">Personalize your productivity environment.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          {/* Profile Section */}
          <section className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
            <h3 className="text-xl font-black mb-6 dark:text-white">Profile Information</h3>
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Display Name</label>
                <input 
                  type="text" 
                  value={user.name}
                  onChange={(e) => onUpdateUser({ ...user, name: e.target.value })}
                  className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 focus:border-indigo-500 outline-none transition-all font-bold dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Account Email</label>
                <input 
                  type="email" 
                  value={user.email}
                  disabled
                  className="w-full px-5 py-4 rounded-2xl border-2 border-slate-50 dark:border-slate-900 bg-slate-50 dark:bg-slate-900 text-slate-400 cursor-not-allowed font-bold"
                />
              </div>
            </div>
          </section>

          {/* Theme Section */}
          <section className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black dark:text-white">App Aesthetics</h3>
              <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 ${getThemeAccent(user.themeColor)}`}>
                {user.themeColor}
              </span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 font-medium">Choose your primary brand color. These palettes are optimized for both light and dark environments.</p>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-4">
              {freeThemes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => onUpdateUser({ ...user, themeColor: t.id })}
                  className={`group relative flex flex-col items-center gap-2 p-2 rounded-2xl transition-all ${
                    user.themeColor === t.id ? 'bg-slate-50 dark:bg-slate-800' : 'hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl ${t.color} shadow-lg transition-transform group-hover:scale-110 ${
                    user.themeColor === t.id ? 'ring-4 ring-white dark:ring-slate-900 shadow-indigo-200' : ''
                  }`} />
                  <span className="text-[9px] font-black uppercase text-slate-400 dark:text-slate-600 truncate w-full text-center">{t.label}</span>
                  {user.themeColor === t.id && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center">
                      <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" /></svg>
                    </div>
                  )}
                </button>
              ))}
            </div>

            <div className="mt-8">
              <h4 className="text-sm font-black dark:text-white flex items-center gap-2 mb-4">
                <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                Pro Aesthetics
              </h4>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-4">
                {proThemes.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      if (!user.isPro) {
                        onNotify?.("Upgrade to Pro to use aesthetic themes!", "info");
                        return;
                      }
                      onUpdateUser({ ...user, themeColor: t.id });
                    }}
                    className={`group relative flex flex-col items-center gap-2 p-2 rounded-2xl transition-all ${
                      user.themeColor === t.id ? 'bg-slate-50 dark:bg-slate-800' : 'hover:bg-slate-50 dark:hover:bg-slate-800'
                    } ${!user.isPro ? 'opacity-50 grayscale' : ''}`}
                  >
                    <div className={`w-10 h-10 rounded-xl ${t.color} shadow-lg transition-transform ${user.isPro ? 'group-hover:scale-110' : ''} ${
                      user.themeColor === t.id ? 'ring-4 ring-white dark:ring-slate-900 shadow-indigo-200' : ''
                    }`} />
                    <span className="text-[9px] font-black uppercase text-slate-400 dark:text-slate-600 truncate w-full text-center">{t.label}</span>
                    {user.themeColor === t.id && user.isPro && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center">
                        <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" /></svg>
                      </div>
                    )}
                    {!user.isPro && (
                      <div className="absolute inset-0 m-auto w-5 h-5 bg-slate-900/80 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <hr className="border-slate-100 dark:border-slate-800 my-8" />
            
            <h3 className="text-xl font-black mb-6 dark:text-white">Display Mode</h3>
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl w-full">
              {['light', 'dark', 'system'].map(mode => (
                <button
                  key={mode}
                  onClick={() => onUpdateUser({ ...user, modePreference: mode as any })}
                  className={`flex-1 py-3 text-sm font-black rounded-xl capitalize transition-all ${
                    (user.modePreference || 'system') === mode
                      ? 'bg-white dark:bg-slate-700 shadow-md text-slate-900 dark:text-white'
                      : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-8">
          {/* Notifications Section */}
          <section className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
            <h3 className="text-xl font-black mb-6 dark:text-white">Notification System</h3>
            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-black dark:text-white">Push Notifications</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Reminders and AI nudges.</p>
                </div>
                <div className={`w-12 h-6 ${getButtonBg(user.themeColor)} rounded-full relative cursor-pointer`}>
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                </div>
              </div>
              <hr className="border-slate-100 dark:border-slate-800" />
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-4">
                  Check if your browser is allowing PLANOVA to send mission alerts.
                </p>
                <button 
                  onClick={handleTestNotification}
                  disabled={testStatus === 'loading'}
                  className={`w-full py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-3 transition-all ${
                    testStatus === 'success' ? 'bg-emerald-500 text-white' :
                    testStatus === 'error' ? 'bg-rose-500 text-white' :
                    `${getButtonBg(user.themeColor)} text-white shadow-xl shadow-indigo-100 dark:shadow-none active:scale-95`
                  }`}
                >
                  {testStatus === 'loading' ? (
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                  ) : testStatus === 'success' ? (
                    'Notification Sent!'
                  ) : testStatus === 'error' ? (
                    'Permission Denied'
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                      Test System Alert
                    </>
                  )}
                </button>
              </div>
            </div>
          </section>

          {/* Pro Section */}
          <section className={`p-8 rounded-[2.5rem] border-2 transition-all ${user.isPro ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : 'border-indigo-100 dark:border-indigo-900/20 bg-indigo-50 dark:bg-indigo-950/20'}`}>
            <h3 className={`text-xl font-black mb-2 ${user.isPro ? 'text-emerald-700 dark:text-emerald-400' : 'text-indigo-700 dark:text-indigo-400'}`}>
              {user.isPro ? 'Pro Member Perks' : 'PLANOVA Pro'}
            </h3>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-6">
              Unlock the full potential of your AI companion and advanced analytics.
            </p>
            {!user.isPro ? (
              <>
                <button 
                  onClick={() => setIsUpgradeModalOpen(true)}
                  className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-black transition-all shadow-xl active:scale-95"
                >
                  Upgrade to PLANOVA Pro
                </button>
                <UpgradeModal 
                  isOpen={isUpgradeModalOpen} 
                  onClose={() => setIsUpgradeModalOpen(false)} 
                  onUpgrade={() => {
                    onUpdateUser({ ...user, isPro: true });
                    onNotify?.("Successfully upgraded to PLANOVA Pro! 🎉", "success");
                  }} 
                />
              </>
            ) : (
              <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400 font-black text-sm">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                Active Subscription
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default Settings;
