const express = require("express");
const router = express.Router();
const matService = require("../../services/matService/mat_service.js");

router.get("/autoMatCode", async (req, res) => {
    let autoMatCode = await matService.autoMatCode()
                                      .catch((err)=> console.log(err));
    res.send(autoMatCode);
});

router.get("/matList", async (req, res) => {
    let matList = await matService.matList()
                                      .catch((err)=> console.log(err));
    res.send(matList);
});

module.exports = router;
