import { db, User } from './db';

export function userRegister(email: string, password: string, username: string) {
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