# Stripe Webhook Setup for Order Creation

## Problem Identified
Orders are not being created in the database because:
1. Stripe Checkout creates a session and redirects to success page
2. The webhook handler exists but only handles `payment_intent.succeeded` events
3. Stripe Checkout uses `checkout.session.completed` events
4. Webhook needs to be configured in Stripe dashboard

## What I Fixed
1. **Updated webhook handler** to handle `checkout.session.completed` events
2. **Added order creation logic** in the webhook when checkout session completes
3. **Added order items creation** for each item in the cart
4. **Added payment record creation** linked to the order

## What You Need to Do

### 1. Configure Stripe Webhook in Dashboard
1. Go to [Stripe Dashboard > Webhooks](https://dashboard.stripe.com/webhooks)
2. Click "Add endpoint"
3. Set endpoint URL to: `https://clickbit.com.au/api/payments/webhook/stripe`
4. Select events: `checkout.session.completed`
5. Save the webhook

### 2. Get Webhook Secret
1. After creating the webhook, click on it
2. Go to "Signing secret" section
3. Copy the webhook secret
4. Add it to your environment variables: `STRIPE_WEBHOOK_SECRET=whsec_...`

### 3. Test the Flow
1. Make a test purchase through Stripe Checkout
2. Check the server logs for webhook events
3. Check the admin dashboard for new orders

## Code Changes Made

### Updated Webhook Handler (`server/routes/payments.js`)
```javascript
case 'checkout.session.completed':
  const session = event.data.object;
  
  // Create order from checkout session
  const order = await Order.create({
    order_number: `ORD-${Date.now().toString().slice(-6)}`,
    guest_email: session.customer_email,
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
  
  // Create order items and payment records...
```

## Expected Result
After webhook configuration:
- ✅ Orders will be created in database when payments complete
- ✅ Orders will appear in admin dashboard
- ✅ Order items will be properly linked
- ✅ Payment records will be created
- ✅ Full order tracking and management

## Testing
1. Complete a test purchase
2. Check server logs: `pm2 logs clickbit`
3. Check admin dashboard: `/admin/orders`
4. Verify order details and payment status
