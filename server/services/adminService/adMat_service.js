const { result } = require("lodash");
const mariaDB = require("../../db/mapper.js");
const { convertObjToAry } = require("../../utils/converts.js");
const { comList } = require("../../db/sqlList.js");

//자재코드
const autoMatCode = async () => {
  return mariaDB.query("autoCountMatCode")
    .then(([rows]) => rows) // rows: [{ mat_code: "MAT-101" }]
    .catch(err => {
      console.log("autoMatCode 쿼리 오류:", err);
      return []; // 오류 발생 시 빈 배열 반환
    });
};


//자재조회
const findAll = async ()=>{
  let list = await mariaDB.query('selectMat');
  return list;
}

//자재 등록
const addMat = async (matCode)=> {
  let insertColumns = ['mat_code', 'mat_name', 'unit', 'size', 'color', 'texture', 'shape', 'safe_inventory'];
  let data = convertObjToAry(matCode, insertColumns);
  let resInfo = await mariaDB.query("addMat", data).catch(err => console.log(err));

  return resInfo;
}

//자재 수정
const updateMat = async (matInfo) => {
  let upMat = [matInfo, matInfo.mat_code];
  let result = await mariaDB.query('updateMat', upMat).catch((err) => console.log(err));
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