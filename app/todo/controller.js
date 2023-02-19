const Todo = require('./model');

module.exports = {
    index: async (req, res) => {
        try {
            const todo = await Todo.find({ user_id: req.user._id }).select('_id title desc dueDate status');

            return res.json({
                status: 'success',
                data: todo
            });

        } catch (err) {
            return res.status(500).json({
                status: 'error',
                message: err.message || 'Internal Server Error'
            });
        }
    },

    get: async (req, res) => {
        try {
            const { id } = req.params;

            const todo = await Todo.findOne({ user_id: req.user._id, _id: id });

            if (!todo) {
                return res.status(400).json({
                    status: 'error',
                    message: "Data not found"
                });
            }

            return res.json({
                status: 'success',
                data: todo
            });

        } catch (err) {
            return res.status(500).json({
                status: 'error',
                message: err.message || 'Internal Server Error'
            });
        }
    },

    create: async (req, res) => {
        try {
            const { title, desc, dueDate } = req.body;

            const todo = new Todo({
                title,
                desc,
                dueDate,
                user_id: req.user.id
            });

            await todo.save();

            return res.json({
                status: 'success',
                data: todo,
            });
        } catch (err) {
            return res.status(500).json({
                status: 'error',
                message: err.message || 'Internal Server Error'
            });
        }
    },

    update: async (req, res) => {
        try {
            const { id } = req.params;
            const { title, desc, dueDate, status } = req.body;

            await Todo.updateOne({ _id: id, user_id: req.user._id }, {
                title,
                desc,
                dueDate,
                status
            })

            const todo = await Todo.findOne({ _id: id, user_id: req.user._id }).select('title desc dueDate status');

            if (todo) {
                return res.json({
                    status: 'success',
                    message: 'Successfully',
                    data: todo,
                })
            } else {
                return res.status(404).json({
                    status: "error",
                    message: "data Not Found"
                })
            }


        } catch (err) {
            return res.status(500).json({
                status: 'error',
                message: err.message || 'Internal Server Error'
            });
        }
    },

    destroy: async (req, res) => {
        try {
            const { id } = req.params;

            const todo = await Todo.findOneAndDelete({ _id: id, user_id: req.user._id })

            if (todo) {
                return res.json({
                    status: 'success',
                    message: 'Deleted',
                    data: todo,
                })
            } else {
                return res.status(404).json({
                    status: 'error',
                    message: "data not found"
                })
            }
        } catch (err) {
            return res.status(500).json({
                status: 'error',
                message: err.message || 'Internal Server Error'
            });
        }
    }
}