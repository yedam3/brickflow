const express = require("express");
const router = express.Router();
const planService = require("../../services/workService/planService.js");

// plan_code 증가 값
router.get("/planAutoCode", async (req, res) => {
    let plan_code = await planService.getPlan_code().catch((err) => console.log(err));
    res.send(plan_code);
})

// 주문 목록 조회
router.get("/orderList", async (req, res) => {
    const { type, keyword } = req.query;
    let orderList = await planService.findAllOrders(type, keyword).catch((err) => console.log(err));
    res.send(orderList);
});

// 주문 상세 조회 및 plan 그리드
router.get("/plan", async (req, res) => {
    let orders_code = req.query.orders_code;
    let orderDetailList = await planService.findByOrders_code(orders_code).catch((err) => console.log(err));
    res.send(orderDetailList);
});

// 상산 계획 목록 조회
router.get("/planList", async (req, res) => {
    const { type, keyword } = req.query;
    let planList = await planService.findAllPlan(type, keyword).catch((err) => console.error(err));
    res.send(planList);
});

// 생산 계획 상세 목록 조회
router.get("/planDetailList/:plan_code", async (req, res) => {
    let plan_code = req.params.plan_code;
    let planDetailList = await planService.findPlanDetailByPlan_code(plan_code).catch((err) => console.error(err));
    res.send(planDetailList);
});

// 생산 번호 체크
router.get("/plan_codeCheck/:plan_code", async (req, res) => {
    let plan_code = req.params.plan_code;
    let result = await planService.existsByPlan_code(plan_code).catch((err) => console.error(err));
    res.send(result);
});

// 주문 상태 확인
router.get("/order_statusCheck/:orders_code", async (req, res) => {
    let orders_code = req.params.orders_code;
    let result = await planService.findOrder_statusByOrders_code(orders_code).catch((err) => console.error(err));
    res.send(result);
});

// 계획 등록
router.post("/plan", async (req, res) => {
    let { planData, planDetailData } = req.body;
    let result = await planService.insertPlan(planData, planDetailData).catch((err) => console.error(err));
    res.send(result);
});

// 생산 계획 수정
router.put("/plan", async (req, res) => {
    let { planData, planDetailData } = req.body;
    let result = await planService.updatePlanByPlan_code(planData, planDetailData).catch((err) => console.error(err));
    res.send(result);
});

// 생산 계획 삭제
router.delete("/plan", async (req, res) => {
    let { plan_code, orders_code } = req.body;
    let result = await planService.deletePlanByPlan_code(plan_code, orders_code).catch((err) => console.error(err));
    res.send(result);
});

// 제품 검색
router.get("/prodList", async (req, res) => {
    const { type, keyword } = req.query;
    let prodList = await planService.findAllProd(type, keyword).catch((err) => console.error(err));
    res.send(prodList);
});

// 주문 상태 조회
router.get("/ordersStatus/:orders_code", async (req, res) => {
    const orders_code = req.params.orders_code;
    let result = await planService.findOrdersFinish_statusByOrders_code(orders_code).catch((err) => console.error(err));
    res.send(result);
});

module.exports = router;