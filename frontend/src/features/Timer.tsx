import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function TimerPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const subject = location.state?.subject ?? 'No Subject';

  return (
    <div className="min-h-screen" style={{
      background: 'linear-gradient(75deg, #815956ff 0%, #ecd4beff 100%)'
    }}>
      <div className="max-w-6xl mx-auto p-12">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-white mb-4">Subject Placeholder</h2>
          <p className="text-xl text-white/80">This is the prototype for the timer page, timer goes ⌄⌄under here⌄⌄</p>
        <button
            onClick={() => navigate('/subjects')}
            className="px-8 py-4 bg-white rounded-2xl shadow-lg text-amber-800 font-bold text-lg hover:scale-105 transition"
          >
            Change Subject
          </button>
        </div>     
        </div>
      </div>
  );
}

//  useEffect(() => {
//     if (isRunning) {
//       intervalRef.current = setInterval(() => {
//         setTime(t => t + 1);
//         setTodayStudyTime(t => t + 1);
//       }, 1000);
//     } else {
//       clearInterval(intervalRef.current);
//     }
//     return () => clearInterval(intervalRef.current);
//   }, [isRunning]);

//   const formatTime = (seconds) => {
//     const h = Math.floor(seconds / 3600);
//     const m = Math.floor((seconds % 3600) / 60);
//     const s = seconds % 60;
//     return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
//   };

//   const handleLogin = () => {
//     if (username.trim()) {
//       setCurrentPage('timer');
//     }
//   };


//   <div className="relative mb-8">
//               <svg className="transform -rotate-90" width="320" height="320">
//                 <circle
//                   cx="160"
//                   cy="160"
//                   r="140"
//                   stroke="#e5e7eb"
//                   strokeWidth="20"
//                   fill="none"
//                 />
//                 <circle
//                   cx="160"
//                   cy="160"
//                   r="140"
//                   stroke="#3b82f6"
//                   strokeWidth="20"
//                   fill="none"
//                   strokeDasharray={`${(time % 3600) / 3600 * 880} 880`}
//                   strokeLinecap="round"
//                   />
//               </svg>
//               <div className="absolute inset-0 flex items-center justify-center">
//                 <div className="text-center">
//                   <div className="text-6xl font-bold text-gray-800 mb-2">
//                     {formatTime(time)}
//                   </div>
//                   <div className="text-lg text-gray-600">
//                     Today: {formatTime(todayStudyTime)}
//                   </div>
//                 </div>
//               </div>
//             </div>