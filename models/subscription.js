const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Subscription name is required'], 
    trim: true 
  },
  cost: { 
    type: Number, 
    required: [true, 'Cost is required'], 
    min: [1, 'Cost must be at least ₹1'] 
  },
  frequency: { 
    type: String, 
    enum: ['weekly', 'monthly', 'yearly'] 
  },
  category: { 
    type: String, 
    enum: ['Entertainment', 'Personal', 'Work', 'Utilities', 'Other'],
    default: 'Other'
  },
  usageHistory: [Date],
  userId: { type: String, required: true },
});


subscriptionSchema.virtual('costPerUse').get(function() {
 
  if (this.usageHistory.length === 0) {
    return this.cost; 
  }
  
  return this.cost / this.usageHistory.length;
});


subscriptionSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Subscription', subscriptionSchema);