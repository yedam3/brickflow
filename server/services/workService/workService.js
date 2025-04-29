const mariaDB = require("../../db/mapper.js");
const { convertObjToAry, dateFormat } = require("../../utils/converts.js");

// plan_code 증가 값
const getPlan_code = async () => {
    let plan_code = await mariaDB
        .query("getPlan_code")
        .catch((err) => console.error(err));
    return plan_code;
};

// 주문 목록 조회
const findAllOrders = async () => {
    // 변수 mariadb에 등록된 query 함수를 통해 서비스에서 필요한 SQL문을 실행하도록 요청
    // -> 비동기작업이므로 await/async를 활용해서 동기식으로 동작하도록 진행
    let list = await mariaDB
        .query("findAllOrders")
        .catch((err) => console.error(err));
    return list;
};

// 주문 상세 조회
const findByOrders_code = async (orders_code) => {
    let list = await mariaDB
        .query("findByOrders_code", orders_code)
        .catch((err) => console.error(err));
    return list;
};

// 생산 계획 목록 조회
const findAllPlan = async () => {
    let planList = await mariaDB.query("findAllPlan").catch((err) => console.error(err));
    return planList;
};

// 생산 계획 상세 목록 조회
const findPlanDetailByPlan_code = async (plan_code) => {
    let planDetailList = await mariaDB.query("findPlanDetailByPlan_code", plan_code).catch((err) => console.error(err));
    return planDetailList;
}

// 생산 계획 등록
const insertPlan = async (planData, planDetailData) => {
    const { finish_status, note, ...data } = planData;
    data.start_date = dateFormat(new Date(data.start_date));
    data.end_date = dateFormat(new Date(data.end_date));
    let result = await mariaDB
        .query("insertPlan", Object.values(data))
        .catch((err) => console.error(err));
    if (result.affectedRows < 1) {
        return result;
    }

    insertPlanDetail(data.plan_code, planDetailData, data.orders_code);
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

// 주문 상태 업데이트
const updateOrdersByOrders_code = async (orders_code) => {
    let result = await mariaDB.query("updateOrdersByOrders_code", orders_code).catch((err) => console.error(err));
    return result;
}

// 생산 계획 수정
const updatePlanByPlan_code = async (planData, planDetailData) => {
    const { finish_status, note, ...data} = planData;

    data.start_date = dateFormat(new Date(data.start_date));
    data.end_date = dateFormat(new Date(data.end_date));

    const fields = ["plan_name", "start_date", "end_date", "order_name", "plan_code"];
    const newData = fields.reduce((obj, key) => {
        if(data[key] !== undefined) {
            obj[key] = data[key];
        }
        return obj;
    }, {});

    let result = await mariaDB.query("updatePlanByPlan_code", Object.values(newData)).catch((err) => console.error(err));

    if(result.affectedRows < 1) {
        return result;
    };
    updatePlanDetailByPlan_code(planDetailData);
};

// 생산 계획 상세 수정
const updatePlanDetailByPlan_code = async (planDetailData) => {
    const fields = ["currentPlanQty", "plan_detail_code"];

    let results = [];
    for(let data of planDetailData) {
        const newData = fields.reduce((obj, key) => {
            if (data[key] !== undefined)
                obj[key] = data[key];
            return obj;
        }, {});
        try {
            const result = await mariaDB.query(
                "updatePlanDetailByPlan_code",
                Object.values(newData)
            );
            results.push(result);
        } catch (err) {
            console.error(err);
        }
    }

    return results;
};

// 생산 계획 삭제
const deletePlanByPlan_code = async (plan_code) => {
    //let result = await mariaDB.query("deletePlanByPlan_code", plan_code).catch((err) => console.error(err));
    let conn ;
    let result;
    try{
        conn =  await mariaDB.getConnection();
        await conn.beginTransaction();
        let selectedQuery = mariaDB.selectedQuery("deletePlanByPlan_code", plan_code);
        result = await conn.query(selectedQuery, plan_code);
        
        // 생산 계획 상세 삭제
        selectedQuery = mariaDB.selectedQuery("deletePlanDetailByPlan_code", plan_code);
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
    updatePlanDetailByPlan_code,
    deletePlanByPlan_code,
};
