const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB Compass (using 127.0.0.1 to avoid localhost issues)
const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ticketDB';

mongoose.connect(mongoURI)
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch(err => console.error("❌ Connection Error:", err));
// Define the Data Schema
const ticketSchema = new mongoose.Schema({
    name: String,
    event: String,
    seatNumber: String,
    date: { type: Date, default: Date.now }
});

const Ticket = mongoose.model('Ticket', ticketSchema);

// Route: Save a new reservation
app.post('/book', async (req, res) => {
    try {
        const newTicket = new Ticket(req.body);
        await newTicket.save();
        res.status(201).send({ message: "Ticket Booked!", ticket: newTicket });
    } catch (error) {
        res.status(400).send({ error: "Booking failed" });
    }
});

// Route: Get all reservations for the table
app.get('/tickets', async (req, res) => {
    try {
        const tickets = await Ticket.find().sort({ date: -1 }); // Newest first
        res.send(tickets);
    } catch (error) {
        res.status(500).send({ error: "Could not fetch tickets" });
    }
});

app.listen(5000, () => console.log('🚀 Server running on http://localhost:5000'));