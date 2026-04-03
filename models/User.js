const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    balance: { type: Number, default: 0 },
    lastDaily: { type: Date, default: null },
    lastWorked: { type: Date, default: null },
    occupation: { type: String, default: 'Unemployed' },
    inventory: { type: Array, default: [] }
});

module.exports = mongoose.model('User', userSchema);