const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const config = require('../config/config');
const logger = require('../utils/logger');

const stripe = config.stripe.secretKey ? new Stripe(config.stripe.secretKey) : null;

// POST /api/stripe/create-checkout-session - Create Stripe checkout session
router.post('/create-checkout-session', async (req, res) => {
  try {
    if (!stripe) {
      return res.status(503).json({ error: 'Payment service not configured' });
    }

    const { priceId } = req.body;

    if (!priceId) {
      return res.status(400).json({ error: 'Price ID is required' });
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${config.frontendUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${config.frontendUrl}/pricing`,
    });

    logger.info(`Checkout session created: ${session.id}`);

    res.json({ sessionId: session.id, url: session.url });

  } catch (error) {
    logger.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

// POST /api/stripe/webhook - Handle Stripe webhooks
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    if (!stripe || !config.stripe.webhookSecret) {
      return res.status(503).json({ error: 'Webhook service not configured' });
    }

    const sig = req.headers['stripe-signature'];
    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, config.stripe.webhookSecret);
    } catch (err) {
      logger.error('Webhook signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        logger.info(`Checkout completed: ${session.id}`);
        // TODO: Update user subscription status in database
        break;

      case 'customer.subscription.created':
        const subscription = event.data.object;
        logger.info(`Subscription created: ${subscription.id}`);
        // TODO: Activate premium features for user
        break;

      case 'customer.subscription.deleted':
        const canceledSubscription = event.data.object;
        logger.info(`Subscription canceled: ${canceledSubscription.id}`);
        // TODO: Deactivate premium features for user
        break;

      default:
        logger.info(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });

  } catch (error) {
    logger.error('Error handling webhook:', error);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
});

// GET /api/stripe/config - Get public Stripe configuration
router.get('/config', (req, res) => {
  if (!stripe) {
    return res.status(503).json({ error: 'Payment service not configured' });
  }

  // Return public key and price IDs (these would typically be in env vars)
  res.json({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || '',
    prices: {
      monthly: process.env.STRIPE_MONTHLY_PRICE_ID || '',
    },
  });
});

module.exports = router;
