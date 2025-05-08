const express = require("express");
const router = express.Router();
const deliveryService = require("../../services/salesservice/delivery_service.js");

// // 주문 목록 조회 (요구량 포함)
// router.get('/orderList', async (req, res) => {
//   const orderList = await orderService.getOrders(); // 이 안에서 demand 포함된 데이터 가져옴
//   res.send(orderList);
// });

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
router.put('/delivery')


//값체크
router.post('/deliveryCheck', async (req, res) => {
    const {deliveryCode} = req.body;
    let list = await deliveryService.deliveryCheck(deliveryCode)
                               .catch((err)=> console.log(err));
    res.send(list);
})

//삭제
router.delete('/deliveryDelete/:delivery_code', async (req, res) => {
    let deliverycode = req.params.delivery_code;
    let resInfo = await deliveryService.removeorder(deliverycode)
    res.send(resInfo);
});


module.exports = router;