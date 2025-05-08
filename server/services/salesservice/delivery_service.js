const {
    inRange
} = require("lodash");
const mariaDB = require("../../db/mapper.js");
const {
    convertObjToAry
} = require("../../utils/converts.js");

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
        delivery.delivery_date
       
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
        }
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
    let result = await mariaDB.query("deliveryDelete", [delivery_code])
        .catch(err => console.log(err));

    result = await mariaDB.query("deliveryDetailDelete", [delivery_code])
        .catch(err => console.log(err));

    return result;
};


module.exports = {
    findMainOrders,
    findorders,
    deliveryAdd,
    removedelivery,
    prodcheck,
    deliveryCheck,

}