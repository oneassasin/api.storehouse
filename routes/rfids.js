const router = require('express').Router();
const rfids = require('../controllers/rfids');
const session = require('../middleware/session');
const permission = require('../middleware/permission');

router.get('/rfids/', session(), permission(), rfids.getMarks);
router.post('/rfids/', session(), permission(), rfids.createMark);
// TODO: 11.05.16 Implement update mark
//router.put('/rfids/:rfidsId', session(), permission(), rfids.updateRfid);
// TODO: 11.05.16 Implement delete mark
//router.delete('/rfids/:rfidsId', session(), permission(), rfids.deleteRfid);

module.exports = router;