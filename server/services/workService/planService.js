const mariaDB = require("../../db/mapper.js");
const { convertObjToAry, dateFormat, convertLikeToQuery } = require("../../utils/converts.js");

// plan_code 증가 값
const getPlan_code = async () => {
    let plan_code = await mariaDB
        .query("getPlan_code")
        .catch((err) => console.error(err));
    return plan_code;
};

// 주문 목록 조회
const findAllOrders = async (type, keyword) => {
    // 변수 mariadb에 등록된 query 함수를 통해 서비스에서 필요한 SQL문을 실행하도록 요청
    // -> 비동기작업이므로 await/async를 활용해서 동기식으로 동작하도록 진행
    let searchCondition = {};
    let convertedCondition = '';
    switch (type) {
        case "prod_name":
            type = "prod.prod_name";
            break;
        case "order_name":
            type = "o.order_name";
            break;
        case "orders_code":
            type = "o.orders_code";
            break;
        default:
            break;
    }
    if(type && keyword) {
        searchCondition[type] = keyword;
        const converted = convertLikeToQuery(searchCondition, []);
        convertedCondition = converted.serchKeyword;
    }

    let list = await mariaDB.query("findAllOrders", {searchCondition: convertedCondition}).catch((err) => console.error(err));
    return list;
};

// 주문 상세 조회
const findByOrders_code = async (orders_code) => {
    let list = await mariaDB.query("findByOrders_code", orders_code).catch((err) => console.error(err));
    return list;
};

// 생산 계획 목록 조회
const findAllPlan = async (type, keyword, onlyOC1) => {
    let searchCondition = {};
    let finish_statusCondition = '';
    let convertedCondition = '';
    switch (type) {
        case "plan_name":
            type = "p.plan_name";
            break;
        case "order_name":
            type = "o.order_name";
            break;
        case "prod_name":
            type = "prod.prod_name";
            break;
        case "plan_code":
            type = "p.plan_code";
            break;
        default:
            break;
    }
    if(type && keyword) {
        searchCondition[type] = keyword;
        const converted = convertLikeToQuery(searchCondition, []);
        convertedCondition = converted.serchKeyword;
    }
    if(onlyOC1 === 'true') {
        finish_statusCondition = "AND p.finish_status = 'OC1'";
    }
    let planList = await mariaDB.query("findAllPlan", {searchCondition: convertedCondition, finishStatusCondition: finish_statusCondition}).catch((err) => console.error(err));
    return planList;
};

// 생산 계획 상세 목록 조회
const findPlanDetailByPlan_code = async (plan_code) => {
    let planDetailList = await mariaDB.query("findPlanDetailByPlan_code", plan_code).catch((err) => console.error(err));
    return planDetailList;
}

// 생산 계획 등록
// const insertPlan = async (planData, planDetailData) => {
//     const { finish_status, order_name, ...data } = planData;
//     data.start_date = dateFormat(new Date(data.start_date));
//     data.end_date = dateFormat(new Date(data.end_date));
//     let result = await mariaDB
//         .query("insertPlan", Object.values(data))
//         .catch((err) => console.error(err));
//     if (result.affectedRows < 1) {
//         return result;
//     }
//     return insertPlanDetail(data.plan_code, planDetailData, data.orders_code);
// };

// 생산 계획 등록
const insertPlan = async (planData, planDetailData) => {
    // 생산 계획
    const { finish_status, order_name, ...newPlanData } = planData;
    newPlanData.start_date = dateFormat(new Date(newPlanData.start_date));
    newPlanData.end_date = dateFormat(new Date(newPlanData.end_date));

    // 생산 필드
    const plan_fields = ["plan_code", "orders_code", "plan_name", "employee_code", "start_date", "end_date", "note"]

    // 생산 계획 상세
    const planDetailFields = ["plan_code", "currentPlanQty", "prod_code"];
    let result;
    try{
        conn =  await mariaDB.getConnection();
        await conn.beginTransaction();

        // 생산 계획 등록
        let selectedQuery = mariaDB.selectedQuery("insertPlan", convertObjToAry(newPlanData, plan_fields));
        result = await conn.query(selectedQuery, convertObjToAry(newPlanData, plan_fields));
        
        // 생산 계획 상세 등록
        for (let data of planDetailData) {
            data.plan_code = newPlanData.plan_code;
            const newPlanDetailData = planDetailFields.reduce((obj, key) => {
                if (data[key] !== undefined)
                    obj[key] = data[key];
                return obj;
            }, {});
            selectedQuery = mariaDB.selectedQuery("insertPlanDetail", Object.values(newPlanDetailData));
            result = await conn.query(selectedQuery, Object.values(newPlanDetailData));
        }

        if(newPlanData.orders_code) {
            // 주문 상태 변경 (생산중)
            let data = ["OS2", newPlanData.orders_code];
            selectedQuery = mariaDB.selectedQuery("updateOrdersByOrders_code", data);
            result = await conn.query(selectedQuery, data);

            // 주문 상세 목록 조회 (orders_code)
            selectedQuery = mariaDB.selectedQuery("findAllOrder_detailByOrders_code", newPlanData.orders_code);
            result = await conn.query(selectedQuery, newPlanData.orders_code);

            // 주문 상세 상태 변경
            for (let orderDetailData of result) {
                const orderDetailStatus = ["OS2", orderDetailData.orders_detail_code]
                selectedQuery = mariaDB.selectedQuery("updateOrderDetailByOrders_code", orderDetailStatus);
                result = await conn.query(selectedQuery, orderDetailStatus);
            }
        }
        
        
        await conn.commit();    
    }catch(err){
        if (conn) await conn.rollback();
        console.log(err);
    } finally{
        if (conn) conn.release();
    }  
    return result;
};

