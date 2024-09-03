var express = require('express'); 
var router = express.Router();
const PersonController = require('../controllers/personController');
const verifyToken  = require('../middleware');

router.post('/', verifyToken, PersonController.createPerson);
router.get('/', verifyToken, PersonController.getAllPersons);
router.get('/id/:id', verifyToken, PersonController.getPersonById);
router.get('/name/:name', verifyToken, PersonController.getPersonByName);
router.get('/idcard/:idcard', verifyToken, PersonController.getPersonByIdCard);
router.put('/:id', verifyToken, PersonController.updatePerson);
router.delete('/:id', verifyToken, PersonController.deletePerson);

module.exports = router;