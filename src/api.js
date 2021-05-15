const express = require("express");
const serverless = require("serverless-http");

const app = express();
const router = express.Router();

router.get('/plans', async (req, res) => {
  const plans = await stripe.plans.list({ product: 'prod_JTzpVJTJZkekNe' });
  res.json(plans)
})


router.post('/pay', async (req, res) => {
  console.log(req.body)
  const { id } = await stripe.customers.create({
    email: req.body.email,
    source: req.body.token,
  });
  const subscription = await stripe.subscriptions.create({
    customer: id,
    items: [
      { price: req.body.plan },
    ],
  });
  res.json(subscription)
})


router.post('/subscription', async (req, res) => {
  const customer = await stripe.customers.retrieve(
    req.body.customerId
  );
  res.json(customer)
})
router.post('/unsubscribe', async (req, res) => {
  const deleted = await stripe.subscriptions.retrieve(
    req.body.subId
  );
  res.json(deleted)
})

app.use(`/.netlify/functions/api`, router);

module.exports = app;
module.exports.handler = serverless(app);
