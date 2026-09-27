const express = require('express');
const router = express.Router();
const apiController = require('../controllers/apiController');

// GET request to /api/hello
router.get('/hello', apiController.getHello);

// POST request to /api/data
router.post('/data', apiController.postData);

module.exports = router;
