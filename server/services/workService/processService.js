const mariaDB = require("../../db/mapper.js");
const { convertObjToAry, dateFormat } = require("../../utils/converts.js");

// 생산 지시 목록 조회
const findAllProduct_order = async (product_order_name, process_name, prod_name) => {
    let convertedCondition = '';
    let insertQuery = "";
    let conditions = [];

    if (product_order_name) {
        conditions.push(`po.product_order_name LIKE '%${product_order_name}%'`);
    }
    if (process_name) {
        conditions.push(`pr.process_name LIKE '%${process_name}%'`);
    }
    if (prod_name) {
        conditions.push(`prod.prod_name LIKE '%${prod_name}%'`);
    }
    if (conditions.length > 0) {
        insertQuery = "AND " + conditions.join(" AND ");
        convertedCondition = insertQuery;
    }

    let result = await mariaDB.query('findAllProduct_order', { searchCondition: convertedCondition }).catch((err) => console.error(err));
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

// 작업 시작 확인
const findProcessStart = async () => {
    let result = await mariaDB.query('findProcessStart').catch((err) => console.error(err));
    return result;
};

// 작업 종료 확인
const findProcessEnd = async () => {
    let result = await mariaDB.query('findProcessEnd').catch((err) => console.error(err));
};

// 실적 목록 조회
const findAllProcess = async (params) => {
    const searchKeywords = {};

    Object.keys(params).forEach((key) => {
        if (key.startsWith("searchKeywords[")) {
            const fieldName = key.match(/\[([^\]]+)\]/)[1];
            searchKeywords[fieldName] = params[key];
        }
    });

    let convertedCondition = '';
    let searchCondition = [];

    // 계획 관련 조건
    if (searchKeywords.plan_code) {
        searchCondition.push(`p.plan_code LIKE '%${searchKeywords.plan_code}%'`);
    }

    if (searchKeywords.plan_name) {
        searchCondition.push(`p.plan_name LIKE '%${searchKeywords.plan_name}%'`);
    }

    // 제품 주문 관련 조건
    if (searchKeywords.product_order_code) {
        searchCondition.push(`po.product_order_code LIKE '%${searchKeywords.product_order_code}%'`);
    }

    if (searchKeywords.product_order_name) {
        searchCondition.push(`po.product_order_name LIKE '%${searchKeywords.product_order_name}%'`);
    }

    // 제품 관련 조건
    if (searchKeywords.prod_name) {
        searchCondition.push(`prod.prod_name LIKE '%${searchKeywords.prod_name}%'`);
    }

    // 공정 관련 조건
    if (searchKeywords.process_name) {
        searchCondition.push(`proc.process_name LIKE '%${searchKeywords.process_name}%'`);
    }

    // 날짜 관련 조건
    // 작업 시작일 범위 처리
    if (searchKeywords.work_start_date_from && searchKeywords.work_start_date_to) {
        // 시작일과 종료일이 모두 있는 경우 - 범위 검색
        searchCondition.push(`wd.work_start_date BETWEEN '${searchKeywords.work_start_date_from}' AND '${ searchKeywords.work_start_date_to}'`);
    } else if (searchKeywords.work_start_date_from) {
        // 시작일만 있는 경우 - 해당 날짜 이후 검색
        searchCondition.push(`wd.work_start_date >= '${ searchKeywords.work_start_date_from}'`);
    } else if (searchKeywords.work_start_date_to) {
        // 종료일만 있는 경우 - 해당 날짜 이전 검색
        searchCondition.push(`wd.work_start_date <= '${searchKeywords.work_start_date_to}'`);
    }

    // 작업 종료일 범위 처리
    if (searchKeywords.work_end_date_from && searchKeywords.work_end_date_to) {
        // 시작일과 종료일이 모두 있는 경우 - 범위 검색
        searchCondition.push(`wd.work_end_date BETWEEN '${searchKeywords.work_end_date_from}' AND '${searchKeywords.work_end_date_to}'`);
    } else if (searchKeywords.work_end_date_from) {
        // 시작일만 있는 경우 - 해당 날짜 이후 검색
        searchCondition.push(`wd.work_end_date >= '${searchKeywords.work_end_date_from}'`);
    } else if (searchKeywords.work_end_date_to) {
        // 종료일만 있는 경우 - 해당 날짜 이전 검색
        searchCondition.push(`wd.work_end_date <= '${searchKeywords.work_end_date_to}'`);
    }
    if (searchCondition.length > 0) {
        insertQuery = "AND " + searchCondition.join(" AND ");
        convertedCondition = insertQuery;
    }
    // convertedCondition += "GROUP BY wp.work_lot, wp.product_order_detail_code, wp.process_code, wp.prod_code, wp.order_quantity";
    let result = await mariaDB.query("findAllProcess", { searchCondition: convertedCondition }).catch((err) => console.error(err));
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

    findProcessStart,                   // 작업 시작 확인
    findProcessEnd,                     // 작업 종료 확인

    findAllProcess,                     // 실적 목록 조회
}