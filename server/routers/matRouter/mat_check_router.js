const express = require("express");
const router = express.Router();
const matCheckService = require("../../services/matService/mat_check_service.js");


//발주 항목 보기
router.get("/checkList", async (req, res) => {
    //쿼리 스트링 형식으로 받기
        const { type, keyword } = req.query;
        let matOrderList = await matCheckService.checkOrderList({type,keyword})
                                          .catch((err)=> console.log(err));
        res.send(matOrderList);
});

module.exports = router;
