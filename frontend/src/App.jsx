import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { SocketProvider } from './contexts/SocketContext';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ChatRoom from './components/Chat/ChatRoom';

const ProtectedRoute = ({ children }) => {
  const { token, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-zinc-950">
        <div className="text-zinc-100">Loading...</div>
      </div>
    );
  }

  return token ? children : <Navigate to="/login" />;
};

const App = () => {
  const defaultRoomId = '507f1f77bcf86cd799439011';

  return (
    <BrowserRouter>
      <AuthProvider>
        <SocketProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/chat"
              element={
                <ProtectedRoute>
                  <ChatRoom roomId={defaultRoomId} />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to="/chat" />} />
          </Routes>
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
