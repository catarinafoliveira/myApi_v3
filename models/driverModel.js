const mongoose = require('mongoose');
const Person = require('../models/personModel');
const Schema = mongoose.Schema;

const DriverSchema = new Schema({
    licence: {
        type: String, 
        unique: true, 
        match: /^[A-Za-z]{2}[0-9]{8}$/,
        minlength: 10,
        maxlength: 10
      }
});

const Driver = Person.discriminator('Driver', DriverSchema);
module.exports = Driver;