/**
 * Database Seed Script for E-Commerce CRM Backend
 * Populates realistic Orders, Payments, Returns, Refunds, and Audit Logs
 * 
 * Usage:
 *   node src/scripts/seed.js
 *   npm run seed
 */

const mongoose = require('mongoose');
const env = require('../config/env');
const { connectDB, disconnectDB } = require('../config/db');

// Import Mongoose Models
const Order = require('../modules/orders/order.model');
const Payment = require('../modules/payments/payment.model');
const Return = require('../modules/returns/return.model');
const Refund = require('../modules/payments/refund.model');
const AuditLog = require('../modules/audit/auditLog.model');

const demoCustomers = {
  aarav: {
    customerId: 'cust_101',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@example.com',
    phone: '+919876543210'
  },
  priya: {
    customerId: 'cust_102',
    name: 'Priya Patel',
    email: 'priya.patel@example.com',
    phone: '+919876543211'
  },
  rahul: {
    customerId: 'cust_103',
    name: 'Rahul Verma',
    email: 'rahul.verma@example.com',
    phone: '+919876543212'
  },
  sneha: {
    customerId: 'cust_104',
    name: 'Sneha Rao',
    email: 'sneha.rao@example.com',
    phone: '+919876543213'
  }
};

const demoAddress = {
  street: 'Flat 402, Green Glen Layout, Bellandur',
  city: 'Bengaluru',
  state: 'Karnataka',
  postalCode: '560103',
  country: 'India'
};

