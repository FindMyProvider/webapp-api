const express = require('express');
const router = express.Router();

//---
const scrapController = require('../controllers/scrapController');


router.post('/remoteCmd', scrapController.remoteCmd)


module.exports = router;