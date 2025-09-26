const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const paypal = require('@paypal/paypal-server-sdk');
const { Order, Payment, SiteSetting, OrderItem } = require('../models');
const { protect, authorize } = require('../middleware/auth');

let stripe;
let paypalClient;

async function initializePaymentProviders() {
  try {
    console.log('🔄 Initializing payment providers...');
    const billingSettings = await SiteSetting.findOne({
      where: { setting_key: 'billing_settings' }
    });
    
    if (billingSettings && billingSettings.setting_value) {
      const settings = JSON.parse(billingSettings.setting_value);
      
      if (settings.stripeSecretKey) {
        stripe = new Stripe(settings.stripeSecretKey);
        console.log('✅ Stripe initialized');
      } else {
        console.log('⚠️  Stripe secret key not found');
      }
      
      if (settings.paypalClientId && settings.paypalClientSecret) {
        // PayPal initialization temporarily disabled due to SDK compatibility issues
        console.log('⚠️  PayPal initialization temporarily disabled');
      } else {
        console.log('⚠️  PayPal credentials not found');
      }
    } else {
      console.log('⚠️  No billing settings found');
    }
  } catch (error) {
    console.error('❌ Failed to initialize payment providers:', error);
  }
}

// Initialize payment providers immediately
initializePaymentProviders();

// Also re-initialize when settings might have changed
async function refreshPaymentProviders() {
  await initializePaymentProviders();
}

router.post('/create-payment-intent', async (req, res) => {
  try {
    if (!stripe) {
      return res.status(400).json({ message: 'Stripe is not configured' });
    }

    const { amount, currency, items, customerInfo } = req.body;

    if (!amount || !currency || !items || !customerInfo) {
      return res.status(400).json({ message: 'Missing required payment information' });
    }

    // Calculate GST and totals for payment intent
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const gstRate = 0.10; // 10% GST for Australia
    const gst = subtotal * gstRate;
    const total = subtotal + gst;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(total * 100), // Use total including GST
      currency: currency.toLowerCase(),
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        items: JSON.stringify(items),
        customerEmail: customerInfo.email,
        customerName: customerInfo.name,
        subtotal: subtotal.toString(),
        gst: gst.toString(),
        total: total.toString()
      }
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (error) {
    console.error('Create payment intent error:', error);
    res.status(500).json({ message: 'Failed to create payment intent' });
  }
});

