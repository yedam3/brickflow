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
router.get('/facList', async (req, res) => {
    let list = await processService.findAllFac().catch((err) => console.error(err));
    res.send(list);
})

module.exports = router;