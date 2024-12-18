const {DataTypes} = require('sequelize');
const Connection = require('../config/db_connection')


const Products = Connection.define('Product', {
    productimage: {
        type: DataTypes.STRING,
    },
    productname:{
        type: DataTypes.CHAR
    },
    productprice:{
        type: DataTypes.CHAR
    },
    productstatus: {
        type: DataTypes.CHAR
    },
    productdescription: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    producturl: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: 'products_abe'
})

module.exports = Products;