const express = require("express");
const router = express.Router();
const matStoreService = require("../../services/matService/mat_store_service.js");

router.get('/storeReadyList',async(req,res)=> {
  const {type,keyword} = req.query;
  let readyList = await matStoreService.storeReadyList({type,keyword})
                                       .catch((err) => console.log(err));
  res.send(readyList);
})

module.exports = router;