const express = require("express");
const router = express.Router();
const facService = require("../services/fac_service.js");

router.get("/", async (req, res) => {
    res.send("");
});

module.exports = router;