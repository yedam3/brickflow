const express = require("express");
const router = express.Router();
const prodTestService = require("../../services/prodTestService/prodTest_service.js");

//검사 대기 리스트 조회
router.get('/storeReadyList',async(req,res)=> {
  let {type,keyword} = req.query;
  let readyList = await prodTestService.testReadyList({type,keyword})
                                       .catch((err) => console.log(err));
  res.send(readyList);
})
//검사항목 조회
router.get('/testMenu/:proc',async(req,res) => {
  let proc = req.params.proc;
  let list = await prodTestService.testMenuList(proc) 
                                  .catch((err) =>  console.log(err));
  res.send(list);
});
//등록
router.post('/addTest',async(req,res)=>{
  let testInfo = req.body;
  let result = await prodTestService.testAdd(testInfo)
                                    .catch((err) => console.log(err));
  res.send(result);
})
module.exports = router;