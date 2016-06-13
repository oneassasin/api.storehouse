const router = require('express').Router();
const user = require('../controllers/user');
const session = require('../middleware/session');

router.post('/user/auth/', user.signIn);
router.delete('/user/auth/', session(), user.signOut);

module.exports = router;