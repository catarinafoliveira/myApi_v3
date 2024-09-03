var express = require('express'); 
var router = express.Router();
const CarController = require('../controllers/carController');
const verifyToken  = require('../middleware');

router.post('/', verifyToken, CarController.createCar);
router.get('/', verifyToken, CarController.getAllCars);
router.get('/id/:id', verifyToken, CarController.getCarById);
router.get('/plate/:plate', verifyToken, CarController.getCarByPlate);
router.get('/owner/:dl', verifyToken, CarController.getCarsByOwnerDriverLicence);
router.put('/:id', verifyToken,CarController.updateCar);
router.delete('/:id', verifyToken,CarController.deleteCar);

module.exports = router;