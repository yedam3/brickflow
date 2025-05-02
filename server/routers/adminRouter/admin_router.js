const express = require("express");
const router = express.Router();
const adminService = require("../../services/adminService/admin_service.js");

//BOM관리
//1.제품 조회
router.get('/bom', async (req, res) => {
    let prodList = await adminService.findProd();
    res.send(prodList);
});
 
 //2.BOM 조회
 router.get('/bom/:prno', async (req, res) => {
    let bomNo = req.params.prno;
    let bomInfo = await adminService.findBom(bomNo);
    res.send(bomInfo);
});

//3.BOM 저장 - 일단 다 삭제
router.delete('/bom/:bno', async (req, res) => {
    let bomNo = req.params.prno;
    let bomInfo = await adminService.findBom(bomNo);
    res.send(bomInfo);
});


//3.BOM 저장 - 삭제 후 등록
router.post('/bomsave', async(req, res)=>{
    let {insertbom} = req.body;
    let result = await adminService.saveBom(insertbom);
    res.send(result);
    });

module.exports = router;