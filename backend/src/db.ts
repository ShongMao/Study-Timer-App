export interface User {
  id: number;
  email: string;
  username: string;
  password: string; // plain for now (hash later)
  subjects: Subject[];
}

export interface Subject {
  id: number;
  name: string;
  totalStudySeconds: number;   // accumulated time
  sessions: StudySession[];    // history (optional but useful)
}

export interface StudySession {
  sessionId: number;
  subjectId: number;
  startTime: number; // unix timestamp (ms)
  endTime: number;   // unix timestamp (ms)
  durationSeconds: number;
}



export const db = {
  users: [] as User[],
  subjects: [] as Subject[]
};

// Optional helper for tests
export function clearDB() {
  db.users.length = 0;
}