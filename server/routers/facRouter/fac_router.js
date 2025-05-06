const express = require("express");
const router = express.Router();
const facService = require("../../services/facService/fac_service.js");


//자동증가
router.get("/autoUnCode", async (req, res) => {
    let autoUnCode = await facService.autoUnCode().catch((err)=> console.log(err));
    res.send(autoUnCode);
})

router.get("/addFac", async (req, res) => {
    const { type, keyword } = req.query;
    let facList = await facService.findAll({ type, keyword }).catch(err => console.log(err));
    res.send(facList);
});

//비가동설비 리스트
router.get("/unFacList", async (req, res)=> {
    const { type, keyword } = req.query;
    let unplayList = await facService.unplayAll({type, keyword}).catch(err => console.log(err));

    res.send(unplayList);
})

//비가동 등록
router.post("/addUnFac", async (req,res)=>{
    const {unplayFac} = req.body;
    console.log("asdfasdf", unplayFac);
    let result = await facService.addUnFac(unplayFac).catch(err => console.log(err));
    res.send(result);
})

//비가동설비 수정
router.put("/modifyUnplay", async(req, res)=>{
    const {unplayFac} = req.body;
    let result = await facService.modifyUnplay(unplayFac).catch((err) => console.log(err));
    res.send(result);
})

//값 체크
router.get('/unFacCheck', async (req, res)=> {
    const {unplayCode} = req.query;
    let list = await facService.unFacCheck(unplayCode).catch((err)=> console.log(err));
    res.send(list);
})

//비가동 설비 삭제
router.delete('/delUnplay/:ucd', async(req,res)=>{
    let unplayCode = req.params.ucd;
    let result = await facService.deleteUnplay(unplayCode)
    res.send(result);
})

//설비 모달리스트
router.get('/facModal', async (req, res) => {
    const {facCode}= req.query;
    let list = await facService.facModal(facCode).catch((err) => console.log(err));
    res.send(list);
})

//설비 리스트
router.get ('/facList', async (req, res)=>{
    const { type, keyword }= req.query;
    let list = await facService.facList({ type, keyword }).catch((err)=> console.log(err));
    res.send(list);
})

router.get('/facStatus', async (req, res)=>{
    const { facCode} = req.query;
    let list = await facService.statuFac(facCode).catch((err) => console.log(err));
    res.send(list);
})




module.exports = router;