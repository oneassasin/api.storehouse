const router = require('express').Router();
const shelfes = require('../controllers/shelfes');
const session = require('../middleware/session');
const permission = require('../middleware/permission');

router.get('/racks/:rackId/shelfes', session(), permission(), shelfes.getShelfes);
router.post('/racks/:rackId/shelfes/', session(), permission(), shelfes.createShelf);
// TODO: 11.05.16 Implement update shelf
//router.put('/racks/:rackId/shelfes/:shelfId', session(), permission(), shelfes.updateShelf);
// TODO: 11.05.16 Implement delete shelf
//router.delete('/racks/:rackId/shelfes/:shelfId', session(), permission(), shelfes.deleteShelf);

module.exports = router;