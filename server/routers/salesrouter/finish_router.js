const express = require("express");
const router = express.Router();
const matStoreService = require("../../services/matService/mat_store_service.js");


//창고리스트
router.get('/storeList',async(req,res) => {
  let result = await matStoreService.storeList()
                                    .catch((err) => console.log(err));
  res.send(result);
})

module.exports = router;