import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; 
import AOS from 'aos';
import 'aos/dist/aos.css'; 
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/clerk-react";


import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';


ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function Dashboard() {
    const { user } = useUser();
  const [editingId, setEditingId] = useState(null); 
  const [subscriptions, setSubscriptions] = useState([]);
  const [form, setForm] = useState({ name: '', cost: '', frequency: 'monthly',category: 'Entertainment' });
  const [filter, setFilter] = useState('All'); 

  const formatDate = (dateString) => {
    if (!dateString) return "Never";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      day: 'numeric', month: 'short', year: 'numeric' 
    });
  };

  const filteredSubscriptions = subscriptions.filter(sub => {
    if (filter === 'All') return true; 
    return sub.category === filter;    
  });


  const chartData = {
    labels: filteredSubscriptions.map(sub => sub.name),
    datasets: [
      {
        label: 'Cost Per Use (₹)',
        data: filteredSubscriptions.map(sub => sub.costPerUse),
        
        
        backgroundColor: '#10B981', 
        hoverBackgroundColor: '#059669', 
        
       
        borderRadius: 6,
        borderSkipped: false,
        barPercentage: 0.6, 
      },
    ],
  };

  
  

  const getCategoryIcon = (cat) => {
    switch(cat) {
      case 'Entertainment': return '🎬';
      case 'Personal': return '🧘';
      case 'Work': return '💼';
      case 'Utilities': return '💡';
      default: return '📦';
    }
  };

  
  const totalMonthlyCost = subscriptions.reduce((total, sub) => {
    let monthlyPrice = Number(sub.cost);

    if (sub.frequency === 'yearly') {
      monthlyPrice = monthlyPrice / 12;
    } else if (sub.frequency === 'weekly') {
      monthlyPrice = monthlyPrice * 4;
    }
    
    return total + monthlyPrice;
  }, 0);

  
  const handleEditClick = (sub) => {
    setEditingId(sub._id);
    setForm({ name: sub.name, cost: sub.cost, frequency: sub.frequency });
   
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

 useEffect(() => {
    if (user) fetchSubscriptions();
    AOS.init({ duration: 1000, once: false, mirror: true, offset: 100 });
  }, [user]);
    
    
    

 const fetchSubscriptions = async () => {
    
    if (!user) return;

    try {
      
      const response = await axios.get('https://tej-smart-subscription.onrender.com/subscriptions', {
        params: { userId: user.id } 
      });
      setSubscriptions(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert("Please sign in!");

    // Fix user ID
    const submissionData = { ...form, userId: user.id }; 

    try {
      if (editingId) {
        await axios.put(`https://tej-smart-subscription.onrender.com/subscriptions/${editingId}`, submissionData);
        setEditingId(null); 
      } else {
        
        await axios.post('https://tej-smart-subscription.onrender.com/subscriptions', submissionData);
      }
      
      setForm({ name: '', cost: '', frequency: 'monthly', category: 'Entertainment' });
      fetchSubscriptions(); 
      alert('Saved successfully! '); 
    } catch (error) {
      console.error("Error saving:", error);
      alert("Error saving subscription.");
    }
  };

  const handleLogUsage = async (id) => {
    try {
      await axios.post(`https://tej-smart-subscription.onrender.com/subscriptions/${id}/log`);
      fetchSubscriptions(); 
    } catch (error) {
      console.error("Error logging usage", error);
    }
  };

  const handleDelete = async (id) => {
    if(!confirm("Are you sure?")) return;
    try {
      await axios.delete(`https://tej-smart-subscription.onrender.com/subscriptions/${id}`);
      fetchSubscriptions();
    } catch (error) {
      console.error("Error deleting", error);
    }
  };

  return (
    <div className="container"> 
      {/* HEADER:  */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px', marginBottom: '20px', marginTop: '20px' }}>
         <h1 style={{ margin: 0 }}>T-Subscription Tracker</h1>
         <UserButton afterSignOutUrl="/" />
      </div>
      {/*   Cost Card */}
      <div className="total-card" data-aos="fade-down">
        <h3>Total Monthly Spend</h3>
        <div className="total-amount">₹{totalMonthlyCost.toFixed(0)}</div>
        <p>You are spending <strong>₹{(totalMonthlyCost * 12).toFixed(0)}</strong> per year!</p>
      </div>
      {/* The Form */}
      <form className="add-form" onSubmit={handleSubmit} data-aos="fade-left">
        <input 
          name="name" 
          placeholder="Netflix, Gym..." 
          value={form.name} 
          onChange={handleChange} 
          required
        />
        <input 
          name="cost" 
          type="number" 
          placeholder="Cost (₹)" 
          value={form.cost} 
          onChange={handleChange} 
          required
          min="1"
        />
        <select name="frequency" value={form.frequency} onChange={handleChange}>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
          <option value="weekly">Weekly</option>
        </select>

        <select name="category" value={form.category} onChange={handleChange}>
          <option value="Entertainment">Entertainment</option>
          <option value="Personal">Personal</option>
          <option value="Work">Work</option>
          <option value="Utilities">Utilities</option>
          <option value="Other">Other</option>
        </select>
        <button type="submit" style={{ backgroundColor: editingId ? '#f39c12' : '#3498db' }}>
  {editingId ? 'Update ✏️' : 'Add +'}
</button>

{/*  editing */}
{editingId && (
  <button type="button" onClick={() => { setEditingId(null); setForm({ name: '', cost: '', frequency: 'monthly' }); }} style={{ background: '#95a5a6', marginLeft: '5px' }}>
    Cancel
  </button>
)}
      </form>

      <div style={{ background: 'rgba(30, 41, 59, 0.7)', border: '1px solid rgba(255,255,255,0.1)', padding: '20px', borderRadius: '12px', marginBottom: '2rem', height: '300px' }} data-aos="zoom-in">
        <Bar 
          data={chartData} 
          options={{
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { labels: { color: 'white' } }, 
    title: { color: 'white' }
  },
  scales: {
    x: { ticks: { color: '#cbd5e1' }, grid: { color: '#334155' } }, 
    y: { ticks: { color: '#cbd5e1' }, grid: { color: '#334155' } }
  }
}} 
        />
      </div>

      <div className="control-bar" data-aos="fade-right">
        <label>Filter by Category:</label>
        <select onChange={(e) => setFilter(e.target.value)} value={filter}>
          <option value="All">All Categories 🌐</option>
          <option value="Entertainment">Entertainment 🎬</option>
          <option value="Personal">Personal 🧘</option>
          <option value="Work">Work 💼</option>
          <option value="Utilities">Utilities 💡</option>
          <option value="Other">Other 📦</option>
        </select>
      </div>

      {/* The List */}
      <div className="grid">
        {filteredSubscriptions.map(sub => (
          <div key={sub._id} className="card" data-aos="fade-up">
            <div className="card-header">
              <h3>{getCategoryIcon(sub.category)} {sub.name}</h3>
              <span className="cost-pill">₹{sub.cost} / {sub.frequency}</span>
            </div>
            
            <div className="stats">
  <p>Used: <strong>{sub.usageHistory.length} times</strong></p>
  <p>Last Used: <strong>{formatDate(sub.usageHistory[sub.usageHistory.length - 1])}</strong></p>
  <p>Real Cost: <strong className="highlight">₹{sub.costPerUse.toFixed(2)}</strong> / use</p>
</div>

            <div className="actions">
              {/* Green Button */}
              <button onClick={() => handleLogUsage(sub._id)} className="btn-log">
                Used it!
              </button>

              {/*  Edit Button */}
              <button onClick={() => handleEditClick(sub)} className="btn-edit">
                ✏️
              </button>

              {/*  Delete Button */}
              <button onClick={() => handleDelete(sub._id)} className="btn-delete">
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>
      <footer className="footer">
        Made by <span className="highlight">tej045</span>
      </footer>
    </div>
  );
}

export default Dashboard;