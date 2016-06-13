const router = require('express').Router();
const savedItems = require('../controllers/savedItems');
const session = require('../middleware/session');
const permission = require('../middleware/permission');

router.get('/storehouses/:storehouseId/items', session(), permission(), savedItems.getSavedItems);
router.post('/storehouses/:storehouseId/items', session(), permission(), savedItems.createSavedItem);
// TODO: 11.05.16 Implement update mark
//router.put('/storehouses/:storehouseId/items/:itemId', session(), permission(), savedItems.updateSavedItem);
router.delete('/storehouses/:storehouseId/items/:itemId', session(), permission(), savedItems.deleteSavedItem);

module.exports = router;