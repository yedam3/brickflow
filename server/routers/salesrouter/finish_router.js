const express = require("express");
const router = express.Router();
const finishStore = require("../../services/salesservice/finishstore_service.js");


//창고리스트
router.get('/storeList',async(req,res) => {
  let result = await finishStore.storeList()
                                    .catch((err) => console.log(err));
  res.send(result);
})
//등록
router.post('/addFinished',async(req,res) => {
   let finishInfo = req.body;
   console.log(finishInfo)
   let result = await finishStore.finishAdd(finishInfo)
                                 .catch((err) => console.log(err));
  res.send(result);
})

//체크
router.get('/checkCount/:checkCode',async(req,res) => {
  let checkCode = req.params.checkCode;
  let result = await finishStore.countCheck(checkCode)
                               .catch((err) => console.log(err));
    res.send(result);
})
//입고 항목 조회
router.get('/finishedList',async(req,res) => {
  let result = await finishStore.finishList()
                                 .catch((err) => console.log(err));
  res.send(result)                              
})

//입고가능 수량 조회
router.get('/possibleQuantity/:prodCode/:quantity' ,async(req,res) => {
  let prodCode = req.params.prodCode;
  let quantity = req.params.quantity;
  let result = await finishStore.possibleQuantity(prodCode,quantity)
                                .catch((err) => console.log(err));
  res.send(result);
})
//수정
router.put('/finishUpdate',async(req,res) => {
  let finishInfo = req.body;
  let result = await finishStore.finishUpdate(finishInfo)
                                .catch((err) => console.log(err));
  res.send(result);
})
module.exports = router;