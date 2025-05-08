const mariaDB = require("../../db/mapper.js");
const { convertObjToAry, dateFormat } = require("../../utils/converts.js");

// 생산 지시 목록 조회
const findAllProduct_order = async () => {
    let result = await mariaDB.query('findAllProduct_order').catch((err) => console.error(err));
    return result;
}

// 사원 목록록 조회
const findAllEmployees = async () => {
    let result = await mariaDB.query('findAllEmployees').catch((err) => console.error(err));
    return result;
}

// 설비 목록 조회
const findAllFac = async () => {
    let result = await mariaDB.query('findAllFac').catch((err) => console.error(err));
    return result;
}

module.exports = {
    findAllProduct_order,               // 생산 지시 조회
    findAllEmployees,                   // 사원 목록 조회    
    findAllFac,                         // 설비 목록 조회 
}