async function seed() {
  console.log('--- Starting CRM Database Seed ---');
  await connectDB();

  console.log('Purging existing CRM test records...');
  await Promise.all([
    Order.deleteMany({ orderNumber: { $regex: /^ORD-DEMO/ } }),
    Payment.deleteMany({ transactionId: { $regex: /^pay_demo/ } }),
    Return.deleteMany({ returnNumber: { $regex: /^RET-DEMO/ } }),
    Refund.deleteMany({ refundNumber: { $regex: /^REF-DEMO/ } }),
    AuditLog.deleteMany({ orderNumber: { $regex: /^ORD-DEMO/ } })
  ]);

  const now = new Date();
  const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
  const fiveDaysAgo = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000);

  // 1. Seed Order 1: DELIVERED (Eligible for return)
  const order1 = await Order.create({
    orderNumber: 'ORD-DEMO-001',
    customer: demoCustomers.aarav,
    items: [
      {
        product: new mongoose.Types.ObjectId(),
        sku: 'SKU-TSHIRT-BLK-M',
        name: 'Classic Cotton T-Shirt (Black, M)',
        qty: 2,
        unitPrice: 79900, // ₹799.00
        discount: 0,
        tax: 28764,       // 18% GST
        subtotal: 159800
      }
    ],
    pricing: {
      subtotal: 159800,
      discountTotal: 0,
      taxTotal: 28764,
      shippingFee: 0,
      total: 188564 // ₹1,885.64 in paise
    },
    currency: 'INR',
    status: 'DELIVERED',
    paymentStatus: 'PAID',
    paymentMethod: 'RAZORPAY',
    shippingAddress: demoAddress,
    billingAddress: demoAddress,
    statusHistory: [
      { status: 'PLACED', changedAt: fiveDaysAgo, changedBy: 'cust_101', note: 'Customer checkout' },
      { status: 'CONFIRMED', changedAt: new Date(fiveDaysAgo.getTime() + 10000), changedBy: 'system', note: 'Payment verified' },
      { status: 'PROCESSING', changedAt: new Date(fiveDaysAgo.getTime() + 3600000), changedBy: 'admin', note: 'Order sent to fulfillment' },
      { status: 'PACKED', changedAt: new Date(fiveDaysAgo.getTime() + 7200000), changedBy: 'warehouse_01', note: 'Packed with invoice' },
      { status: 'SHIPPED', changedAt: new Date(fiveDaysAgo.getTime() + 14400000), changedBy: 'warehouse_01', note: 'Handed to Bluedart' },
      { status: 'OUT_FOR_DELIVERY', changedAt: new Date(twoDaysAgo.getTime() - 7200000), changedBy: 'courier_stub', note: 'Out for delivery' },
      { status: 'DELIVERED', changedAt: twoDaysAgo, changedBy: 'courier_stub', note: 'Delivered to recipient with OTP' }
    ],
    tracking: {
      courier: 'Bluedart Express',
      trackingNumber: 'BD-789012345',
      trackingUrl: 'https://bluedart.example.com/track/BD-789012345',
      estimatedDelivery: twoDaysAgo
    },
    createdAt: fiveDaysAgo
  });

  // Payment for Order 1
  const payment1 = await Payment.create({
    orderId: order1._id,
    orderNumber: order1.orderNumber,
    customerId: demoCustomers.aarav.customerId,
    amount: 188564,
    currency: 'INR',
    method: 'RAZORPAY',
    status: 'PAID',
    transactionId: 'pay_demo_001_aarav',
    razorpayOrderId: 'order_rzp_demo_001',
    razorpayPaymentId: 'pay_rzp_demo_001',
    razorpaySignature: 'sig_valid_mock_signature_001',
    fee: 3771,
    tax: 678,
    metadata: { cardLast4: '4242', bank: 'HDFC', method: 'card' },
    createdAt: fiveDaysAgo
  });

  // 2. Seed Order 2: PROCESSING (Paid via Razorpay)
  const order2 = await Order.create({
    orderNumber: 'ORD-DEMO-002',
    customer: demoCustomers.priya,
    items: [
      {
        product: new mongoose.Types.ObjectId(),
        sku: 'SKU-HOODIE-GRY-L',
        name: 'Fleece Pullover Hoodie (Grey, L)',
        qty: 1,
        unitPrice: 199900,
        discount: 20000,
        tax: 32382,
        subtotal: 179900
      }
    ],
    pricing: {
      subtotal: 179900,
      discountTotal: 20000,
      taxTotal: 32382,
      shippingFee: 0,
      total: 212282
    },
    currency: 'INR',
    status: 'PROCESSING',
    paymentStatus: 'PAID',
    paymentMethod: 'RAZORPAY',
    shippingAddress: demoAddress,
    billingAddress: demoAddress,
    statusHistory: [
      { status: 'PLACED', changedAt: twoDaysAgo, changedBy: 'cust_102' },
      { status: 'CONFIRMED', changedAt: twoDaysAgo, changedBy: 'system' },
      { status: 'PROCESSING', changedAt: now, changedBy: 'admin', note: 'Allocating inventory' }
    ],
    createdAt: twoDaysAgo
  });

  const payment2 = await Payment.create({
    orderId: order2._id,
    orderNumber: order2.orderNumber,
    customerId: demoCustomers.priya.customerId,
    amount: 212282,
    currency: 'INR',
    method: 'RAZORPAY',
    status: 'PAID',
    transactionId: 'pay_demo_002_priya',
    razorpayOrderId: 'order_rzp_demo_002',
    razorpayPaymentId: 'pay_rzp_demo_002',
    razorpaySignature: 'sig_valid_mock_signature_002',
    createdAt: twoDaysAgo
  });

  // 3. Seed Order 3: PLACED (Pending payment)
  const order3 = await Order.create({
    orderNumber: 'ORD-DEMO-003',
    customer: demoCustomers.rahul,
    items: [
      {
        product: new mongoose.Types.ObjectId(),
        sku: 'SKU-MUG-CERAMIC',
        name: 'Artisan Ceramic Coffee Mug',
        qty: 2,
        unitPrice: 44900,
        discount: 5000,
        tax: 15264,
        subtotal: 84800
      }
    ],
    pricing: {
      subtotal: 84800,
      discountTotal: 5000,
      taxTotal: 15264,
      shippingFee: 5000,
      total: 105064
    },
    currency: 'INR',
    status: 'PLACED',
    paymentStatus: 'PENDING',
    paymentMethod: 'RAZORPAY',
    shippingAddress: demoAddress,
    billingAddress: demoAddress,
    statusHistory: [
      { status: 'PLACED', changedAt: now, changedBy: 'cust_103' }
    ],
    createdAt: now
  });

  // 4. Seed Order 4: CANCELLED (Pre-shipped cancellation with stock release)
  const order4 = await Order.create({
    orderNumber: 'ORD-DEMO-004',
    customer: demoCustomers.sneha,
    items: [
      {
        product: new mongoose.Types.ObjectId(),
        sku: 'SKU-CAP-NAVY',
        name: 'Embroidered Baseball Cap',
        qty: 1,
        unitPrice: 39900,
        discount: 0,
        tax: 7182,
        subtotal: 39900
      }
    ],
    pricing: {
      subtotal: 39900,
      discountTotal: 0,
      taxTotal: 7182,
      shippingFee: 5000,
      total: 52082
    },
    currency: 'INR',
    status: 'CANCELLED',
    paymentStatus: 'REFUNDED',
    paymentMethod: 'RAZORPAY',
    shippingAddress: demoAddress,
    billingAddress: demoAddress,
    cancellationReason: 'Customer requested cancellation before shipment',
    cancelledAt: now,
    statusHistory: [
      { status: 'PLACED', changedAt: twoDaysAgo, changedBy: 'cust_104' },
      { status: 'CONFIRMED', changedAt: twoDaysAgo, changedBy: 'system' },
      { status: 'CANCELLED', changedAt: now, changedBy: 'cust_104', note: 'Customer ordered wrong color' }
    ],
    createdAt: twoDaysAgo
  });

  // 5. Seed Return for Order 1: INSPECTED and ready for refund
  const returnRecord = await Return.create({
    returnNumber: 'RET-DEMO-001',
    orderId: order1._id,
    orderNumber: order1.orderNumber,
    customerId: demoCustomers.aarav.customerId,
    items: [
      {
        orderItemId: order1.items[0]._id,
        sku: order1.items[0].sku,
        name: order1.items[0].name,
        qty: 1,
        unitPrice: 79900,
        subtotal: 79900,
        reason: 'SIZE_TOO_LARGE',
        condition: 'UNOPENED'
      }
    ],
    reasonCategory: 'SIZE_FIT_ISSUE',
    reasonDetails: 'Ordered Medium, customer needed Small. Original tags attached.',
    evidenceUrls: [
      'https://res.cloudinary.com/crm-demo/image/upload/v1/evidence/shirt_front.jpg',
      'https://res.cloudinary.com/crm-demo/image/upload/v1/evidence/shirt_tags.jpg'
    ],
    status: 'INSPECTED',
    pickupAddress: demoAddress,
    refundAmount: 79900,
    statusHistory: [
      { status: 'REQUESTED', changedAt: twoDaysAgo, changedBy: 'cust_101', note: 'Customer created return' },
      { status: 'APPROVED', changedAt: new Date(twoDaysAgo.getTime() + 3600000), changedBy: 'agent_support_01', note: 'Valid return within 7-day window' },
      { status: 'PICKUP_SCHEDULED', changedAt: new Date(twoDaysAgo.getTime() + 7200000), changedBy: 'agent_support_01', note: 'Courier scheduled for tomorrow' },
      { status: 'RECEIVED', changedAt: new Date(now.getTime() - 14400000), changedBy: 'warehouse_01', note: 'Package received at warehouse' },
      { status: 'INSPECTED', changedAt: now, changedBy: 'qa_inspector', note: 'Tags verified intact. Approved for refund.' }
    ],
    createdAt: twoDaysAgo
  });

  // 6. Seed Refund for Return 1
  const refundRecord = await Refund.create({
    refundNumber: 'REF-DEMO-001',
    orderId: order1._id,
    orderNumber: order1.orderNumber,
    paymentId: payment1._id,
    returnId: returnRecord._id,
    customerId: demoCustomers.aarav.customerId,
    amount: 79900, // ₹799.00 in paise
    currency: 'INR',
    reason: 'SIZE_TOO_LARGE',
    status: 'PROCESSED',
    type: 'RETURN',
    speed: 'normal',
    razorpayPaymentId: payment1.razorpayPaymentId,
    razorpayRefundId: 'rfnd_demo_001_rzp',
    processedAt: now,
    createdAt: now
  });

  // 7. Seed Audit Logs
  await AuditLog.create([
    {
      orderId: order1._id,
      orderNumber: order1.orderNumber,
      action: 'ORDER_CREATED',
      actor: { id: 'cust_101', name: 'Aarav Sharma', role: 'customer' },
      details: { totalPaise: order1.pricing.total, paymentMethod: 'RAZORPAY' },
      createdAt: fiveDaysAgo
    },
    {
      orderId: order1._id,
      orderNumber: order1.orderNumber,
      action: 'PAYMENT_VERIFIED',
      actor: { id: 'system', name: 'Razorpay Webhook', role: 'system' },
      details: { transactionId: payment1.transactionId, amount: payment1.amount },
      createdAt: fiveDaysAgo
    },
    {
      orderId: order1._id,
      orderNumber: order1.orderNumber,
      action: 'RETURN_INSPECTED',
      actor: { id: 'usr_qa_01', name: 'Warehouse QA', role: 'support_agent' },
      details: { returnId: returnRecord._id, returnNumber: returnRecord.returnNumber, outcome: 'PASSED' },
      createdAt: now
    },
    {
      orderId: order1._id,
      orderNumber: order1.orderNumber,
      action: 'REFUND_PROCESSED',
      actor: { id: 'usr_fin_01', name: 'Finance Agent', role: 'admin' },
      details: { refundId: refundRecord._id, amountPaise: refundRecord.amount, gatewayRefundId: refundRecord.razorpayRefundId },
      createdAt: now
    }
  ]);

  console.log('✅ Demo records successfully seeded:');
  console.log(`  - 4 Orders (DELIVERED, PROCESSING, PLACED, CANCELLED)`);
  console.log(`  - 2 Razorpay Payments (PAID with transaction IDs)`);
  console.log(`  - 1 Return Request (INSPECTED, tags verified)`);
  console.log(`  - 1 Gateway Refund (PROCESSED with speed normal)`);
  console.log(`  - 4 Audit Log timeline entries`);

  await disconnectDB();
  console.log('--- Seed Completed ---');
}

if (require.main === module) {
  seed()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Seed Error:', err);
      process.exit(1);
    });
}

module.exports = seed;
