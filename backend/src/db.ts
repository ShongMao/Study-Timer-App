export interface User {
  id: number;
  email: string;
  username: string;
  password: string; // plain for now (hash later)
}

export const db = {
  users: [] as User[],
};

// Optional helper for tests
export function clearDB() {
  db.users.length = 0;
}