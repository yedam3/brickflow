const {inRange} = require("lodash");
const mariaDB = require("../../db/mapper.js");
const { convertObjToAry } = require("../../utils/converts.js");

//업체리스트 조회
const comList = async ({
  type,
  keyword
}) => {
  let searchCondition = {};
  let convertedCondition = ''; // 기본값

  if (type && keyword) {searchCondition[type] = keyword;
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



// 메인조회
const findMainOrders = async (orders_code) => {
  let list = await mariaDB.query("orderinfochoice", orders_code)
  return list[0];
}
// 상세그리드 조회
const findorders = async (orders_code) => {
  let list = await mariaDB.query("selectorders", orders_code)
    .catch(err => console.log(err));
}

//등록
const deliveryAdd = async (delivery, deliveryDetail) => {
  delivery.delivery_code = (await mariaDB.query('deliveryAutoOrder'))[0].code;
  console.log(delivery.delivery_code);
  let result = await mariaDB.query('deliveryAdd', [
    delivery.delivery_code
    , delivery.orders_code
    , delivery.company_code
    , delivery.employee_code
    , delivery.delivery_date
  ])
    .catch((err) => console.log(err));
  if (result.affecteRows < 1) {
    return result;
  }
  for (let detail of deliveryDetail) {
    result = await mariaDB.query('deliveryDetailAdd', [
      detail.delivery_detail_code, detail.prod_code, detail.delivery_quantity, detail.prod_LOT, detail.delivery_code
    ])
      .catch((err) => console.log(err));
  }
  return result;
}

//삭제
      const removedelivery = async (delivery_code) => {
        let result = await mariaDB.query("deliveryDelete", [delivery_code])
          .catch(err => console.log(err));

        result = await mariaDB.query("deliveryDetailDelete", [delivery_code])
          .catch(err => console.log(err));

        return result;
      };


module.exports = {
  comList,
  findMainOrders,
  findorders,
  deliveryAdd,
  removedelivery,
}