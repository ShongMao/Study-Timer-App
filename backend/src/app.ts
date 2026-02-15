import { db, User, Subject, StudySession } from './db';
import { findUser, getTodayKey, getYesterdayKey, passwordIsValid } from './helper';
import { pool } from "./database" 
import { RowDataPacket } from 'mysql2';

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



// ============================= V2 Functions ==================================

export async function V2userRegister(email: string, password: string, username: string): Promise<number> {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!regex.test(email)) {
    throw new Error('Invalid email');
  }

  passwordIsValid(password);

  if (!username || username.trim() === "") {
    throw new Error("Username cannot be empty");
  }

  const [existing] = await pool.query<RowDataPacket[]>(
    `SELECT id FROM users WHERE email = ?`,
    [email]
  );

  if (existing.length > 0) {
    throw new Error("Email already registered");
  }
  
  const [result] = await pool.query(
    `INSERT INTO users (email, username, password)
     VALUES (?, ?, ?)`,
    [email, username, password]
  );

  return (result as any).insertId;
}

export async function V2userLogin(username: string, password: string): Promise<number> {
  if (!username || !password) {
    throw new Error('Username and password are required');
  }

  const [rows] = await pool.query(
    `SELECT * FROM users WHERE username = ?`,
    [username]
  );

  const user = (rows as any[])[0];

  if (!user) {
    throw new Error('User does not exist');
  }

  if (user.password !== password) {
    throw new Error('Incorrect password');
  }

  return user.id;
}

export async function V2userDetails(userId: number) {
  
  // Get user
  const [userRows] = await pool.query(
    `SELECT id, email, username, lastStudyDay, studyStreak
    FROM users WHERE id = ?`,
    [userId]
  );
  
  const user = (userRows as any[])[0];
  
  if (!user) throw new Error("User not found");
  
  // Get subjects
  const [subjectRows] = await pool.query(
    `SELECT * FROM subjects WHERE userId = ?`,
    [userId]
  );
  
  return {
    ...user,
    subjects: subjectRows
  };
}


export async function V2userDetailsUpdate(
  userId: number,
  updates: { username?: string; password?: string }
) {
  
  // Confirm user exists
  const [rows] = await pool.query(
    `SELECT * FROM users WHERE id = ?`,
    [userId]
  );
  
  if ((rows as any[]).length === 0) {
    throw new Error("User not found");
  }
  
  // Username update
  if (updates.username !== undefined) {
    if (updates.username.trim() === "") {
      throw new Error("Username cannot be empty");
    }
    
    await pool.query(
      `UPDATE users SET username = ? WHERE id = ?`,
      [updates.username, userId]
    );
  }
  
  // Password update
  if (updates.password !== undefined) {
    passwordIsValid(updates.password);
    
    await pool.query(
      `UPDATE users SET password = ? WHERE id = ?`,
      [updates.password, userId]
    );
  }
  
  // Return updated user details
  return await V2userDetails(userId);
}

export async function V2addSubject(userId: number, name: string): Promise<number> {
  const normalizedName = name.trim().toLowerCase();

  // Check if subject already exists for this user
  const [existing] = await pool.query(
    `SELECT * FROM subjects WHERE userId = ? AND LOWER(name) = ?`,
    [userId, normalizedName]
  );

  if ((existing as any[]).length > 0) {
    throw new Error("Subject already exists");
  }

  // Insert new subject
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const [result] = await pool.query(
    `INSERT INTO subjects (userId, name, lastUpdatedDay) VALUES (?, ?, ?)`,
    [userId, name, today]
  );

  return (result as any).insertId;
}

export async function V2getSubjects(userId: number) {

  // Check user exists
  const [userRows] = await pool.query(
    `SELECT id FROM users WHERE id = ?`,
    [userId]
  );

  if ((userRows as any[]).length === 0) {
    throw new Error("User not found");
  }

  // Fetch subjects
  const [subjectRows] = await pool.query(
    `SELECT * FROM subjects WHERE userId = ?`,
    [userId]
  );

  return subjectRows;
}

export async function V2getSubject(userId: number, subjectId: number) {

  const [rows] = await pool.query(
    `SELECT * FROM subjects 
     WHERE id = ? AND userId = ?`,
    [subjectId, userId]
  );

  const subject = (rows as any[])[0];

  if (!subject) {
    throw new Error("Subject not found for user");
  }

  return subject;
}

