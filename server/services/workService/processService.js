const mariaDB = require("../../db/mapper.js");
const { convertObjToAry, dateFormat } = require("../../utils/converts.js");

// 생산 지시 목록 조회
const findAllProduct_order = async () => {
    let result = await mariaDB.query('findAllProduct_order').catch((err) => console.error(err));
    return result;
};

// 사원 목록 조회
const findAllEmployees = async () => {
    let result = await mariaDB.query('findAllEmployees').catch((err) => console.error(err));
    return result;
};

// 설비 목록 조회
const findAllFac = async (work_lot) => {
    let result = await mariaDB.query('findAllFacByWork_lot', work_lot).catch((err) => console.error(err));
    return result;
};

// 정보 조회
const findProcessInfo = async (work_lot, emp_code, fac_code) => {
    let processInfoData = [fac_code, emp_code, work_lot]
    let result = await mariaDB.query('findProcessInfoWork_lotAndEmp_codeAndFac_code', processInfoData).catch((err) => console.error(err));
    return result[0];
};

// 공정 정보 조회
const findWork_processByWork_lot = async (work_lot) => {
    let result = await mariaDB.query('findWork_processByWork_lot', work_lot).catch((err) => console.error(err));
    return result;
};

// 작업자 정보 조회
const findEmployeesByEmp_code = async (emp_code) => {
    let result = await mariaDB.query('findWork_processByWork_lot', emp_code).catch((err) => console.error(err));
    return result;
};

// 설비 정보 조회
const findFacByFac_code = async (fac_code) => {
    let result = await mariaDB.query('findWork_processByWork_lot', fac_code).catch((err) => console.error(err));
    return result;
};

// 작업 시작
const processStart = async (processStartData) => {
    const processStart_fields = ["work_lot", "fac_code", "employee_code", "input_quantity"];
    let result = await mariaDB.query('processStart', convertObjToAry(processStartData, processStart_fields)).catch((err) => console.error(err));
    return result;
};

// 작업 종료
const processEnd = async (processEndData) => {
    const processEnd_fields = ["work_lot", "fac_code", "employee_code", "error_quantity", "created_quantity"];
    let result = await mariaDB.query('processEnd', convertObjToAry(processEndData, processEnd_fields)).catch((err) => console.error(err));
    return result;
};

// 지시 목록 조회
const findAllPlanOrderName = async () => {
    let result = await mariaDB.query('findAllPlanOrderName').catch((err) => console.error(err));
    return result;
};
// 공정 목록 조회
const findAllProcessName = async () => {
    let result = await mariaDB.query('findAllProcessName').catch((err) => console.error(err));
    return result;
};

// 제품 목록 조회
const findAllProdName = async () => {
    let result = await mariaDB.query('findAllProdName').catch((err) => console.error(err));
    return result;
};

module.exports = {
    findAllProduct_order,               // 생산 지시 조회
    findAllEmployees,                   // 사원 목록 조회
    findAllFac,                         // 설비 목록 조회

    findProcessInfo,                    // 정보 조회
    findWork_processByWork_lot,         // 공정 정보 조회
    findEmployeesByEmp_code,            // 작업자 정보 조회
    findFacByFac_code,                  // 설비 정보 조회

    processStart,                       // 작업 시작
    processEnd,                         // 작업 종료

    findAllPlanOrderName,               // 지시 목록 조회
    findAllProcessName,                 // 공정 목록 조회
    findAllProdName,                    // 제품 목록 조회
}