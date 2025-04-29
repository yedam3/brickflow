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


//등록
router.post('/salesOrderAdd',async(req,res)=>{
    const { salesOrder, salesOrderDetail } = req.body;
    let result = await salesService.salesOrderAdd(salesOrder, salesOrderDetail);
    res.send(result)
})

//값체크
router.post('/orderCheck',async (req,res)=>{
    const {orderCode} = req.body;
    let list = await salesService.orderCheck(orderCode)
                               .catch((err)=> console.log(err));
    res.send(list);
})



module.exports = router;