// New Stripe Checkout endpoint
router.post('/create-checkout-session', async (req, res) => {
  try {
    if (!stripe) {
      return res.status(400).json({ message: 'Stripe is not configured' });
    }

    const { amount, currency, items, customerInfo } = req.body;

    if (!amount || !currency || !items || !customerInfo) {
      return res.status(400).json({ message: 'Missing required payment information' });
    }

    // Calculate GST and totals
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const gstRate = 0.10; // 10% GST for Australia
    const gst = subtotal * gstRate;
    const total = subtotal + gst;

    // Convert items to Stripe line items format with GST included
    const lineItems = items.map(item => ({
      price_data: {
        currency: currency.toLowerCase(),
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(item.price * 100), // Convert to cents
      },
      quantity: item.quantity,
    }));

    // Add GST as a separate line item
    lineItems.push({
      price_data: {
        currency: currency.toLowerCase(),
        product_data: {
          name: `GST (${(gstRate * 100).toFixed(0)}%)`,
        },
        unit_amount: Math.round(gst * 100), // Convert to cents
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: lineItems,
      customer_email: customerInfo.email,
      success_url: `${req.protocol}://${req.get('host')}/order-confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.protocol}://${req.get('host')}/checkout-cancelled`,
      metadata: {
        items: JSON.stringify(items),
        customerEmail: customerInfo.email,
        customerName: customerInfo.name,
        subtotal: subtotal.toString(),
        gst: gst.toString(),
        total: total.toString()
      }
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Create checkout session error:', error);
    res.status(500).json({ message: 'Failed to create checkout session' });
  }
});

router.post('/create-paypal-order', async (req, res) => {
  try {
    console.log('PayPal order creation requested');
    
    // For now, let's just return a mock order ID to test the frontend flow
    // TODO: Implement proper PayPal server-side integration
    const mockOrderId = 'MOCK_ORDER_' + Date.now();
    
    console.log('Returning mock PayPal order ID:', mockOrderId);
    
    res.json({
      orderID: mockOrderId
    });
  } catch (error) {
    console.error('Create PayPal order error:', error);
    res.status(500).json({ message: 'Failed to create PayPal order' });
  }
});

router.post('/confirm-payment', async (req, res) => {
  try {
    const { paymentIntentId, paypalOrderId, items, customerInfo, paymentMethod, paypalDetails } = req.body;

    let paymentData = {};
    let transactionId = '';
    let gatewayResponse = {};

    if (paymentMethod === 'stripe' && paymentIntentId) {
      if (!stripe) {
        return res.status(400).json({ message: 'Stripe is not configured' });
      }
      
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      
      if (paymentIntent.status !== 'succeeded') {
        return res.status(400).json({ message: 'Payment not completed' });
      }
      
      transactionId = paymentIntent.id;
      gatewayResponse = paymentIntent;
      paymentData = {
        amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency.toUpperCase(),
        status: 'completed'
      };
    } else if (paymentMethod === 'paypal' && paypalOrderId) {
      console.log('Processing PayPal payment confirmation for order:', paypalOrderId);
      
      transactionId = paypalOrderId;
      gatewayResponse = paypalDetails || {};
      
      // For mock orders, calculate from items
      const itemsTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const gstAmount = itemsTotal * 0.1;
      const totalAmount = itemsTotal + gstAmount;
      
      paymentData = {
        amount: totalAmount,
        currency: 'AUD',
        status: 'completed'
      };
    } else {
      return res.status(400).json({ message: 'Invalid payment method or missing transaction ID' });
    }

    const itemsTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const gstRate = 0.1;
    const gstAmount = itemsTotal * gstRate;
    const totalAmount = itemsTotal + gstAmount;

    // Generate order number
    const orderNumber = `ORD-${Date.now().toString().slice(-6)}`;
    const addressObj = {
      name: customerInfo.name,
      email: customerInfo.email,
      address: customerInfo.address || '',
      city: customerInfo.city || '',
      state: customerInfo.state || '',
      postcode: customerInfo.postcode || '',
      country: customerInfo.country || 'Australia'
    };

    const order = await Order.create({
      order_number: orderNumber,
      guest_email: customerInfo.email,
      subtotal: itemsTotal,
      tax_amount: gstAmount,
      total_amount: totalAmount,
      currency: paymentData.currency,
      payment_status: 'paid',
      payment_method: paymentMethod,
      payment_transaction_id: transactionId,
      status: 'confirmed',
      billing_address: addressObj,
      shipping_address: addressObj,
      items_count: items.length,
      ip_address: req.ip,
      user_agent: req.get('User-Agent') || ''
    });

    // Create order items with product IDs
    let orderItems = [];
    try {
      orderItems = await Promise.all(items.map(item => 
        OrderItem.create({
          order_id: order.id,
          product_id: item.productId || null, // Use product ID from cart item
          product_name: item.name,
          quantity: item.quantity,
          unit_price: item.price,
          total_price: item.price * item.quantity,
          tax_amount: (item.price * item.quantity) * 0.1, // 10% GST
          status: 'confirmed'
        })
      ));
    } catch (orderItemError) {
      console.warn('Could not create order items:', orderItemError.message);
      // Continue without order items - the order is still valid
    }

    const payment = await Payment.create({
      order_id: order.id,
      amount: paymentData.amount,
      currency: paymentData.currency,
      payment_provider: paymentMethod,
      payment_method: paymentMethod === 'stripe' ? 'card' : 'paypal',
      transaction_id: transactionId,
      status: 'completed',
      gateway_response: JSON.stringify(gatewayResponse),
      ip_address: req.ip,
      user_agent: req.get('User-Agent') || ''
    });

    res.json({
      success: true,
      order: {
        id: order.id,
        orderNumber: `ORD-${order.id.toString().padStart(6, '0')}`,
        total: totalAmount,
        currency: paymentData.currency,
        items,
        customerInfo
      },
      payment: {
        id: payment.id,
        transactionId,
        method: paymentMethod
      }
    });
  } catch (error) {
    console.error('Confirm payment error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    res.status(500).json({ 
      message: 'Failed to process payment confirmation',
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Get order by Stripe session ID (for checkout success page)
router.get('/order/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    if (!stripe) {
      return res.status(400).json({ message: 'Stripe is not configured' });
    }

    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    if (!session || session.payment_status !== 'paid') {
      return res.status(404).json({ message: 'Payment session not found or not completed' });
    }

    // Find the order by Stripe session ID in metadata or by customer email
    const order = await Order.findOne({
      where: {
        customer_email: session.customer_email
      },
      include: [{
        model: Payment,
        as: 'payments',
        where: {
          transaction_id: sessionId
        },
        required: false
      }],
      order: [['created_at', 'DESC']] // Get the most recent order
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found for this session' });
    }

    // Format the response to match what the frontend expects
    const response = {
      order: {
        id: order.id,
        orderNumber: order.order_number,
        total: parseFloat(order.total),
        currency: order.currency,
        status: order.status,
        items: order.items || [],
        customer_email: order.customer_email,
        created_at: order.created_at
      },
      payment: {
        id: order.payments?.[0]?.id || null,
        method: order.payments?.[0]?.payment_method || 'stripe',
        transactionId: sessionId,
        status: 'completed'
      }
    };

    res.json(response);
  } catch (error) {
    console.error('Get order by session error:', error);
    res.status(500).json({ message: 'Failed to retrieve order' });
  }
});

router.get('/order/:orderId', protect, async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const order = await Order.findByPk(orderId, {
      include: [{
        model: Payment,
        as: 'payments'
      }]
    });
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    if (req.user.role !== 'admin' && order.customer_email !== req.user.email) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    res.json(order);
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ message: 'Failed to retrieve order' });
  }
});

router.post('/webhook/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    if (!stripe) {
      return res.status(400).send('Stripe not configured');
    }
    
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
    
    let event;
    
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        console.log('Checkout session completed:', session.id);
        
        // Create order from checkout session
        try {
          const items = JSON.parse(session.metadata.items || '[]');
          const customerInfo = {
            email: session.customer_email,
            name: session.metadata.customerName
          };
          
          const subtotal = parseFloat(session.metadata.subtotal || '0');
          const gst = parseFloat(session.metadata.gst || '0');
          const total = parseFloat(session.metadata.total || '0');
          
          // Create order
          const order = await Order.create({
            order_number: `ORD-${Date.now().toString().slice(-6)}`,
            guest_email: customerInfo.email,
            status: 'confirmed',
            subtotal: subtotal,
            tax_amount: gst,
            total_amount: total,
            currency: session.currency.toUpperCase(),
            payment_status: 'paid',
            payment_method: 'card',
            payment_transaction_id: session.id,
            items: items,
            billing_address: {
              email: customerInfo.email,
              name: customerInfo.name
            },
            notes: 'Order created from Stripe Checkout'
          });
          
          // Create order items
          try {
            await Promise.all(items.map(item => 
              OrderItem.create({
                order_id: order.id,
                product_name: item.name,
                quantity: item.quantity,
                unit_price: item.price,
                total_price: item.price * item.quantity,
                tax_amount: (item.price * item.quantity) * 0.1, // 10% GST
                status: 'confirmed'
              })
            ));
          } catch (orderItemError) {
            console.warn('Could not create order items:', orderItemError.message);
          }
          
          // Create payment record
          await Payment.create({
            order_id: order.id,
            amount: total,
            currency: session.currency.toUpperCase(),
            payment_provider: 'stripe',
            payment_method: 'card',
            transaction_id: session.id,
            status: 'completed',
            gateway_response: JSON.stringify(session),
            ip_address: session.customer_details?.ip_address || '',
            user_agent: session.customer_details?.user_agent || ''
          });
          
          console.log('Order created successfully:', order.id);
        } catch (orderError) {
          console.error('Failed to create order from checkout session:', orderError);
        }
        break;
        
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        console.log('PaymentIntent succeeded:', paymentIntent.id);
        break;
        
      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object;
        console.log('PaymentIntent failed:', failedPayment.id);
        
        await Payment.update(
          { status: 'failed' },
          { where: { transaction_id: failedPayment.id } }
        );
        break;
        
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
    
    res.json({ received: true });
  } catch (error) {
    console.error('Stripe webhook error:', error);
    res.status(500).json({ message: 'Webhook processing failed' });
  }
});

