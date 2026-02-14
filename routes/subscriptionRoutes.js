const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscriptionController');

// Routes
router.get('/', subscriptionController.getAllSubscriptions);
router.post('/', subscriptionController.createSubscription);
router.post('/:id/log', subscriptionController.logUsage);
router.delete('/:id', subscriptionController.deleteSubscription);

router.put('/:id', subscriptionController.updateSubscription);
module.exports = router;