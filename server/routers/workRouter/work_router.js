const express = require("express");
const router = express.Router();
const workService = require("../../services/workService/workService.js");

// plan_code 증가 값
router.get("/autoCode", async (req, res) => {
    let plan_code = await workService.getPlan_code().catch((err) => console.error(err));
    res.send(plan_code);
})

// 주문 목록 조회
router.get("/orderList", async (req, res) => {
    let orderList = await workService.findAllOrders().catch((err) => console.error(err));
    res.send(orderList);
});

// 주문 상세 조회 및 plan 그리드
router.get("/plan", async (req, res) => {
    let orders_code = req.query.orders_code;
    let orderDetailList = await workService.findByOrders_code(orders_code).catch((err) => console.error(err));
    res.send(orderDetailList);
});

// 상산 계획 목록 조회
router.get("/planList", async (req, res) => {
    let planList = await workService.findAllPlan().catch((err) => console.error(err));
    res.send(planList);
});

// 생산 계획 상세 목록 조회
router.get("/planDetailList", async (req, res) => {
    let plan_code = req.query.plan_code;
    let planDetailList = await workService.findPlanDetailByPlan_code(plan_code).catch((err) => console.error(err));
    res.send(planDetailList);
});

// 계획 등록
router.post("/plan", async (req, res) => {
    let { planData, planDetailData } = req.body;
    let result = await workService.insertPlan(planData, planDetailData).catch((err) => console.error(err));
    res.send(result);
});

// 생산 계획 수정
router.put("/plan", async (req, res) => {
    let { planData, planDetailData } = req.body;
    let result = await workService.updatePlanByPlan_code(planData, planDetailData).catch((err) => console.error(err));
    res.send(result);
});

// 생산 계획 삭제
router.delete("/plan/:plan_code", async (req, res) => {
    let plan_code = req.params.plan_code;
    let result = await workService.deletePlanByPlan_code(plan_code).catch((err) => console.error(err));
    res.send(result);
});

module.exports = router;