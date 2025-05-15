const express = require("express");
const router = express.Router();
const companyService = require("../../services/adminService/company_service.js");

//목록조회
router.get('/company', async (req, res) => {
  let comList = await companyService.comList()
                                    .catch((err) => console.log(err)); 
  res.send(comList);        
                      
});
//업체리스트
router.get('/comTypeList', async (req, res) => {
  let result = await companyService.comCodeList()
                                    .catch((err) => console.log(err)); 
  res.send(result);
});

//상세조회
router.get('/company/:comno', async (req, res) => {
  let comNo = req.params.comno;
  let comInfo = await companyService.comInfo(comNo)
                                    .catch((err) => console.log(err));
  res.send(comInfo);
});

//등록
router.post('/comSave', async (req, res) => {
  let comInfo = req.body;
  let result = await companyService.comSave(comInfo)
                                   .catch((err) => console.log(err)); 
  res.send(result);
  
});

//수정
router.put('/comUpdate', async (req, res) => {
  let comInfo = req.body;
  let result = await companyService.comUpdate(comInfo)
                                   .catch((err) => console.log(err)); 
  res.send(result);
});

//삭제
router.delete('/comDelete/:comCode', async(req,res) => {
  let comCode = req.params.comCode;
  let result = await companyService.comDelete(comCode)
                                   .catch((err) => console.log(err)); 
  res.send(result);
});


module.exports = router;