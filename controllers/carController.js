const CarModel = require('../models/carModel');
const DriverModel = require('../models/driverModel');
const CarInputDTO = require('../DTO/carInputDTO');
const CarOutputDTO = require('../DTO/carOutputDTO')

exports.createCar = async function(req, res) {
    console.log("POST: /api/cars - " + JSON.stringify(req.body));
    const { plate, date, ownerLicence } = req.body;

    try {
        const ownerDriver = await DriverModel.findOne({ licence: ownerLicence });
        if (!ownerDriver) {
            return res.status(404).json({ message: 'Driver not found' });
        }

        const carInputDTO = new CarInputDTO(plate, parseDateString(date), ownerLicence);
        const car = await carInputDTO.toCar(); 

        await car.save();
        res.status(201).json({ message: 'Car created!' });
    } catch (err) {
        if (err.name === 'ValidationError') {
            let errorMessage = 'Validation Error: ';
            for (let field in err.errors) {
                errorMessage += `${err.errors[field].message} `;
            }
            res.status(400).json({ error: errorMessage.trim() });
        } else if (err.code === 11000) {
            res.status(400).json({ error: 'Duplicate plate. Please use unique values.' });
        } else {
            res.status(500).json({ error: 'Error saving car', details: err.message });
        }
    }
};

function parseDateString(dateString) {
    const parts = dateString.split('/');
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; 
    const year = parseInt(parts[2], 10);
    return new Date(year, month, day);
}

exports.getAllCars = async function(req, res) {
    console.log("GET: /api/cars");
    try {
        const cars = await CarModel.find().populate('owner');
        const carDTOs = cars.map(car => CarOutputDTO.fromCar(car));
        res.status(200).json(carDTOs);
    } catch (err) {
        res.status(500).json({ error: 'Error retrieving cars', details: err });
    }
};

exports.getCarById = async function(req, res) {
    console.log("GET: /api/cars by Id: " + req.params.id);
    try {
        const car = await CarModel.findById(req.params.id).populate('owner');
        if (!car) {
            return res.status(404).json({ message: 'Car not found' });
        }
        res.status(200).json(CarOutputDTO.fromCar(car));
    } catch (err) {
        res.status(500).json({ error: 'Error retrieving car', details: err });
    }
};

exports.getCarByPlate = async function(req, res) {
    console.log("GET: /api/cars by Plate: " + req.params.plate);
    try {
        const car = await CarModel.findOne({ plate: req.params.plate }).populate('owner');
        if (!car) {
            return res.status(404).json({ message: 'Car not found' });
        }
        res.status(200).json(CarOutputDTO.fromCar(car));
    } catch (err) {
        res.status(500).json({ error: 'Error retrieving car', details: err });
    }
};

exports.getCarsByOwnerDriverLicence = async function(req, res) {
    console.log("GET: /api/cars By Owner Driver licence: " + req.params.dl);
    try {
        const driver = await DriverModel.findOne({ licence: req.params.dl });
        if (!driver) {
            return res.status(404).json({ message: 'Driver not found' });
        }
        const cars = await CarModel.find({ owner: driver._id }).populate('owner');
        const carDTOs = cars.map(car => CarOutputDTO.fromCar(car));
        res.status(200).json(carDTOs);
    } catch (err) {
        res.status(500).json({ error: 'Error retrieving cars', details: err });
    }
};

exports.updateCar = async function(req, res) {
    console.log("PUT: /api/cars/" + req.params.id + " - " + JSON.stringify(req.body));
    const { plate, date, ownerLicence } = req.body;

    try {
        const car = await CarModel.findById(req.params.id).populate('owner');
        if (!car) {
            return res.status(404).json({ message: 'Car not found' });
        }

        const ownerDriver = await DriverModel.findOne({ licence: ownerLicence });
        if (!ownerDriver) {
            return res.status(404).json({ message: 'Driver not found' });
        }

        car.plate = plate || car.plate;
        car.date = date ? parseDateString(date) : car.date;
        car.owner = ownerDriver._id;

        await car.save();
        res.status(200).json({ message: 'Car updated!' });
    } catch (err) {
        if (err.name === 'ValidationError') {
            let errorMessage = 'Validation Error: ';
            for (let field in err.errors) {
                errorMessage += `${err.errors[field].message} `;
            }
            res.status(400).json({ error: errorMessage.trim() });
        } else if (err.code === 11000) {
            res.status(400).json({ error: 'Duplicate plate. Please use unique values.' });
        } else {
            res.status(500).json({ error: 'Error updating car', details: err.message });
        }
    }
};

exports.deleteCar = async function(req, res) {
    console.log("DELETE: /api/cars/" + req.params.id);
    try {
        const car = await CarModel.findByIdAndDelete(req.params.id);
        if (!car) {
            return res.status(404).json({ message: 'Car not found' });
        }
        res.status(200).json({ message: 'Car deleted!' });
    } catch (err) {
        res.status(500).json({ error: 'Error deleting car', details: err.message });
    }
};
