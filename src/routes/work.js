const express = require('express')
const route = express.Router()
const workController = require('../controllers/workController')

route.get('/Allworks', workController.allWorks);

route.get('/api/v1/work/edit/:id', workController.editWork)

route.post('/workdetails', workController.addWorks)

route.delete('/DelectWork/:id', workController.deleteWork)

route.put('/api/v1/update', workController.updateWork)


module.exports = route