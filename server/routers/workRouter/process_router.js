const express = require("express");
const router = express.Router();
const processService = require("../../services/workService/processService.js");

// 생산 지시 목록 조회
router.get('/productOrderList', async (req, res) => {
    let list = await processService.findAllProduct_order().catch((err) => console.error(err));
    res.send(list);
});

// 사원 목록 조회
router.get('/empList', async (req, res) => {
    let list = await processService.findAllEmployees().catch((err) => console.error(err));
    res.send(list);
});

// 설비 목록 조회
router.get('/facList/:work_lot', async (req, res) => {
    const work_lot = req.params.work_lot;
    let list = await processService.findAllFac(work_lot).catch((err) => console.error(err));
    res.send(list);
});

// 정보 조회
router.get('/select', async (req, res) => {
    let { work_lot, emp_code, fac_code } = req.query;
    let result = await processService.findProcessInfo(work_lot, emp_code, fac_code).catch((err) => console.error(err));
    res.send(result);
});

// 공정 정보 조회
router.get('/workLot/:work_lot', async (req, res) => {
    const work_lot = req.params.work_lot;
    let result = await processService.findWork_processByWork_lot(work_lot).catch((err) => console.error(err));
    res.send(result);
});

// 작업자 정보 조회
router.get('/emp/:emp_code', async (req, res) => {
    const emp_code = req.params.emp_code
    let result = await processService.findEmployeesByEmp_code(emp_code).catch((err) => console.error(err));
    res.send(result);
});

// 설비 정보 조회
router.get('/fac/:fac_code', async (req, res) => {
    const fac_code = req.params.fac_code
    let result = await processService.findFacByFac_code(fac_code).catch((err) => console.error(err));
    res.send(result);
});

// 작업 시작
router.post('/start', async (req, res) => {
    const processStartData = req.body;
    console.log(processStartData)
    let result = await processService.processStart(processStartData).catch((err) => console.error(err));
    res.send(result);
});

// 작업 종료
router.post('/end', async(req, res) => {
    const processEndData = req.body;
    let result = await processService.processEnd(processEndData).catch((err) => console.error(err));
    res.send(result);
});

// 지시 목록 조회
router.get('/planOrderList', async(req, res) => {
    let list = await processService.findAllPlanOrderName().catch((err) => console.error(err));
    res.send(list);
});

// 공정 목록 조회
router.get('/processList', async(req, res) => {
    let list = await processService.findAllProcessName().catch((err) => console.error(err));
    res.send(list);
});

// 제품 목록 조회
router.get('/prodList', async(req, res) => {
    let list = await processService.findAllProdName().catch((err) => console.error(err));
    res.send(list);
});


module.exports = router;