const router = require('express').Router();
const storehouses = require('../controllers/storehouses');
const session = require('../middleware/session');
const permission = require('../middleware/permission');

router.get('/storehouses/', session(), permission(), storehouses.getStorehouses);
router.post('/storehouses/', session(), permission(), storehouses.createStorehouse);
// TODO: 11.05.16 Implement update stoerehouse
//router.put('/storehouses/:storehouseId/', session(), permission(), storehouses.updateStorehouse);
// TODO: 11.05.16 Implement delete storehouse
//router.delete('/storehouses/:storehouseId/', session(), permission(), storehouses.deleteStorehouse);

module.exports = router;