const { values } = require("lodash");
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

             delivery.delivery_detail_code = (await mariaDB.query('deliveryAutoDetailOrder'))[0].code; // 출고코드 자동생성
             
             let test = [
                 delivery.delivery_detail_code,
                 detail.prod_code,
                 detail.delivery_quantity,
                 delivery.delivery_code
             ]
             result = await mariaDB.query('deliveryDetailAdd', test)
                 .catch((err) => console.log(err));
            for (let data of detail.lotList) {
                if (data.delivery_quantity > 0) {
            
            let findStore = (await mariaDB.query('findProdStroage',data.prod_LOT))[0].storage_code; // 창고 찾기
            let info = [
                delivery.delivery_detail_code,
                detail.prod_code,
                data.prod_LOT,
                data.delivery_quantity,
               findStore
            ]
            
            result = await mariaDB.query('addStoreProd', info)
                                            .catch((err) => console.log(err));
               }
            }
        }
    }
   
    //상태값 변경
    
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
    
    for (let detail of deliveryDetail) {
        if (Number(detail.delivery_quantity) > 0) {
            let test = [
                detail.delivery_quantity,
                detail.delivery_detail_code,
            ]
            result = await mariaDB.query('deliveryDetailUpdate', test)
                .catch((err) => console.log(err));
             
            //창고에 있는 detailCode 먼저 삭제
            result = await mariaDB.query('storeDeliveryDelete', detail.delivery_detail_code)
            
            for (let data of detail.lotList) {
                if (data.delivery_quantity > 0) {
                    let findStore = (await mariaDB.query('findProdStroage', data.prod_LOT))[0].storage_code; // 창고 찾기
                    let info = [
                        detail.delivery_detail_code,
                        detail.prod_code,
                        data.prod_LOT,
                        data.delivery_quantity,
                        findStore
                    ]
                    ///창고 에 다시 값 추가
                    result = await mariaDB.query('addStoreProd' ,info)
                        .catch((err) => console.log(err));
                }
            }
        }
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
const removedelivery = async (delivery_code,deliveryDetail) => {
     await mariaDB.query("deliveryDelete", [delivery_code])
        .catch(err => console.log(err));

    let result = await mariaDB.query("deliveryDetailDelete", [delivery_code])
        .catch(err => console.log(err));
    
   
    console.log(deliveryDetail);
    //반복문 돌려서 삭제기능 구현 
    for (let value of deliveryDetail) { 
        console.log(value)
         result = await mariaDB.query("storeDeliveryDelete", [value.delivery_detail_code])
                                                             .catch(err => console.log(err));
    }

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