const express = require('express');
const router = express.Router();
const empService = require('../services/agTest_service.js');


router.get('/agTest',async(req,res)=>{
    let empList = await empService.findAll()
                      .catch((err) => console.log(err));
    res.send(empList);
})


module.exports=router;