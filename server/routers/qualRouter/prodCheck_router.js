const express = require("express");
const router = express.Router();
const prodCheckService = require("../../services/qualService/prodCheck_service.js");

//제품검수관리
//1.
router.get('/prodcheck', async (req, res) => {
    let findProd = await prodCheckService.prodList();
    res.send(findProd);
});
module.exports = router;
    