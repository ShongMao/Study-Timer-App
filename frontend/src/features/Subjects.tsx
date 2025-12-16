import { useState } from 'react';

export default function SubjectsPage() {
  const [selectedSubject, setSelectedSubject] = useState('Math');
  // const [currentPage, setCurrentPage] = useState('test');

  const subjects = [
    { name: 'Math', icon: '📐', color: 'from-blue-500 to-blue-600' },
    { name: 'Science', icon: '🔬', color: 'from-green-500 to-green-600' },
    { name: 'English', icon: '📚', color: 'from-purple-500 to-purple-600' },
    { name: 'History', icon: '🏛️', color: 'from-amber-500 to-amber-600' },
    { name: 'Programming', icon: '💻', color: 'from-cyan-500 to-cyan-600' },
    { name: 'Art', icon: '🎨', color: 'from-pink-500 to-pink-600' },
    { name: 'Music', icon: '🎵', color: 'from-indigo-500 to-indigo-600' },
    { name: 'Other', icon: '📖', color: 'from-gray-500 to-gray-600' },
  ];

  return (
    <div className="min-h-screen" style={{
      background: 'linear-gradient(135deg, #815854 0%, #F9EBDE 100%)'
    }}>
      <div className="max-w-6xl mx-auto p-12">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-white mb-4">Select Your Subject</h2>
          <p className="text-xl text-white/80">Choose what you're studying today</p>
        </div>
        
        <div className="grid grid-cols-4 gap-6">
          {subjects.map((subject) => (
            <button
              key={subject.name}
              onClick={() => {
                setSelectedSubject(subject.name);
                // setCurrentPage('test');
              }}
              className={`p-8 rounded-3xl shadow-2xl transition transform hover:scale-105 ${
                selectedSubject === subject.name
                  ? 'bg-white ring-4 ring-white/50'
                  : 'bg-white/90'
              }`}
            >
              <div className="text-6xl mb-4">{subject.icon}</div>
              <div className="text-xl font-bold text-gray-800">{subject.name}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}