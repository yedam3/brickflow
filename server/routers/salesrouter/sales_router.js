const express = require("express");
const router = express.Router();
const salesService = require("../../services/salesservice/sales_service.js");

// axios module
//업체리스트
router.get("/comList", async (req, res) => {
    //쿼리 스트링 형식으로 받기
    const { type, keyword } = req.query; // comList?type=값&keyword=값
    let comList = await salesService.comList({type,keyword})
                                      .catch((err)=> console.log(err));
    res.send(comList);
});

//메인 디스플

//단건조회
router.get('/detail', async (req, res) => {
    const { orders_code } = req.query;
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
router.put('salesOrderModify', async (req, res) => {
    const { salesOrder } = req.body;
    let result = await salesService.modifyoders(salesOrder)
                                   .catch((err) => console.log(err));
    res.send(result);
})

//삭제
router.delete('/salesOrderDelete', async (req, res) => {
    let orders_code = req.params.orders_code;
    let resInfo = await salesService.removeorder(orders_code)
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