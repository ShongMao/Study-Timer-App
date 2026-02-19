import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Play, Pause, RotateCcw, BookOpen, ChevronLeft } from 'lucide-react';
import { startTimer, stopTimer, fetchSubject } from '../api/timer';
import type { Subject } from '../api/subject';

interface TimerPageState {
  subject: Subject;
}

export default function TimerPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [todayStudyTime, setTodayStudyTime] = useState(0);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const state = location.state as TimerPageState | undefined;
  const subject = state?.subject;

  const rawUserId = localStorage.getItem('userId');
  if (!rawUserId) throw new Error('Not logged in');
  const userId = Number(rawUserId);

  const handleStartPause = async () => {
    try {
      if (!isRunning) {
        if (subject) await startTimer(userId, subject.id);
        setIsRunning(true);
      } else {
        if (subject) {
          await stopTimer(userId);
          const latestSubject = await fetchSubject(String(userId), subject.id);
          setTodayStudyTime(latestSubject.totalStudySeconds || 0);
        }
        setIsRunning(false);
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleRestart = async () => {
    try {
      if (isRunning && subject) await stopTimer(userId);
      setTime(0);
      setIsRunning(false);
    } catch (err: any) {
      alert(err.message);
    }
  };

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setTime(t => t + 1);
      setTodayStudyTime(t => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning]);

  useEffect(() => {
    return () => {
      if (isRunning && subject) {
        stopTimer(userId).catch(err => console.warn('Failed to stop timer on unmount:', err.message));
      }
    };
  }, [isRunning, subject, userId]);

  useEffect(() => {
    if (!subject) return;
    const loadSubject = async () => {
      try {
        const latestSubject = await fetchSubject(String(userId), subject.id);
        setTodayStudyTime(latestSubject.totalStudySeconds || 0);
      } catch (err: any) {
        console.warn('Failed to load subject totalStudySeconds:', err.message);
      }
    };
    loadSubject();
  }, [subject?.id]);

  // Circle math
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const progress = (time % 3600) / 3600;
  // const progress = (time % 60) / 60;
  const dashOffset = circumference * (1 - progress);

  return (
    <div
      className="min-h-screen text-white flex flex-col"
      style={{ background: 'linear-gradient(75deg, #1b0c1aff 0%, #4B2138 100%)' }}
    >
      {/* Noise texture */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '150px',
        }}
      />

      <div className="relative flex-1 flex flex-col max-w-lg mx-auto w-full px-6 py-10">

        {/* Top nav */}
        <div className="flex items-center justify-between mb-12">
          <button
            onClick={() => navigate('/subjects')}
            className="flex items-center gap-1.5 text-sm transition-all duration-150"
            style={{ color: 'rgba(255,255,255,0.35)' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.35)')}
          >
            <ChevronLeft size={15} />
            Subjects
          </button>

          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.09)' }}
          >
            <BookOpen size={13} style={{ color: '#c4b5fd' }} />
            <span style={{ color: 'rgba(255,255,255,0.6)' }}>{subject ? subject.name : 'No subject'}</span>
          </div>
        </div>

        {/* Title */}
        <div className="mb-10">
          <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: 'rgba(255,255,255,0.3)' }}>
            Focus Timer
          </p>
          <h1
            className="text-5xl font-light tracking-tight"
            style={{ 
              fontFamily: "'Neue Montreal', 'Georgia', 'Times New Roman', serif",
              fontWeight: 500,
              color: "rgba(255,255,255,0.92)",
              letterSpacing: "0.04em",
            }}
          >
            {subject ? subject.name : 'Timer'}
          </h1>

          {/* Status pill */}
          <div className="flex items-center gap-2 mt-3">
            <span
              className="inline-block w-1.5 h-1.5 rounded-full transition-all duration-500"
              style={{ background: isRunning ? '#86efac' : 'rgba(255,255,255,0.2)' }}
            />
            <span
              className="text-sm transition-all duration-300"
              style={{ color: isRunning ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.3)' }}
            >
              {isRunning ? 'Studying…' : time === 0 ? 'Ready to study?' : 'Paused'}
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px mb-12" style={{ background: 'rgba(255,255,255,0.07)' }} />

        {/* Timer ring */}
        <div className="flex justify-center mb-12">
          <div className="relative">
            <svg width="280" height="280" viewBox="0 0 280 280">
              {/* Track */}
              <circle
                cx="140" cy="140" r={radius}
                fill="none"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="5"
              />
              {/* Tick marks */}
              {Array.from({ length: 60 }).map((_, i) => {
                const angle = (i / 60) * 2 * Math.PI - Math.PI / 2;
                const isMajor = i % 5 === 0;
                const inner = radius - 4 - (isMajor ? 12 : 6);
                const outer = radius - 4;
                return (
                  <line
                    key={i}
                    x1={140 + inner * Math.cos(angle)}
                    y1={140 + inner * Math.sin(angle)}
                    x2={140 + outer * Math.cos(angle)}
                    y2={140 + outer * Math.sin(angle)}
                    stroke={isMajor ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.06)'}
                    strokeWidth={isMajor ? 1.5 : 1}
                  />
                );
              })}
              {/* Progress arc */}
              <circle
                cx="140" cy="140" r={radius}
                fill="none"
                stroke="url(#arcGrad)"
                strokeWidth="3"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                strokeLinecap="round"
                style={{
                  transform: 'rotate(-90deg)',
                  transformOrigin: '140px 140px',
                  transition: 'stroke-dashoffset 1s linear',
                }}
              />
              {/* Gradient def */}
              <defs>
                <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#c4b5fd" />
                  <stop offset="100%" stopColor="#a78bfa" />
                </linearGradient>
              </defs>
            </svg>

            {/* Center content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div
                className="text-5xl font-light tracking-tight tabular-nums"
                style={{ fontFamily: "'Georgia', 'Times New Roman', serif", letterSpacing: '-0.02em' }}
              >
                {formatTime(time)}
              </div>
              <div className="mt-2 text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
                session
              </div>
            </div>
          </div>
        </div>

        {/* Today stat */}
        <div
          className="flex items-center justify-between px-5 py-3 rounded-xl mb-8"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <span className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>Today's total</span>
          <span className="font-mono text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
            {formatTime(todayStudyTime)}
          </span>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-5">
          {/* Restart */}
          <button
            onClick={handleRestart}
            className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 active:scale-90"
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.09)',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
          >
            <RotateCcw size={18} style={{ color: 'rgba(255,255,255,0.45)' }} />
          </button>

          {/* Play / Pause — primary */}
          <button
            onClick={handleStartPause}
            className="w-20 h-20 rounded-full flex items-center justify-center transition-all duration-200 active:scale-90 shadow-lg"
            style={{
              background: '#3b0764',
              boxShadow: isRunning
                ? '0 0 0 6px rgba(167,139,250,0.15), 0 8px 32px rgba(59,7,100,0.6)'
                : '0 8px 32px rgba(59,7,100,0.5)',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = '#4c0f80')}
            onMouseLeave={e => (e.currentTarget.style.background = '#3b0764')}
          >
            {isRunning ? (
              <Pause size={28} className="text-white" />
            ) : (
              <Play size={28} className="text-white" style={{ marginLeft: '3px' }} />
            )}
          </button>

          {/* Change subject */}
          <button
            onClick={() => navigate('/subjects')}
            className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 active:scale-90"
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.09)',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
          >
            <BookOpen size={18} style={{ color: 'rgba(255,255,255,0.45)' }} />
          </button>
        </div>

        {/* Hint */}
        <p className="text-center text-xs mt-6" style={{ color: 'rgba(255,255,255,0.2)' }}>
          {isRunning ? 'Tap pause to save your session' : 'Tap play to begin focusing'}
        </p>

      </div>
    </div>
  );
}