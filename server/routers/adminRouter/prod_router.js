const express = require("express");
const router = express.Router();
const ProdService = require("../../services/adminService/prod_service.js");

//제품등록
router.post('/prodinput', async (req, res) => {
  const rowData  = req.body;
  let result = await ProdService.prodAdd(rowData).catch((err) => console.log(err));
  res.send(result);
})

module.exports = router;