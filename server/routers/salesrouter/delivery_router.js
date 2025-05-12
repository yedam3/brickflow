const express = require("express");
const router = express.Router();
const deliveryService = require("../../services/salesservice/delivery_service.js");

//업체리스트
router.get("/comList", async (req, res) => {
    //쿼리 스트링 형식으로 받기 => 선택값
    const { type, keyword } = req.query; // comList?type=값&keyword=값
    let comList = await salesService.comList({type,keyword})
                                      .catch((err)=> console.log(err));
    res.send(comList);
});


// 제품LOT조건 조회
router.get('/deliveryCheck/:prodCode', async (req, res) => {
  const  prod_code  = req.params.prodCode;
  let result = await deliveryService.prodcheck(prod_code)
  res.send(result);
})

//출고 등록
router.post('/deliveryAdd', async (req, res) => {
  const { delivery, deliveryDetail } = req.body;
  let result = await deliveryService.deliveryAdd(delivery, deliveryDetail);
  res.send(result);
})

//출고 상세 등록
router.post('/deliveryDetail', async (req, res) => {
  const { delivery, deliveryDetail } = req.body;
  let result = await deliveryService.deliveryAdd(delivery, deliveryDetail);
  res.send(result);
})

//수정
router.put('/deliveryModify', async (req, res) => {
  const { delivery,deliveryDetail} = req.body;
  let result = await deliveryService.modifydelivery(delivery, deliveryDetail)
                                    .catch((err) => console.log(err));
  res.send(result);
})

//값체크
router.post('/deliveryCheck', async (req, res) => {
    const {deliveryCode} = req.body;
    let list = await deliveryService.deliveryCheck(deliveryCode)
                               .catch((err)=> console.log(err));
    res.send(list);
})

//삭제
router.delete('/deliveryDelete/:delivery_code', async (req, res) => {
// router.delete('/deliveryDelete', async (req, res) => {
    let deliverycode = req.params.delivery_code;
    let resInfo = await deliveryService.removedelivery(deliverycode)
    res.send(resInfo);
});

//출고 모달창
router.get('/deliveryModal', async (req, res) => {
   const {type,keyword} = req.query; // comList?type=값&keyword=값
   let deliveryList = await deliveryService.deliveryList({type,keyword})
     .catch((err) => console.log(err));
   res.send(deliveryList);
})

router.get('/deldetail/:orders_code/:delivery_code', async (req, res) => { 
  const orderCode = req.params.orders_code;
  const delivery_code = req.params.delivery_code;
  let findOrders = await deliveryService.deliveryDetailRender(orderCode,delivery_code)
    .catch((err) => console.log(err));
  res.send(findOrders);
})


module.exports = router;