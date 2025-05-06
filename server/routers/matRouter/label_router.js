const express = require("express");
const router = express.Router();
const label_service = require("../../services/matService/label_service.js");

router.get('/labelList',async(req,res)=>{
    //쿼리 스트링 형식으로 받기
    const { type, keyword } = req.query;
    let matOrderList = await label_service.labeList({ type, keyword })
        .catch((err) => console.log(err));
    res.send(matOrderList);
})

module.exports=router;