import { Flame } from 'lucide-react';
import { formatTime } from '../shared/util/format';
import { useState, useEffect } from 'react';
import { fetchTodayLeaderboard } from '../api/leaderboard';

export default function LeaderboardPage() {
  const [friends, setFriends] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        // Later we will add a "show top... button"
        const data = await fetchTodayLeaderboard(10);

        const ranked = data.map((user, i) => ({
          name: user.username,
          time: user.totalTodaySeconds,
          streak: user.studyStreak,
          rank: i + 1,
          avatar: user.username
            .split(' ')
            .map(n => n[0])
            .join('')
            .slice(0, 2)
            .toUpperCase(),
        }));

        setFriends(ranked);
      } catch (err: any) {
        alert(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadLeaderboard();
  }, []);

  if (loading) {
    return <div className="text-center text-white text-xl mt-20">Loading leaderboard...</div>;
  }

  

  return (
    <div className="min-h-screen overflow-shown" style={{
      background: 'linear-gradient(135deg, #1b0c1aff 0%, #4B2138 100%)'
    }}>
      <div className="max-w-4xl mx-auto p-12 scrollbar-show">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-white mb-4">Global Leaderboard</h2>
          <p className="text-xl text-white/80">Today's study time rankings</p>
        </div>
        
        <div className="space-y-4">
          {friends.map((friend) => (
            // Container for each friend entry
            <div
              key={friend.name}
              className={`p-6 rounded-2xl shadow-2xl flex items-center gap-6 transition hover:scale-105 ${
                friend.name === 'You'
                  ? 'bg-white ring-4 ring-white/50'
                  : 'bg-white/95'
              }`}
            >
              {/* Friend icons */}
              <div className={`w-20 h-20 rounded-full flex items-center justify-center font-bold text-white text-2xl shadow-lg ${
                friend.rank === 1 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' :
                friend.rank === 2 ? 'bg-gradient-to-br from-gray-300 to-gray-500' :
                friend.rank === 3 ? 'bg-gradient-to-br from-amber-500 to-amber-700' :
                'bg-gradient-to-br from-amber-700 to-amber-500'
              }`}>
                {friend.rank <= 3 ? (friend.rank === 1 ? '🥇' : friend.rank === 2 ? '🥈' : '🥉') : friend.avatar}
              </div>
              
              {/* Friend name and time studied */}
              <div className="flex-1">
                <div className="text-2xl font-bold text-gray-800 mb-1">{friend.name}</div>
                <div className="text-lg text-gray-600">{formatTime(friend.time)} today</div>
              </div>

              <div className="flex items-center gap-6">
                {/* Streak */}
                <div className="text-center">
                  <div className="flex items-center gap-2 text-orange-500 text-lg font-semibold mb-1">
                    <Flame size={20} />
                    {friend.streak} days
                  </div>
                  <div className="text-sm text-gray-500">Streak</div>
                </div>
                
                {/* Rank */}
                <div className="text-center">
                  <div className="text-4xl font-bold text-amber-800">#{friend.rank}</div>
                  <div className="text-sm text-gray-500">Rank</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}