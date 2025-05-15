const { result } = require("lodash");
const mariaDB = require("../../db/mapper.js");
const { convertObjToAry } = require("../../utils/converts.js");
const { comList } = require("../../db/sqlList.js");

//자재코드
const autoMatCode = async()=>{
  let list = await mariaDB.query("autoCountMatCode").catch((err) => console.log(err));
  return list;
}

//자재조회
const findAll = async ()=>{
  let list = await mariaDB.query('selectMat');
  return list;
}

//자재 등록
const addMat = async (matCode)=> {
  let insertColumns = ['mat_code', 'mat_name', 'unit', 'size', 'color', 'texture', 'shape', 'safe_inventory'];
  let data = convertObjToAry(matCode,insertColumns);
  let resInfo = await mariaDB.query("addMat", data).catch(err => console.log(err));

  return resInfo;
}

//자재 수정
const updateMat = async (matCode) => {
  let result = await mariaDB.query('updateMat', matCode).catch((err) => console.log(err));
  return result;
}

//자재삭제
const delMat = async (matCode) => {
  let result = await mariaDB.query('delMat', matCode).catch((err) => console.log(err))
  if (result.affectedRows < 1) {
    return result;
  }
  return result;
}

module.exports ={
  addMat,
  findAll,
  autoMatCode,
  updateMat,
  delMat,
}