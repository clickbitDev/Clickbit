# GST Calculation Test

## What was fixed:

### **Problem**: 
- Stripe checkout was only charging the subtotal (without GST)
- Customers were being undercharged
- GST compliance issues

### **Solution**:
1. **Stripe Checkout Session**: Now includes GST as a separate line item
2. **Payment Intent**: Now uses total amount including GST
3. **Metadata**: Added subtotal, GST, and total amounts for reporting

## Test Cases:

### Example 1: Single Item
- **Item**: Website Development - $1,500.00
- **Quantity**: 1
- **Subtotal**: $1,500.00
- **GST (10%)**: $150.00
- **Total**: $1,650.00

**Stripe Checkout should show**:
- Website Development: $1,500.00
- GST (10%): $150.00
- **Total Charge**: $1,650.00

### Example 2: Multiple Items
- **Item 1**: Logo Design - $500.00 (qty: 1)
- **Item 2**: Business Cards - $200.00 (qty: 1)
- **Subtotal**: $700.00
- **GST (10%)**: $70.00
- **Total**: $770.00

**Stripe Checkout should show**:
- Logo Design: $500.00
- Business Cards: $200.00
- GST (10%): $70.00
- **Total Charge**: $770.00

## How to Test:

1. **Add items to cart**
2. **Go to checkout** - verify GST is shown in order summary
3. **Click "Pay with Stripe"** - verify Stripe checkout shows:
   - Individual items at their base prices
   - GST as a separate line item
   - Correct total amount
4. **Complete payment** - verify the charged amount matches the total

## Backend Changes Made:

### Stripe Checkout Session:
```javascript
// Calculate GST and totals
const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
const gstRate = 0.10; // 10% GST for Australia
const gst = subtotal * gstRate;
const total = subtotal + gst;

// Add GST as separate line item
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
```

### Payment Intent:
```javascript
// Use total including GST
amount: Math.round(total * 100), // Use total including GST
```

### Metadata Added:
```javascript
metadata: {
  items: JSON.stringify(items),
  customerEmail: customerInfo.email,
  customerName: customerInfo.name,
  subtotal: subtotal.toString(),
  gst: gst.toString(),
  total: total.toString()
}
```

## Expected Results:

✅ **Before**: Customer charged $1,500 for $1,650 total (undercharged $150)  
✅ **After**: Customer charged $1,650 for $1,650 total (correct amount)

✅ **Stripe Receipt**: Shows itemized breakdown with GST  
✅ **Compliance**: All amounts match your accounting records  
✅ **Reporting**: Metadata includes subtotal, GST, and total for easy reconciliation

The GST calculation is now properly integrated into both Stripe Checkout and Payment Intents!
