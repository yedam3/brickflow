const { forEach } = require("lodash");
const mariaDB = require("../../db/mapper.js");
const { convertObjToAry } = require("../../utils/converts.js");
const { retry } = require("rxjs");

//제품검수관리
//1. 제품조회
const  prodcList = async () => {
  let list = await mariaDB.query('pcprodList');
  return list;
}

module.exports 
= {
  prodcList,
}