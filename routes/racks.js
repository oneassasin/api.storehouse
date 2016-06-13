const router = require('express').Router();
const racks = require('../controllers/racks');
const session = require('../middleware/session');
const permission = require('../middleware/permission');

router.get('/sectors/:sectorId/racks', session(), permission(), racks.getRacks);
router.post('/sectors/:sectorId/racks', session(), permission(), racks.createRack);
// TODO: 11.05.16 Implement update rack
//router.put('/sectors/:sectorId/racks/:rackId', session(), permission(), racks.updateRack);
// TODO: 11.05.16 Implement delete rack
//router.delete('/sectors/:sectorId/racks/:rackId', session(), permission(), racks.deleteRack);

module.exports = router;