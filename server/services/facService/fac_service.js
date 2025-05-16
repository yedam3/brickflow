const { keyword } = require("color-convert");
const mariaDB = require("../../db/mapper.js");
const { updateUnplay } = require("../../db/sqls/fac/fac.js");
const { dateFormat,convertObjToAry } = require("../../utils/converts.js");

// 자동 matcode 증가
const autoUnCode = async() => {
  let list = await mariaDB.query("autoUnCode").catch((err) => console.log(err));
  return list;
}

const autoReCode = async()=> {
  let list = await mariaDB.query("autoReCode").catch((err) => console.log(err));
  return list;
}

const autoFacCode = async()=>{
  let list = await mariaDB.query("autoFacCode").catch((err) => console.log(err));
  return list;
}

//설비모달창
const facList = async ({type, keyword})=>{
  let searchCondition ={};
  let convertedCondition = '';

  if (type && keyword) {
    searchCondition[type] = keyword;
    const converted = convertObjToAry(searchCondition, []);
    convertedCondition = converted.searchKeyword;
  }

  const result = await mariaDB.query('selectFacList', { searchCondition: convertedCondition}).catch((err) => console.log(err));
  return result;
}

//비가동설비조회
const unplayAll = async (unplayCode) => {
  let list = await mariaDB.query("unplayList", unplayCode);
  return list;
}

//설비조회
const facListAll = async (facCode) => {
  let list = await mariaDB.query("selectFacList", facCode);
  return list;

}

//설비상태확인
const statuFac = async ({type, keyword}) => {
  let searchCondition ={};
  let convertedCondition = '';

  if (type && keyword) {
    searchCondition[type] = keyword;
    const converted = convertObjToAry(searchCondition, []);
    convertedCondition = converted.searchKeyword;
  }

  const result = await mariaDB.query('selectFacList', { searchCondition: convertedCondition}).catch((err) => console.log(err));
  return result;
}

//비가동설비 등록
const addUnFac = async (unplayFac)=> {
  let insertColumns = ['unplay_code', 'employee_code','unplay_start_date','unplay_end_date','note','fac_code', 'unplay_reason_code'];
  let data = convertObjToAry(unplayFac, insertColumns);
  let resInfo = await mariaDB.query("addNoFac", data).catch(err => console.log(err));

  return resInfo;
}
//설비등록
const addFac = async (facCode)=> {
  facCode.install_date = dateFormat(facCode.install_date)
  let insertColumns = ['fac_code','model_name','fac_location','employee_code','fac_pattern','install_date','inspection_cycle','image','fac_status'];
  let data = convertObjToAry(facCode, insertColumns);
  let resInfo = await mariaDB.query("addFac", data).catch(err => console.log(err));

  return resInfo;
}
const facService = {
  // 이미지 경로 저장
  saveImagePath: (filePath) => {
    return db.query(facSql.saveImagePath, [filePath]);
  },

  // 또는 이미지 갱신 (fac_code로 업데이트)
  updateImagePath: (filePath, facCode) => {
    return db.query(facSql.updateImagePath, [filePath, facCode]);
  },
}

//수리 처리
const repaireFac = async (repaireFacData) => {
  let result = await mariaDB.query("autoReCode", {});
  const repaireCode = result[0].repaire_code;

  console.log(repaireFacData);
  const param = [
    repaireCode,
    repaireFacData.employee_code,
    repaireFacData.repaire_add_date,
    repaireFacData.repaire_finish_date,
    repaireFacData.fac_code,
    repaireFacData.fac_result,
    repaireFacData.break_status,
    repaireFacData.unplay_code,
    repaireFacData.note,
    repaireFacData.fac_history,
  ];
  console.log(param)
 result = await mariaDB.query("repaireFac", param)
                    .catch((err) => console.log(err));
  return result;
}
//설비수정
const updateFac = async (facInfo) => {
  const { imagePreview, ...data } = facInfo;
  const updateParams = [data, data.fac_code];
  const result = await mariaDB.query('updateFac', updateParams);
  return result;
}
//비가동 설비 수정
const modifyUnplay = async (unplayInfo)=> {
  let updateUnplay = [unplayInfo, unplayInfo.unplay_code]
  let result = await mariaDB.query('updateUnplay', updateUnplay).catch((err)=> console.log(err))
  if(result.affectedRows < 1){
    return result;
  }
  return result;
}
//수리 처리
const updateUnplayEndDate = async ({ unplay_code, unplay_end_date }) => {
  const params = [unplay_end_date, unplay_code];
  const result = await mariaDB.query('updateReFac', params).catch((err) => {
    console.log('updateUnplayEndDate 오류:', err);
    return null; // 실패 시 null 반환
  });
  return result;
}
//가동업뎃
const updateList = async ({ facCode, facStatus }) => {
  const params = [facStatus, facCode]
  const result = await mariaDB.query('updateList', params).catch((err) => console.log(err));
  return result;
}
//값 중복확인
const unFacCheck = async (unplayCode) => {
  console.log(unplayCode);
  let list = await mariaDB.query('facCheck', unplayCode)
  return list;
}
//설비삭제
const delFac = async (facCode) => {
  let result = await mariaDB.query('delFac', facCode).catch((err)=> console.log(err))
  if (result.affectedRows < 1) {
    return result;
  }
  return result;
}
//비가동사유
const reason = async() =>{
  let list = await mariaDB.query('reasonFac');
  return list
}
//수리결과
const facResult = async() => {
  let list = await mariaDB.query('facResult');
  return list
}
//설비상태
const facStatus = async() => {
  let list = await mariaDB.query('facStatus');
  return list
}
//설비유형
const facPattern = async() => {
  let list = await mariaDB.query('facPattern');
  return list
}

//설비 모달
const facModal = async (facCode) => {
  let list = await mariaDB.query('facModal', facCode)
  return list;
}

//비가동설비 수리
const repaireList = async({type, keyword})=>{
  let searchCondition ={};
  let convertedCondition = '';

  if (type && keyword) {
    searchCondition[type] = keyword;
    const converted = convertObjToAry(searchCondition, []);
    convertedCondition = converted.searchKeyword;
  }

  const result = await mariaDB.query('repaireList', { searchCondition: convertedCondition}).catch((err) => console.log(err));
  return result;
}
//수리 목록
const repList = async({type, keyword}) => {
  let searchCondition ={};
  let convertedCondition = '';

  if (type && keyword) {
    searchCondition[type] = keyword;
    const converted = convertObjToAry(searchCondition, []);
    convertedCondition = converted.searchKeyword;
  }

  const result = await mariaDB.query('repList', { searchCondition: convertedCondition}).catch((err) => console.log(err));
  return result;
}

module.exports = {
  autoUnCode,
  autoReCode,
  autoFacCode,
  facList,
  unplayAll,
  addUnFac,
  repaireFac,
  modifyUnplay,
  unFacCheck,
  reason,
  facModal,
  statuFac,
  repaireList,
  facResult,
  repList,
  updateList,
  facStatus,
  facListAll,
  addFac,
  facPattern,
  updateFac,
  updateUnplayEndDate,
  delFac,
  facService,
}