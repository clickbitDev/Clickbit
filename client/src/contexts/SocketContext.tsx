import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';

// Types
interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  isAuthenticated: boolean;
  connectionError: string | null;
  activeSessionUser: any | null;
  connect: () => void;
  disconnect: () => void;
  authenticate: (token: string) => void;
  userLogin: (userData: any) => void;
  userLogout: () => void;
}

// Create context
const SocketContext = createContext<SocketContextType | undefined>(undefined);

// Provider component
export const SocketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [activeSessionUser, setActiveSessionUser] = useState<any | null>(null);
  const { user, token, isAuthenticated: authIsAuthenticated } = useAuth();

  // Socket server URL
  const SOCKET_URL = window.location.origin;

  // Initialize socket connection
  const connect = () => {
    if (socket?.connected) return;

    const newSocket = io(SOCKET_URL, {
      withCredentials: true,
      transports: ['polling', 'websocket'],
      autoConnect: true,
    });

    setSocket(newSocket);

    // Connection events
    newSocket.on('connect', () => {
      console.log('Socket connected:', newSocket.id);
      setIsConnected(true);
      setConnectionError(null);
      
      // Authenticate immediately since socket only connects when user is authenticated
      if (token) {
        newSocket.emit('authenticate', { token });
      }
    });

    newSocket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      setIsConnected(false);
      setIsAuthenticated(false);
      setActiveSessionUser(null);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setConnectionError(error.message);
      setIsConnected(false);
    });

    // Authentication events
    newSocket.on('authenticated', (data) => {
      console.log('Socket authenticated:', data.user);
      setIsAuthenticated(true);
      setActiveSessionUser(data.user);
      setConnectionError(null);
    });

    newSocket.on('auth_error', (error) => {
      console.error('Socket auth error:', error);
      setIsAuthenticated(false);
      setActiveSessionUser(null);
      setConnectionError(error.message);
    });

    newSocket.on('login_success', (data) => {
      console.log('Socket login success:', data.user);
      setIsAuthenticated(true);
      setActiveSessionUser(data.user);
    });

    newSocket.on('logged_out', () => {
      console.log('Socket logged out');
      setIsAuthenticated(false);
      setActiveSessionUser(null);
    });

    // Heartbeat
    newSocket.on('pong', (data) => {
      // console.log('Heartbeat response:', data.timestamp);
    });

    // Send periodic heartbeat
    const heartbeat = setInterval(() => {
      if (newSocket.connected) {
        newSocket.emit('ping');
      }
    }, 30000); // Every 30 seconds

    // Cleanup heartbeat on disconnect
    newSocket.on('disconnect', () => {
      clearInterval(heartbeat);
    });
  };

  // Disconnect socket
  const disconnect = () => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
      setIsConnected(false);
      setIsAuthenticated(false);
      setActiveSessionUser(null);
    }
  };

  // Authenticate with token
  const authenticate = (authToken: string) => {
    if (socket && socket.connected) {
      socket.emit('authenticate', { token: authToken });
    }
  };

  // Handle user login
  const userLogin = (userData: any) => {
    if (socket && socket.connected) {
      socket.emit('user_login', { user: userData });
    }
  };

  // Handle user logout
  const userLogout = () => {
    if (socket && socket.connected) {
      socket.emit('user_logout');
    }
  };

  // Connect only when user is authenticated
  useEffect(() => {
    if (authIsAuthenticated && token) {
      // User is authenticated, connect to socket
      connect();
    } else {
      // User is not authenticated, disconnect socket
      disconnect();
    }

    // Cleanup on unmount
    return () => {
      disconnect();
    };
  }, [authIsAuthenticated, token]);

  // Handle user login through auth context when socket connects
  useEffect(() => {
    if (user && authIsAuthenticated && socket && socket.connected && !isAuthenticated) {
      userLogin(user);
    }
  }, [user, authIsAuthenticated, socket, isAuthenticated]);

  const value: SocketContextType = {
    socket,
    isConnected,
    isAuthenticated,
    connectionError,
    activeSessionUser,
    connect,
    disconnect,
    authenticate,
    userLogin,
    userLogout,
  };

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};

// Custom hook to use socket context
export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
}; 