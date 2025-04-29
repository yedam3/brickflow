const mariaDB = require("../../db/mapper.js");
const { convertObjToAry, dateFormat } = require("../../utils/converts.js");

// 생산계획 조회 (생산 지시)
const findPlanDetailByPlan_code = async () => {
    let planDetailList = await mariaDB.query("findPlanDetailByPlan_code").catch((err) => console.error(err));
    return planDetailList;
}

// 생산지시 등록
const insertInstr = async () => {
    let result = await mariaDB.query("").catch((err) => console.error(err));
    return result;
}

// 

export default {
    findPlanDetailByPlan_code,
}