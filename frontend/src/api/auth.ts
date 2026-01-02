const API_BASE = "http://localhost:3200/v1";

export async function register(email: string, username: string, password: string): Promise<number> {
  const response = await fetch(`${API_BASE}/user/register`, {
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
  const response = await fetch(`${API_BASE}/user/login`, {
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

export async function fetchUser(userId: string) {
  const res = await fetch(`/v1/user/${userId}/details`);
  if (!res.ok) throw new Error("User not found");
  return res.json();
}