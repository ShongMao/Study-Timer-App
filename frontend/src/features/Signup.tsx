import { Clock, Users, TrendingUp, Award} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../api/auth';

export default function SignupPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const userId = await register(email, username, password);
      localStorage.setItem('userId', String(userId));
      setError('');
      navigate('/subjects');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  };

  return (
      <div className="min-h-screen flex" style={{
    background: 'linear-gradient(135deg, #815854 0%, #F9EBDE 100%)'
  }}>
    <div className="flex-1 flex items-center justify-center p-12">
      <div className="max-w-md w-full">
        <div className="text-center mb-12">
          <div className="inline-block p-6 bg-white rounded-full mb-6 shadow-2xl">
            <Clock size={64} className="text-amber-800" />
          </div>
          <h1 className="text-6xl font-bold text-white mb-4">StudyFlow</h1>
          <p className="text-xl text-white/90">Focus. Track. Achieve.</p>
        </div>
        
        {/* Form */}
        <div className="bg-white rounded-3xl p-10 shadow-2xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Create Account</h2>
          {/* Email field */}
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                onKeyPress={(e) => e.key === 'Enter' && handleRegister()}
                className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:border-amber-800 focus:outline-none transition text-lg"
                placeholder="Enter your email"
              />
            </div>


          {/* Username field */}
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => { setUsername(e.target.value); setError(''); }}
              onKeyPress={(e) => e.key === 'Enter' && handleRegister()}
              className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:border-amber-800 focus:outline-none transition text-lg"
              placeholder="Enter your name"
            />
          </div>
          {/* Password field */}
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
              className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:border-amber-800 focus:outline-none transition text-lg"
              placeholder="Enter your password"
            />
          </div>
          {error && (
            <p className="text-red-600 text-sm mb-4">{error}</p>
          )}
          <button
            onClick={handleRegister}
            className="w-full py-4 rounded-xl font-semibold text-white text-lg transition shadow-lg hover:shadow-xl hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #815854 0%, #a67a75 100%)' }}
          >
            Start Studying
          </button>
          {/* Link to login page */}
          <button
            onClick={() => navigate('/login')}
            className="mt-6 w-full text-center text-sm font-semibold text-amber-800 hover:underline"
          >
            Already have an account? Log in
          </button>
        </div>
      </div>
    </div>

    <div className="flex-1 flex items-center justify-center p-12 bg-white/10 backdrop-blur-sm">
      <div className="max-w-lg text-white">
        <h2 className="text-4xl font-bold mb-6">Track Your Progress</h2>
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <TrendingUp size={28} />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Detailed Analytics</h3>
              <p className="text-white/80">Monitor your study time across subjects and track your progress over time.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <Users size={28} />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Compete with Friends</h3>
              <p className="text-white/80">Join leaderboards and stay motivated by studying together.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <Award size={28} />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Earn Achievements</h3>
              <p className="text-white/80">Unlock badges and rewards as you reach your study goals.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}