router.post('/webhook/paypal', async (req, res) => {
  try {
    console.log('PayPal webhook received:', req.body);
    res.json({ received: true });
  } catch (error) {
    console.error('PayPal webhook error:', error);
    res.status(500).json({ message: 'Webhook processing failed' });
  }
});

// Test endpoint to manually create an order (for testing purposes)
router.post('/test/create-order', async (req, res) => {
  try {
    const { items, customerInfo } = req.body;
    
    if (!items || !customerInfo) {
      return res.status(400).json({ message: 'Missing items or customerInfo' });
    }
    
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const gst = subtotal * 0.10;
    const total = subtotal + gst;
    
    // Create order
    const order = await Order.create({
      order_number: `ORD-${Date.now().toString().slice(-6)}`,
      guest_email: customerInfo.email,
      status: 'confirmed',
      subtotal: subtotal,
      tax_amount: gst,
      total_amount: total,
      currency: 'AUD',
      payment_status: 'paid',
      payment_method: 'card',
      payment_transaction_id: `test_${Date.now()}`,
      items: items,
      billing_address: {
        email: customerInfo.email,
        name: customerInfo.name
      },
      notes: 'Test order created manually'
    });
    
    // Create order items
    await Promise.all(items.map(item => 
      OrderItem.create({
        order_id: order.id,
        product_name: item.name,
        quantity: item.quantity,
        unit_price: item.price,
        total_price: item.price * item.quantity,
        tax_amount: (item.price * item.quantity) * 0.1,
        status: 'confirmed'
      })
    ));
    
    // Create payment record
    await Payment.create({
      order_id: order.id,
      amount: total,
      currency: 'AUD',
      payment_provider: 'stripe',
      payment_method: 'card',
      transaction_id: `test_${Date.now()}`,
      status: 'completed',
      gateway_response: JSON.stringify({ test: true }),
      ip_address: req.ip,
      user_agent: req.get('User-Agent') || ''
    });
    
    res.json({
      success: true,
      order: {
        id: order.id,
        order_number: order.order_number,
        total: total,
        status: order.status
      }
    });
  } catch (error) {
    console.error('Test order creation error:', error);
    res.status(500).json({ message: 'Failed to create test order' });
  }
});

module.exports = {
  router,
  refreshPaymentProviders
};