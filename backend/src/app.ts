import { db, User, Subject } from './db';

export function userRegister(email: string, password: string, username: string): number {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!regex.test(email)) {
    throw new Error('Invalid email');
  }

  if (password.length < 4) {
    throw new Error('Password must be at least 4 characters long');
  }

  if (!/[A-Z]/.test(password)) {
    throw new Error('Password must contain a capital letter');
  }

  if (!/[0-9]/.test(password)) {
    throw new Error('Password must contain a number');
  }

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
    subjects: []
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
    //sessions: [],
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
  };
}

export function getSubjects(userId: number): Subject[] {
  const user = findUser(userId);
  if (!user) {
    throw new Error("User not found");
  }

  return user.subjects;
}

export function findUser(userId: number): User | null {
  const user = db.users.find(u => u.id == userId);

  return user ?? null;
}