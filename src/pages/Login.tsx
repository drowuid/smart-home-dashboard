import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(username, password)) {
      navigate('/dashboard');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="bg-white/10 p-8 rounded-2xl backdrop-blur-xl shadow-lg w-96 border border-white/20">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">Smart Dashboard Login</h1>
        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="text" 
            placeholder="Username"
            className="w-full p-3 rounded-xl bg-white/10 text-white border border-white/20"
            value={username} onChange={(e) => setUsername(e.target.value)} 
          />
          <input 
            type="password" 
            placeholder="Password"
            className="w-full p-3 rounded-xl bg-white/10 text-white border border-white/20"
            value={password} onChange={(e) => setPassword(e.target.value)} 
          />
          <button 
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl text-white hover:scale-105 transform transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
