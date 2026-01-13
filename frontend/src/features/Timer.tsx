import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { startTimer, stopTimer, fetchSubject } from '../api/timer'
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
  const [timerStatus, setTimerStatus] = useState('Ready to Study?');

  const formatTime = (seconds:any) => {
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
        if (subject) {
          await startTimer(userId, subject.id);
        }
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
      if (isRunning && subject) {
        await stopTimer(userId);
      } 
      setTime(0);
      setIsRunning(false);
    } catch (err: any) {
      alert(err.message);
    }
  }

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTime(t => t + 1);
      setTodayStudyTime(t => t + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  useEffect(() => {
    setTimerStatus(isRunning ? 'Studying...' : 'Paused');
  }, [isRunning]);

  useEffect(() => {
    return () => {
      if (isRunning && subject) {
        stopTimer(userId).catch(err => {
          console.warn("Failed to stop timer on unmount:", err.message);
        });
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
        console.warn("Failed to load subject totalStudySeconds:", err.message);
      }
    };

    loadSubject();
  }, [subject?.id]);

  return (
    <div className="min-h-screen" style={{
      background: 'linear-gradient(75deg, #1b0c1aff 0%, #4B2138 100%)'
    }}>
      <div className="max-w-6xl mx-auto p-12">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-white mb-4">{subject ? subject.name : 'Timer'}</h2>
          <p className="text-xl text-white/80">{timerStatus}</p>

          <div className="min-h-screen flex flex-col items-center justify-start pt-[5vh] gap-6">

                {/* Timer */}
                <div className="relative">
                  <svg className="transform -rotate-90" width="320" height="320">
                    <circle
                      cx="160"
                      cy="160"
                      r="140"
                      stroke="#e5e7eb"
                      strokeWidth="20"
                      fill="none"
                    />
                    <circle
                      cx="160"
                      cy="160"
                      r="140"
                      stroke="#3b0764"
                      strokeWidth="20"
                      fill="none"
                      strokeDasharray={`${(time % 3600) / 3600 * 880} 880`}
                      strokeLinecap="round"
                    />
                  </svg>

                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-5xl font-bold text-white mb-2">
                        {formatTime(time)}
                      </div>
                      <div className="text-lg text-gray-600">
                        Today: {formatTime(todayStudyTime)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 justify-center mb-6">

                {/* Control buttons */}  
                <button
                  onClick={handleStartPause}
                  className="w-20 h-20 rounded-full shadow-lg flex items-center justify-center bg-purple-950 hover:bg-purple-950 transition"
                >
                  {isRunning ? (
                    <Pause size={32} className="text-white" />
                  ) : (
                    <Play size={32} className="text-white ml-1" />
                  )}
                </button>
                <button
                  onClick={handleRestart}
                  className="w-20 h-20 rounded-full shadow-lg flex items-center justify-center bg-gray-200 hover:bg-gray-300 transition"
                >
                  <RotateCcw size={28} className="text-purple-950" />
                </button>
              </div>

          <button
              onClick={() => navigate('/subjects')}
              className="px-8 py-4 bg-white rounded-2xl shadow-lg text-purple-950 font-bold text-lg hover:scale-105 transition"
            >
              Change Subject
            </button>
          </div>     
        </div>
      </div>
    </div>
  );
}
