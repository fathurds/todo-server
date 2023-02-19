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

            return res.json({
                status: 'success',
                data: user
            })
        } catch (err) {
            if (err && err.name === "ValidationError") {
                return res.status(422).json({
                    status: 'error',
                    message: err.message || 'Internal server error'
                })
            }
            next(err);
        }
    },
    signin: async (req, res, next) => {
        try {
            const { username, password } = req.body;

            const user = await User.findOne({ username });

            if (user) {
                const checkPassword = bcrypt.compareSync(password, user.password)
                if (checkPassword) {
                    const token = jwt.sign({
                        id: user.id,
                        username: user.username,
                        name: user.name
                    }, config.jwtKey);

                    return res.json({
                        status: 'success',
                        data: { token }
                    })
                } else {
                    return res.status(403).json({
                        status: 'error',
                        message: "The password that you've entered is incorrect"
                    })
                }
            } else {
                return res.status(403).json({
                    status: 'error',
                    message: 'Username not registered'
                })
            }

        } catch (err) {
            return res.status(500).json({
                status: 'error',
                message: err.message || 'Internal server error'
            });
        }
    }
}