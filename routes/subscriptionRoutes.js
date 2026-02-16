const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscriptionController');

// Routes
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
router.post('/:id/log', subscriptionController.logUsage);
router.delete('/:id', subscriptionController.deleteSubscription);

router.put('/:id', subscriptionController.updateSubscription);
module.exports = router;