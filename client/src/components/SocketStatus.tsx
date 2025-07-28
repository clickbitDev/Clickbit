import React from 'react';
import { useSocket } from '../contexts/SocketContext';
import { useAuth } from '../contexts/AuthContext';

const SocketStatus: React.FC = () => {
  const { isConnected, isAuthenticated, connectionError, activeSessionUser } = useSocket();
  const { isAuthenticated: authAuthenticated, user } = useAuth();

  if (process.env.NODE_ENV === 'production') {
    return null; // Don't show in production
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3 text-xs font-mono">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${authAuthenticated ? 'bg-green-400' : 'bg-red-400'}`}></span>
          <span>User Auth: {authAuthenticated ? 'Authenticated' : 'Not Authenticated'}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></span>
          <span>Socket: {isConnected ? 'Connected' : 'Disconnected'}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${isAuthenticated ? 'bg-green-400' : 'bg-gray-400'}`}></span>
          <span>Socket Auth: {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}</span>
        </div>
        {user && (
          <div className="text-blue-600 dark:text-blue-400">
            Local: {user.first_name}
          </div>
        )}
        {activeSessionUser && (
          <div className="text-green-600 dark:text-green-400">
            Socket: {activeSessionUser.first_name}
          </div>
        )}
        {connectionError && (
          <div className="text-red-600 dark:text-red-400">
            Error: {connectionError}
          </div>
        )}
      </div>
    </div>
  );
};

export default SocketStatus; 