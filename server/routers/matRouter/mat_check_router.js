const express = require("express");
const router = express.Router();
const matCheckService = require("../../services/matService/mat_check_service.js");


//검수 대기 항목 보기
router.get("/checkList", async (req, res) => {
    //쿼리 스트링 형식으로 받기
        const { type, keyword } = req.query;
        let matOrderList = await matCheckService.checkOrderList({type,keyword})
                                          .catch((err)=> console.log(err));
        res.send(matOrderList);
});
//발주상세코드 통해 미검수 기검수 랜더링
router.get("/checkList/:mcd",async(req,res)=>{
    let matDeatailCode  = req.params.mcd;
    let list = await matCheckService.checkRender(matDeatailCode)
                                    .catch((err)=> console.log(err));
    res.send(list);
})
//합격인 자제 검수 등록
router.post('/successAdd',async(req,res)=>{
    const {check,error} = req.body;
    let result = await matCheckService.successCheckAdd(check,error)
                               .catch((err)=> console.log(err));
    res.send(result);
})
//검수 결과 항목 보기
router.get("/checkResultList", async (req, res) => {
    //쿼리 스트링 형식으로 받기
        const { type, keyword } = req.query;
        let matOrderList = await matCheckService.checkReusltList({type,keyword})
                                          .catch((err)=> console.log(err));
        res.send(matOrderList);
});

//검수불량수량확인
router.get("/errorList/:mcd",async(req,res)=>{
    let matDeatailCode  = req.params.mcd;
    let list = await matCheckService.matErrorQuantity(matDeatailCode)
                                    .catch((err)=> console.log(err));
    res.send(list);
})
//검수수정
router.put('/checkUpdate',async(req,res)=>{
    const {check,error} = req.body;
     let result = await matCheckService.checkUpdate(check,error)
                                        .catch((err) =>console.log(err));
    res.send(result)                            
})
//값중복확인
router.get('/testCheck/:checkCode',async(req,res)=>{
    let check = req.params.checkCode;
    let list = await matCheckService.addUpdateCheck(check);
    res.send(list);
})
//값중복확인
router.get('/finExist/:checkCode',async(req,res)=>{
    let check = req.params.checkCode;
    let list = await matCheckService.updateFinished(check);
    res.send(list);
})

//값 삭제
router.delete('/checkDelete/:check',async(req,res)=>{
    let checkCode = req.params.check;
    let {matOrderCode} = req.query;
    console.log('라우터'+matOrderCode)
    let result = await matCheckService.deleteChekc(checkCode,matOrderCode)
    res.send(result);
})

module.exports = router;
