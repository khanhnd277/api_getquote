var Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
    var Insurer = sequelize.define('insurer', {
        code: {
            type: Sequelize.STRING,
            primaryKey: true
        },
        name: Sequelize.STRING
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
    return Insurer;
}