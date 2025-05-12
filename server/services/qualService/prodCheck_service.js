const { forEach, result } = require("lodash");
const mariaDB = require("../../db/mapper.js");
const { convertObjToAry } = require("../../utils/converts.js");
const { retry } = require("rxjs");

//제품검수관리
//1. 제품조회
const  prodList = async () => {
  let list = await mariaDB.query('prodCheckList');
  return list;
}

//2. 저장
const saveProdCheck = async(prodchecksave,insertErrorCheck) =>{
  let resList = await mariaDB.query('autoProdCheckCode');
  
  let result = await mariaDB.query('prodCheckSave',[resList[0].prod_check_code,
                                                    prodchecksave[0].prod_code,
                                                    insertErrorCheck[0].pass_quantity,
                                                    insertErrorCheck[0].error_quantity,
                                                    prodchecksave[0].work_lot,
                                                    Number(insertErrorCheck[0].pass_quantity)+Number(insertErrorCheck[0].error_quantity)]);
  
  for(let value of prodchecksave){
    if(value.error_quantity > 0){
       let errList = await mariaDB.query('autoErrorReasonCode');
        result = await mariaDB.query('errorstandardSave',[errList[0].error_reason_code,value.prod_code,value.check_list,resList[0].prod_check_code,value.error_quantity])
    }
}

  return result;
  
}
module.exports
= {
  prodList,
  saveProdCheck,
}