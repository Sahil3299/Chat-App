import React from 'react';
import { X, Phone, Mic, Volume2 } from 'lucide-react';

const RightPanel = ({ users, selectedUser }) => {
  const displayUser = selectedUser || users?.[0];

  if (!displayUser) {
    return (
      <div className="hidden xl:flex w-72 shrink-0 bg-zinc-900 border-l border-zinc-800 flex-col items-center justify-center text-center">
        <div className="text-zinc-500">
          <p className="text-sm">Select a user to see details</p>
        </div>
      </div>
    );
  }

  return (
    <div className="hidden xl:flex w-72 shrink-0 bg-zinc-900 border-l border-zinc-800 flex-col">
      {/* Close Button */}
      <div className="p-4 border-b border-zinc-800 flex justify-between items-center">
        <h3 className="text-white font-semibold text-sm">Contact Info</h3>
        <button className="text-zinc-400 hover:text-zinc-200 p-1">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Contact Card */}
      <div className="p-6 border-b border-zinc-800 text-center">
        {/* Avatar */}
        <div className="flex justify-center mb-4">
          <div className="relative">
            <img
              src={displayUser.avatar || `https://ui-avatars.com/api/?name=${displayUser.username}`}
              alt={displayUser.username}
              className="w-24 h-24 rounded-full"
            />
            {displayUser.status === 'online' && (
              <div className="absolute bottom-2 right-2 w-4 h-4 bg-green-400 rounded-full border-2 border-zinc-900"></div>
            )}
          </div>
        </div>

        {/* User Info */}
        <h2 className="text-white font-semibold text-lg">{displayUser.username}</h2>
        <p className="text-zinc-400 text-sm mt-1">
          {displayUser.status === 'online'
            ? 'Active now'
            : displayUser.status === 'away'
            ? 'Away'
            : 'Offline'}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="p-4 space-y-2 border-b border-zinc-800">
        <button className="w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 text-white rounded-xl py-3 font-medium transition-colors">
          <Phone className="w-4 h-4" />
          Video Call
        </button>
        <button className="w-full flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded-xl py-3 font-medium transition-colors">
          <Mic className="w-4 h-4" />
          Voice Call
        </button>
        <button className="w-full flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded-xl py-3 font-medium transition-colors">
          <Volume2 className="w-4 h-4" />
          Mute
        </button>
      </div>

      {/* Shared Media */}
      <div className="p-4">
        <h4 className="text-white font-semibold text-sm mb-3">Shared Media</h4>
        <div className="grid grid-cols-3 gap-1">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="aspect-square rounded-lg bg-zinc-800 overflow-hidden"
            >
              <div className="w-full h-full bg-gradient-to-br from-zinc-700 to-zinc-800 flex items-center justify-center">
                <span className="text-xs text-zinc-500">Image</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Info */}
      <div className="mt-auto p-4 border-t border-zinc-800">
        <div className="space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-zinc-500">Joined</span>
            <span className="text-zinc-300">{new Date().toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">Status</span>
            <span className="text-zinc-300 capitalize">{displayUser.status || 'offline'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightPanel;
