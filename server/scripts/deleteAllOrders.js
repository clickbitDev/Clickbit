/**
 * Script to delete all orders from the database
 * Usage: node server/scripts/deleteAllOrders.js
 */

const { sequelize, Order, OrderItem } = require('../models');

async function deleteAllOrders() {
  try {
    // Connect to database
    await sequelize.authenticate();
    console.log('✅ Database connection established');

    // Get count before deletion
    const orderCount = await Order.count();
    const orderItemCount = await OrderItem.count();
    
    console.log(`\n📊 Current database state:`);
    console.log(`   - Orders: ${orderCount}`);
    console.log(`   - Order Items: ${orderItemCount}`);

    if (orderCount === 0) {
      console.log('\n✅ No orders to delete. Database is already clean.');
      process.exit(0);
    }

    // Confirm deletion
    console.log(`\n⚠️  WARNING: This will delete ALL ${orderCount} order(s) and ${orderItemCount} order item(s) from the database!`);
    console.log('   This action cannot be undone.\n');

    // Start transaction
    const transaction = await sequelize.transaction();

    try {
      // Delete all order items first
      console.log('🗑️  Deleting order items...');
      const deletedItems = await OrderItem.destroy({
        where: {},
        truncate: true,
        transaction
      });
      console.log(`   ✅ Deleted ${orderItemCount} order item(s)`);

      // Delete all orders
      console.log('🗑️  Deleting orders...');
      const deletedOrders = await Order.destroy({
        where: {},
        truncate: true,
        transaction
      });
      console.log(`   ✅ Deleted ${orderCount} order(s)`);

      // Commit transaction
      await transaction.commit();

      console.log('\n✅ Successfully deleted all orders and order items!');
      console.log(`   - Orders deleted: ${orderCount}`);
      console.log(`   - Order items deleted: ${orderItemCount}`);
    } catch (error) {
      // Rollback transaction on error
      await transaction.rollback();
      throw error;
    }

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error deleting orders:', error);
    process.exit(1);
  }
}

// Run the script
deleteAllOrders();

