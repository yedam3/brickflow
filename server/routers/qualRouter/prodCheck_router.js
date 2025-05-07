const express = require("express");
const router = express.Router();
const prodCheckService = require("../../services/qualService/prodCheck_service.js");

//제품검수관리
router.get('/prodcheck', async (req, res) => {
    let pcprodList = await prodCheckService.prodcList();
    res.send(pcprodList);
});
module.exports = router;

