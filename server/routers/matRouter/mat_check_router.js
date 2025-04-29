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

module.exports = router;
