const mariaDB = require("../../db/mapper.js");
const { convertObjToAry } = require("../../utils/converts.js");

//BOM관리
// 1. 제품조회
const findProd = async ()=>{
  let list = await mariaDB.query('prodList');
  return list;
}
// 2. BOM조회
const findBom = async (prno)=>{
  let list = await mariaDB.query('bomList',prno);
  return list;
}
// 3. BOM등록
const insertBom = async(bomInfo)=>{
  let addBom = convertAary(bomInfo);
  let result = await mariadb.query('bomInsert', addBom);
  return result;
}


module.exports = {
  findProd,
  findBom,
  insertBom
}