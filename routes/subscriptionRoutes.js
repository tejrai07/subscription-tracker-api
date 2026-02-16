const express = require('express');
const router = express.Router();

const Subscription = require('../models/subscription'); 


router.get('/', async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.json([]); 
    }

    
    const subscriptions = await Subscription.find({ userId });
    res.json(subscriptions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
   
    const newSubscription = new Subscription(req.body); 
    await newSubscription.save();
    res.status(201).json(newSubscription);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


router.delete('/:id', async (req, res) => {
  try {
    await Subscription.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.put('/:id', async (req, res) => {
  try {
    const updatedSubscription = await Subscription.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedSubscription);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


router.post('/:id/log', async (req, res) => {
  try {
    const sub = await Subscription.findById(req.params.id);
    sub.usageHistory.push(new Date());
    await sub.save();
    res.json(sub);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;