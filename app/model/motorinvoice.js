var Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
    var Motorinvoice = sequelize.define('motorinvoice', {
        motordetailid: {
            type: Sequelize.STRING,
            primaryKey: true
        },
        vehicleid: Sequelize.STRING,
        insurercode: Sequelize.STRING,
        safetyfeaturecode: Sequelize.STRING,
        antitheftfeaturecode: Sequelize.STRING,
    }, {
        timestamps: false,
        // define the table's name
        // freezeTableName: true,
        indexes: [
            // Create a unique index on email
            {
                unique: false,
                fields: ['vehicleid']
            }
        ]
    });
    return Motorinvoice;
}