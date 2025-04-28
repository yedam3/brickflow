const express = require("express");
const router = express.Router();
const salesService = require("../../services/salesservice/sales_service.js");

router.get("/", async (req, res) => {
    res.send("");
});

module.exports = router;