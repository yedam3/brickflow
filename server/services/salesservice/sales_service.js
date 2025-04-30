const { inRange } = require("lodash");
const mariaDB = require("../../db/mapper.js");
const { convertObjToAry } = require("../../utils/converts.js");

const findAll = async () => {
  let list = await mariaDB.query("testList").catch(err => console.log(err));
  return result;
};

//업체리스트 조회
const comList = async ({ type, keyword }) => {
  let searchCondition = {};
  let convertedCondition = ''; // 기본값

  if (type && keyword) {
    searchCondition[type] = keyword;
    // selected 배열을 넣어줘야 작동
    const converted = convertLikeToQuery(searchCondition, []);
    convertedCondition = converted.serchKeyword;
  }

  const result = await mariaDB.query('prodComList', { searchcondition: convertedCondition })
    .catch((err) => console.log(err));
  return result;
};

//등록
const salesOrderAdd = async (salesOrder, salesOrderDetail) => {
  salesOrder.orders_code = (await mariaDB.query('salesAutoOrder'))[0].code;
  console.log(salesOrder.orders_code);
  let result = await mariaDB.query('salesOrderAdd', [
                                                    salesOrder.orders_code,
                                                    salesOrder.order_name,
                                                    salesOrder.orders_date,
                                                    salesOrder.del_date,
                                                    salesOrder.employee_code,
                                                    salesOrder.note,
                                                    salesOrder.finish_status,
                                                    salesOrder.company_code,
                                                    ])
                            .catch((err)=>console.log(err));
     if(result.affectedRows < 1 ) {
        return result;
     }
  for (let detail of salesOrderDetail) {
        detail.orders_detail_code = (await mariaDB.query('salesAutoOrderDetail'))[0].code;
       result = await mariaDB.query('salesOrderDetailAdd', [
         detail.orders_detail_code
                                                          , salesOrder.orders_code
                                                          , detail.quantity
                                                          , detail.price
                                                          , detail.note
                                                          , detail.prod_code
                                                          , detail.finish_status
                                                  ])
                            .catch((err)=>console.log(err));
     }
     return result;
}

//메인 그리드 디스플레이
const findOrderAll = async (orderCode) => {
  let list = await mariaDB.query('orderschoice', orderCode)
  return list;
}

// 상세그리드 단건조회
const findorders = async (orders_code) => {
  let list = await mariaDB.query("selectorders", orders_code)
    .catch(err => console.log(err));
  
  //let info = list[0];
  //return info;
  return list;
}

//수정
const modifyoders = async (order_name, orders_code) => {
  let orderUpdate = [orders_code, order_name]
  let result = await mariaDB.query('orderUpdate', orderUpdate)
    .catch((err) => console.log(err))
  if (result.affectedRows < 1) {
    return result;
  } else {
    result = {
      isUpdated: false,
    };
  }
  return result;
};

//삭제
const removeorder = async (orders_code) => {
  let result = await mariaDB.query("orderDelete", orders_code)
    .catch(err => console.log(err));
  
  return result;
};

  
//값중복확인
const orderCheck = async (orderCode) => {
  let list = await mariaDB.query('addCheck',orderCode)
  return list;
}

module.exports = {
  findAll,
  findOrderAll,
  comList,
  salesOrderAdd,
  orderCheck,
  findorders,
  modifyoders, 
  removeorder,
}