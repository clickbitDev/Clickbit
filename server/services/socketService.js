const jwt = require('jsonwebtoken');
const { logger } = require('../utils/logger');

class SocketService {
  constructor(io) {
    this.io = io;
    this.activeUsers = new Map(); // userId -> { socketId, user, connectedAt }
    this.socketUsers = new Map(); // socketId -> userId
    this.initialize();
  }

  initialize() {
    this.io.on('connection', (socket) => {
      logger.info(`Socket connected: ${socket.id}`);

      // Handle user authentication
      socket.on('authenticate', async (data) => {
        try {
          await this.authenticateUser(socket, data.token);
        } catch (error) {
          logger.error('Socket authentication failed:', error);
          socket.emit('auth_error', { message: 'Authentication failed' });
        }
      });

      // Handle user login
      socket.on('user_login', async (data) => {
        try {
          await this.handleUserLogin(socket, data);
        } catch (error) {
          logger.error('Socket login failed:', error);
          socket.emit('login_error', { message: 'Login failed' });
        }
      });

      // Handle user logout
      socket.on('user_logout', () => {
        this.handleUserLogout(socket);
      });

      // Handle heartbeat/ping
      socket.on('ping', () => {
        socket.emit('pong', { timestamp: Date.now() });
      });

      // Handle disconnect
      socket.on('disconnect', (reason) => {
        logger.info(`Socket disconnected: ${socket.id}, reason: ${reason}`);
        this.handleUserLogout(socket);
      });

      // Send initial connection status
      socket.emit('connected', { 
        socketId: socket.id, 
        timestamp: Date.now() 
      });
    });
  }

  async authenticateUser(socket, token) {
    if (!token) {
      throw new Error('No token provided');
    }

    try {
      // Verify JWT token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.id;

      // Get user from database
      const { User } = require('../models');
      const user = await User.findByPk(userId, {
        attributes: ['id', 'email', 'first_name', 'last_name', 'role', 'status']
      });

      if (!user) {
        throw new Error('User not found');
      }

      if (user.status !== 'active') {
        throw new Error('User account is not active');
      }

      // Store user session
      this.addUserSession(socket, user);

      // Emit successful authentication
      socket.emit('authenticated', {
        user: {
          id: user.id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          role: user.role
        },
        timestamp: Date.now()
      });

      logger.info(`User authenticated via socket: ${user.email} (${socket.id})`);
    } catch (error) {
      logger.error('Token verification failed:', error);
      throw error;
    }
  }

  async handleUserLogin(socket, userData) {
    if (!userData.user) {
      throw new Error('No user data provided');
    }

    // Store user session
    this.addUserSession(socket, userData.user);

    // Emit login success
    socket.emit('login_success', {
      user: userData.user,
      timestamp: Date.now()
    });

    logger.info(`User logged in via socket: ${userData.user.email} (${socket.id})`);
  }

  handleUserLogout(socket) {
    const userId = this.socketUsers.get(socket.id);
    
    if (userId) {
      // Remove from active users
      this.activeUsers.delete(userId);
      this.socketUsers.delete(socket.id);

      // Emit logout event
      socket.emit('logged_out', { timestamp: Date.now() });

      logger.info(`User logged out via socket: ${userId} (${socket.id})`);
    }
  }

  addUserSession(socket, user) {
    // Remove any existing session for this user
    if (this.activeUsers.has(user.id)) {
      const existingSession = this.activeUsers.get(user.id);
      this.socketUsers.delete(existingSession.socketId);
    }

    // Add new session
    this.activeUsers.set(user.id, {
      socketId: socket.id,
      user: user,
      connectedAt: Date.now()
    });
    this.socketUsers.set(socket.id, user.id);

    // Join user to their personal room for targeted messages
    socket.join(`user_${user.id}`);
  }

  isUserActive(userId) {
    return this.activeUsers.has(userId);
  }

  getActiveUser(userId) {
    return this.activeUsers.get(userId);
  }

  getActiveUsers() {
    return Array.from(this.activeUsers.values()).map(session => ({
      id: session.user.id,
      name: session.user.first_name,
      email: session.user.email,
      connectedAt: session.connectedAt
    }));
  }

  sendToUser(userId, event, data) {
    this.io.to(`user_${userId}`).emit(event, data);
  }

  broadcastToAll(event, data) {
    this.io.emit(event, data);
  }

  getConnectionCount() {
    return this.io.engine.clientsCount;
  }
}

module.exports = SocketService; 