const mariaDB = require("../../db/mapper.js");
const { convertObjToAry, dateFormat } = require("../../utils/converts.js");

// 생산계획 조회 (생산 지시)
const findPlanDetailByPlan_code = async () => {
    let planDetailList = await mariaDB.query("findPlanDetailByPlan_code").catch((err) => console.error(err));
    return planDetailList;
}

export default {
    findPlanDetailByPlan_code,
}