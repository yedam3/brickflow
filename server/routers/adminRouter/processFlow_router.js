const express = require("express");
const router = express.Router();
const processFlowService = require("../../services/adminService/processFlow_service.js");

// 공정흐름도 관리
//1.제품 조회
router.get('/processflow', async (req, res) => {
    let fProdList = await processFlowService.flowProd();
    res.send(fProdList);
});


//2. 공정 조회
router.get('/processflow/:prodno', async (req, res) => {
    let procNo = req.params.prodno;
    let procInfo = await processFlowService.findProc(procNo);
    res.send(procInfo);
});
//. 공정 전체 조회
router.get('/processAll',async(req,res) => {
    let list = await processFlowService.allProc()
                     .catch((err) => console.log(err));
    res.send(list);
})

//3. 공정 저장 - 일단 다 삭제
router.delete('/processflow/:procno', async (req, res) => {
    let procNo = req.params.procno;
    let procInfo = await processFlowService.findProc(procNo);
    res.send(procInfo);
});
//3. 공정 저장 - 삭제 후 등록
router.post('/procSave', async(req, res) => {
    let {insertProc,prodFlow} = req.body;
    let result = await processFlowService.saveProc(insertProc,prodFlow);
    res.send(result);
});

module.exports = router;