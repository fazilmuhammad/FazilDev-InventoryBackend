const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

router.get('/stocks/excel', reportController.exportToExcel);
router.get('/stocks/pdf', reportController.exportToPDF);

module.exports = router;
