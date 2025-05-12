const express = require("express");
const router = express.Router();
const prodCheckService = require("../../services/qualService/prodCheck_service.js");

//제품검수관리
//1. 제품검수 목록 조회
router.get('/prodcheck', async (req, res) => {
    let findProd = await prodCheckService.prodList();
    res.send(findProd);
});

//2. 제품검수 저장
router.post('/prodchecksave', async(req, res)=>{
    let {insertProdCheck,insertErrorCheck} = req.body;
    let result = await prodCheckService.saveProdCheck(insertProdCheck,insertErrorCheck);
    res.send(result);
});

module.exports = router;
    