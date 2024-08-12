const {DataTypes} = require('sequelize');
//const Connection = require('../config/db_connection')


const Products = Connection.define('Product', {
    productImage: {
        type: DataTypes.STRING,
    },
    productname:{
        type: DataTypes.CHAR
    },
    productPrice:{
        type: DataTypes.CHAR
    },
    productStatus: {
        type: DataTypes.CHAR
    },
    productDescription: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    productUrl: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: 'products_abe'
})

module.exports = Products;