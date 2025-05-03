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
  let conn;
  let result;
  try{
    conn = await mariaDB.getConnection();
    await conn.beginTransaction();
    for(let test of testInfo){
     //기본값 설정
     if(!test.input_quantity){
      test.input_quantity=0;
     }
     if(!test.pass_standard){
      test.pass_standard=0;
     }
     if(!test.test_value){
      test.test_value=0;
     }
    

     //등록 실행
      let selectedQuery =await mariaDB.selectedQuery("testAdd",[test.work_lot,
                                                            test.pass_or_not,
                                                            test.test_item,
                                                            test.test_name,
                                                            test.test_value
          
                                                          ])
      result = await conn.query(selectedQuery,[test.work_lot,
                                                test.pass_or_not,
                                                test.test_item,
                                                test.test_name,
                                                test.test_value])
    }
    //공정 업데이트 프로시저 실행
    let prodQuery = await mariaDB.selectedQuery("workProcessUpdate",[Number(testInfo[0].input_quantity),
                                                                     testInfo[0].work_lot,
                                                                     testInfo[0].product_order_detail_code,
                                                                     testInfo[0].prod_code
                                                                      ])
      result = await conn.query(prodQuery,[Number(testInfo[0].input_quantity),
                                          testInfo[0].work_lot,
                                          testInfo[0].product_order_detail_code,
                                          testInfo[0].prod_code 
      ])
  await conn.commit();
    //
  }catch{
    if (conn) await conn.rollback();
    return result;
  }finally{
    if(conn) conn.release();
  }
  return result;
}
module.exports = {
    testReadyList,
    testMenuList,
    testAdd
}