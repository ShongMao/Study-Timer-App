export async function register(email: string, username: string, password: string): Promise<number> {
  const response = await fetch('http://localhost:3200/v1/user/register', {
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
  const response = await fetch('http://localhost:3200/v1/user/login', {
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