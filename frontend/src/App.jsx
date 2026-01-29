import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { SocketProvider } from './contexts/SocketContext';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ChatRoom from './components/Chat/ChatRoom';
import Navbar from './components/Common/Navbar';
import './App.css';

const ProtectedRoute = ({ children }) => {
  const { token, loading } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return token ? children : <Navigate to="/login" />;
};

const App = () => {
  // Default room ID - in production, you'd have room selection
  const defaultRoomId = '507f1f77bcf86cd799439011';

  return (
    <BrowserRouter>
      <AuthProvider>
        <SocketProvider>
          <div className="app">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/chat"
                element={
                  <ProtectedRoute>
                    <>
                      <Navbar />
                      <ChatRoom roomId={defaultRoomId} />
                    </>
                  </ProtectedRoute>
                }
              />
              <Route path="/" element={<Navigate to="/chat" />} />
            </Routes>
          </div>
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
