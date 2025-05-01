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
  let addColumn = ['mat_code', 'prod_code', 'quantity'];
  let addBom = convertObjToAry(bomInfo,addColumn);
  
  // bom code 추가
  // bom code 자동 생성 SELEC문 조회
  let resList = await mariaDB.query('autoBomCode');
  // 그결과를 newBomCode라는 변수에 담고
  let newBomCode = resList[0].BOM_code;
  // addBom에 첫번째 값으로 추가
  addBom.unshift(newBomCode);

  let result = await mariaDB.query('bomInsert', addBom);
  return result;
}


module.exports = {
  findProd,
  findBom,
  insertBom
}