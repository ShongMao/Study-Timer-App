import { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Play, Pause, RotateCcw, Timer } from 'lucide-react';
import { getTodayStudyTime, saveTimeStudied } from '../api/time';

export default function TimerPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const subject = location.state?.subject || localStorage.getItem('currentSubject') || 'No Subject';
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [todayStudyTime, setTodayStudyTime] = useState(0);
  const [timerStatus, setTimerStatus] = useState('Ready to Study?');
  const intervalRef = useRef<number | null>(null);
//   const userId = localStorage.getItem('userId');
//   if (!userId) {
//   console.error("No userId found in localStorage");
//   return; // skip the API call
// }
const storedUserId = localStorage.getItem('userId');
const userId = storedUserId ?? '';
const getTodayKey = () => {
    const today = new Date();                                 //UNUSED CODE
    return `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  };
let studyDuration = 0;


  /* ------------------ Utils ------------------ */
  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m
      .toString()
      .padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const refreshTodayTime = async () => {
  const studyTime = await getTodayStudyTime(userId, subject);
  setTodayStudyTime(studyTime);
};

  /* ------------------ Timer logic ------------------ */
  useEffect(() => {
    if (!isRunning || !userId || !subject) return;

    const interval = setInterval(async () => {
      // Increment session time
      setTime(t => t + 1);
      setTodayStudyTime(k => k + 1);

      try {
        // Save 1 second to today's total (use normalized values)
        await saveTimeStudied(userId, subject, 1);
        const updatedTime = await getTodayStudyTime(userId, subject);
        setTodayStudyTime(updatedTime);
      } catch (err) {
        console.error('Failed to save or fetch time:', err);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, userId, subject]);


/* ------------------ Load today's time ------------------ */
// useEffect(() => {
//   if (!userId || !subject) return;

//   const fetchStudyTime = async () => {
//     try {
//       const studyTime = await getTodayStudyTime(userId, subject);
//       setTodayStudyTime(studyTime);                                        JUST IN CASE
//     } catch (err) {
//       console.error("Failed to fetch today's study time:", err);
//     }
//   };

//   fetchStudyTime();
// }, [userId, subject]);

const fetchTodayTime = async () => {
  if (!userId || !subject) return;
  try {
    const studyTime = await getTodayStudyTime(userId, subject);
    setTodayStudyTime(studyTime);
  } catch (err) {
    console.error("Failed to fetch today's study time:", err);
  }
};

useEffect(() => {
  fetchTodayTime();
}, [userId, subject]);

useEffect(() => {
    const loadData = async () => {
      try {
        const storedData = localStorage.getItem('study-data');
        if (storedData) {
          const data = JSON.parse(storedData);
          
          const todayKey = getTodayKey();
          if (data[todayKey]) {
            const todayTotal = Object.values(data[todayKey]).reduce((sum: number, time) => sum + (time as number), 0) as number;
            setTodayStudyTime(todayTotal);
          }
        }
      } catch (error) {
        console.log('No existing data found');
      }
    };
    loadData();
  }, []);

/* ------------------ Save time on stop ------------------ */
if (!isRunning && time > 0) {
  studyDuration += todayStudyTime;
}

// const previousIsRunningRef = useRef(isRunning);

// useEffect(() => {
//   // Save time only when transitioning from running to stopped (not on reset)
//   if (previousIsRunningRef.current && !isRunning && time > 0) {
//     const userId = localStorage.getItem('userId');
//     if (!userId) return;

//     saveTimeStudied(userId, subject, time);
//   }
//   previousIsRunningRef.current = isRunning;
// }, [isRunning, time, subject]);                                       UNUSED CODE

// useEffect(() => {
//   // Save time when user leaves the page
//   return () => {
//     if (time > 0) {
//       const userId = localStorage.getItem('userId');
//       if (userId) {
//         saveTimeStudied(userId, subject, time);
//       }
//     }
//   };
// }, [time, subject]);

return (
  <div className="min-h-screen" style={{
    background: 'linear-gradient(75deg, #815956ff 0%, #ecd4beff 100%)'
  }}>
    <div className="max-w-6xl mx-auto p-12">
      <div className="text-center mb-12">
        <h2 className="text-5xl font-bold text-white mb-4">{subject}</h2>
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
                    stroke="#3b82f6"
                    strokeWidth="20"
                    fill="none"
                    strokeDasharray={`${(time % 3600) / 3600 * 880} 880`}
                    strokeLinecap="round"
                  />
                </svg>

                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-gray-800 mb-2">
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
                onClick={() => {
                  setIsRunning(!isRunning);
                  setTimerStatus(isRunning ? "Paused" : "Studying...");
                  // setTodayStudyTime(todayStudyTime);
                  // saveTimeStudied(userId, subject, todayStudyTime);
                }}
                className="w-20 h-20 rounded-full shadow-lg flex items-center justify-center bg-blue-600 hover:bg-blue-700 transition"
              >
                {isRunning ? (
                  <Pause size={32} className="text-white" />
                ) : (
                  <Play size={32} className="text-white ml-1" />
                )}
              </button>
              <button
                onClick={() => { setTime(0); setIsRunning(false); }} // Reset button
                className="w-20 h-20 rounded-full shadow-lg flex items-center justify-center bg-gray-200 hover:bg-gray-300 transition"
              >
                <RotateCcw size={28} className="text-gray-700" />
              </button>
            </div>

        <button
            onClick={() => navigate('/subjects')}
            className="px-8 py-4 bg-white rounded-2xl shadow-lg text-amber-800 font-bold text-lg hover:scale-105 transition"
          >
            Change Subject
          </button>
        </div>     
        </div>
      </div>
      </div>
  );
}