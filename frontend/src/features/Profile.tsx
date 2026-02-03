import { useEffect, useState } from 'react';
import { User } from 'lucide-react';
import { fetchUser } from '../api/auth';

export default function ProfilePage() {
  // const userId = localStorage.getItem('userId');
  const rawUserId = localStorage.getItem('userId');
  if (!rawUserId) throw new Error('Not logged in');
  const userId = Number(rawUserId);

  const [username, setUsername] = useState<string>("My");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      if (!userId) {
        return
      }

      try {
        const user = await fetchUser(userId);
        setUsername(user.username);
      } catch (err) {
        console.error('Failed to fetch user:', err);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, [userId]);

  return (
    <div className="min-h-screen flex items-center justify-center" style={{
      background: 'linear-gradient(135deg, #1b0c1aff 0%, #4B2138 100%)'
    }}>
      <div className="w-260 h-185 bg-gray-200 rounded-2xl shadow-lg flex p-6 gap-4">
        <div className="w-1/2 h-full bg-gray-300 rounded-2xl flex flex-col p-6">
          {/* User icon */}
          <div className="flex justify-center mb-4">
            <User className="w-24 h-24 text-gray-600" />
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            {loading ? 'Loading...' : `${username}'s Profile`}
          </h2>

          {/* Profile fields */}
          <div className="flex flex-col gap-4 flex-1">
            
            <div>
              <label className="block text-base font-semibold text-gray-700 mb-1">
                Username:
              </label>
              <input
                type="text"
                placeholder="your_username"
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-base font-semibold text-gray-700 mb-1">
                Password:
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

          </div>

          {/* Save button */}
          <div className="flex justify-center mt-6">
            <button className="w-32 bg-purple-700 hover:bg-purple-800 text-white font-semibold py-2 rounded-lg transition">
              Save
            </button>
          </div>
        </div>

        <div className="w-1/2 h-full flex flex-col gap-4">
          <div className="h-1/2 bg-gray-400 rounded-2xl"></div>
          <div className="h-1/2 bg-gray-400 rounded-2xl"></div>
        </div>


      </div>

    </div>
  )
}