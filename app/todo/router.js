const express = require('express');
const { isLogin } = require('../../middleware/auth');
const { index, get, create, update, destroy } = require('./controller');
const router = express.Router();

router.get('/', isLogin, index);
router.get('/:id', isLogin, get);
router.post('/todo', isLogin, create);
router.put('/todo/:id', isLogin, update);
router.delete('/todo/:id', isLogin, destroy);

module.exports = router;
