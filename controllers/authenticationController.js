const keyFile = require('../secret.key');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database.db');
const { saveUser } = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const PersonModel = require('../models/personModel');
const DriverModel = require('../models/driverModel');

exports.register = async function(req,res){
    var { username, password, idCard, licence, role } = req.body;
    
    try {
        const exists = await checkExists(username, idCard, licence);
        if (exists) {
            res.status(400).json({ error: 'Duplicate username, idCard or licence.' });
        } else {
            try {
                const idCreated = await savePerson(username, idCard, licence, role);
                if(role=="employee"){
                    licence = null;
                }
                await saveUser(username, password, idCard, licence, role, idCreated,'active');
                res.status(201).json({ message: 'User registered successfully' });
            } catch(err){
                if (err.name === 'ValidationError') {
                    let errorMessage = 'Validation Error: ';
                    for (field in err.errors) {
                        errorMessage += `${err.errors[field].message} `;
                    }
                    res.status(400).json({ error: errorMessage.trim() });
                } else if (err.code === 11000) {
                    res.status(400).json({ error: 'Duplicate idCard. Please use a unique idCard number.' });
                } else {
                    res.status(500).json({ error: 'Error saving person', details: err });
                }
            }
            
        }
    } catch(error){
        res.send('Error:', error);
    }
}

function checkExists(username, idCard, licence) {
    if(licence == ''){
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM users WHERE username = ? OR idCard = ?', [username, idCard], (err, row) => {
                if (err) {
                    reject(err); 
                } else {
                    resolve(!!row);
                }
            });
        });
    } else {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM users WHERE username = ? OR idCard = ? OR licence = ?', [username, idCard, licence], (err, row) => {
                if (err) {
                    reject(err); 
                } else {
                    resolve(!!row);
                }
            });
        });
    }
    
}

async function savePerson(name, idCard, licence, role){
    try{
        if(role==='driver'){
            const driver = new DriverModel({
                name,
                idCard,
                licence
            });
            await driver.save();
        } else if(role==='employee'){
            const person = new PersonModel({
                name,
                idCard
            });
            await person.save();
        }
        const savedPerson = await PersonModel.findOne({ idCard: idCard });
        return savedPerson.id;
    } catch(err){
        throw err;
    }
}

exports.login = async function(req,res){
    const { username, password } = req.body;
    try {
        const user = await fetchUserByUsername(username);
        if (user) {
            if(user.status!='active'){
                res.status(401).json({ error: 'Inactive user'});
            } else {
                const hashedPasswordFromDB = user.password; 
            
                const passwordsMatch = await comparePasswords(password, hashedPasswordFromDB);
                if (passwordsMatch) {
                    const authData = { 
                        username: user.username,
                        userRole: user.role,
                        idCard: user.idCard,
                        licence: user.licence,
                        id: user.personId 
                    };
                    
                    const token = jwt.sign(authData, keyFile.securekey , { expiresIn: '1h' });
                    
                    res.status(200).json({ userToken: token });
                } else {
                    res.status(401).json({ error: 'Incorrect username or password'});
                } 
            }
        } else {
            res.status(401).json({ error: 'User not found'});
        }
    } catch(error) {
        res.status(500).json({error: error});
    }
}

const fetchUserByUsername = (username) => {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
};

const comparePasswords = (password, hashedPassword) => {
    return bcrypt.compare(password, hashedPassword);
};