import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchSubjects, addSubject, deleteSubject } from '../api/subject';
import type { Subject } from '../api/subject';
export default function SubjectsPage() {
  //const [selectedSubject, setSelectedSubject] = useState('Math');
  //const navigate = useNavigate();
  // const [currentPage, setCurrentPage] = useState('test');
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const userId = localStorage.getItem('userId');

  const loadSubjects = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const subs = await fetchSubjects(userId);
      setSubjects(subs);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubjects();
  }, []);

  useEffect(() => {
  if (!userId) {
    console.warn("No userId found in localStorage");
    navigate("/login"); // redirect to login if missing
    return;
  }
  loadSubjects();
}, []);

  const handleAddSubject = async () => {
    if (!newSubjectName.trim() || !userId) return;
    try {
      const subject = await addSubject(userId, newSubjectName);
      setSubjects((prev) => [...prev, subject]);
      setNewSubjectName("");
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDeleteSubject = async (subjectId: number) => {
    if (!userId) return;
    try {
      await deleteSubject(userId, subjectId);
      setSubjects((prev) => prev.filter((s) => s.id !== subjectId));
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) return <p className="text-white text-center mt-20">Loading subjects...</p>;


  return (
    <div className="min-h-screen" style={{
      background: 'linear-gradient(135deg, #815854 0%, #F9EBDE 100%)'
    }}>
      <div className="max-w-6xl mx-auto p-12">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-white mb-4">Select Your Subject</h2>
          <p className="text-xl text-white/80">Choose what you're studying today</p>
        </div>
        
        {error && <p className="text-red-600 text-center mb-4">{error}</p>}

        <div className="flex mb-6 gap-2 justify-center">
          <input
            type="text"
            placeholder="New Subject Name"
            value={newSubjectName}
            onChange={(e) => setNewSubjectName(e.target.value)}
            className="px-4 py-2 rounded-xl outline-none"
          />
          <button
            onClick={handleAddSubject}
            className="px-4 py-2 rounded-xl bg-amber-800 text-white font-bold hover:bg-amber-700 transition"
          >
            Add
          </button>
        </div>

        <div className="grid grid-cols-4 gap-6">
          {subjects.map((subject) => (
            <div
              key={subject.id}
              className="p-6 rounded-3xl shadow-2xl bg-white/90 flex flex-col items-center justify-center relative"
            >
              <div
                className="text-6xl mb-4 cursor-pointer"
                onClick={() => navigate("/timer", { state: { subject: subject.name } })}
              >
                📚
              </div>
              <div className="text-xl font-bold text-gray-800">{subject.name}</div>
              <button
                onClick={() => handleDeleteSubject(subject.id)}
                className="absolute top-2 right-2 text-red-600 font-bold hover:text-red-800"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}