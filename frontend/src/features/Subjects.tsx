import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchSubjects, addSubject, deleteSubject } from '../api/subject';
import type { Subject } from '../api/subject';
import { Trash2, Pencil } from "lucide-react";

const SUBJECT_COLOR_KEY = 'subjectColors';

function getSubjectColors(): Record<number, string> {
  const raw = localStorage.getItem(SUBJECT_COLOR_KEY);
  return raw ? JSON.parse(raw) : {};
}

function setSubjectColor(subjectId: number, color: string) {
  const colors = getSubjectColors();
  colors[subjectId] = color;
  localStorage.setItem(SUBJECT_COLOR_KEY, JSON.stringify(colors));
}

/* Calm, Notion-style palette */
const SUBJECT_COLORS = [
  'from-amber-700 to-amber-900',
  'from-emerald-600 to-emerald-800',
  'from-sky-600 to-sky-800',
  'from-violet-600 to-violet-800',
  'from-rose-600 to-rose-800',
  'from-stone-600 to-stone-800',
];

export default function SubjectsPage() {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isMobile, setIsMobile] = useState(
  window.matchMedia('(max-width: 768px)').matches
  );
  const subjectColors = getSubjectColors();
  const [editingSubjectId, setEditingSubjectId] = useState<number | null>(null);
  

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

  useEffect(() => {
  const originalOverflow = document.body.style.overflow;

  document.body.style.overflow = 'hidden';

  return () => {
    document.body.style.overflow = originalOverflow;
  };
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
    <div className="min-h-screen overflow-hidden" style={{
      background: 'linear-gradient(150deg, #1b0c1aff 0%, #4B2138 100%)',
    }}>
      <div className="max-w-6xl mx-auto p-12 overflow-y-auto no-scrollbar">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-white mb-4">Select Your Subject</h2>
          <p className="text-xl text-white/80">Choose what you're studying today</p>
        </div>

        {error && <p className="text-red-600 text-center mb-4">{error}</p>}

        {/* Input field and add button */}
        <div className="flex justify-center mb-15">
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
                bg-purple-950
                text-white
                font-bold
                hover:bg-purple-950
                transition
                rounded-none
                rounded-r-xl
              "
            >
              Add
            </button>
          </div>
        </div>

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
                  {shelf.map((subject) => {
                    const bgColor =
                      subjectColors[subject.id] ??
                      'from-amber-700 to-amber-900';

                    return (
                      <div
                        key={subject.id}
                        onClick={() =>
                          navigate('/timer', {
                            state: { subject: subject },
                          })
                        }
                        onMouseLeave={() => setEditingSubjectId(null)}
                        className={`
                          group
                          relative
                          h-14
                          w-64
                          bg-gradient-to-r ${bgColor}
                          rounded-md
                          shadow-md
                          cursor-pointer
                          transition-all
                          duration-300
                          flex
                          items-center
                          justify-center

                          hover:h-20
                          hover:w-68
                          hover:translate-x-2
                          hover:shadow-xl
                        `}
                      >
                        {/* Title */}
                        <span className="
                          text-white
                          font-normal
                          truncate
                          text-center
                          px-8
                        ">
                          {subject.name}
                        </span>

                        {/* Action icons */}
                        <div className="
                          absolute
                          right-3
                          top-1/2
                          -translate-y-1/2
                          flex
                          gap-2
                          opacity-0
                          group-hover:opacity-100
                          transition
                        ">
                          {/* Edit wrapper (anchor point) */}
                          <div className="relative">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingSubjectId(
                                  editingSubjectId === subject.id ? null : subject.id
                                );
                              }}
                              className="text-white hover:text-amber-300"
                            >
                              <Pencil size={16} />
                            </button>

                            {/* Color palette — expands DOWN */}
                            <div
                              className={`
                                absolute
                                top-full
                                mt-2
                                right-0
                                flex
                                gap-2
                                px-3
                                py-2
                                bg-white/90
                                backdrop-blur
                                rounded-xl
                                shadow-lg
                                transition-all
                                duration-200
                                origin-top
                                ${
                                  editingSubjectId === subject.id
                                    ? 'opacity-100 scale-y-100'
                                    : 'opacity-0 scale-y-0 pointer-events-none'
                                }
                              `}
                            >
                              {SUBJECT_COLORS.map((color) => (
                                <button
                                  key={color}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSubjectColor(subject.id, color);
                                    setSubjects([...subjects]);
                                  }}
                                  className={`w-5 h-5 rounded-full bg-gradient-to-r ${color}`}
                                />
                              ))}
                            </div>
                          </div>

                          {/* Delete */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteSubject(subject.id);
                            }}
                            className="text-white hover:text-red-300"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>

            </div>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
}