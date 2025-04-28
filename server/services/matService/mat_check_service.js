const mariaDB = require("../../db/mapper.js");
const { convertObjToQuery } = require("../../utils/converts.js");
const { convertLikeToQuery } = require("../../utils/converts.js");

//검수대기리스트 조회
const checkOrderList = async ({ type, keyword }) => {
  let searchCondition = {};
  let convertedCondition = ''; // 기본값
  if (type && keyword) {
    searchCondition[type] = keyword;
    // selected 배열을 넣어줘야 작동
    const converted = convertLikeToQuery(searchCondition, []); 
    convertedCondition = converted.serchKeyword;
  }
  const result = await mariaDB.query('matOrderCheckList', { searchcondition: convertedCondition })
                                  .catch((err) => console.log(err));
      return result;
}
//체크하면 기검수 미검수 조회
const checkRender = async(matDetailCode) => {
   const result = await mariaDB.query('matCheckRender',matDetailCode)
                                .catch((err)=> console.log(err));
      return result[0];
}
//통과인 자재 등록
 const successCheckAdd = async (matCheck) => {
  let result = null
  if(matCheck.error_check_ary.length < 1){
  result = await mariaDB.query('successCheckAdd',[matCheck.mat_code,
                                                      matCheck.check_quantity,
                                                      matCheck.check_history,
                                                      matCheck.check_quantity,
                                                      matCheck.mat_order_detailCode])
                              .catch((err)=> console.log(err));
  }else{
    result = await mariaDB.query('errCheckAdd', [matCheck.mat_code,
                                                     matCheck.check_quantity,
                                                     matCheck.check_history,
                                                     matCheck.check_quantity,
                                                     matCheck.mat_order_detailCode])
      .catch((err) => console.log(err))
      for(let error_check of matCheck.error_check_ary){
        result = await mariaDB.query('errorReason',error_check)
      }
  }
  return result;
 }
module.exports={
  checkOrderList,
  checkRender,
  successCheckAdd
}