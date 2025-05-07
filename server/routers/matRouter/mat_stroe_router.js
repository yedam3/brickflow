const express = require("express");
const router = express.Router();
const matStoreService = require("../../services/matService/mat_store_service.js");

router.get('/storeReadyList',async(req,res)=> {
  const {type,keyword} = req.query;
  let readyList = await matStoreService.storeReadyList({type,keyword})
                                       .catch((err) => console.log(err));
  res.send(readyList);
})

//LOT 자동증가
router.get('/matLotAuto',async(req,res) => {
  let result = await matStoreService.matAuto()
                                    .catch((err) => console.log(err));
  res.send(result);
})
//창고리스트
router.get('/storeList',async(req,res) => {
  let result = await matStoreService.storeList()
                                    .catch((err) => console.log(err));
  res.send(result);
})
//등록건 카운트
router.get('/storeCount/:sc',async(req,res)=> {
  let matLOt = req.params.sc;
  let result = await matStoreService.countCheck(matLOt)
                                    .catch((err)=> console.log(err));
  res.send(result)
})
//등록
router.post('/storeAdd',async(req,res) => {
  let info = req.body;
  let result = await matStoreService.storeAdd(info)
                                    .catch((err) => console.log(err));
  res.send(result);
})
//수정
router.put('/storeUpdate',async(req,res)=>{
  let info= req.body;
  let result = await matStoreService.storeUpdate(info)
                                    .catch((err) => console.log(err));
  res.send(result)
})
//입고 리스트 모달
router.get("/storeListModal", async (req, res) => {
    //쿼리 스트링 형식으로 받기
        const { type, keyword } = req.query;
        let matOrderList = await matStoreService.storageList({type,keyword})
                                          .catch((err)=> console.log(err));
        res.send(matOrderList);
});

//삭제
router.delete("/storeDelete/:mlt",async(req,res)=>{
  let matLot = req.params.mlt;
  let result = await matStoreService.deleteSore(matLot)
                                    .catch((err) => console.log(err));
  res.send(result);
})
//사용여부
router.get("/matUseCheck/:mit",async(req,res)=>{
  let matLot = req.params.mit
  let result = await matStoreService.matUseCheck(matLot)
                                     .catch((err) => console.log(err));
  res.send(result);
})

//자재재고 조회
router.get('/matStorepage',async(req,res) => {
  const {type,keyword} =req.query;
  let list = await matStoreService.matStoreList({type,keyword})
                                       .catch((err) => console.log(err));
  res.send(list);
})
//자재 LOT 조회
router.get('/matLotList/:matCode' ,async(req,res) => {
  const matCode= req.params.matCode;
  let list = await matStoreService.matLotList(matCode)
                                .catch((err) => console.log(err));
   res.send(list);
})
module.exports = router;