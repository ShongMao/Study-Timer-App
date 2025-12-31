import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchSubjects, addSubject, deleteSubject } from '../api/subject';
import type { Subject } from '../api/subject';
import { Trash2 } from "lucide-react";

export default function SubjectsPage() {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isMobile, setIsMobile] = useState(
  window.matchMedia('(max-width: 768px)').matches
  );

  useEffect(() => {
    const media = window.matchMedia('(max-width: 768px)');
    const handler = () => setIsMobile(media.matches);

    media.addEventListener('change', handler);
    return () => media.removeEventListener('change', handler);
  }, []);

  const BOOK_LIMIT = isMobile ? 100 : 7;

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
    if (!userId) {
      console.warn("No userId found in localStorage");
      navigate("/login");
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

  const shelves: Subject[][] = [];
  for (let i = 0; i < subjects.length; i += BOOK_LIMIT) {
    shelves.push(subjects.slice(i, i + BOOK_LIMIT));
  }

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

        {/* Input field and add button */}
        <div className="flex justify-center mb-6">
          <div className="flex bg-white rounded-xl shadow-md overflow-hidden">
            <input
              type="text"
              placeholder="New Subject Name"
              value={newSubjectName}
              onChange={(e) => setNewSubjectName(e.target.value)}
              className="
                px-4 py-2
                outline-none
                border-r border-gray-200
                rounded-none
                rounded-l-xl
                focus:border-amber-800
              "
            />
            <button
              onClick={handleAddSubject}
              className="
                px-4 py-2
                bg-amber-800
                text-white
                font-bold
                hover:bg-amber-700
                transition
                rounded-none
                rounded-r-xl
              "
            >
              Add
            </button>
          </div>
        </div>

        {/* <div className="grid grid-cols-4 gap-6">
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
        </div> */}
        <div className="flex justify-center">
          <div className="flex gap-16">
          {shelves.map((shelf, shelfIndex) => (
            <div key={shelfIndex} className="flex gap-6">
              
              {/* Vertical shelf plank */}
              <div className="relative w-6">
                <div className="absolute inset-0 bg-gradient-to-b from-amber-900/70 to-amber-700/70 rounded-full shadow-lg" />
              </div>

              {/* Books on this shelf */}
              <div className="flex flex-col gap-4">
                {shelf.map((subject) => (
                  <div
                    key={subject.id}
                    onClick={() =>
                      navigate("/timer", { state: { subject: subject.name } })
                    }
                    className="
                      group
                      relative
                      h-14
                      w-64
                      bg-gradient-to-r from-amber-700 to-amber-900
                      rounded-md
                      shadow-md
                      cursor-pointer
                      transition-all
                      duration-300
                      flex
                      items-center
                      justify-center

                      hover:w-66
                      hover:h-20
                      hover:translate-x-2
                      hover:shadow-xl
                    "
                  >
                    {/* Subject title */}
                    <span className="
                      text-white
                      font-semibold
                      truncate
                      text-center
                      transition-all
                      duration-300
                      group-hover:text-base
                    ">
                      {subject.name}
                    </span>

                    {/* Delete button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteSubject(subject.id);
                      }}
                      className="
                        absolute
                        right-3
                        opacity-0
                        group-hover:opacity-100
                        text-white/70
                        hover:text-red-300
                        transition
                      "
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
}