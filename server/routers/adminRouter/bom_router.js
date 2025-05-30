const express = require("express");
const router = express.Router();
const bomService = require("../../services/adminService/bom_service.js");

//BOM관리
//1.제품 조회
router.get('/bom', async (req, res) => {
    let prodList = await bomService.findProd();
    res.send(prodList);
});
 
 //2.BOM 조회
 router.get('/bom/:prno', async (req, res) => {
    let bomNo = req.params.prno;
    let bomInfo = await bomService.findBom(bomNo);
    res.send(bomInfo);
});

//3.BOM 저장 - 일단 다 삭제
router.delete('/bom/:bno', async (req, res) => {
    let bomNo = req.params.prno;
    let bomInfo = await bomService.findBom(bomNo);
    res.send(bomInfo);
});


//3.BOM 저장 - 삭제 후 등록
router.post('/bomsave', async(req, res)=>{
    let {insertBom,prodBom} = req.body;
    console.log('라우터',insertBom)
    let result = await bomService.saveBom(insertBom,prodBom);
    res.send(result);
    });

module.exports = router;