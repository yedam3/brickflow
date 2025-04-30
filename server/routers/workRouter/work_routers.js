// work_rtouers.js
const express = require("express");
const router = express.Router();

const work = require('../workRouter/work_router.js');
const order = require('../workRouter/order_router.js');

router.use('/plan', work);
router.use('/order', order);

module.exports = router;