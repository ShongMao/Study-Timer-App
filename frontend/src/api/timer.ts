import type { Subject } from "./subject";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3200";


export async function startTimer(userId: number, subjectId: number) {
  const res = await fetch(`${API_BASE}/v2/timer/start`, {
    method: "POST", 
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, subjectId })
  })

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error);
  }
}

export async function stopTimer(userId: number) {
  const res = await fetch(`${API_BASE}/v2/timer/stop`, {
    method: "POST", 
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId })
  })

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error);
  }
}

export async function fetchSubject(userId: string, subjectId: number): Promise<Subject> {
  const res = await fetch(`${API_BASE}/v2/timer/${userId}/subject/${subjectId}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to fetch subject");
  return data.subject;
}