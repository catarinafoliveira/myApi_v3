// Express setup
var express = require('express');
var app = express();

// MongoDB Connection
var mongoose = require('mongoose');
mongoose.set('strictQuery', true);
mongoose.connect('mongodb+srv://usertest:pwdtest@cluster0.bryvmhq.mongodb.net/tutorialnode');

// Use JSON in request body
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Run app in port 8080
var port = 8080;
app.listen(port);
console.log("App running in port " + port);

// Enable CORS for all routes
const cors = require('cors');
app.use(cors()); 

// Authentication Routes
var AuthenticationRoutes=require('./routes/authenticationRoutes');
app.use('/api/auth', AuthenticationRoutes);

// API Routes
var PersonRoutes = require('./routes/personRoutes');
app.use('/api/persons',PersonRoutes);
var DriverRoutes = require('./routes/driverRoutes');
app.use('/api/drivers',DriverRoutes);
var CarRoutes = require('./routes/carRoutes');
app.use('/api/cars',CarRoutes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.status(404).json({ message: 'Resource not found' });
});