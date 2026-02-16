const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3200";


export interface LeaderboardUser {
  userId: number;
  username: string;
  totalTodaySeconds: number;
  studyStreak: number;
}

export async function fetchTodayLeaderboard(limit = 10): Promise<LeaderboardUser[]> {
  const res = await fetch(
    `${API_BASE}/v2/leaderboard/users?limit=${limit}`
  );

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Failed to load leaderboard");
  }

  return data.leaderboard;
}