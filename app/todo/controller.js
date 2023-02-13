const Todo = require('./model');

module.exports = {
    index: async (req, res) => {
        try {
            const todo = await Todo.find({ user_id: req.user._id }).select('_id title desc dueDate status');

            res.json({ data: todo });

        } catch (err) {
            res.status(500).json({ message: err.message || 'Internal Server Error' });
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

            res.json({
                data: todo,
            });
        } catch (err) {
            res.status(500).json({ message: err.message || 'Internal Server Error' });
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
                res.json({
                    message: 'Successfully',
                    data: todo,
                })
            } else {
                res.status(403).json({message: "You haven't access to this Todo"})
            }


        } catch (err) {
            res.status(500).json({ message: err.message || 'Internal Server Error' });
        }
    },

    destroy: async (req, res) => {
        try {
            const { id } = req.params;

            const todo = await Todo.findOneAndDelete({ _id: id, user_id: req.user._id })

            if (todo) {
                res.json({
                    message: 'Deleted',
                    data: todo,
                })
            } else {
                res.status(403).json({message: "You haven't access to this Todo"})
            }
        } catch (err) {
            res.status(500).json({ message: err.message || 'Internal Server Error' });
        }
    }
}