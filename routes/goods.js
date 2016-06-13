const router = require('express').Router();
const goods = require('../controllers/goods');
const session = require('../middleware/session');
const permission = require('../middleware/permission');

router.get('/storehouses/:storehouseId/goods/', session(), permission(), goods.getGoods);
router.post('/storehouses/:storehouseId/goods/', session(), permission(), goods.createGood);
// TODO: 11.05.16 Implement delete good.
//router.delete('/storehouses/:storehouseId/goods/:goodId', session(), permission(), goods.deleteGood);
// TODO: 11.05.16 Implement update good.
//router.put('goods/:goodId', session(), permission(), goods.updateGood);

module.exports = router;