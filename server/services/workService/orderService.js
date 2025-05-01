const mariaDB = require("../../db/mapper.js");
const { convertObjToAry, dateFormat } = require("../../utils/converts.js");

// 생산지시코드 자동증가
const getOrder_code = async () => {
    let result = await mariaDB
        .query("getOrder_code")
        .catch((err) => console.error(err));
    return result;
};

// 자재 요구량 조회
const findMatReqByPlan_code = async (plan_code) => {
    let result = await mariaDB.query("findMatReqByPlan_code", plan_code).catch((err) => {
        console.err(err);
    });
    return result;
};

// 생산 지시 목록 조회
const findAllPlanOrder = async () => {
    let result = await mariaDB.query("findAllPlanOrder").catch((err) => {
        console.error(err);
    })
    return result;
}

// 생산지시 상태 확인
const findStatusByPlan_code = async (plan_code) => {
    let result = await mariaDB.query("findStatusByPlan_code", plan_code).catch((err) => {
        console.err(err);
    });
    return result;
}

// 자재홀드량

// 생산계획 조회 (생산 지시)
const findPlanDetailByPlan_code = async () => {
    let planDetailList = await mariaDB
        .query("findPlanDetailByPlan_code")
        .catch((err) => console.error(err));
    return planDetailList;
};

// 생산지시 등록
const insertInstr = async () => {
    let conn;
    let result;
    try {
        conn = await mariaDB.getConnection();
        await conn.beginTransaction();
        let selectedQuery = mariaDB.selectedQuery(
            "deletePlanByPlan_code",
            plan_code
        );
        result = await conn.query(selectedQuery, plan_code);

        // 생산 계획 상세 삭제
        selectedQuery = mariaDB.selectedQuery(
            "deletePlanDetailByPlan_code",
            plan_code
        );
        result = await conn.query(selectedQuery, plan_code);
        await conn.commit();
    } catch (err) {
        if (conn) await conn.rollback();
        console.log(err);
    } finally {
        if (conn) conn.release();
    }
    return result;
};

//

module.exports = {
    getOrder_code,
    findAllPlanOrder,

    findStatusByPlan_code,
    findPlanDetailByPlan_code,
    findMatReqByPlan_code,
    insertInstr,
};
