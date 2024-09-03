const DriverModel = require('../models/driverModel');

class CarOutputDTO {
    constructor(id, plate, date, ownerName, ownerIdCard, ownerLicence) {
        this._id = id;
        this.plate = plate;
        this.date = date;
        this.ownerName = ownerName;
        this.ownerIdCard = ownerIdCard;
        this.ownerLicence = ownerLicence;
    }

    static fromCar(car) {
        const formattedDate = car.date ? formatDate(car.date) : null;
        return new CarOutputDTO(
            car._id,
            car.plate,
            formattedDate,
            car.owner.name,
            car.owner.idCard,
            car.owner.licence
        );
    }
}

function formatDate(date) {
    if (!date) return null;
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

module.exports = CarOutputDTO;