const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/database'); // This is the correct, single import
const { roles } = require('../config/roles');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      len: [6, 255]
    }
  },
  first_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      len: [1, 100]
    }
  },
  last_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      len: [1, 100]
    }
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: true,
    validate: {
      is: /^[\+]?[\d\s\-\(\)]{7,15}$/
    },
    set(value) {
      if (value) {
        this.setDataValue('phone', value.replace(/[\s\-\(\)]/g, ''));
      } else {
        this.setDataValue('phone', value);
      }
    }
  },
  role: {
    type: DataTypes.ENUM('admin', 'manager', 'customer'),
    defaultValue: 'customer',
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'suspended'),
    defaultValue: 'active',
    allowNull: false
  },
  email_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  email_verification_token: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  password_reset_token: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  password_reset_expires: {
    type: DataTypes.DATE,
    allowNull: true
  },
  last_login: {
    type: DataTypes.DATE,
    allowNull: true
  },
  login_attempts: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  locked_until: {
    type: DataTypes.DATE,
    allowNull: true
  },
  avatar: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  preferences: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {}
  },
  stripe_customer_id: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  address: {
    type: DataTypes.JSON,
    allowNull: true
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        user.password = await bcrypt.hash(user.password, 12);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        user.password = await bcrypt.hash(user.password, 12);
      }
    }
  }
});

// Instance methods
User.prototype.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

User.prototype.getFullName = function() {
  return `${this.first_name} ${this.last_name}`;
};

User.prototype.isAdmin = function() {
  return this.role === 'admin';
};

User.prototype.isManager = function() {
  return this.role === 'manager' || this.role === 'admin';
};

User.prototype.isActive = function() {
  return this.status === 'active';
};

User.prototype.isLocked = function() {
  return this.locked_until && this.locked_until > new Date();
};

User.prototype.incrementLoginAttempts = async function() {
  this.login_attempts += 1;

  // Lock account after 5 failed attempts for 15 minutes
  if (this.login_attempts >= 5) {
    this.locked_until = new Date(Date.now() + 15 * 60 * 1000);
  }

  await this.save();
};

User.prototype.resetLoginAttempts = async function() {
  this.login_attempts = 0;
  this.locked_until = null;
  this.last_login = new Date();
  await this.save();
};

// Class methods
User.findByEmail = function(email) {
  // Store email exactly as provided (case-sensitive)
  return this.findOne({ where: { email: email.trim() } });
};

User.createUser = async function(userData) {
  const user = await this.create(userData);
  return user;
};

User.updateUser = async function(id, updateData) {
  const user = await this.findByPk(id);
  if (!user) {
    throw new Error('User not found');
  }

  await user.update(updateData);
  return user;
};

User.deleteUser = async function(id) {
  const user = await this.findByPk(id);
  if (!user) {
    throw new Error('User not found');
  }

  await user.destroy();
  return true;
};

// Scopes
User.addScope('active', {
  where: { status: 'active' }
});

User.addScope('admins', {
  where: { role: 'admin' }
});

User.addScope('managers', {
  where: { role: ['admin', 'manager'] }
});

User.addScope('customers', {
  where: { role: 'customer' }
});

User.addScope('verified', {
  where: { email_verified: true }
});

// Virtual fields
User.prototype.toJSON = function() {
  const values = Object.assign({}, this.get());
  
  // Add permissions to user object
  values.permissions = roles[this.role]?.permissions || [];

  delete values.password;
  delete values.email_verification_token;
  delete values.password_reset_token;
  delete values.password_reset_expires;
  return values;
};

module.exports = User;
