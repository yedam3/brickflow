const express = require("express");
const router = express.Router();
const processService = require("../../services/workService/processService.js");

router.get('/productOrderList', async (req, res) => {
    let productOrderList = await processService.findProduct_orderByNotWS3().catch((err) => console.error(err));
    res.send(productOrderList);
});

module.exports = router;