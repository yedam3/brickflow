const mariaDB = require("../../db/mapper.js");
const { convertObjToQuery } = require("../../utils/converts.js");
const { convertLikeToQuery } = require("../../utils/converts.js");

//완제품대기리스트 조회
const storeReadyList = async ({ type, keyword }) => {
  let searchCondition = {};
  let convertedCondition = ''; // 기본값
  if (type && keyword) {
    searchCondition[type] = keyword;
    // selected 배열을 넣어줘야 작동
    const converted = convertLikeToQuery(searchCondition, []); 
    convertedCondition = converted.serchKeyword;
  }
  const result = await mariaDB.query('possilbleList', { searchcondition: convertedCondition })
                                  .catch((err) => console.log(err));
      return result;
}
//제품 LOT 자동증가
const matAuto = async () => {
  const result =await mariaDB.query('autoMatLot');
  return result[0];
}
//창고리스트
const storeList = async () => {
  const result =await mariaDB.query('storeList');
  return result;
}
//카운트체크
const countCheck = async (matLOt) => {
  const result = await mariaDB.query('countCheck',matLOt)
  return result[0]; 
}

//등록
const storeAdd = async (matLot) => {
  let conn;
  let result;

  try{
    conn = await mariaDB.getConnection();
    await conn.beginTransaction();
    //입고등록
    let selectQuery = mariaDB.selectedQuery("addSMattore",[matLot.emp_code,
                                                          matLot.mat_code,
                                                          matLot.store_quantity,
                                                          matLot.note,
                                                          matLot.check_code
                                                          ])
    result = await conn.query(selectQuery,[matLot.emp_code,
                                          matLot.mat_code,
                                          matLot.store_quantity,
                                          matLot.note,
                                          matLot.check_code
                                          ]);
    //창고등록
    selectQuery = mariaDB.selectedQuery("addStore",[matLot.mat_lot,
                                                    matLot.mat_code,
                                                    matLot.mat_lot,
                                                    matLot.store_quantity,
                                                    matLot.storage_code
                                                    ])
   result = await conn.query(selectQuery,[matLot.mat_lot,
                                          matLot.mat_code,
                                          matLot.mat_lot,
                                          matLot.store_quantity,
                                          matLot.storage_code
                                          ])
    await conn.commit();
  }catch(err) {
    if (conn) await conn.rollback();
    return result.affectedRows=0;
  }finally{
    if(conn) conn.release();
  }
  return result;
}
//수정
const storeUpdate = async (matLot)=> {
  let conn;
  let result;
  try{
    conn = await mariaDB.getConnection();
    await conn.beginTransaction();
    //입고 수정
    let selectedQuery = mariaDB.selectedQuery("updateMatStore",[matLot.emp_code,
                                                                matLot.mat_code,
                                                                matLot.store_quantity,
                                                                matLot.note,
                                                                matLot.mat_lot
                                                                  ])
    result = await conn.query(selectedQuery,[matLot.emp_code,
                                            matLot.mat_code,
                                            matLot.store_quantity,
                                            matLot.note,
                                            matLot.mat_lot
                                              ])
    //창고 수정
      selectedQuery  = mariaDB.selectedQuery("updateStore",[matLot.mat_code,
                                                                matLot.mat_lot,
                                                                matLot.store_quantity,
                                                                matLot.storage_code,
                                                                matLot.mat_lot
                                                                  ])
  result = await conn.query(selectedQuery,[matLot.mat_code,
                                            matLot.mat_lot,
                                            matLot.store_quantity,
                                            matLot.storage_code,
                                            matLot.mat_lot
                                              ])
  await conn.commit();
  }catch(err) {
    if (conn) await conn.rollback();
    return result.affectedRows=0;
  }finally{
    if(conn) conn.release();
  }
  return result;
}
//창고 리스트
const storageList = async ({ type, keyword })=>{
   let searchCondition = {};
    let convertedCondition = ''; // 기본값
    if (type && keyword) {
      searchCondition[type] = keyword;
      // selected 배열을 넣어줘야 작동
      const converted = convertLikeToQuery(searchCondition, []); 
      convertedCondition = converted.serchKeyword;
    }
    const result = await mariaDB.query('storageList', { searchcondition: convertedCondition })
                                    .catch((err) => console.log(err));
        return result;
}

//삭제
const deleteSore = async(matLot) => {
  let result = await mariaDB.query('storeDelete',matLot)
                            .catch((err) => console.log(err))
  result = await mariaDB.query('storageDelete',matLot)
                        .catch((err) => console.log(err))
  return result;
}

//자재사용여부
const matUseCheck = async(matLot) => {
  let result = await mariaDB.query('matUseCheck',matLot)
                           .catch((err) => console.log(err));
  return result;
}
module.exports={
  storeReadyList,
  matAuto,
  storeList,
  countCheck,
  storeAdd,
  storeUpdate,
  storageList,
  deleteSore,
  matUseCheck
}