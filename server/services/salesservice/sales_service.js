const mariaDB = require("../../db/mapper.js");
const { convertObjToAry } = require("../../utils/converts.js");

const findAll = async () => {
  let list = await mariaDB.query("testList").catch(err => console.log(err));
  return result;
};

//리스트 조회
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
  let result = await mariaDB.query('addsalesOrder',[salesOrder.sales_order_name,
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
     if(result.affectedRows<1){
        return result;
     }
     for (let detail of salesOrderDetail) {
      result = await mariaDB.query('addsalesDetail',[detail.sales_code,
                                                  detail.request_quantity,
                                                  detail.sales_order_code,
                                                ])
                            .catch((err)=>console.log(err));
     }
     return result;
}
  
//값중복확인
const orderCheck = async (orderCode) => {
  let list = await mariaDB.query('addCheck',orderCode)
  return list;
}

module.exports = {
  findAll,
  comList,
  salesOrderAdd,
  orderCheck,
}