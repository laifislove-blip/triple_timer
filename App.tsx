
import React, { useState } from 'react';
import { Timer } from './components/Timer';
import { THEMES } from './constants';

const App: React.FC = () => {
  const [isMuted, setIsMuted] = useState(false);

  const toggleSound = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div className="min-h-screen bg-transparent flex flex-col items-center justify-start p-4">
      <div className="w-full max-w-md bg-transparent">
        <header className="mb-6 flex items-center justify-between px-2">
          <div className="text-left">
            <h1 className="text-xl font-black text-slate-800 tracking-tight leading-tight">Focus Timers</h1>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Efficiency Dashboard</p>
          </div>
          
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-bold uppercase tracking-tight transition-colors ${isMuted ? 'text-slate-400' : 'text-sky-500'}`}>
              {isMuted ? 'Muted' : 'Sound On'}
            </span>
            <button 
              onClick={toggleSound}
              className={`
                w-12 h-12 rounded-2xl transition-all duration-300 flex items-center justify-center border-2
                ${isMuted 
                  ? 'bg-slate-50 border-slate-200 text-slate-400' 
                  : 'bg-sky-50 border-sky-100 text-sky-500 shadow-sm shadow-sky-100'}
              `}
              title={isMuted ? "소리 켜기" : "소리 끄기"}
            >
              <i className={`fa-solid ${isMuted ? 'fa-volume-xmark' : 'fa-volume-high'} text-lg`}></i>
            </button>
          </div>
        </header>
        
        <main className="flex flex-col gap-3">
          <Timer 
            initialMinutes={25} 
            theme={THEMES.focus} 
            isMuted={isMuted}
          />
          <Timer 
            initialMinutes={10} 
            theme={THEMES.shortBreak} 
            isMuted={isMuted}
          />
          <Timer 
            initialMinutes={15} 
            theme={THEMES.longBreak} 
            isMuted={isMuted}
          />
        </main>
      </div>
    </div>
  );
};

export default App;
