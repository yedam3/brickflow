const mariaDB = require("../../db/mapper.js");
const { updateUnplay } = require("../../db/sqls/fac/fac.js");
const { convertObjToAry } = require("../../utils/converts.js");

// 자동 matcode 증가
const autoUnCode = async() => {
  let list = await mariaDB.query("autoUnCode").catch((err) => console.log(err));
  return list;
}


const findAll = async (facCode)=>{
  let list = await mariaDB.query("selectFacList", facCode);
  return list;
}

//비가동설비조회
const unplayAll = async (unplayCode) => {
  let list = await mariaDB.query("unplayList", unplayCode);
  return list;
}

//비가동설비 등록
const addUnFac = async (unplayFac)=> {
  let insertColumns = ['unplay_code', 'unplay_reason_code','employee_code','unplay_start_date','unplay_end_date','note','fac_code'];
  let data = convertObjToAry(unplayFac, insertColumns);
  console.log("asd", data);
  let resInfo = await mariaDB.query("addNoFac", data).catch(err => console.log(err));

  return resInfo;
}
//비가동 설비 수정
const modifyUnplay = async (unplayInfo)=> {
  let updatefac = [unplayInfo, unplayInfo.unplay_code]
  let result = await mariaDB.query('updateUnplay', updateUnplay).catch((err)=> console.log(err))
  if(result.affectedRows < 1){
    return result;
  }
  return result;
}

//값 중복확인
const unFacCheck = async (unplayCode) => {
  console.log(unplayCode);
  let list = await mariaDB.query('facCheck', unplayCode)
  return list;
}

//비가동 설비 삭제
const deleteUnplay = async(unplayCode) =>{
  let result = await mariaDB.query('delUnplay', unplayCode).catch((err)=> console.log(err))
  if (result.affectedRows < 1) {
    return result;
  }
  return result;
}

const reason = async() =>{
  let list = await mariaDB.query("reasonFac");
  return list
}

module.exports = {
  autoUnCode,
  findAll,
  unplayAll,
  addUnFac,
  modifyUnplay,
  unFacCheck,
  deleteUnplay,
  reason,
}