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
  //에러인 상품이 없을시 
  if(!errExist){
    console.log('맷코드'+check.check_history)
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
  //검수내역 조회
  const checkReusltList = async ({ type, keyword }) => {
    let searchCondition = {};
    let convertedCondition = ''; // 기본값
    if (type && keyword) {
      searchCondition[type] = keyword;
      // selected 배열을 넣어줘야 작동
      const converted = convertLikeToQuery(searchCondition, []); 
      convertedCondition = converted.serchKeyword;
    }
    const result = await mariaDB.query('errCheckList', { searchcondition: convertedCondition })
                                    .catch((err) => console.log(err));
        return result;
  }
//체크하면 기검수 미검수 조회
const matErrorQuantity = async(checkcode) => {
  const result = await mariaDB.query('errQuantity',checkcode)
                               .catch((err)=> console.log(err));
     return result;

   
}
//검수 수정
const checkUpdate = async (check,error) => {
  let orderCode = check.mat_order_code;
  //필요없는 컬럼 삭제
  delete check.already_check_quantity;
  delete check.not_check_quantity;
  delete check.mat_name;
  delete check.request_quantity;
  delete check.mat_order_code;
  delete check.emp_code;
  //초기화
  let result = null;
  let errExist= false;
  //에러 값이 있는지 체크
  for(let errCheck of error){
    if(errCheck.check == true){
      errExist = true;
    }
  }
  console.log('에러'+errExist)
  //에러 값이 없으면 등록
  if(!errExist){
  check.mat_check_pass = check.check_quantity;
  check.mat_check_error = 0;
  
     console.log('값')
     console.log(check.check_quantity);
 

  let updateCheck = [check,check.check_code]
  result = await mariaDB.query('checkUpdate',updateCheck)
                              .catch((err)=> console.log(err))
   //불량량 삭제
   result = await mariaDB.query('errorDelete',check.check_code)
   .catch((err) => console.log(err))
  //상태값 합격으로 변환
  result = await mariaDB.query('updateClear',['OG1',check.check_code])
                                .catch((err) => console.log(err));
  }else{
    check.mat_check_pass = 0;
    check.mat_check_error = check.check_quantity;
    let updateCheck = [check,check.check_code]
    result = await mariaDB.query('checkUpdate',updateCheck)
                              .catch((err)=> console.log(err))
    
    //불량량 삭제
    result = await mariaDB.query('errorDelete',check.check_code)
                          .catch((err) => console.log(err))
    //불량량 등록
    for (let value of error) {
      if (value.check == true) {
        result = await mariaDB.query('errorReason', [value.mat_error_name,
                                                    value.mat_check_error,
                                                    value.mat_error_code
                                                  ])
                                      .catch((err) => console.log(err))             
      }
    }
    //상태값 합격으로 변환
    result = await mariaDB.query('updateClear', ['OG2', check.check_code])
      .catch((err) => console.log(err));
  }
  if(result.affectedRows<1){
    return result;
  }
  //상태값 확인
  let statusCheck = await mariaDB.query('statusCheck', [orderCode, orderCode, orderCode, orderCode])
    .catch((err) => console.log(err));
  //상태값변경
  result = await mariaDB.query('statusUpdate', [statusCheck[0].status, orderCode])
    .catch((err) => console.log(err));
  return result;
  
} 

//검수 등록 및 수정 체크
const addUpdateCheck = async(checkCode) =>{
  let list = await mariaDB.query('updateInsertCheck',checkCode);
  return list;
}
const updateFinished = async(checkCode) =>{
  let list = await mariaDB.query('updateFinished',checkCode);
  return list;
}
//삭제
const deleteChekc = async(checkCode,matOrderCode) => {
  let result = await mariaDB.query('deleteCheck',checkCode);
  result = await mariaDB.query('errorDelete',checkCode);
console.log('맷'+matOrderCode)
  //상태값 확인
  let statusCheck = await mariaDB.query('statusCheck', [matOrderCode, matOrderCode, matOrderCode, matOrderCode])
    .catch((err) => console.log(err));
  console.log('값'+statusCheck[0])
  //상태값변경
  result = await mariaDB.query('statusUpdate', [statusCheck[0].status, matOrderCode])
    .catch((err) => console.log(err));
  return result;
}
module.exports={
  checkOrderList,
  checkRender,
  successCheckAdd,
  checkReusltList,
  matErrorQuantity,
  checkUpdate,
  addUpdateCheck,
  updateFinished,
  deleteChekc
}