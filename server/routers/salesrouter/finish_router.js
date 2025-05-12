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
module.exports = router;