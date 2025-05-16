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
router.post("/addMat", async (req, res) => {
  const matData = req.body; // 클라이언트에서 보내는 자재 정보

  if (!matData || !matData.mat_code) {
    console.error("유효하지 않은 mat_code:", matData);
    return res.status(400).send("mat_code가 필요합니다.");
  }

  let reuslt = await adMatService.addMat(matData).catch((err) => console.log(err));
  res.send(reuslt);
})

//자재 수정
router.put('/updateMat', async (req, res) => {
  const {mat} = req.body;
  let result = await adMatService.updateMat(mat).catch((err) => console.log(err));
  res.send(result);
})

//자재삭제
router.delete('/delMat/:mcd', async (req, res) => {
  let matCode = req.params.mcd;
  let result = await adMatService.delMat(matCode)
  res.send(result);
})

module.exports = router;