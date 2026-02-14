const express = require('express');
const mongoose = require('mongoose');
const subscriptionRoutes = require('./routes/subscriptionRoutes'); 

const app = express();

const cors = require('cors'); 



app.use(cors());

app.use(express.json()); 
app.use(cors());


mongoose.connect('mongodb://127.0.0.1:27017/sub-tracker')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ Could not connect to MongoDB:', err));


app.use('/subscriptions', subscriptionRoutes);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});