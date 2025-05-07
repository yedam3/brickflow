const express = require("express");
const router = express.Router();
//const salesService = require("../../services/salesservice/sales_service.js");

//업체리스트
router.get("/comList", async (req, res) => {
    //쿼리 스트링 형식으로 받기 => 선택값
    const { type, keyword } = req.query; // comList?type=값&keyword=값
    let comList = await deliveryService.comList({type,keyword})
                                      .catch((err)=> console.log(err));
    res.send(comList);
});

router.get('/deliveryAutoCode', async (req, res) => {
  const result = await deliveryService.getAutoDeliveryCode();
  res.send(result);
});

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

//삭제
router.delete('/deliveryDelete/:delivery_code', async (req, res) => {
    let deliverycode = req.params.delivery_code;
    let resInfo = await deliveryService.removeorder(deliverycode)
    res.send(resInfo);
});


module.exports = router;