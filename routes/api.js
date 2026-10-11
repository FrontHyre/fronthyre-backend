const express = require('express');
const router = express.Router();
const apiController = require('../controllers/apiController');
const professionalsRoutes = require('./professionals');

router.get('/hello', apiController.getHello);
router.post('/data', apiController.postData);

router.use('/v1/professionals', professionalsRoutes);

module.exports = router;
