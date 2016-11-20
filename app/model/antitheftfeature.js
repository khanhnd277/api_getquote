var Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
    var Antitheftfeature = sequelize.define('antitheftfeature', {
        code: {
            type: Sequelize.STRING,
            primaryKey: true
        },
        description: Sequelize.STRING
    }, {
        timestamps: false,
        // define the table's name
        // freezeTableName: true,
        indexes: [
            // Create a unique index on email
            {
                unique: true,
                fields: ['code']
            }
        ]
    });
    return Antitheftfeature;
}