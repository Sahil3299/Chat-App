import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useSocket } from '../../contexts/SocketContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { connected } = useSocket();

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <nav className="h-16 bg-zinc-900 border-b border-zinc-800 px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="text-2xl">💬</span>
        <h1 className="text-white font-semibold text-lg">Chat App</h1>
      </div>

      <div className={`flex items-center gap-2 ${connected ? 'text-green-400' : 'text-red-400'}`}>
        <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: connected ? '#4ade80' : '#f87171' }}></span>
        <span className="text-sm">{connected ? 'Connected' : 'Disconnected'}</span>
      </div>

      <div className="flex items-center gap-4">
        {user && (
          <>
            <div className="flex items-center gap-2">
              <img src={user.avatar} alt={user.username} className="w-8 h-8 rounded-full" />
              <span className="text-zinc-100 text-sm">{user.username}</span>
            </div>
            <button
              onClick={handleLogout}
              className="text-zinc-400 hover:text-zinc-200 text-sm transition-colors"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
