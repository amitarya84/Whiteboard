const mongoose = require('mongoose');

const BoardSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    shapes: {
        type: Array,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Boards', BoardSchema);