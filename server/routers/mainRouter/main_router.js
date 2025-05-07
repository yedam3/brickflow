const express = require("express");
const router = express.Router();
const matCheckService = require("../../services/mainService/mainService.js");

router.get('/count',async(req,res) => {
    let list = await matCheckService.countList()
                                   .catch((err) => console.log(err));
    res.send(list);
}) ;

router.get('/lineChart',async(req,res) => {
    let list = await matCheckService.lineChart()
                                     .catch((err) => console.log(err));
    res.send(list);                                     
})
router.get('/barChart',async(reqm,res)=> {
    let list= await matCheckService.barChart()
                                    .catch((err) => console.log(err));
    res.send(list);
})
router.get('/pieChart',async(reqm,res)=> {
    let list= await matCheckService.pieChart()
                                    .catch((err) => console.log(err));
    res.send(list);
})
router.get('/popChart',async(reqm,res)=> {
    let list= await matCheckService.popChart()
                                    .catch((err) => console.log(err));
    res.send(list);
})
module.exports = router;
