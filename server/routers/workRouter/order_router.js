const express = require("express");
const router = express.Router();
const orderService = require("../../services/workService/orderService.js");


// 생산 지시 코드 자동 증가
router.get("/orderAutoCode", async (req, res) => {
    let product_order_code = await orderService.getOrder_code().catch((err) => console.error(err));
    return product_order_code;
});

// 생산 지시 상태 확인
router.get("/findStatusByPlan_code/:plan_code", async (req, res) => {
    let plan_code = req.params.plan_code;
    let result = await orderService.findStatusByPlan_code(plan_code).catch((err) => console.error(err));
    return result;
});

// 자재 홀드량 계산
router.get("/matHoldQty", async (req, res) => {
    // let plan_code = await workService.getPlan_code().catch((err) => console.error(err));
    // res.send(plan_code);
})


module.exports = router;