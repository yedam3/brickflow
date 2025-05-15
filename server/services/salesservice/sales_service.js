const {inRange} = require("lodash");
const mariaDB = require("../../db/mapper.js");
const {convertObjToAry} = require("../../utils/converts.js");

// const findAll = async () => {
//   let list = await mariaDB.query("testList").catch(err => console.log(err));
//   return list;
// };

//업체리스트 조회
const comList = async ({type,keyword}) => {
  let searchCondition = {};
  let convertedCondition = ''; // 기본값

  if (type && keyword) {
    searchCondition[type] = keyword;
    // selected 배열을 넣어줘야 작동
    const converted = convertLikeToQuery(searchCondition, []);
    convertedCondition = converted.serchKeyword;
  }

  const result = await mariaDB.query('prodComList', {
      searchcondition: convertedCondition
    })
    .catch((err) => console.log(err));
  return result;
};

//등록
const salesOrderAdd = async (salesOrder, salesOrderDetail) => {
  salesOrder.orders_code = (await mariaDB.query('salesAutoOrder'))[0].code; // 자동생성 코드

  console.log(salesOrder.orders_code);
  let result = await mariaDB.query('salesOrderAdd', [
      salesOrder.orders_code,
      salesOrder.order_name,
      salesOrder.orders_date,
      salesOrder.del_date,
      salesOrder.employee_code,
      salesOrder.note,
      salesOrder.company_code,
      salesOrder.company_name,
    ])
    .catch((err) => console.log(err));
  if (result.affectedRows < 1) {
    return result;
  }
  for (let detail of salesOrderDetail) {
    detail.orders_detail_code = (await mariaDB.query('salesAutoOrderDetail'))[0].code;
    result = await mariaDB.query('salesOrderDetailAdd', [
        detail.orders_detail_code, salesOrder.orders_code, detail.delivery_demand, detail.price, detail.note, detail.prod_code, detail.finish_status
      ])
      .catch((err) => console.log(err));
  }
  return result;
}

// //메인 그리드 디스플레이
// const findOrderAll = async (orderCode) => {
//   let list = await mariaDB.query('orderschoice', orderCode)
//   return list;
// }

// 메인조회
const findMainOrders = async (orders_code) => {
  let list = await mariaDB.query("orderinfochoice", orders_code)
  return list;
}

// 상세그리드 조회
const findorders = async (orders_code) => {
  let list = await mariaDB.query("selectorders", orders_code)
    .catch(err => console.log(err));

  //let info = list[0];
  //return info;
  return list;
}

//수정
const modifyoders = async (orders, ordersDetail) => {
  
  let upInfo = {
    order_name: orders.order_name,
    orders_date: orders.orders_date,
    del_date: orders.del_date,
    note: orders.note,
    company_code: orders.company_code,
  }
  let result = await mariaDB.query('ordersUpdate', [upInfo, orders.orders_code])
    .catch((err) => console.log(err)); 
        if (result.affectedRows < 1) {
            return result;
        }
  for (let detail of ordersDetail) {                // [ 객체 ,            주문번호값       ]
    let upDetailInfo = {
      // quantity: detail.delivery_demand,
      price: detail.price,
      note: detail.note,
      prod_code: detail.prod_code,
    }

    result = await mariaDB.query('ordersUpdateDetail', [upDetailInfo, detail.orders_detail_code])
      .catch((err) => console.log(err));
  }
  return result;
};

      //삭제
      const removeorder = async (orders_code) => {
        let result = await mariaDB.query("orderDelete", [orders_code])
          .catch(err => console.log(err));

        result = await mariaDB.query("orderDeleteDetail", [orders_code])
          .catch(err => console.log(err));

        return result;
      };



      //값중복확인
      const orderCheck = async (orderCode) => {
        let list = await mariaDB.query('orderAddCheck', orderCode).catch((err) => console.log(err));
        return list;
      }

      module.exports = {
        // findAll,
        // findOrderAll,
        comList,
        salesOrderAdd,
        orderCheck,
        findorders,
        modifyoders,
        removeorder,
        findMainOrders
      }