// 생산 번호 체크
const existsByPlan_code = async (plan_code) => {
    let result = (await mariaDB.query("existsByPlan_code", plan_code).catch((err) => console.error(err)))[0];
    return result;
};

// 주문 상태 확인
const findOrder_statusByOrders_code = async (orders_code) => {
    let result = (await mariaDB.query("findOrder_statusByOrders_code", orders_code).catch((err => console.error(err))))[0];
    return result;
}
// ----------------------------------------
// 생산 계획 상세 등록
const insertPlanDetail = async (plan_code, planDetailData, orders_code) => {
    const fields = ["plan_code", "currentPlanQty", "prod_code"];

    let results = [];
    for (let data of planDetailData) {
        data.plan_code = plan_code;
        const newData = fields.reduce((obj, key) => {
            if (data[key] !== undefined)
                obj[key] = data[key];
            return obj;
        }, {});
        try {
            const result = await mariaDB.query(
                "insertPlanDetail",
                Object.values(newData)
            );
            results.push(result);
        } catch (err) {
            console.error(err);
        }
    };

    let affectedRows = 0;
    for(let result of results) {
        if(result.affectedRows > 0) {
            affectedRows++;
        } else {
            return results;
        }
    }
    updateOrdersByOrders_code(orders_code);
};

// ----------------------------------------
// 생산 계획 수정
// const __updatePlanByPlan_code = async (planData, planDetailData) => {
//     const { finish_status, ...data} = planData;

//     data.start_date = dateFormat(new Date(data.start_date));
//     data.end_date = dateFormat(new Date(data.end_date));

//     const fields = ["plan_name", "start_date", "end_date", "note", "plan_code"];
//     const newData = fields.reduce((obj, key) => {
//         if(data[key] !== undefined) {
//             obj[key] = data[key];
//         }
//         return obj;
//     }, {});

//     let result = await mariaDB.query("updatePlanByPlan_code", Object.values(newData)).catch((err) => console.error(err));

//     if(result.affectedRows < 1) {
//         return result;
//     };
//     updatePlanDetailByPlan_code(planDetailData);
// };

// const updatePlanDetailByPlan_code = async (planDetailData) => {
//     const fields = ["currentPlanQty", "plan_detail_code"];

//     let results = [];
//     for(let data of planDetailData) {
//         const newData = fields.reduce((obj, key) => {
//             if (data[key] !== undefined)
//                 obj[key] = data[key];
//             return obj;
//         }, {});
//         try {
//             const result = await mariaDB.query(
//                 "updatePlanDetailByPlan_code",
//                 Object.values(newData)
//             );
//             results.push(result);
//         } catch (err) {
//             console.error(err);
//         }
//     }

//     return results;
// };

