const express = require('express');
const bodyParser = require('body-parser');
const stripe = require('stripe')('sk_test_xxx'); // Replace with your test secret key

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.post('/create-payment-intent', async (req, res) => {
  const { amount, currency } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never',
      },
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    res.status(500).send({
      error: error.message,
    });
  }
});

app.post('/confirm-payment', async (req, res) => {
  const { paymentIntentId, paymentMethodId } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId, {
      payment_method: paymentMethodId,
    });

    res.send(paymentIntent);
  } catch (error) {
    res.status(500).send({
      error: error.message,
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
