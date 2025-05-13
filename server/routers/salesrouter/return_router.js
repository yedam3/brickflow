const express = require("express");
const router = express.Router();
const returnService = require("../../services/salesservice/return_service.js");

router.get("/returnOrders/:deliveryCode", async (req, res) => {
  
  const { orders_code } = req.params.orderCode;
  console.log('오더코드',orders_code)
  let orderList = await returnService.findMainretrun(orders_code).catch((err) => console.log(err));
  res.send(orderList);
})


module.exports = router;