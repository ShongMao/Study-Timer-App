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

  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [copied, setCopied] = useState(false);

  async function loadAll() {
    setMessage(null);
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
    setMessage(null);
    setSearchResult(null);
    const code = searchCode.toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (!code) {
      setMessage({ text: "Please enter a valid friend code.", type: "error" });
      return;
    }
    const result = await searchByFriendCode(code);
    if (result.error) {
      setMessage({ text: "No user found with that code.", type: "error" });
    } else {
      setSearchResult(result);
    }
  }

  async function handleSendRequest() {
    if (!searchResult) return;
    const result = await sendFriendRequest(userId, searchResult.friendCode);
    if (result.error) {
      setMessage({ text: result.error, type: "error" });
    } else {
      setMessage({ text: "Friend request sent!", type: "success" });
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

  function handleCopyCode() {
    navigator.clipboard.writeText(`#${friendCode}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div
      className="min-h-screen text-white"
      style={{ background: "linear-gradient(75deg, #1b0c1aff 0%, #4B2138 100%)" }}
    >
      {/* Subtle noise texture overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "150px",
        }}
      />

      <div className="relative max-w-2xl mx-auto px-6 py-12">

        {/* Header */}
        <div className="mb-10">
          <p className="text-xs font-semibold tracking-widest uppercase text-purple-300/60 mb-2">
            Social
          </p>
          <h1
            className="text-5xl font-light tracking-tight mb-6"
            style={{ 
              fontFamily: "'Neue Montreal', 'Georgia', 'Times New Roman', serif",
              fontWeight: 500,
              color: "rgba(255,255,255,0.92)",
              letterSpacing: "0.04em",
            }}
          >
            Friends
          </h1>

          {/* Friend code pill */}
          <button
            onClick={handleCopyCode}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all duration-200"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
            title="Click to copy"
          >
            <span className="text-white/40 text-xs">Your code</span>
            <span className="font-mono text-purple-200 font-medium">#{friendCode}</span>
            <span className="text-white/30 text-xs ml-1">
              {copied ? (
                <svg className="w-3.5 h-3.5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              )}
            </span>
          </button>
        </div>

        {/* Divider */}
        <div className="h-px mb-8" style={{ background: "rgba(255,255,255,0.08)" }} />

        {/* Search */}
        <div className="mb-10">
          <label className="block text-xs font-semibold tracking-widest uppercase text-white/40 mb-3">
            Add a friend
          </label>
          <div className="flex gap-2">
            <input
              value={searchCode}
              onChange={(e) => {
                const filtered = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
                setSearchCode(filtered);
              }}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Friend code — e.g. HSNCIE83"
              className="flex-1 px-4 py-2.5 rounded-lg text-sm outline-none transition-all duration-200 placeholder-white/20 font-mono"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "white",
              }}
              onFocus={(e) => {
                e.target.style.border = "1px solid rgba(167,139,250,0.4)";
                e.target.style.background = "rgba(255,255,255,0.09)";
              }}
              onBlur={(e) => {
                e.target.style.border = "1px solid rgba(255,255,255,0.1)";
                e.target.style.background = "rgba(255,255,255,0.06)";
              }}
            />
            <button
              onClick={handleSearch}
              className="px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 active:scale-95"
              style={{ background: "#3b0764", color: "white" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#4c0f80")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#3b0764")}
            >
              Search
            </button>
          </div>

          {/* Search result */}
          {searchResult && (
            <div
              className="mt-3 px-4 py-3 rounded-lg flex items-center justify-between"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <div>
                <p className="text-sm font-medium text-white">{searchResult.username}</p>
                <p className="text-xs font-mono text-white/40 mt-0.5">#{searchResult.friendCode}</p>
              </div>
              <button
                onClick={handleSendRequest}
                className="text-xs px-3 py-1.5 rounded-md font-semibold transition-all duration-150 active:scale-95"
                style={{ background: "rgba(134,239,172,0.15)", color: "#86efac", border: "1px solid rgba(134,239,172,0.2)" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(134,239,172,0.22)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(134,239,172,0.15)")}
              >
                Send request →
              </button>
            </div>
          )}

          {/* Feedback message */}
          {message && (
            <p
              className="mt-3 text-xs font-medium"
              style={{ color: message.type === "success" ? "#86efac" : "#fca5a5" }}
            >
              {message.text}
            </p>
          )}
        </div>

        {/* Tab nav */}
        <div className="flex gap-1 mb-6 p-1 rounded-lg w-fit" style={{ background: "rgba(255,255,255,0.05)" }}>
          {(["friends", "requests"] as const).map((tab) => {
            const isActive = view === tab;
            const label = tab === "friends" ? `Friends${friends.length > 0 ? ` · ${friends.length}` : ""}` : `Requests${requests.length > 0 ? ` · ${requests.length}` : ""}`;
            return (
              <button
                key={tab}
                onClick={() => setView(tab)}
                className="px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200"
                style={
                  isActive
                    ? { background: "#3b0764", color: "white" }
                    : { color: "rgba(255,255,255,0.45)", background: "transparent" }
                }
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.color = "rgba(255,255,255,0.75)";
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.color = "rgba(255,255,255,0.45)";
                }}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Friends list */}
        {view === "friends" && (
          <div>
            {friends.length === 0 ? (
              <div className="py-16 text-center">
                <p className="text-3xl mb-3">👋</p>
                <p className="text-sm text-white/30">No friends yet — search a code to get started.</p>
              </div>
            ) : (
              <div className="space-y-1">
                {friends.map((f) => (
                  <div
                    key={f.id}
                    className="flex items-center justify-between px-4 py-3 rounded-lg group transition-all duration-150"
                    style={{ border: "1px solid transparent" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                      e.currentTarget.style.border = "1px solid rgba(255,255,255,0.07)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.border = "1px solid transparent";
                    }}
                  >
                    <div className="flex items-center gap-3">
                      {/* Avatar placeholder */}
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0"
                        style={{ background: "rgba(167,139,250,0.2)", color: "#c4b5fd" }}
                      >
                        {f.username[0]?.toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white/90">{f.username}</p>
                        <p className="text-xs font-mono text-white/30">#{f.friendCode}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemove(f.id)}
                      className="text-xs px-2.5 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-all duration-150"
                      style={{ color: "#fca5a5", background: "rgba(252,165,165,0.1)" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(252,165,165,0.18)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(252,165,165,0.1)")}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Requests list */}
        {view === "requests" && (
          <div>
            {requests.length === 0 ? (
              <div className="py-16 text-center">
                <p className="text-3xl mb-3">📭</p>
                <p className="text-sm text-white/30">No pending requests.</p>
              </div>
            ) : (
              <div className="space-y-1">
                {requests.map((r) => (
                  <div
                    key={r.requestId}
                    className="flex items-center justify-between px-4 py-3 rounded-lg"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0"
                        style={{ background: "rgba(167,139,250,0.2)", color: "#c4b5fd" }}
                      >
                        {r.username[0]?.toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white/90">{r.username}</p>
                        <p className="text-xs font-mono text-white/30">#{r.friendCode}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAccept(r.requestId)}
                        className="text-xs px-3 py-1.5 rounded-md font-semibold transition-all duration-150"
                        style={{ background: "rgba(134,239,172,0.15)", color: "#86efac", border: "1px solid rgba(134,239,172,0.2)" }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(134,239,172,0.22)")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(134,239,172,0.15)")}
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleDecline(r.requestId)}
                        className="text-xs px-3 py-1.5 rounded-md font-medium transition-all duration-150"
                        style={{ color: "rgba(255,255,255,0.35)", background: "rgba(255,255,255,0.05)" }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.09)")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
                      >
                        Ignore
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}