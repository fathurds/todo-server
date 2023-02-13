const User = require('./model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../../config');

module.exports = {
    signup: async (req, res, next) => {
        try {
            const payload = req.body;

            const user = new User(payload);
            await user.save();

            delete user._doc.password;

            res.json({
                message: 'Success',
                data: user
            })
        } catch (err) {
            if (err && err.name === "ValidationError") {
                return res.status(422).json({
                    error: 1,
                    message: err.message,
                })
            }
            next(err);
        }
    },
    signin: async (req, res, next) => {
        try {
            const { username, password } = req.body;

            const user = await User.findOne({username});

            if (user) {
                const checkPassword = bcrypt.compareSync(password, user.password)
                if (checkPassword) {
                    const token = jwt.sign({
                        id: user.id,
                        username: user.username,
                        name: user.name
                    }, config.jwtKey);

                    res.json({ data: { token } })
                } else {
                    res.status(403).json({ message: "The password that you've entered is incorrect" })
                }
            } else {
                res.status(403).json({ message: 'Username not registered' })
            }

        } catch (err) {
            res.status(500).json({
                message: err.message || 'Internal server error'
            });
        }
    }
}