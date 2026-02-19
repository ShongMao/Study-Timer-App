import { db, User } from './db'
import { pool } from './database';
import { RowDataPacket } from 'mysql2';

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

export async function generateFriendCode(): Promise<string> {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  while (true) {
    let code = "";

    for (let i = 0; i < 8; i++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }

    // Check uniqueness in DB
    const [check] = await pool.query<RowDataPacket[]>(
      `SELECT id FROM users WHERE friendCode = ?`,
      [code]
    );

    if (check.length === 0) {
      return code;
    }
  }
}
