const mongoose = require('mongoose');

const todoSchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, 'title is required']
    },
    desc: {
        type: String,
        minLength: [6, 'Your username must be at least 6 characters'],
    },
    dueDate: {
        type: Date,
    },
    status: {
        type: Boolean,
        default: false
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

module.exports = mongoose.model('Todo', todoSchema);