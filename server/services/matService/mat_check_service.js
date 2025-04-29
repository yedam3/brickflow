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
 const successCheckAdd = async (check,error) => {
  let result = null
  let errExist= false;
  for(let errCheck of error){
    if(errCheck.check == true){
      errExist = true;
    }
  }
  console.log('에러'+errExist)
  if(!errExist){
  result = await mariaDB.query('successCheckAdd',[check.mat_code,
                                                      check.check_quantity,
                                                      check.check_history,
                                                      check.check_quantity,
                                                      check.mat_order_detailCode])
                              .catch((err)=> console.log(err));
  } else {
    result = await mariaDB.query('errCheckAdd', [check.mat_code,
        check.check_quantity,
        check.check_history,
        check.check_quantity,
        check.mat_order_detailCode
      ])
      .catch((err) => console.log(err))
      //비사유 코드 추가
  
    for (let value of error) {
      if(value.check == true){
      result = await mariaDB.query('errorReason', [value.mat_error_name,
                                                   value.mat_check_error,
                                                   value.mat_error_code
      ])
    }
   }
  }
  //상태값 확인
  let statusCheck = await mariaDB.query('statusCheck',[check.mat_order_code,
                                                   check.mat_order_code,
                                                   check.mat_order_code,
                                                   check.mat_order_code])
                            .catch((err)=> console.log(err));
  //상태값변경
  result = await mariaDB.query('statusUpdate',[statusCheck[0].status,check.mat_order_code])
                                     .catch((err)=> console.log(err));
  return result;
 }
module.exports={
  checkOrderList,
  checkRender,
  successCheckAdd
}