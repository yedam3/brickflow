// work_rtouers.js
const express = require("express");
const router = express.Router();

const plan = require('../workRouter/plan_router.js');
const order = require('../workRouter/order_router.js');

router.use('/plan', plan);
router.use('/order', order);

module.exports = router;