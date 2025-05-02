const mariaDB = require("../../db/mapper.js");
const { convertObjToQuery } = require("../../utils/converts.js");
const { convertLikeToQuery } = require("../../utils/converts.js");

//상품검사 대기리스트 조회
const testReadyList = async ({ type, keyword }) => {
  let searchCondition = {};
  let convertedCondition = ''; // 기본값
  if (type && keyword) {
    searchCondition[type] = keyword;
    // selected 배열을 넣어줘야 작동
    const converted = convertLikeToQuery(searchCondition, []); 
    convertedCondition = converted.serchKeyword;
  }
  const result = await mariaDB.query('testReadyList', { searchcondition: convertedCondition })
                                  .catch((err) => console.log(err));
      return result;
}
//검사항목리스트 조회
const testMenuList = async (procCode) => {
  const result = await mariaDB.query('testMenuList',procCode)
  return result;
}
//등록
const testAdd = async (testInfo) => {
  for(let test of testInfo){
    const result = await mariaDB.query('testAdd',)
 }
}
module.exports = {
    testReadyList,
    testMenuList
}