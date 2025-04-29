const mariaDB = require("../../db/mapper.js");
const { convertObjToAry } = require("../../utils/converts.js");

//BOM관리
// 1. 제품조회
const findProd = async ()=>{
  let list = await mariaDB.query('prodList');
  return list;
}

module.exports = {
  findProd,

}