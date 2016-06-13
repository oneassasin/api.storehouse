const router = require('express').Router();
const messages = require('../controllers/messages');
const session = require('../middleware/session');
const permission = require('../middleware/permission');

router.get('/storehouses/:storehouseId/messages', session(), permission(), messages.getMessages);
router.post('/storehouses/:storehouseId/messages', session(), permission(), messages.createMessage);
// TODO: 11.05.16 Implement update message
//router.put('/storehouses/:storehouseId/messages/:messageId', session(), permission(), messages.updateMessage);

module.exports = router;