const express = require('express') // import the express framework package
const route = express.Router() //import the router from rxpress
const productsController = require('../controllers/productsController')



route.get('/AllProducts', productsController.allProducts);


route.get('/api/v1/product/edit/:id', productsController.editProduct)


route.post('/productDetails', productsController.addProducts)


route.delete('/DelectItem/:id', productsController.deleteProduct)


route.put('/api/v1/updateProduct', productsController.updateProduct )


module.exports = route //export the routes

