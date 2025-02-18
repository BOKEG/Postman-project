const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/User');

require('dotenv').config({ path: './config/.env' });

const app = express();
app.use(express.json()); // Middleware to parse JSON requests

// ✅ CONNECT TO MONGO ATLAS
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("✅ Database Connected Successfully"))
.catch(err => console.error("❌ Database Connection Error:", err));

// RETURN ALL USERS
app.get('/users', async (req, res) => {
    try {
        const users = await User.find(); // Fetch all users from the database
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ADD A NEW USER TO THE DATABASE
app.post('/users', async (req, res) => {
    try {
        const { name, email, age } = req.body;
        const newUser = new User({ name, email, age });
        await newUser.save(); // Save user to the database
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// EDIT A USER BY ID
app.put('/users/:id', async (req, res) => {
    try {
        const { name, email, age } = req.body;
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { name, email, age },
            { new: true, runValidators: true } // Return updated user & validate input
        );
        if (!updatedUser) return res.status(404).json({ message: "User not found" });
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// REMOVE A USER BY ID
app.delete('/users/:id', async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) return res.status(404).json({ message: "User not found" });
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 🚀 START THE SERVER

app.listen(3000, () => {
  console.log(`🚀 Server running on port 3000`)
});
  
