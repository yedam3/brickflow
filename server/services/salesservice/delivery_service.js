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

//출고 조회
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
    return list;
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


    for (let detail of deliveryDetail) {
        if (Number(detail.delivery_quantity) > 0) {
            console.log('예담')
        for (let data of detail.lotList) {
            
            delivery.delivery_detail_code = (await mariaDB.query('deliveryAutoDetailOrder'))[0].code; // 출고코드 자동생성
            console.log(data);

            let test = [
                delivery.delivery_detail_code,
                detail.prod_code,
                detail.delivery_quantity,
                data.prod_LOT,
                delivery.delivery_code
            ]
            
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

    let result = await mariaDB.query('deliveryUpdate', [delivery.delivery_name,delivery.company_code,delivery.delivery_code ])
    .catch((err) => console.log(err));
    // if (result.affectedRows < 1) { // affectedRows ; 행의 수를 반환
    // return result;
    // }
    console.log(deliveryDetail)
    for (let detail of deliveryDetail) {
        if (Number(detail.delivery_quantity) > 0) {
            
        result = await mariaDB.query('deliveryDetailUpdate', [detail.delivery_quantity,detail.delivery_detail_code])
                .catch((err) => console.log(err));  
               
            result = await mariaDB.query('storageDeliveryUpdate', [detail.delivery_quantity, detail.prod_LOT, detail.delivery_detail_code])
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

//값중복확인
const deliveryCheck = async (deliveryCode) => {
    let list = await mariaDB.query('addCheck', deliveryCode)
    return list;
}

//삭제
const removedelivery = async (delivery_code) => {
     await mariaDB.query("deliveryDelete", [delivery_code])
        .catch(err => console.log(err));

    const result = await mariaDB.query("deliveryDetailDelete", [delivery_code])
        .catch(err => console.log(err));
    
    let test = [
        delivery.delivery_detail_code,
        detail.prod_code,
        detail.delivery_quantity,
        data.prod_LOT,
        delivery.delivery_code
    ]
    // 창고 값 수정
    result = await mariaDB.query('addStoreProd', test)
        .catch((err) => console.log(err));
    let findStore = (await mariaDB.query('findProdStroage', data.prod_LOT))[0].storage_code; // 출고코드 자동생성
    let info = [
        delivery.delivery_detail_code,
        detail.prod_code,
        data.prod_LOT,
        detail.delivery_quantity,
        findStore
    ]
    result = await mariaDB.query('addStoreProd', info)
        .catch((err) => console.log(err));
    
    // 재고 값 수정
    result = await mariaDB.query('storageDeliveryUpdate', [detail.delivery_quantity, detail.prod_LOT, detail.delivery_detail_code])
        .catch((err) => console.log(err));

    return result;
};
//두번쨰 그리드 값전달(상세 값 전달)
const deliveryDetailRender = async (ordersCode,delivery_code) => { 
    const result = await mariaDB.query('deliveryDetailRender',[ordersCode,delivery_code])
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