const express = require("express");
const router = express.Router();
const ProdService = require("../../services/adminService/prod_service.js");
const { result } = require("lodash");

router.get("/autoProdCode", async (req, res) => {
  let autoProdCode = await ProdService.autoProdCode().catch((err) => console.log(err));
  res.send(autoProdCode);
})

//제품조회
router.get('/Prod', async (req, res) => {
  let prodList = await ProdService.findAllProd();
  res.send(prodList);
})


//제품등록
router.post('/prodinput', async (req, res) => {
  const rowData  = req.body;
  let result = await ProdService.prodAdd(rowData).catch((err) => console.log(err));
  res.send(result);
})

//제품수정
router.put('/updateProd', async (req, res) => {
  const { prod } = req.body;
  let result = await ProdService.updateProdNum(prod).catch((err) => console.log(err));
  res.send(result);
})

//제품삭제
router.delete('/resetProd/:ProdCode', async (req, res) => {
  let ProdCode = req.params.ProdCode;
  let result = await ProdService.deleteProdreset(ProdCode)
  res.send(result);
})


//값체크
router.get('/prodCheck/:prodCode',async (req,res)=>{
    const prodCode = req.params.prodCode;
    let list = await ProdService.prodCheck(prodCode)
        .catch((err) => console.log(err));
    res.send(list);
})


module.exports = router;