const express = require("express");
const router = express.Router();
const matService = require("../../services/matService/mat_service.js");


//MatCode 자동증가
router.get("/autoMatCode", async (req, res) => {
    let autoMatCode = await matService.autoMatCode()
                                      .catch((err)=> console.log(err));
    res.send(autoMatCode);
});

//자재리스트
router.get("/matList", async (req, res) => {
    //쿼리 스트링 형식으로 받기
    const { type, keyword } = req.query;
    let matList = await matService.matList({type,keyword})
                                      .catch((err)=> console.log(err));
    res.send(matList);
});

//업체리스트
router.get("/comList", async (req, res) => {
    //쿼리 스트링 형식으로 받기
    const { type, keyword } = req.query;
    let comList = await matService.comList({type,keyword})
                                      .catch((err)=> console.log(err));
    res.send(comList);
});


//발주등록
router.post('/matOrderAdd',async(req,res)=>{
    const { matOrder, matOrderDetail } = req.body;
    let result = await matService.matOrderAdd(matOrder,matOrderDetail);
    res.send(result)
})

//발주리스트
router.get("/orderList", async (req, res) => {
    //쿼리 스트링 형식으로 받기
    const { type, keyword } = req.query;
    let comList = await matService.orderList({type,keyword})
                                      .catch((err)=> console.log(err));
    res.send(comList);
});
//메인그리드 Render
router.get("/render", async (req, res) => {
    //쿼리 스트링 형식으로 받기
    const { orderCode } = req.query;
    let list = await matService.orderRender(orderCode)
                                      .catch((err)=> console.log(err));
    res.send(list);
});
//상세그리드 Render
router.get("/detailRender", async (req, res) => {
    //쿼리 스트링 형식으로 받기
    const { orderCode } = req.query;
    let list = await matService.orderDetailRender(orderCode)
                                      .catch((err)=> console.log(err));
    res.send(list);
});
//값체크
router.get('/orderCheck',async (req,res)=>{
    const {orderCode} = req.query;
    let list= await matService.orderCheck(orderCode)
                               .catch((err)=> console.log(err));
    res.send(list);
})
//발주 수정
router.put('/modify',async(req,res)=>{
    const {matOrder,matOrderDetail} = req.body;
    let result = await matService.modifyOrder(matOrder,matOrderDetail)
                                 .catch((err)=> console.log(err));
    res.send(result);
})
//발주 삭제
router.delete('/delete/:ocd',async(req,res)=>{
    let orderCdoe = req.params.ocd;
    let result = await matService.deleteOrder(orderCdoe)
    res.send(result);
})
module.exports = router;
