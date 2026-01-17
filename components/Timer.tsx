
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { TimerProps, TimerState } from '../types';

export const Timer: React.FC<TimerProps> = ({ initialMinutes: propInitialMinutes, theme, isMuted }) => {
  const [initialSeconds, setInitialSeconds] = useState(propInitialMinutes * 60);
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const [status, setStatus] = useState<TimerState>('IDLE');
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(propInitialMinutes.toString());
  const timerRef = useRef<number | null>(null);

  const playFinishSound = useCallback(() => {
    // 음소거 상태면 소리를 재생하지 않음
    if (isMuted) return;

    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioContextClass();
      
      const playTone = (freq: number, startTime: number, duration: number) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);
        
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.25, startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
        
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        
        osc.start(startTime);
        osc.stop(startTime + duration);
      };

      const now = audioCtx.currentTime;
      [0, 0.2, 0.4, 0.6].forEach((delay) => playTone(880, now + delay, 0.4));
      [1.2, 1.4, 1.6, 1.8].forEach((delay) => playTone(880, now + delay, 0.4));
      [2.4, 2.6, 2.8, 3.0].forEach((delay) => playTone(880, now + delay, 0.4));

      setTimeout(() => {
        if (audioCtx.state !== 'closed') audioCtx.close();
      }, 5000);
    } catch (e) {
      console.warn("Audio error:", e);
    }
  }, [isMuted]);

  useEffect(() => {
    const newSeconds = propInitialMinutes * 60;
    setInitialSeconds(newSeconds);
    setTimeLeft(newSeconds);
    setEditValue(propInitialMinutes.toString());
  }, [propInitialMinutes]);

  useEffect(() => {
    if (status === 'FINISHED') {
      playFinishSound();
    }
  }, [status, playFinishSound]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startTimer = useCallback(() => {
    if (status === 'RUNNING') return;
    
    // 오디오 권한 활성화 (소리가 켜져 있을 때만)
    if (!isMuted) {
      try {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        if (ctx.state === 'suspended') ctx.resume();
        ctx.close();
      } catch (e) {}
    }

    setStatus('RUNNING');
    setIsEditing(false);
    timerRef.current = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setStatus('FINISHED');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [status, isMuted]);

  const pauseTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setStatus('PAUSED');
  }, []);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTimeLeft(initialSeconds);
    setStatus('IDLE');
  }, [initialSeconds]);

  const handleEditSubmit = () => {
    const newMins = parseInt(editValue, 10);
    if (!isNaN(newMins) && newMins > 0 && newMins <= 999) {
      const newSeconds = newMins * 60;
      setInitialSeconds(newSeconds);
      setTimeLeft(newSeconds);
      setStatus('IDLE');
    } else {
      setEditValue(Math.floor(initialSeconds / 60).toString());
    }
    setIsEditing(false);
  };

  const isRunning = status === 'RUNNING';
  const isFinished = status === 'FINISHED';
  
  const currentStyles = isFinished 
    ? { bg: 'bg-rose-500', border: 'border-rose-600', text: 'text-white', divider: 'bg-white/30', icon: 'text-white' }
    : isRunning 
      ? theme.active 
      : theme.idle;

  return (
    <div className="flex flex-col items-start gap-1 w-full">
      <div 
        className={`
          relative flex items-center w-full h-16 rounded-2xl border-2 transition-all duration-300 overflow-hidden
          ${currentStyles.bg} ${currentStyles.border}
          ${isRunning ? 'shadow-md scale-[1.01]' : 'shadow-sm'}
        `}
      >
        <button
          onClick={isRunning ? pauseTimer : startTimer}
          disabled={isEditing}
          className={`
            w-16 h-full flex items-center justify-center transition-colors shrink-0
            ${currentStyles.icon} hover:opacity-80 disabled:opacity-30
          `}
        >
          {isRunning ? (
            <i className="fa-solid fa-pause text-xl"></i>
          ) : isFinished ? (
            <i className="fa-solid fa-check text-xl"></i>
          ) : (
            <i className="fa-solid fa-play text-xl ml-1"></i>
          )}
        </button>

        <div className={`h-10 w-[1.5px] shrink-0 ${currentStyles.divider}`} />

        <div 
          className={`
            flex-1 flex items-center justify-center font-bold text-2xl tabular-nums tracking-tight h-full
            ${currentStyles.text} cursor-pointer
          `}
          onClick={() => !isRunning && setIsEditing(true)}
        >
          {isEditing ? (
            <input
              autoFocus
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value.replace(/\D/g, ''))}
              onBlur={handleEditSubmit}
              onKeyDown={(e) => e.key === 'Enter' && handleEditSubmit()}
              className="w-full h-full bg-transparent text-center focus:outline-none appearance-none"
            />
          ) : (
            <span>{formatTime(timeLeft)}</span>
          )}
        </div>

        {!isEditing && (
          <div className={`h-10 w-[1.5px] shrink-0 ${currentStyles.divider}`} />
        )}

        {!isEditing && (
          <button 
            onClick={(e) => { e.stopPropagation(); resetTimer(); }}
            className={`
              w-16 h-full flex items-center justify-center transition-colors shrink-0
              ${currentStyles.icon} hover:opacity-80
            `}
            title="초기화"
          >
            <i className="fa-solid fa-rotate-right text-lg"></i>
          </button>
        )}
      </div>
    </div>
  );
};
