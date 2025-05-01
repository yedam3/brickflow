const express = require("express");
const router = express.Router();
const proceService = require("../../services/proceService/proce_service.js");

router.get("/getMatLotCount/:matLot", async (req, res) => {
    const matLot = req.params.matLot;
    const count = await proceService.getCountByLot(matLot);
    res.send({ count });
  });

module.exports = router;