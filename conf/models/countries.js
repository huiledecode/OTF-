/**
 * Created by sma on 18/07/16.
 */

/** Modele countries */
module.exports = function(sequelize, DataTypes) {

    var Countries = sequelize.define('countries', {
        _id: {
            type: DataTypes.INTEGER,
            field: '_id', // Will result in an attribute that is firstName when user facing but first_name in the database
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING
        },
        code: {
            type: DataTypes.STRING
        },
        createdAt: {
            type: DataTypes.DATE,
            field: 'created_date'
        }
    }, {
        updatedAt: false,
        deletedAt: false,
        freezeTableName: true // Model tableName will be the same as the model name
    });
    return Countries;
};
