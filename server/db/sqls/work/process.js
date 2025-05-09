// 생산 지시 목록 조회 - 생산 완료(WS3) 제외
const findAllProduct_order = `
SELECT wp.work_lot, po.product_order_name, wp.process_sequence, wp.order_quantity, wp.input_quantity, wp.created_quantity, wp.error_quantity,
	getProdName(wp.prod_code) AS prod_name,
	getProcessName(wp.process_code) AS process_name,
    IFNULL(work.work_start_date,'') AS work_start_date,
    IFNULL(work.work_end_date,'') AS work_end_date,
	CASE
        WHEN wp.input_quantity = 0 THEN 'PP1'
        WHEN IFNULL(work.work_end_date,'') = '' THEN 'PP2'
        WHEN wp.input_quantity > 0 THEN 'PP3'
    END AS 'finish_status'
FROM work_process wp
    LEFT JOIN work_data work ON work.work_lot = wp.work_lot
	LEFT JOIN work_detail wd ON (wd.product_order_detail_code = wp.product_order_detail_code)
	LEFT JOIN product_order po ON (po.product_order_code = wd.product_order_code)
    LEFT JOIN process pr  ON (wp.process_code = pr.process_code)
WHERE wp.order_quantity > 0	
	AND wp.order_quantity > wp.input_quantity
    AND pr.process_type = 'PT1'
    AND IFNULL(work.work_data_code,'') = (SELECT IFNULL(MAX(wd.work_data_code),'')
                                  FROM work_data wd
								WHERE wd.worK_lot = work.work_lot)
`;

// 사원 목록 조회
const findAllEmployees = `
SELECT emp_code, emp_name, 
	CASE
		WHEN department = 'DP1' THEN '관리'
        WHEN department = 'DP2' THEN '영업'
        WHEN department = 'DP3' THEN '생산'
        WHEN department = 'DP4' THEN '품질'
        WHEN department = 'DP5' THEN '자재'
        WHEN department = 'DP6' THEN '설비'
    END AS 'department_name'
FROM employees
WHERE UPPER(department) LIKE 'DP3'
`;

// 설비 목록 조회
const findAllFac = `
SELECT fac.fac_code, fac.model_name, fac_status
FROM fac fac
	LEFT JOIN process pro ON pro.fac_pattern LIKE fac.fac_pattern
    LEFT OUTER JOIN fac_none_play fn ON fn.fac_code LIKE fac.fac_code
`;

// 정보 조회
const findProcessInfo = `

`;

// 공정 정보 조회
const findWork_processByWork_lot = `

`;

// 작업자 정보 조회
const findEmployeesByEmp_code = `

`;


// 설비 정보 조회
const findFacByFac_code = `

`;

module.exports = {
    findAllProduct_order,               // 생산 지시 목록 조회 - 생산 완료(WS3) 제외
    findAllEmployees,                   // 사원 목록 조회
    findAllFac,                         // 설비 목록 조회

    findProcessInfo,                    // 정보 조회
    findWork_processByWork_lot,         // 공정 정보 조회
    findEmployeesByEmp_code,            // 작업자 정보 조회
    findFacByFac_code,                  // 설비 정보 조회
}