var express = require('express'); 
var router = express.Router();
const DriverController = require('../controllers/driverController');
const verifyToken  = require('../middleware');

router.post('/', verifyToken, DriverController.createDriver);
router.get('/', verifyToken, DriverController.getAllDrivers);
router.get('/id/:id', verifyToken, DriverController.getDriverById);
router.get('/name/:name', verifyToken, DriverController.getDriverByName);
router.get('/idcard/:idcard', verifyToken, DriverController.getDriverByIdCard);
router.get('/dl/:dl', verifyToken, DriverController.getDriverByLicence);
router.put('/:id', verifyToken,DriverController.updateDriver);
router.delete('/:id', verifyToken,DriverController.deleteDriver);

module.exports = router;