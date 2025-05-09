const express = require("express");
const router = express.Router();
const salesService = require("../../services/salesservice/sales_service.js");

// axios module
//업체리스트
router.get("/comList", async (req, res) => {
    //쿼리 스트링 형식으로 받기 => 선택값
    const { type, keyword } = req.query; // comList?type=값&keyword=값
    let comList = await salesService.comList({type,keyword})
                                      .catch((err)=> console.log(err));
    res.send(comList);
});

// 주문 목록 조회
router.get("/orders/:orders_code", async (req, res) => { // /orders/ORD-999 or /orders/ORD-1001
    //  경로 안에 :(콜론)으로 선언된 변수는  req.params 에 등록됨 => 필수값
    const { orders_code } =  req.params;
    let orderList = await salesService.findMainOrders(orders_code).catch((err) => console.log(err));
    res.send(orderList);
});

//상세조회
router.get('/detail/:orders_code', async (req, res) => {
    const { orders_code } =  req.params;
    let findorders = await salesService.findorders(orders_code)
        .catch((err) => console.log(err));
    res.send(findorders);
})

//등록
router.post('/salesOrderAdd',async(req,res)=>{
    const { salesOrder, salesOrderDetail } = req.body;
    let result = await salesService.salesOrderAdd(salesOrder, salesOrderDetail);
    res.send(result);
})

//상세등록
router.post('/salesOrderDetailAdd', async (req, res) => {
    const { salesOrder, salesOrderDetail } = req.body;
    let result = await salesService.salesOrderAdd(salesOrder, salesOrderDetail);
    res.send(result);
})

//수정
router.put('/salesOrderModify', async (req, res) => {
    const { order,orderDetail} = req.body;
    let result = await salesService.modifyoders(order, orderDetail)
                                   .catch((err) => console.log(err));
    res.send(result);
})

//삭제
router.delete('/salesOrderDelete/:orders_code', async (req, res) => {
    let orderscode = req.params.orders_code;
    let resInfo = await salesService.removeorder(orderscode)
    res.send(resInfo);
});



//값체크
router.post('/orderCheck',async (req,res)=>{
    const {orderCode} = req.body;
    let list = await salesService.orderCheck(orderCode)
                               .catch((err)=> console.log(err));
    res.send(list);
})





module.exports = router;