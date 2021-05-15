const express = require("express")
const serverless = require("serverless-http")
const stripe = require('stripe')(process.env.STRIPE_SECRET)

const app = express()
const router = express.Router()

router.get('/plans', async (req, res) => {
  try {
    const plans = await stripe.plans.list({ product: 'prod_JTzpVJTJZkekNe' })
    res.json(plans)
  } catch (err) {
    res.json({ error: true, error: err.message })
  }
})

router.post('/pay', async (req, res) => {
  console.log(req.body)
  try {
    const { id } = await stripe.customers.create({
      email: req.body.email,
      source: req.body.token,
    })
    const subscription = await stripe.subscriptions.create({
      customer: id,
      items: [
        { price: req.body.plan },
      ],
    })
    res.json(subscription)
  } catch (err) {
    res.json({ error: true, error: err.message })
  }

})

router.post('/subscription', async (req, res) => {
  try {
    const customer = await stripe.customers.retrieve(
      req.body.customerId
    )
    res.json(customer)
  } catch (err) {
    res.json({ error: true, error: err.message })
  }
})

router.post('/unsubscribe', async (req, res) => {
  try {
    const deleted = await stripe.subscriptions.retrieve(
      req.body.subId
    )
    res.json(deleted)
  } catch (err) {
    res.json({ error: true, error: err.message })
  }
})

app.use(`/.netlify/functions/api`, router)

module.exports = app
module.exports.handler = serverless(app)
