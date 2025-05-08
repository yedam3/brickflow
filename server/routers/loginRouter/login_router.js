const express = require("express");
const router = express.Router();
const loginService = require("../../services/loginService/login_service.js");

router.post('/login',async (req,res) => {
  const {id,pwd} = req.body;
  const crypto = require('crypto');
  let secret = 'awetawt';
  let encData = crypto.createHmac('sha512',secret)
                      .update(pwd)
                      .digest('base64')
   let result = await loginService.login(id);
   if(result.data[0].empCount ==0){
    res.send({result : 'idIncorrect'});
    return;
  }
  if(result.data[0].pwd!=encData){
    res.send({result : 'pwdIncorrect'});
    return;
  }
  let department = result.data[0].department;
  let empName = result.data[0].empName
  req.session.id = id;
  req.session
  res.send(result);

})

module.exports=router;