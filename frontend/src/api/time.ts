export async function saveTimeStudied(userId: string, subject: string, duration: number): Promise<void> {
  await fetch('/api/save-study-time', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, subject, duration }),
  });
}

export async function getTodayStudyTime(userId: string, subject: string): Promise<number> {
    try {
        const response = await fetch(`/api/get-today-study-time?userId=${userId}&subject=${subject}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch today\'s study time');
        }

        const data = await response.json();
        return data.studyTime || 0;
    } catch (error) {
        console.error('Error fetching today\'s study time:', error);
        throw error;
    }
}