const { sequelize } = require('../config/database');

// Import all models
const User = require('./User');
const Product = require('./Product');
const Category = require('./Category');
const Order = require('./Order');
const OrderItem = require('./OrderItem');
const Payment = require('./Payment');
const Content = require('./Content');
const BlogPost = require('./BlogPost');
const PortfolioItem = require('./PortfolioItem');
const Page = require('./Page');
const SiteSetting = require('./SiteSetting');
const Contact = require('./Contact');
const Analytics = require('./Analytics');
const Comment = require('./Comment');
const Service = require('./Service');
const Team = require('./Team');
const Review = require('./Review');
const Notification = require('./Notification');

// Define associations
const defineAssociations = () => {
  // User associations
  User.hasMany(Content, { as: 'posts', foreignKey: 'author_id' });
  User.hasMany(BlogPost, { as: 'blogPosts', foreignKey: 'author_id' });
  User.hasMany(Page, { as: 'pages', foreignKey: 'author_id' });
  User.hasMany(Comment, { as: 'comments', foreignKey: 'user_id' });
  User.hasMany(Review, { as: 'reviews', foreignKey: 'user_id' });

  // Content associations
  Content.belongsTo(User, { as: 'author', foreignKey: 'author_id' });
  Content.hasMany(Comment, { as: 'comments', foreignKey: 'post_id' });
  
  // BlogPost associations
  BlogPost.belongsTo(User, { as: 'author', foreignKey: 'author_id' });
  BlogPost.hasMany(Comment, { as: 'comments', foreignKey: 'post_id' });
  
  // PortfolioItem associations  
  PortfolioItem.hasMany(Comment, { as: 'comments', foreignKey: 'post_id' });
  
  // Page associations
  Page.belongsTo(User, { as: 'author', foreignKey: 'author_id' });

  // Comment associations
  Comment.belongsTo(Content, { as: 'post', foreignKey: 'post_id' });
  Comment.belongsTo(BlogPost, { as: 'blogPost', foreignKey: 'post_id' });
  Comment.belongsTo(PortfolioItem, { as: 'portfolioItem', foreignKey: 'post_id' });
  Comment.belongsTo(User, { as: 'author', foreignKey: 'user_id' });
  Comment.hasMany(Comment, { as: 'replies', foreignKey: 'parent_id' });
  Comment.belongsTo(Comment, { as: 'parent', foreignKey: 'parent_id' });
  
  // Review associations
  Review.belongsTo(User, { as: 'user', foreignKey: 'user_id' });
  
  // Order associations
  Order.belongsTo(User, { as: 'customer', foreignKey: 'user_id' });
  Order.hasMany(OrderItem, { as: 'items', foreignKey: 'order_id' });
  User.hasMany(Order, { as: 'orders', foreignKey: 'user_id' });
  
  // OrderItem associations
  OrderItem.belongsTo(Order, { as: 'order', foreignKey: 'order_id' });
  OrderItem.belongsTo(Product, { as: 'product', foreignKey: 'product_id' });
  Product.hasMany(OrderItem, { as: 'orderItems', foreignKey: 'product_id' });
  
  // Contact associations
  Contact.belongsTo(User, { as: 'assignedUser', foreignKey: 'assigned_to' });
  Contact.belongsTo(User, { as: 'user', foreignKey: 'user_id' });
  User.hasMany(Contact, { as: 'assignedContacts', foreignKey: 'assigned_to' });
  User.hasMany(Contact, { as: 'contacts', foreignKey: 'user_id' });
};

// Initialize models and associations
const initializeModels = () => {
  defineAssociations();
};

module.exports = {
  sequelize,
  User,
  Product,
  Category,
  Order,
  OrderItem,
  Payment,
  Content,
  BlogPost,
  PortfolioItem,
  Page,
  SiteSetting,
  Contact,
  Analytics,
  Comment,
  Service,
  Team,
  Review,
  Notification,
  initializeModels,
}; 