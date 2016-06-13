const router = require('express').Router();
const sectors = require('../controllers/sectors');
const session = require('../middleware/session');
const permission = require('../middleware/permission');

router.get('/storehouses/:storehouseId/sectors/', session(), permission(), sectors.getSectors);
router.post('/storehouses/:storehouseId/sectors/', session(), permission(), sectors.createSector);
// TODO: 11.05.16 Implement update sector
//router.put('/storehouses/:storehouseId/sectors/:sectorId', session(), permission(), sectors.updateSector);
// TODO: 11.05.16 Implement delete sector
//router.delete('/storehouses/:storehouseId/sectors/:sectorId', session(), permission(), sectors.deleteSector);

module.exports = router;