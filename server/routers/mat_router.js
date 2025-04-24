const express = require("express");
const router = express.Router();
const matService = require("../services/mat_service.js");

router.get("/", async (req, res) => {
    res.send("");
});

module.exports = router;
//가가
