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

// 공정 현황 수정
const updateWork_Process = async () => {

};

// 실적 등록
const insertWork_data = async() => {

};

module.exports = {
    findAllProduct_order,               // 생산 지시 조회
    findAllEmployees,                   // 사원 목록 조회
    findAllFac,                         // 설비 목록 조회

    findProcessInfo,                    // 정보 조회
    findWork_processByWork_lot,         // 공정 정보 조회
    findEmployeesByEmp_code,            // 작업자 정보 조회
    findFacByFac_code,                  // 설비 정보 조회


    updateWork_Process,                 // 공정 현황 수정
    insertWork_data                     // 실적 등록
}