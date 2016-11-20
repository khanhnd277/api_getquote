var Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
    var Vehicle = sequelize.define('vehicle', {
        vehicleid: {
            type: Sequelize.STRING,
            primaryKey: true
        },
        registrationno: Sequelize.STRING,
        makecode: Sequelize.STRING,
        chassisno: Sequelize.STRING,
        engineno: Sequelize.STRING,
        yearmake: Sequelize.STRING,
        enginecapacity: Sequelize.STRING,
        parkedlocation: Sequelize.STRING,
    }, {
        timestamps: false,
        // define the table's name
        // freezeTableName: true,
        indexes: [
            // Create a unique index on email
            {
                unique: true,
                fields: ['registrationno']
            }
        ]
    });
    return Vehicle;
}