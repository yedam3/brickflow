const mariaDB = require("../../db/mapper.js");
const { convertObjToQuery } = require("../../utils/converts.js");
const { convertLikeToQuery } = require("../../utils/converts.js");
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
//창고리스트
const storeList = async () => {
  const result =await mariaDB.query('storeProdList')
                      .catch((err) => console.log(err));
  return result;
}
//등록
const finishAdd = async (finishedInfo) => {
  let conn;
  let result;
  try{
    conn = await mariaDB.getConnection();
    await conn.beginTransaction();
    //최고값 조회
    let maxLot = await mariaDB.query('maxProdLot')
                        .catch((err) => console.log(err));
    maxLot = maxLot[0].code;
    console.log(finishedInfo.code)
    //입고등록
    let selectQuery = await mariaDB.selectedQuery('addFinshied',[finishedInfo.prod_code,finishedInfo.quantity,finishedInfo.store_date,finishedInfo.emp_code,finishedInfo.prod_check_code])

    result = await conn.query(selectQuery,[finishedInfo.prod_code,finishedInfo.quantity,finishedInfo.store_date,finishedInfo.emp_code,finishedInfo.prod_check_code])

    //창고 등록
    selectQuery = await  mariaDB.selectedQuery('storeFinished',[maxLot,finishedInfo.prod_code,maxLot,finishedInfo.quantity,finishedInfo.storage_code]);

    result = await conn.query(selectQuery,[maxLot,finishedInfo.prod_code,maxLot,finishedInfo.quantity,finishedInfo.storage_code])

    await conn.commit();
  }
  catch{
    if (conn) await conn.rollback();
    return result;
  }finally{
    if(conn) conn.release();
  }
  return result;
}

//값체크
const countCheck = async(checkCode) => {
  let result = await mariaDB.query('finishCheck',[checkCode,checkCode,checkCode])
                              .catch((err) => console.log(err))
  return result
}

//완제품 입고 항목 조회
const finishList = async() => {
  let result = await mariaDB.query('finishList')
                              .catch((err) => console.log(err))
  return result;
}
//제고 가능 수량 조회
const possibleQuantity = async(prodcode,quantity,checkCode) => {

  let result = await mariaDB.query('possibleProdQuantity',[quantity,prodcode,checkCode])
                            .catch((err) => console.log(err))
  return result ; 
}

//수정
const finishUpdate = async (finishInfo) => {
  let conn;
  let result;

  try{
    conn = await mariaDB.getConnection();
    await conn.beginTransaction();
     //수정
     let selectQuery =await mariaDB.selectedQuery('finishUpdate',[finishInfo.quantity,finishInfo.prod_lot])
     result = await conn.query(selectQuery,[finishInfo.quantity,finishInfo.prod_lot])
                        .catch((err) => console.log(err));
     //창고수정
     let selectedQuery = await mariaDB.selectedQuery('finishStoreUpdate',[finishInfo.quantity,finishInfo.storage_code,finishInfo.prod_lot])
     result = await conn.query(selectedQuery,[finishInfo.quantity,finishInfo.storage_code,finishInfo.prod_lot])
                                        .catch((err) => console.log(err));
        await conn.commit();                
  }catch{
    if (conn) await conn.rollback();
    return result;
  }finally{
    if(conn) conn.release();
  }
  return result;
}
//출거건 있는지확인
 const deliveryCount = async(prodLot,quantity) => {
  let checkCount = (await mariaDB.query('storeFinishiCheck', prodLot))[0].checkCount
                                 
  console.log(checkCount)
  result = null;
  if (checkCount > 0) {
    
    result = await mariaDB.query('deliveryFinishCheck', [quantity,prodLot])
                          .catch((err) => console.log(err))
    console.log(result)
    return result
  }
  result = [{ count: 1 }]
  return result
} 
//삭제시 출고건 있는지 확인
const deleteCount = async(prodLot) => {
  let result = await mariaDB.query('deleteFinishCheck',prodLot)
                           .catch((err) => console.log(err))
  return result                           
}
 //삭제
 const deleteFinish = async(prodLot) => {
  let result = await mariaDB.query('deleteFinish',prodLot)
                            .catch((err) => console.log(err))
  result = await mariaDB.query('deleteStore',prodLot)
                          .catch((err) => console.log(err));
  return result;
 }
 //재고 조회
 const prodList = async({type,keyword}) => {
  let searchCondition = {};
    let convertedCondition = ''; // 기본값
    if (type && keyword) {
      searchCondition[type] = keyword;
      // selected 배열을 넣어줘야 작동
      const converted = convertLikeToQuery(searchCondition, []); 
      convertedCondition = converted.serchKeyword;
    }
    const result = await mariaDB.query('prodStoreList', { searchcondition: convertedCondition })
                                    .catch((err) => console.log(err));
        return result;
 }
//LOT별 재고 조회
const prodLotList = async(prodCode) => {
  const result = await mariaDB.query('prodLotList',prodCode)
                              .catch((err) => console.log(err));
  return result;
}
module.exports={
  storageList,
  storeList,
  finishAdd,
  countCheck,
  finishList,
  possibleQuantity,
  finishUpdate,
  deliveryCount,
  deleteFinish,
  prodList,
  prodLotList,
  deleteCount
}