export async function V2startTimer(userId: number, subjectId: number) {

  // Check user exists
  const [userRows] = await pool.query(
    `SELECT id FROM users WHERE id = ?`,
    [userId]
  );

  if ((userRows as any[]).length === 0) {
    throw new Error("User not found");
  }

  // Check timer not already running
  const [activeRows] = await pool.query(
    `SELECT * FROM active_sessions WHERE userId = ?`,
    [userId]
  );

  if ((activeRows as any[]).length > 0) {
    throw new Error("Timer already running");
  }

  // Create new session
  const sessionId = Date.now();
  const startTime = Date.now();

  await pool.query(
    `INSERT INTO study_sessions (id, userId, subjectId, startTime)
     VALUES (?, ?, ?, ?)`,
    [sessionId, userId, subjectId, startTime]
  );

  // Store active session
  await pool.query(
    `INSERT INTO active_sessions (userId, sessionId)
     VALUES (?, ?)`,
    [userId, sessionId]
  );
}

export async function V2stopTimer(userId: number): Promise<void> {

  // 1. Find active session
  const [activeRows] = await pool.query<RowDataPacket[]>(
    `SELECT sessionId FROM active_sessions WHERE userId = ?`,
    [userId]
  );

  const [active] = activeRows;

  if (!active) {
    return; // nothing running
  }

  const sessionId = active.sessionId as number;

  // 2. Get session
  const [sessionRows] = await pool.query<RowDataPacket[]>(
    `SELECT * FROM study_sessions WHERE id = ?`,
    [sessionId]
  );

  const [session] = sessionRows;

  if (!session) {
    throw new Error("Session not found");
  }

  // 3. Compute duration
  const endTime = Date.now();
  const durationSeconds = Math.floor(
    (endTime - (session.startTime as number)) / 1000
  );

  // 4. Update session row
  await pool.query(
    `UPDATE study_sessions
     SET endTime = ?, durationSeconds = ?
     WHERE id = ?`,
    [endTime, durationSeconds, sessionId]
  );

  // 5. Update subject totals
  const today = getTodayKey();

  await pool.query(
    `UPDATE subjects
     SET totalStudySeconds = totalStudySeconds + ?,
         todayStudySeconds = todayStudySeconds + ?,
         lastUpdatedDay = ?
     WHERE id = ?`,
    [durationSeconds, durationSeconds, today, session.subjectId]
  );

  // 6. Update streak logic
  const [userRows] = await pool.query<RowDataPacket[]>(
    `SELECT lastStudyDay, studyStreak FROM users WHERE id = ?`,
    [userId]
  );

  const [user] = userRows;

  if (!user) {
    throw new Error("User not found");
  }

  const yesterday = getYesterdayKey();
  let newStreak = user.studyStreak as number;

  if (durationSeconds > 0 && user.lastStudyDay !== today) {
    if (user.lastStudyDay === yesterday) {
      newStreak += 1;
    } else {
      newStreak = 1;
    }

    await pool.query(
      `UPDATE users
       SET lastStudyDay = ?, studyStreak = ?
       WHERE id = ?`,
      [today, newStreak, userId]
    );
  }

  // 7. Remove active session
  await pool.query(
    `DELETE FROM active_sessions WHERE userId = ?`,
    [userId]
  );
}

export async function V2getTodayLeaderBoard(limit: number) {

  if (limit <= 0) {
    throw new Error("Limit must be greater than 0");
  }

  const [rows] = await pool.query<RowDataPacket[]>(
    `
    SELECT 
      u.id AS userId,
      u.username,
      COALESCE(SUM(s.todayStudySeconds), 0) AS totalTodaySeconds,
      u.studyStreak
    FROM users u
    LEFT JOIN subjects s
      ON u.id = s.userId
    GROUP BY u.id, u.username, u.studyStreak
    ORDER BY totalTodaySeconds DESC
    LIMIT ?
    `,
    [limit]
  );

  return rows.map(row => ({
    userId: row.userId as number,
    username: row.username as string,
    totalTodaySeconds: row.totalTodaySeconds as number,
    studyStreak: row.studyStreak as number,
  }));
}
