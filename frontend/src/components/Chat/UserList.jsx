import React from 'react';
import PresenceIndicator from '../Common/PresenceIndicator';

const UserList = ({ users }) => {
  return (
    <div className="w-72 bg-zinc-900 border-l border-zinc-800 flex flex-col">
      <div className="p-4 border-b border-zinc-800">
        <h3 className="text-white font-semibold">Online Users ({users.length})</h3>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {users.length === 0 ? (
          <div className="p-4 text-center text-zinc-500 text-sm">No users online</div>
        ) : (
          users.map((user) => (
            <div key={user._id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-zinc-800/60 transition-colors">
              <div className="relative">
                <img
                  src={user.avatar}
                  alt={user.username}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="absolute bottom-0 right-0">
                  <PresenceIndicator status={user.status} />
                </div>
              </div>

              <div className="flex-1 text-left">
                <div className="text-white text-sm font-medium line-clamp-1">{user.username}</div>
                <div className="text-zinc-400 text-xs">
                  {user.status === 'online'
                    ? 'Active now'
                    : user.status === 'away'
                    ? 'Away'
                    : 'Offline'}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UserList;
