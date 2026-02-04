import { db, User, Subject, StudySession } from './db';
import { findUser, getTodayKey, getYesterdayKey } from './helper';

export function userRegister(email: string, password: string, username: string): number {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!regex.test(email)) {
    throw new Error('Invalid email');
  }

  passwordIsValid(password);

  const existingUser = db.users.find(u => u.email === email);
  if (existingUser) {
    throw new Error('Email already registered');
  }

  // temporary database.
  const newUser: User = {
    id: db.users.length + 1,
    email,
    username,
    password, 
    subjects: [],
    studyStreak: 0
  };

  db.users.push(newUser);

  return newUser.id;
}

export function userLogin(username: string, password: string) {
  if (!username || !password) {
    throw new Error('Username and password are required');
  }

  const user = db.users.find(u => u.username === username);

  if (!user) {
    throw new Error('User does not exist');
  }

  // Plaintext password check (mock DB only)
  if (user.password !== password) {
    throw new Error('Incorrect password');
  }

  return user.id;
}

export function addSubject(userId: number, name: string): number {
  const user = findUser(userId);
  if (!user) throw new Error("User not found");

  const normalizedName = name.trim().toLowerCase();

  const subjectExists = user.subjects.some(
    s => s.name.trim().toLowerCase() === normalizedName
  );

  if (subjectExists) {
    throw new Error("Subject already exists");
  }

  // For now create subjects off of current subjects length.
  const subjectId = db.subjects.length + 1;

  const subject: Subject = {
    id: subjectId,
    name,
    totalStudySeconds: 0,
    todayStudySeconds: 0,
    lastUpdatedDay: new Date().toISOString().slice(0, 10),
    sessionIds: [],
  }

  user.subjects.push(subject);
  db.subjects.push(subject);

  return subject.id;
}

export function deleteSubject(userId: number, subjectId: number): void {
  const user = findUser(userId);
  if (!user) {
    throw new Error("User not found");
  }

  const subjectIndex = user.subjects.findIndex(s => s.id === subjectId);
  if (subjectIndex === -1) {
    throw new Error("Subject not found for user");
  }

  user.subjects.splice(subjectIndex, 1);
}

export function userDetails(userId: number): User {
  const user = findUser(userId);
  if (!user) throw new Error("User not found");
  
  return {
    id: user.id,
    email: user.email,
    username: user.username,
    subjects: user.subjects,
    ...(user.lastStudyDay && { lastStudyDay: user.lastStudyDay }),
    studyStreak: user.studyStreak
  };
}

export function userDetailsUpdate(userId: number, updates: {
    username?: string;
    password?: string;
  }): User {

  const user = findUser(userId);
  if (!user) throw new Error("User not found");
  
  if (updates.username !== undefined) {
    if (updates.username.trim() === "") {
      throw new Error("Username cannot be empty");
    }
    user.username = updates.username;
  }

  if (updates.password !== undefined) {
    passwordIsValid(updates.password);

    user.password = updates.password
  }

  return {
    id: user.id,
    email: user.email,
    username: user.username,
    subjects: user.subjects,
    ...(user.lastStudyDay && { lastStudyDay: user.lastStudyDay }),
    studyStreak: user.studyStreak
  };
}

export function getSubjects(userId: number): Subject[] {
  const user = findUser(userId);
  if (!user) {
    throw new Error("User not found");
  }

  return user.subjects;
}

export function startTimer(userId: number, subjectId: number) {
  if (db.activeSessions.has(userId)) {
    throw new Error('Timer already running');
  }
  const user = findUser(userId);
  if (!user) throw new Error("User not found");

  const session: StudySession = {
    id: Date.now(),
    userId,
    subjectId,
    startTime: Date.now()
  };

  db.studySessions.push(session);
  db.activeSessions.set(userId, session.id);
}

export function stopTimer(userId: number) {
  const user = findUser(userId);
  if (!user) throw new Error("User not found");

  const sessionId = db.activeSessions.get(userId);
  if (!sessionId) {
    return;
  }

  const session = db.studySessions.find(s => s.id === sessionId)!;

  session.endTime = Date.now();
  session.durationSeconds = Math.floor(
    (session.endTime - session.startTime) / 1000
  );

  const subject = user.subjects.find(
    s => s.id === session.subjectId
  );

  if (!subject) {
    throw new Error('Subject not found for session');
  }

  const today = getTodayKey();

  // Update study streak.

  const yesterday = getYesterdayKey();

  if (session.durationSeconds > 0) {
    if (user.lastStudyDay !== today) {
      if (user.lastStudyDay === yesterday) {
        user.studyStreak += 1;
      } else {
        user.studyStreak = 1;
      }

      user.lastStudyDay = today;
    }
  }

  // Update study seconds.

  if (subject.lastUpdatedDay !== today) {
    subject.todayStudySeconds = 0;
    subject.lastUpdatedDay = today;
  }

  subject.totalStudySeconds += session.durationSeconds;
  subject.todayStudySeconds += session.durationSeconds;
  subject.sessionIds.push(session.id);

  db.activeSessions.delete(userId);
}

export function getSubject(userId: number, subjectId: number): Subject {
  const user = findUser(userId);
  if (!user) throw new Error("User not found");

  const subject = user.subjects.find(
    s => s.id === subjectId
  );

  if (!subject) {
    throw new Error('Subject not found for user');
  }

  return subject;
}

export function getTodayLeaderBoard(limit: number) {
  return db.users
    .map(user => {
      const totalTodaySeconds = user.subjects.reduce(
        (sum, subject) => sum + subject.todayStudySeconds, 0
      );

      return {
        userId: user.id,
        username: user.username,
        totalTodaySeconds,
        studyStreak: user.studyStreak,
      };
    })
    .sort((a, b) => b.totalTodaySeconds - a.totalTodaySeconds)
    .slice(0, limit);
}

export function passwordIsValid(password: string) {
  if (password.length < 4) {
    throw new Error('Password must be at least 4 characters long');
  }

  if (!/[A-Z]/.test(password)) {
    throw new Error('Password must contain a capital letter');
  }

  if (!/[0-9]/.test(password)) {
    throw new Error('Password must contain a number');
  }
}