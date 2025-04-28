const express = require("express");
const router = express.Router();
const workService = require("../../services/workService/workService.js");

router.get("/orderList", async (req, res) => {
    let orderList = await workService.findAllOrders().catch((err) => console.log(err));
    res.send(orderList);
});

module.exports = router;