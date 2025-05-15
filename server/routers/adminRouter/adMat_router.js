const express = require("express");
const router = express.Router();
const adMatService = require("../../services/adminService/adMat_service.js");

//자재코드
router.get("/autoMatCode", async (req,res) => {
  let autoMatCode = await adMatService.autoMatCode().catch((err) => console.log(err));
  res.send(autoMatCode);
})
//자재 조회
router.get('/mat', async (req, res) => {
  let matList = await adMatService.findAll();
  res.send(matList);
});

//자재등록
router.post("/mat", async (req, res) => {
  const {matCode} = req.body;
  let result = await adMatService.addMat(matCode).catch(err => console.log(err));
  res.send(result);
})

//자재 수정
router.put('/updateMat', async (req, res) => {
  let result = await adMatService.updateMat().catch((err) => console.log(err));
  res.send(result);
})

//자재삭제
router.delete('/delMat/:mcd', async (req, res) => {
  let matCode = req.params.mcd;
  let result = await adMatService.delMat(matCode)
  res.send(result);
})

module.exports = router;