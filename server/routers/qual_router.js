const express = require("express");
const router = express.Router();
const qualService = require("../services/qual_service.js");

router.get("/", async (req, res) => {
    res.send("");
});

module.exports = router;