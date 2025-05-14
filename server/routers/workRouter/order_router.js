const express = require("express");
const router = express.Router();
const orderService = require("../../services/workService/orderService.js");
const { insertInstr } = require("../../db/sqlList.js");


// 생산 지시 코드 자동 증가
router.get("/orderAutoCode", async (req, res) => {
    let product_order_code = await orderService.getOrder_code().catch((err) => console.error(err));
    res.send(product_order_code);
});

// 자재 요구량 조회 (plan_code)
router.get("/matReqQty/:plan_code", async (req, res) => {
    let plan_code = req.params.plan_code;
    let result = await orderService.findMatReqByPlan_code(plan_code).catch((err) => console.error(err));
    res.send(result);
});

// 자재 요구량 조회 (prod_code)
router.get("/matReqQtyByProd_code", async (req, res) => {
    let { prod_code, quantity } = req.query;
    console.log(prod_code);
    console.log(quantity);
    let result = await orderService.findAllMatReqByProd_code(prod_code, quantity).catch((err) => console.error(err));
    res.send(result);
});

// 생산 지시 목록 조회
router.get("/list", async (req, res) => {
    const { type, keyword } = req.query;
    let list = await orderService.findAllPlanOrder(type, keyword).catch((err) => console.error(err));
    res.send(list);
});

// 생산 지시 조회
router.get("/productOrder/:product_order_code", async (req, res) => {
    let product_order_code = req.params.product_order_code;
    let result = await orderService.findAllProductOrderByProduct_order_code(product_order_code).catch((err) => {
        console.error(err);
    })
    res.send(result);
});

// 생산 지시 상세 조회
router.get("/workDetail/:product_order_code", async (req, res) => {
    let product_order_code = req.params.product_order_code;
    let detailList = await orderService.findAllWorkDetailByProduct_order_code(product_order_code).catch((err) => {
        console.error(err);
    })
    res.send(detailList);
});

// 생산 상품 자재 홀드 조회
router.get("/loadMatQty/:product_order_detail_code", async (req, res) => {
    let product_order_detail_code = req.params.product_order_detail_code;
    let matQtyList = await orderService.findAllMatHoldByProduct_order_detail_code(product_order_detail_code).catch((err) => {
        console.error(err);
    });
    res.send(matQtyList);
});

// 생산 상품 자재 LOT 조회
router.get("/loadMat", async (req, res) => {
    let { product_order_detail_code, mat_code } = req.query;
    let matList = await orderService.findAllMat_HoldByProduct_order_detail_codeAndMat_code(product_order_detail_code, mat_code).catch((err) => {
        console.error(err);
    });
    res.send(matList);
});

// 생산 상품 자재 재고 조회
router.get("/matQty", async (req, res) => {
    let { prod_code, mat_code } = req.query;
    let matList = await orderService.findAllProdMatQtyByMat_code(prod_code, mat_code).catch((err) => {
        console.error(err);
    })
    res.send(matList);
});

// 생산 지시 상태 확인
router.get("/orderStatus/:plan_code", async (req, res) => {
    let plan_code = req.params.plan_code;
    let result = await orderService.findStatusByPlan_code(plan_code).catch((err) => console.error(err));
    res.send(result);
});

// 생산 지시 코드 중복 확인
router.get("/orderCheck/:product_order_code", async (req, res) => {
    let product_order_code = req.params.product_order_code;
    let result = await orderService.findProduct_orderByProduct_order_code(product_order_code).catch((err) => console.error(err));
    res.send(result);
});

// 생산 지시 등록
router.post("/insert", async (req, res) => {
    let { orderData, orderDetailDataList, matHoldDataList } = req.body;
    let result = await orderService.insertProduct_order(orderData, orderDetailDataList, matHoldDataList).catch((err) => console.error(err));
    res.send(result);
});

// 생산 지시 수정
router.put("/update", async (req, res) => {
    let {orderData, workDetailList, matHoldDataList} = req.body;
    let result = await orderService.deleteProduct_order(orderData.product_order_code).catch((err) => console.error(err));
    result = await orderService.insertProduct_order(orderData, workDetailList, matHoldDataList).catch((err) => console.error(err));
    res.send(result);
});

// 생산 지시 삭제
router.delete("/delete/:product_order_code", async (req, res) => {
    let product_order_code = req.params.product_order_code;
    let result = await orderService.deleteProduct_order(product_order_code).catch((err) => console.error(err));
    res.send(result);
});

router.get("/productOrderStatus/:product_order_code", async (req, res) => {

});

module.exports = router;