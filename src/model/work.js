const {DataTypes} = require('sequelize');
//const Connection = require('../config/db_connection')


const Works = Connection.define('work', {
    workimage: {
        type: DataTypes.STRING,
    },
    workname:{
        type: DataTypes.CHAR
    },
    workstatus: {
        type: DataTypes.CHAR
    },
    workdetails: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: 'work'
})

module.exports = Works;