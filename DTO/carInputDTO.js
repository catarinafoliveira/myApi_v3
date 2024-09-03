const DriverModel = require('../models/driverModel');
const CarModel = require('../models/carModel');

class CarInputDTO {
    constructor(plate, date, ownerDL) {
        this.plate = plate;
        this.date = date;
        this.ownerDL = ownerDL;
    }

    async toCar(){
        const ownerDriver = await DriverModel.findOne({ licence: this.ownerDL });
        if (!ownerDriver) {
            throw new Error('Driver not found');
        }
        return new CarModel({
            plate: this.plate,
            date: this.date,
            owner: ownerDriver._id
        });
    }
}

module.exports = CarInputDTO;