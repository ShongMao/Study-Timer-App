import { Flame } from 'lucide-react';
import { formatTime } from '../shared/util/format';

export default function LeaderboardPage() {
  // This data will be pulled from the backend
  const friends = [
    { name: 'Sarah Kim', time: 14400, rank: 1, avatar: 'SK', streak: 12, weeklyTime: 75600 },
    { name: 'John Lee', time: 12600, rank: 2, avatar: 'JL', streak: 8, weeklyTime: 68400 },
    { name: 'Emma Park', time: 10800, rank: 3, avatar: 'EP', streak: 15, weeklyTime: 72000 },
    { name: 'You', time: 200, rank: 4, avatar: 'XD', streak: 7, weeklyTime: 54000 },
    { name: 'Mike Chen', time: 7200, rank: 5, avatar: 'MC', streak: 5, weeklyTime: 46800 },
    { name: 'Lisa Wang', time: 6300, rank: 6, avatar: 'LW', streak: 10, weeklyTime: 43200 },
    { name: 'Tom Davis', time: 5400, rank: 7, avatar: 'TD', streak: 3, weeklyTime: 36000 },
  ].sort((a, b) => b.time - a.time).map((f, i) => ({ ...f, rank: i + 1 }));

  

  return (
    <div className="min-h-screen" style={{
      background: 'linear-gradient(135deg, #815854 0%, #F9EBDE 100%)'
    }}>
      <div className="max-w-4xl mx-auto p-12">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-white mb-4">Friend Leaderboard</h2>
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