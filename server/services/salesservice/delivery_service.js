const mariaDB = require("../../db/mapper.js");
const { convertObjToAry } = require("../../utils/converts.js");

//업체리스트 조회
const comList = async ({
  type,
  keyword
}) => {
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

const deliveryList = async ({
    type,
    keyword
}) => {
    let searchCondition = {};
    let convertedCondition = ''; // 기본값

    if (type && keyword) {
        searchCondition[type] = keyword;
        // selected 배열을 넣어줘야 작동
        const converted = convertLikeToQuery(searchCondition, []);
        convertedCondition = converted.serchKeyword;
    }

    const result = await mariaDB.query('deliveryModal', {
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
    return list;
}

// 제품 LOT 조회
const prodcheck = async (prod_LOT) => {
    let list = await mariaDB.query("prodcheck", prod_LOT)
        .catch(err => console.log(err));
    return list;
}


//등록
const deliveryAdd = async (delivery, deliveryDetail) => {
    delivery.delivery_code = (await mariaDB.query('deliveryAutoOrder'))[0].code; // 출고코드 자동생성
    console.log(delivery);
    let result = await mariaDB.query('deliveryAdd', [
        delivery.delivery_code,
        delivery.orders_code,
        delivery.company_code,
        delivery.employee_code,
        delivery.delivery_name
       
    ])
        .catch((err) => console.log(err));
    if (result.affectedRows < 1) {
        return result;
    }
    
    console.log(deliveryDetail);

    for (let detail of deliveryDetail) {
        for (let data of detail.lotList) {
            delivery.delivery_detail_code = (await mariaDB.query('deliveryAutoDetailOrder'))[0].code; // 출고코드 자동생성
            console.log(data);

            let test = [
                delivery.delivery_detail_code,
                detail.prod_code,
                detail.delivery_quantity,
                data.prod_LOT,
                delivery.delivery_code]
            
            result = await mariaDB.query('deliveryDetailAdd', test)
                .catch((err) => console.log(err));
            let findStore = (await mariaDB.query('findProdStroage',data.prod_LOT))[0].storage_code; // 출고코드 자동생성
            let info = [
                delivery.delivery_detail_code,
                detail.prod_code,
                data.prod_LOT,
                detail.delivery_quantity,
               findStore
            ]
            result = await mariaDB.query('addStoreProd', info)
                                    .catch((err) => console.log(err));
        }
    }
   
    //상태값 변경
    for (let value of deliveryDetail) { 
        console.log('값조회')
        console.log(value.yetdelivery)
        console.log(value.delivery_quantity)
    }
    if (deliveryDetail.every(info => Number(info.yetdelivery) == Number(info.delivery_quantity))) {
        await mariaDB.query('deliveryStatus', ['OS4', delivery.orders_code])
    } else { 
        await mariaDB.query('deliveryStatus', ['OS3', delivery.orders_code])
    }
    

    return result;
}

//수정
const modifydelivery = async (delivery,deliveryDetail) => {

    let updateInfo = {
       company_code: delivery.company_code,
       employee_code: delivery.employee_code,
       delivery_date: delivery.delivery_date,
       delivery_name: delivery.delivery_name,

    }
    let result = await mariaDB.query('deliveryUpdate', [updateInfo, ])
    .catch((err) => console.log(err));
    if (result.affectedRows > 0) {
    return result;
    }
    for(let detail of deliveryDetail){
        let updateDetailIndo = {
            delivery_quantity: detail.delivery_quantity,
            demend: detail.demend,
            prod_code: detail.prod_code,
        }
        result = await mariaDB.query('deliveryDetailUpdate ', [updateDetailIndo,detail.delivery_detail_code]
            .catch((err)=> console.log(err)));
        
    }
    return result;
}

//값중복확인
const deliveryCheck = async (deliveryCode) => {
    let list = await mariaDB.query('addCheck', deliveryCode)
    return list;
}

// //삭제
const removedelivery = async (delivery_code) => {
     await mariaDB.query("deliveryDelete", [delivery_code])
        .catch(err => console.log(err));

    const result = await mariaDB.query("deliveryDetailDelete", [delivery_code])
        .catch(err => console.log(err));

    return result;
};
//두번쨰 그리드 값전달
const deliveryDetailRender = async (ordersCode) => { 
    const result = await mariaDB.query('deliveryDetailRender', ordersCode)
        .catch(err => console.log(err));
    return result;
}

module.exports = {
    findMainOrders,
    findorders,
    deliveryAdd,
    prodcheck,
    deliveryCheck,
    modifydelivery,
    removedelivery,
    deliveryList,
    deliveryDetailRender

}