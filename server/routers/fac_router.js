const express = require("express");
const router = express.Router();
const facService = require("../services/fac_service.js");

router.get("/fac", async (req, res) => {
    let facList = await facService.findAll().catch(err => console.log(err));

    res.send(facList);
});


module.exports = router;