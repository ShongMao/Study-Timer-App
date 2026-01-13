import { db, User } from './db'

export function findUser(userId: number): User | null {
  const user = db.users.find(u => u.id == userId);

  return user ?? null;
}

export function getTodayKey(): string {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}


export function getYesterdayKey(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}