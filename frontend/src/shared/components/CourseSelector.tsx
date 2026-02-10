import { useState } from "react";
import UNSWData from "../../data/UNSWcourses.json";
import { addSubject } from "../../api/subject";

type CourseMap = Record<string, Record<string, string>>;

interface Props {
  userId: string;
  onCourseAdded: () => void;
  onClearCustomInput: () => void;
}

export default function CourseSelector({ userId, onCourseAdded, onClearCustomInput }: Props) {
  const courses = UNSWData as CourseMap;

  const [subject, setSubject] = useState("");
  const [courseCode, setCourseCode] = useState("");

  const subjects = Object.keys(courses);

  const availableCourses =
    subject !== "" ? Object.entries(courses[subject]) : [];

  async function handleAddCourse() {
    if (!subject || !courseCode) return;

    const courseName = courses[subject][courseCode];
    const fullCourse = `${courseCode.toUpperCase()} — ${courseName}`;

    try {
      await addSubject(userId, fullCourse);
      onCourseAdded();
      onClearCustomInput();

      setSubject("");
      setCourseCode("");
    } catch (err) {
      console.error("Failed to add course:", err);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="text-white font-semibold text-sm">
        Select UNSW course:
      </p>

      {/* Dropdown + Add Button Row */}
      {/* Dropdown + Add Button Row */}
      <div className="flex rounded-xl shadow-md overflow-hidden w-[520px] h-10">
        
        {/* Subject Dropdown */}
        <select
          value={subject}
          onChange={(e) => {
            setSubject(e.target.value);
            setCourseCode("");
          }}
          className="
            w-[140px]
            h-full
            px-3
            bg-white
            outline-none
            border-r border-gray-200
            text-m
            text-gray-500
          "
        >
          <option value="">Subject area:</option>
          {subjects.map((subj) => (
            <option key={subj} value={subj}>
              {subj}
            </option>
          ))}
        </select>

        {/* Course Dropdown Wrapper */}
        <div className="w-[280px] h-full overflow-x-auto whitespace-nowrap">
          <select
            value={courseCode}
            onChange={(e) => setCourseCode(e.target.value)}
            disabled={!subject}
            className="
              w-full
              h-full
              px-3
              bg-white
              outline-none
              border-r border-gray-200
              text-m
              text-gray-500
            "
          >
            <option value="">Course:</option>
            {availableCourses.map(([code, name]) => (
              <option key={code} value={code}>
                {code.toUpperCase()} — {name}
              </option>
            ))}
          </select>
        </div>

        {/* Add Button */}
        <button
          onClick={handleAddCourse}
          disabled={!courseCode}
          className="
            w-[100px]
            h-full
            bg-purple-950
            text-white
            font-bold
            hover:bg-purple-900
            transition
            disabled:opacity-50
            disabled:cursor-not-allowed
          "
        >
          Add
        </button>
      </div>

    </div>
  );
}
