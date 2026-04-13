import React, { useState } from 'react';
import { Search, Plus, LogOut } from 'lucide-react';

const Sidebar = ({ users, selectedUser, onSelectUser, user, onLogout }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUsers = users.filter(u =>
    u.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-64 shrink-0 bg-zinc-900 border-r border-zinc-800 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-zinc-800">
        <h1 className="text-white font-semibold text-lg">💬 Chat</h1>
      </div>

      {/* Search */}
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-800 text-zinc-100 rounded-lg pl-10 pr-4 py-2 text-sm border border-zinc-700 focus:outline-none focus:border-violet-500 transition-colors"
          />
        </div>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto px-2 space-y-1">
        {filteredUsers.length === 0 ? (
          <div className="p-4 text-center text-zinc-500 text-sm">
            No users online
          </div>
        ) : (
          filteredUsers.map((u) => (
            <button
              key={u._id}
              onClick={() => onSelectUser(u)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                selectedUser?._id === u._id
                  ? 'bg-zinc-800 border-l-2 border-violet-500'
                  : 'hover:bg-zinc-800/60'
              }`}
            >
              {/* Avatar */}
              <div className="relative">
                <img
                  src={u.avatar || `https://ui-avatars.com/api/?name=${u.username}`}
                  alt={u.username}
                  className="w-10 h-10 rounded-full obj-cover"
                />
                {u.status === 'online' && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-zinc-800"></div>
                )}
              </div>

              {/* User Info */}
              <div className="flex-1 text-left">
                <p className="text-white text-sm font-medium line-clamp-1">{u.username}</p>
                <p className="text-zinc-400 text-xs">
                  {u.status === 'online' ? 'Active now' : u.status === 'away' ? 'Away' : 'Offline'}
                </p>
              </div>

              {/* Unread Badge (optional) */}
              {/* <div className="w-5 h-5 bg-violet-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs font-bold">2</span>
              </div> */}
            </button>
          ))
        )}
      </div>

      {/* New Chat Button */}
      <div className="p-2 border-t border-zinc-800">
        <button className="w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 text-white rounded-lg py-2 font-medium transition-colors">
          <Plus className="w-4 h-4" />
          New Chat
        </button>
      </div>

      {/* User Profile Section */}
      <div className="p-3 border-t border-zinc-800">
        <div className="flex items-center gap-2 mb-3">
          <img
            src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.username}`}
            alt={user?.username}
            className="w-8 h-8 rounded-full"
          />
          <div className="flex-1 text-left min-w-0">
            <p className="text-white text-sm font-medium truncate">{user?.username}</p>
            <p className="text-zinc-500 text-xs">You</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 text-zinc-400 hover:text-zinc-200 text-sm py-2 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
