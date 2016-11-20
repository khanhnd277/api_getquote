// BASE SETUP
// =============================================================================

// call the packages we need
var express = require('express'); // call express
var app = express(); // define our app using express
var bodyParser = require('body-parser');
var morgan = require('morgan');
var CryptoJS = require('crypto-js');

var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

// db config
// var env = "dev";
var env = "home";
var config = require('./config.json')[env];
var password = config.password ? config.password : null;

var Sequelize = require('sequelize');
var sequelize = new Sequelize(config.database, config.user, password, {
    host: config.host,
    dialect: config.driver,

    pool: {
        max: 5,
        min: 0,
        idle: 10000
    },

});

//Test connection 
sequelize
    .authenticate()
    .then(function(err) {
        console.log('Connection has been established successfully.');
    })
    .catch(function(err) {
        console.log('Unable to connect to the database:', err);
    });

// Declare all model and relationship
var Vehicle = sequelize.import('./app/model/vehicle');
var Motorinvoice = sequelize.import('./app/model/motorinvoice');
var Antitheftfeature = sequelize.import('./app/model/antitheftfeature');
var Safetyfeature = sequelize.import('./app/model/safetyfeature');
var Insurer = sequelize.import('./app/model/insurer');


Vehicle.hasOne(Motorinvoice, { foreignKey: 'vehicleid' });
Motorinvoice.belongsTo(Antitheftfeature, { foreignKey: 'antitheftfeaturecode' });
Motorinvoice.belongsTo(Safetyfeature, { foreignKey: 'safetyfeaturecode' });
Motorinvoice.belongsTo(Insurer, { foreignKey: 'insurercode' });

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = config.port || 8080; // set our port
app.set('superSecret', config.signature); // secret variable

// use morgan to log requests to the console
app.use(morgan('dev'));



// ROUTES FOR OUR API
// =============================================================================
var router = express.Router(); // get an instance of the express Router

// CORS for development environment
if (env === 'home' || env === 'dev') {
    router.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });
}


// middleware to use for all requests
router.use(function(req, res, next) {
    // // do logging
    // console.log('Something is happening.');
    // next(); // make sure we go to the next routes and don't stop here

    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['auth_token'];
    token = token.substring(config.enc.jwt_prefix.length + 1);
    // decode token
    if (token) {
        // verifies secret and checks exp
        try {
            var decoded = jwt.verify(token, config.signature);
            req.decoded = decoded;
            next();
        } catch (err) {
            return res.json({ success: false, message: 'Failed to authenticate token.' });
        }
    } else {
        // if there is no token
        // return an error
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });

    }
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});

// more routes for our API will happen here

// on routes that end in /vehicles/:vehicle_id
// ----------------------------------------------------
router.route('/vehicles/:regno')

// get the vehicle with that id (accessed at GET http://localhost:8080/api/vehicles/:vehicle_id)
.get(function(req, res) {
    Vehicle.findAll({
        where: { registrationno: req.params.regno },
        order: [
            ['registrationno', 'DESC']
        ],
        include: [{
            model: Motorinvoice,
            include: [{
                model: Antitheftfeature
            }, {
                model: Safetyfeature
            }, {
                model: Insurer
            }]
        }]
    }).then(function(vehicle) {
        if (vehicle) {
            res.json(vehicle);
        } else {
            res.send(401, "Vehicle not found");
        }
    }, function(error) {
        console.log(error);
        res.send("Vehicle not found");
    });
})

// update the vehicle with this id (accessed at PUT http://localhost:8080/api/vehicles/:vehicle_id)
.put(function(req, res) {
    var vehicle = Vehicle.build();

    vehicle.vehiclename = req.body.vehiclename;
    vehicle.password = req.body.password;

    vehicle.updateById(req.params.vehicle_id, function(success) {
        console.log(success);
        if (success) {
            res.json({ message: 'Vehicle updated!' });
        } else {
            res.send(401, "Vehicle not found");
        }
    }, function(error) {
        res.send("Vehicle not found");
    });
})

// delete the vehicle with this id (accessed at DELETE http://localhost:8080/api/vehicles/:vehicle_id)
.delete(function(req, res) {
    var vehicle = Vehicle.build();

    vehicle.removeById(req.params.vehicle_id, function(vehicles) {
        if (vehicles) {
            res.json({ message: 'Vehicle removed!' });
        } else {
            res.send(401, "Vehicle not found");
        }
    }, function(error) {
        res.send("Vehicle not found");
    });
});






// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);