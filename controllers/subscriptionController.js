const Subscription = require('../models/subscription');


exports.getAllSubscriptions = async (req, res) => {
    try {
        const subscriptions = await Subscription.find();
        res.json(subscriptions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.createSubscription = async (req, res) => {
    try {
        const newSubscription = new Subscription(req.body);
        const savedSubscription = await newSubscription.save();
        res.status(201).json(savedSubscription);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


exports.logUsage = async (req, res) => {
    try {
        const subscription = await Subscription.findById(req.params.id);
        if (!subscription) {
            return res.status(404).json({ message: "Subscription not found" });
        }
        
        
        subscription.usageHistory.push(new Date());
        await subscription.save();
        
        res.json(subscription);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.deleteSubscription = async (req, res) => {
    try {
        const subscription = await Subscription.findByIdAndDelete(req.params.id);
        if (!subscription) return res.status(404).json({ message: "Not found" });
        res.json({ message: "Subscription deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.updateSubscription = async (req, res) => {
    try {
        
        const updatedSubscription = await Subscription.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true } 
        );
        res.json(updatedSubscription);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};