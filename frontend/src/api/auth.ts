const API_BASE = "http://localhost:3200";

export async function register(email: string, username: string, password: string): Promise<number> {
  const response = await fetch(`${API_BASE}/v2/user/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password, username }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Registration failed');
  }

  return data.userId;
}

export async function login( username: string, password: string): Promise<number> {
  const response = await fetch(`${API_BASE}/v2/user/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Login failed');
  }

  return data.userId;
}

export async function fetchUser(userId: number) {
  const res = await fetch(`${API_BASE}/v2/user/${userId}/details`);
  if (!res.ok) throw new Error("User not found");
  return res.json();
}

export async function updateUser(userId: number, updates: {
    username?: string;
    password?: string;
  }) {
  const res = await fetch(`${API_BASE}/v2/user/${userId}/details`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to update user");

  }
  return res.json();
}