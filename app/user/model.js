const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')

const HASH_ROUND = 10;

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'name is required']
    },
    username: {
        type: String,
        required: [true, 'name is required'],
        minLength: [5, 'Your username must be at least 6 characters'],
    },
    password: {
        type: String,
        required: [true, 'Password harus diisi'],
        minLength: [5, 'Your password must be at least 6 characters'],
    },
}, { timestamps: true });

// Validasi username sudah ada
userSchema.path('username').validate(async function (value) {
    try {
        const count = await this.model('User').countDocuments({ username: value });
        return !count;
    } catch (err) {
        throw err
    }
}, attr => `${attr.value} already registered`);

// Hash password
userSchema.pre('save', function (next) {
    this.password = bcrypt.hashSync(this.password, HASH_ROUND);
    next();
})

module.exports = mongoose.model('User', userSchema);