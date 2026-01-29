import React from 'react';
import PresenceIndicator from '../Common/PresenceIndicator';
import './UserList.css';

const UserList = ({ users }) => {
  return (
    <div className="user-list">
      <div className="user-list-header">
        <h3>Online Users ({users.length})</h3>
      </div>
      
      <div className="user-list-content">
        {users.length === 0 ? (
          <div className="no-users">No users online</div>
        ) : (
          users.map((user) => (
            <div key={user._id} className="user-item">
              <div className="user-avatar-container">
                <img 
                  src={user.avatar} 
                  alt={user.username}
                  className="user-avatar"
                />
                <PresenceIndicator status={user.status} />
              </div>
              
              <div className="user-info">
                <div className="user-username">{user.username}</div>
                <div className="user-status">
                  {user.status === 'online' ? 'Active now' : 
                   user.status === 'away' ? 'Away' : 'Offline'}
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
