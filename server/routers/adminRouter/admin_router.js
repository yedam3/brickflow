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


// 공정흐름도 관리
//1.제품 조회
router.get('/processflow', async (req, res) => {
    let fProdList = await adminService.findProd();
    res.send(fProdList);
});


//2. 공정 조회
router.get('/processflow/:prodno', async (req, res) => {
    let procNo = req.params.prodno;
    let procInfo = await adminService.findProc(procNo);
    res.send(procInfo);
});

//3. 공정 저장 - 일단 다 삭제
router.delete('/processflow/:procno', async (req, res) => {
    let procNo = req.params.procno;
    let procInfo = await adminService.findProc(procNo);
    res.send(procInfo);
});
//3. 공정 저장 - 삭제 후 등록
router.post('/procsave', async(req, res) => {
    let {insertproc} = req.body;
    let result = await adminService.saveProc(insertproc);
    res.send(result);
});


//제품검수관리
router.get('/prodcheck', async (req, res) => {
    let pcprodList = await adminService.prodcList();
    res.send(pcprodList);
});
module.exports = router;