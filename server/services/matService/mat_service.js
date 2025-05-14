const mariaDB = require("../../db/mapper.js");
const { convertObjToQuery } = require("../../utils/converts.js");
const { convertLikeToQuery } = require("../../utils/converts.js");

// 자동 matCode 증가
const autoMatCode = async () => {
  let list = await mariaDB.query("autoMatCode").catch((err) => console.log(err));
  return list;
};

// 자재 항목 리스트 조회
const matList = async ({ type, keyword }) => {
  let searchCondition = {};
  let convertedCondition = ''; // 기본값

  if (type && keyword) {
    searchCondition[type] = keyword;
    // selected 배열을 넣어줘야 작동
    const converted = convertLikeToQuery(searchCondition, []); 
    convertedCondition = converted.serchKeyword;
  }

  const result = await mariaDB.query('matList', { searchcondition: convertedCondition })
                              .catch((err) => console.log(err));
  return result;
};

// 자재 항목 리스트 조회
const comList = async ({ type, keyword }) => {
  let searchCondition = {};
  let convertedCondition = ''; // 기본값

  if (type && keyword) {
    searchCondition[type] = keyword;
    // selected 배열을 넣어줘야 작동
    const converted = convertLikeToQuery(searchCondition, []); 
    convertedCondition = converted.serchKeyword;
  }

  const result = await mariaDB.query('comList', { searchcondition: convertedCondition })
                              .catch((err) => console.log(err));
  return result;
};
//자재 발주 등록
const matOrderAdd = async(matOrder,matOrderDetail) =>{
   let result = await mariaDB.query('addMatOrder',[matOrder.mat_order_name,
                                                   matOrder.company_code,
                                                   matOrder.request_date,
                                                   matOrder.emp_code,
                                                   matOrder.note,
                                                   matOrder.delivery_date,
                                                  ]) 
                            .catch((err)=>console.log(err));
   if(result.affectedRows<1){
      return result;
   }
   for(let detail of matOrderDetail){
    result = await mariaDB.query('addMatDetail',[detail.mat_code,
                                                detail.request_quantity,
                                                detail.mat_order_code,
                                              ])
                          .catch((err)=>console.log(err));
   }
   return result;
}


// 발주 항목 리스트 조회
const orderList = async ({ type, keyword }) => {
  let searchCondition = {};
  let convertedCondition = ''; // 기본값

  if (type && keyword) {
    searchCondition[type] = keyword;
    // selected 배열을 넣어줘야 작동
    const converted = convertLikeToQuery(searchCondition, []); 
    convertedCondition = converted.serchKeyword;
  }

  const result = await mariaDB.query('matOrderList', { searchcondition: convertedCondition })
                              .catch((err) => console.log(err));
  return result;
};

//주문 조회 Render
const orderRender = async (orderCode) => {
  let list = await mariaDB.query('orderRender',orderCode)
  return list;
}
//주문 상세 조회 Render
const orderDetailRender = async (orderCode) => {
  let list = await mariaDB.query('orderDetailRender',orderCode)
  return list;
}
//값중복확인
const orderCheck = async (orderCode) => {
  let list = await mariaDB.query('matAddCheck',orderCode)
  return list;
}

//발주수정
const modifyOrder = async (orderInfo,detailInfo) =>{
  
  let result = await mariaDB.query('updateOrder',[orderInfo.company_code,
                                                  orderInfo.emp_code,
                                                  orderInfo.note,
                                                  orderInfo.delivery_date,
                                                  orderInfo.mat_order_name,
                                                  orderInfo.mat_order_code
                                                  ])
                            .catch((err) => console.log(err))
  if(result.affectedRows<1){
    return result;
  }
  for(let detail of detailInfo){
    delete detail.mat_name;
    let updateOrderDetail = [detail,detail.mat_order_detailcode]
    result = await mariaDB.query('updateOrderDetail',updateOrderDetail)
                           .catch((err) => console.log(err))
  }
  
  return result;
}

//발주삭제

const deleteOrder = async(orderCode) =>{
  let result = await mariaDB.query('delOrder',orderCode)
                             .catch((err)=> console.log(err))
  if (result.affectedRows < 1) {
    return result;
  }
  result = await mariaDB.query('delOrderDetail', orderCode)
                        .catch((err) => console.log(err)) 
  return result;
}
module.exports = {
  autoMatCode,
  matList,
  comList,
  matOrderAdd,
  orderList,
  orderRender,
  orderDetailRender,
  orderCheck,
  modifyOrder,
  deleteOrder
};
