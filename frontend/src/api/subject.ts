export interface Subject {
  id: number;
  name: string;
  totalStudySeconds: number;
}

const API_BASE = "http://localhost:3200/v1";

// Fetch all subjects for a user
export async function fetchSubjects(userId: string): Promise<Subject[]> {
  const res = await fetch(`${API_BASE}/user/${userId}/subjects`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to fetch subjects");
  return data.subjects;
}

// Add a new subject
export async function addSubject(userId: string, name: string): Promise<Subject> {
  const res = await fetch(`${API_BASE}/user/${userId}/subject`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to add subject");
  return { id: data.subjectId, name, totalStudySeconds: 0 };
}

// Delete a subject
export async function deleteSubject(userId: string, subjectId: number): Promise<void> {
  const res = await fetch(`${API_BASE}/user/${userId}/subject/${subjectId}`, {
    method: "DELETE",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to delete subject");
}