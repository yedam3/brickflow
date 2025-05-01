const express = require("express");
const router = express.Router();
const orderService = require("../../services/workService/orderService.js");


// 생산 지시 코드 자동 증가
router.get("/orderAutoCode", async (req, res) => {
    let product_order_code = await orderService.getOrder_code().catch((err) => console.error(err));
    res.send(product_order_code);
});

// 자재 계산
router.get("/matReqQty/:plan_code", async (req, res) => {
    let plan_code = req.params.plan_code;
    let result = await orderService.findMatReqByPlan_code(plan_code).catch((err) => console.error(err));
    res.send(result);
});

// 생산 지시 목록 조회
router.get("/list", async (req, res) => {
    let list = await orderService.findAllPlanOrder().catch((err) => console.error(err));
    res.send(list);
});

// 생산 지시 상세 조회
router.get("/detailList", async (req, res) => {
    let detailList = await orderService.findAllPlanOrderDetail().catch((err) => {
        console.error(err);
    })
    res.send(detailList);
});

// 생산 지시 상태 확인
router.get("/findStatusByPlan_code/:plan_code", async (req, res) => {
    let plan_code = req.params.plan_code;
    let result = await orderService.findStatusByPlan_code(plan_code).catch((err) => console.error(err));
    res.send(result);
});

module.exports = router;