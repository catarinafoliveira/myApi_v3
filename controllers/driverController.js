const DriverModel = require('../models/driverModel');
const baseController = require('./baseController');
const { updateUser  } = require('../models/userModel');

exports.createDriver = async function(req, res) {
    console.log("POST: /api/drivers - " + JSON.stringify(req.body));
    const {name, idCard, licence} = req.body;
    try {
        const driver = new DriverModel({
            name,
            idCard,
            licence
        });

        await driver.save();
        res.status(201).json({ message: 'Driver created!' });
    } catch (err) {
        if (err.name === 'ValidationError') {
            let errorMessage = 'Validation Error: ';
            for (let field in err.errors) {
                errorMessage += `${err.errors[field].message} `;
            }
            res.status(400).json({ error: errorMessage.trim() });
        } else if (err.code === 11000) {
            res.status(400).json({ error: 'Duplicate idCard or licence. Please use unique values.' });
        } else {
            res.status(500).json({ error: 'Error saving driver', details: err.message });
        }
    }
};

exports.getAllDrivers = async function(req, res) {
    console.log("GET: /api/drivers");
    try {
        const divers = await DriverModel.find();
        res.status(200).json(divers);
    } catch (err) {
        res.status(500).json({ error: 'Error retrieving drivers', details: err });
    }
};

exports.getDriverById = async function(req, res) {
    console.log("GET: /api/drivers by Id: " + req.params.id);
    try {
        const driver = await DriverModel.findById(req.params.id);
        if (!driver) {
            return res.status(404).json({ message: 'Driver not found' });
        }
        res.status(200).json(driver);
    } catch (err) {
        res.status(500).json({ error: 'Error retrieving driver', details: err });
    }
};

exports.getDriverByName = async function(req, res) {
    console.log("GET: /api/drivers by Name: " + req.params.name);
    try {
        const drivers = await DriverModel.find({ name: req.params.name });
        res.status(200).json(drivers);
    } catch (err) {
        res.status(500).json({ error: 'Error retrieving drivers', details: err });
    }
};

exports.getDriverByIdCard = async function(req, res) {
    console.log("GET: /api/drivers by IdCard: " + req.params.idcard);
    try {
        const driver = await DriverModel.findOne({ idCard: req.params.idcard });
        if (!driver) {
            return res.status(404).json({ message: 'Driver not found' });
        }
        res.status(200).json(driver);
    } catch (err) {
        res.status(500).json({ error: 'Error retrieving driver', details: err });
    }
};

exports.getDriverByLicence = async function(req, res) {
    console.log("GET: /api/drivers/ by licence: " + req.params.dl);
    try {
        const driver = await DriverModel.findOne({ licence: req.params.dl });
        if (!driver) {
            return res.status(404).json({ message: 'Driver not found' });
        }
        res.status(200).json(driver);
    } catch (err) {
        res.status(500).json({ error: 'Error retrieving driver', details: err });
    }
};

exports.updateDriver = async function(req, res) {
    console.log("PUT: /api/drivers/" + req.params.id + " - " + JSON.stringify(req.body));
    try {
        const driver = await DriverModel.findById(req.params.id);
        if (!driver) {
            return res.status(404).json({ error: 'Driver not found' });
        }

        // Update driver model
        driver.name = req.body.name || driver.name;
        driver.idCard = req.body.idCard || driver.idCard;
        driver.licence = req.body.licence || driver.licence;
        await driver.save();

        // Update user model
        const updates = {
            idCard: driver.idCard,
            licence: driver.licence,
        };

        const username = req.body.username || driver.name;
        if (req.body.password) {
            updates.password = req.body.password;
        }
        if (req.body.role) {
            updates.role = req.body.role;
        }

        await updateUser(username, updates);

        res.status(200).json({ message: 'Driver updated!' });
    } catch (err) {
        if (err.name === 'ValidationError') {
            let errorMessage = 'Validation Error: ';
            for (let field in err.errors) {
                errorMessage += `${err.errors[field].message} `;
            }
            res.status(400).json({ error: errorMessage.trim() });
        } else if (err.code === 11000) {
            res.status(400).json({ error: 'Duplicate idCard or licence. Please use unique values.' });
        } else {
            res.status(500).json({ error: 'Error updating driver', details: err.message });
        }
    }
};

exports.deleteDriver = async function(req, res) {
    baseController.delete(req, res, DriverModel);
};