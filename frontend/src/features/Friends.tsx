import { useEffect, useState } from "react";
import {
  fetchFriends,
  fetchFriendRequests,
  searchByFriendCode,
  sendFriendRequest,
  acceptFriendRequest,
  declineFriendRequest,
  removeFriend,
} from "../api/friends";
import type { Friend, FriendRequest } from "../api/friends";
import { fetchUser } from "../api/auth";

export default function FriendsPage() {
  const userId = Number(localStorage.getItem("userId"));

  const [friendCode, setFriendCode] = useState("");
  const [view, setView] = useState<"friends" | "requests">("friends");

  const [friends, setFriends] = useState<Friend[]>([]);
  const [requests, setRequests] = useState<FriendRequest[]>([]);

  const [searchCode, setSearchCode] = useState("");
  const [searchResult, setSearchResult] = useState<Friend | null>(null);

  const [message, setMessage] = useState("");

  async function loadAll() {
    setMessage("");

    const userData = await fetchUser(userId);
    if (!userData.error) setFriendCode(userData.friendCode);

    const friendsData = await fetchFriends(userId);
    if (!friendsData.error) setFriends(friendsData.friends);

    const requestData = await fetchFriendRequests(userId);
    if (!requestData.error) setRequests(requestData.requests);
  }

  useEffect(() => {
    loadAll();
  }, []);

  async function handleSearch() {
    setMessage("");
    setSearchResult(null);

    // Normalize code: uppercase + remove non-alphanumeric
    const code = searchCode.toUpperCase().replace(/[^A-Z0-9]/g, "");

    if (!code) {
      setMessage("Please enter a valid friend code.");
      return;
    }

    const result = await searchByFriendCode(code);

    if (result.error) {
      setMessage("User not found.");
    } else {
      setSearchResult(result);
    }
  }

  async function handleSendRequest() {
    if (!searchResult) return;

    const result = await sendFriendRequest(userId, searchResult.friendCode);

    if (result.error) {
      setMessage(result.error);
    } else {
      setMessage("Friend request sent!");
      setSearchResult(null);
      setSearchCode("");
    }
  }

  async function handleAccept(requestId: number) {
    await acceptFriendRequest(requestId, userId);
    loadAll();
  }

  async function handleDecline(requestId: number) {
    await declineFriendRequest(requestId, userId);
    loadAll();
  }

  async function handleRemove(friendId: number) {
    await removeFriend(userId, friendId);
    loadAll();
  }

  return (
    <div
      className="min-h-screen p-8 text-white"
      style={{
        background: "linear-gradient(135deg, #1b0c1aff 0%, #4B2138 100%)",
      }}
    >
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2">Friends</h1>
        <p className="text-lg">
          My friend code:{" "}
          <span className="font-mono text-sm">#{friendCode}</span>
        </p>
      </div>

      {/* Search */}
      <div className="max-w-xl mx-auto mb-8">
        <div className="flex gap-2">
          <input
            value={searchCode}
            onChange={(e) => {
              const filtered = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
              setSearchCode(filtered);
            }}
            placeholder="Search friend code (e.g. #HSNCIE83)"
            className="flex-1 p-2 rounded text-black"
          />
          <button
            onClick={handleSearch}
            className="bg-pink-600 px-4 py-2 rounded font-semibold"
          >
            Search
          </button>
        </div>

        {searchResult && (
          <div className="mt-4 p-4 bg-white/10 rounded">
            <p>
              Found: <b>{searchResult.username}</b> (#{searchResult.friendCode})
            </p>
            <button
              onClick={handleSendRequest}
              className="mt-2 bg-green-600 px-3 py-1 rounded"
            >
              Add Friend
            </button>
          </div>
        )}
      </div>

      {/* Toggle */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => setView("friends")}
          className={`px-4 py-2 rounded ${
            view === "friends" ? "bg-pink-600" : "bg-white/10"
          }`}
        >
          My Friends
        </button>

        <button
          onClick={() => setView("requests")}
          className={`px-4 py-2 rounded ${
            view === "requests" ? "bg-pink-600" : "bg-white/10"
          }`}
        >
          Friend Requests
        </button>
      </div>

      {/* Friends View */}
      {view === "friends" && (
        <div className="max-w-xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">My Friends</h2>

          {friends.length === 0 ? (
            <p>No friends yet.</p>
          ) : (
            friends.map((f) => (
              <div
                key={f.id}
                className="flex justify-between items-center p-3 mb-2 bg-white/10 rounded"
              >
                <p>
                  {f.username}{" "}
                  <span className="font-mono text-sm">#{f.friendCode}</span>
                </p>

                <button
                  onClick={() => handleRemove(f.id)}
                  className="bg-red-600 px-3 py-1 rounded"
                >
                  Remove
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* Requests View */}
      {view === "requests" && (
        <div className="max-w-xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Friend Requests</h2>

          {requests.length === 0 ? (
            <p>No pending requests.</p>
          ) : (
            requests.map((r) => (
              <div
                key={r.requestId}
                className="flex justify-between items-center p-3 mb-2 bg-white/10 rounded"
              >
                <p>
                  {r.username}{" "}
                  <span className="font-mono text-sm">#{r.friendCode}</span>
                </p>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleAccept(r.requestId)}
                    className="bg-green-600 px-3 py-1 rounded"
                  >
                    Accept
                  </button>

                  <button
                    onClick={() => handleDecline(r.requestId)}
                    className="bg-gray-600 px-3 py-1 rounded"
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Message */}
      {message && (
        <p className="text-center mt-6 text-yellow-300 font-semibold">
          {message}
        </p>
      )}
    </div>
  );
}
