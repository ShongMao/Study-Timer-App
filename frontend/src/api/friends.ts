const API_BASE = 
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export type Friend = {
  id: number;
  username: string;
  friendCode: string;
};

export type FriendRequest = {
  requestId: number;
  fromUserId: number;
  username: string;
  friendCode: string;
  createdAt: string;
};

export async function fetchUserDetails(userId: number) {
  const res = await fetch(`${API_BASE}/v2/user/details?userId=${userId}`);
  return await res.json();
}


export async function fetchFriends(userId: number) {
  const res = await fetch(`${API_BASE}/v2/friends/list/${userId}`);
  return await res.json();
}

export async function fetchFriendRequests(userId: number) {
  const res = await fetch(
    `${API_BASE}/v2/friends/requests?userId=${userId}`
  );
  return await res.json();
}

export async function searchByFriendCode(code: string) {
  const res = await fetch(`${API_BASE}/v2/friends/search?code=${code}`);
  return await res.json();
}

export async function sendFriendRequest(
  fromUserId: number,
  friendCode: string
) {
  const res = await fetch(`${API_BASE}/v2/friends/request`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fromUserId, friendCode }),
  });

  return await res.json();
}

export async function acceptFriendRequest(
  requestId: number,
  userId: number
) {
  const res = await fetch(`${API_BASE}/v2/friends/accept`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ requestId, userId }),
  });

  return await res.json();
}

export async function declineFriendRequest(
  requestId: number,
  userId: number
) {
  const res = await fetch(`${API_BASE}/v2/friends/decline`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ requestId, userId }),
  });

  return await res.json();
}

export async function removeFriend(userId: number, friendId: number) {
  const res = await fetch(`${API_BASE}/v2/friends/remove`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, friendId }),
  });

  return await res.json();
}