// 생산 계획 상세 수정
const updatePlanByPlan_code = async (planData, planDetailData) => {
    const plan_fields = ["plan_name", "start_date", "end_date", "note", "plan_code"];
    const plan_detail_fields = ["prod_code", "currentPlanQty", "plan_detail_code"];

    const newPlan = plan_fields.reduce((obj, key) => {
        if(planData[key] !== undefined) {
            obj[key] = planData[key];
        }
        return obj;
    }, {});
    delete newPlan.finish_status;
    newPlan.start_date = dateFormat(new Date(newPlan.start_date));
    newPlan.end_date = dateFormat(new Date(newPlan.end_date));

    let conn ;
    let result;
    try{
        conn =  await mariaDB.getConnection();
        await conn.beginTransaction();
        
        let selectedQuery;
        // 생산 계획 상세 수정
        for(let data of planDetailData) {
            const newPlan_detail = plan_detail_fields.reduce((obj, key) => {
                if (data[key] !== undefined) {
                    obj[key] = data[key];
                }
                return obj;
            }, {});
            selectedQuery = mariaDB.selectedQuery("updatePlanDetailByPlan_code", Object.values(newPlan_detail));
            result = await conn.query(selectedQuery, Object.values(newPlan_detail));
        }
        
        // 생산 계획 수정
        selectedQuery = mariaDB.selectedQuery("updatePlanByPlan_code", Object.values(newPlan));
        result = await conn.query(selectedQuery, Object.values(newPlan));

        await conn.commit();    
    }catch(err){
        if (conn) await conn.rollback();
        console.log(err);
    } finally{
        if (conn) conn.release();
    }  
    return result;
};


// 생산 계획 삭제
const deletePlanByPlan_code = async (plan_code, orders_code) => {
    //let result = await mariaDB.query("deletePlanByPlan_code", plan_code).catch((err) => console.error(err));
    let conn ;
    let result;
    try{
        conn =  await mariaDB.getConnection();
        await conn.beginTransaction();

        // 주문 상태 변경
        let data = ['OS1', orders_code];
        let selectedQuery = mariaDB.selectedQuery("updateOrdersByOrders_code", data);
        result = await conn.query(selectedQuery, data);

        // 주문 상세 목록 조회 (orders_code)
        selectedQuery = mariaDB.selectedQuery("findAllOrder_detailByOrders_code", orders_code);
        result = await conn.query(selectedQuery, orders_code);

        // 주문 상세 상태 변경
        for(let orderDetailData of result) {
            const orderDetailStatus = ["OS2" , orderDetailData.orders_detail_code]
            selectedQuery = mariaDB.selectedQuery("updateOrderDetailByOrders_code", orderDetailStatus);
            result = await conn.query(selectedQuery, orderDetailStatus);
        }
        
        // 생산 계획 상세 삭제
        selectedQuery = mariaDB.selectedQuery("deletePlanDetailByPlan_code", plan_code);
        result = await conn.query(selectedQuery, plan_code);

        // 생산 계획 삭제
        selectedQuery = mariaDB.selectedQuery("deletePlanByPlan_code", plan_code);
        result = await conn.query(selectedQuery, plan_code);
        
        await conn.commit();    
    }catch(err){
        if (conn) await conn.rollback();
        console.log(err);
    } finally{
        if (conn) conn.release();
    }  
    return result;
};

// 주문 상태 업데이트
const updateOrdersByOrders_code = async (orders_code, status_type) => {
    let data = [orders_code, status_type];
    let result = await mariaDB.query("updateOrdersByOrders_code", data).catch((err) => console.error(err));
    return result;
}

// 제품 목록 조회
const findAllProd = async (type, keyword) => {
    let searchCondition = {};
    let convertedCondition = '';

    if(type && keyword) {
        searchCondition[type] = keyword;
        const converted = convertLikeToQuery(searchCondition, []);
        convertedCondition = converted.serchKeyword;
    }

    let prodList = await mariaDB.query("findAllProd", {searchCondition: convertedCondition}).catch((err) => console.error(err));
    return prodList;
}

// 생산 계획 상태 확인
const findPlanFinish_statusByPlan_code = async (plan_code) => {
    let result = await mariaDB.query("findPlanFinish_statusByPlan_code", plan_code).catch((err) => console.error(err));
    return result;
}

// 주문 상태 조회
const findOrdersFinish_statusByOrders_code = async (orders_code) => {
    let result = await mariaDB.query("findOrdersFinish_statusByOrders_code", orders_code).catch((err) => console.error(err));
    return result;
}

module.exports = {
    getPlan_code,
    findAllOrders,
    findByOrders_code,
    findAllPlan,
    findPlanDetailByPlan_code,
    existsByPlan_code,
    findOrder_statusByOrders_code,
    insertPlan,
    insertPlanDetail,
    updatePlanByPlan_code,
    deletePlanByPlan_code,
    findAllProd,
    findPlanFinish_statusByPlan_code,       // 생산 계획 상태 확인

    findOrdersFinish_statusByOrders_code,   // 주문 상태 조회회
};
