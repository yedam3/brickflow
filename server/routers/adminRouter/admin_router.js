const express = require("express");
const router = express.Router();
const adminService = require("../../services/adminService/admin_service.js");

//BOM관리
//1.제품 조회
router.get('/bom', async (req, res) => {
    let prodList = await adminService.findProd();
    res.send(prodList);
});

module.exports = router;