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
const findAllFacByWork_lot = `
SELECT fac.fac_code, fac.model_name, fac_status
FROM fac fac
	LEFT JOIN process pro ON pro.fac_pattern = fac.fac_pattern
    LEFT JOIN work_process wp ON wp.process_code = pro.process_code
    LEFT OUTER JOIN fac_none_play fn ON fn.fac_code = fac.fac_code
WHERE wp.work_lot = ?
`;

// 정보 조회
const findProcessInfoWork_lotAndEmp_codeAndFac_code = `
SELECT wp.process_code,fc.fac_code AS 'fac_code', emp.emp_code AS 'emp_code', wp.prod_code, wp.order_quantity, wp.process_sequence,
    getProdName(wp.prod_code) AS prod_name,
    getProcessName(wp.process_code) AS process_name, 
    getFacModelName(fc.fac_code) AS model_name,
    getEmpName(emp.emp_code) AS emp_name,
    IFNULL(dd.input_quantity, 0) AS processed_quantity,
    (
        SELECT wp2.order_quantity
        FROM work_process wp2
        WHERE wp2.work_lot = wp.work_lot AND wp2.process_sequence = 1
    ) -
    (
        SELECT SUM(wp3.error_quantity + wp3.created_quantity)
        FROM work_process wp3
        WHERE wp3.work_lot = wp.work_lot
    ) AS 'unprocessed_quantity',
    IFNULL(dd.work_start_date, '') AS work_start_date,
    IFNULL(dd.work_end_date, '') AS work_end_date
FROM work_process wp
LEFT JOIN work_data dd ON wp.work_lot = dd.work_lot
LEFT JOIN work_detail wd ON wp.product_order_detail_code = wd.product_order_detail_code
LEFT JOIN fac fc ON fc.fac_code = ?
LEFT JOIN employees emp ON emp.emp_code = ?
WHERE wp.work_lot = ?
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

// 작업 시작
const processStart = `
CALL processStart(?, ?, ?, ?, @result_code, @result);
SELECT @result_code AS 'result_code', @result AS 'result';
`;

// 작업 종료
const processEnd = `
CALL processEnd(?, ?, ?, ?, ?, @result_code, @result);
SELECT @result_code AS 'result_code', @result AS 'result';
`;

module.exports = {
    findAllProduct_order,                           // 생산 지시 목록 조회 - 생산 완료(WS3) 제외
    findAllEmployees,                               // 사원 목록 조회
    findAllFacByWork_lot,                           // 설비 목록 조회

    findProcessInfoWork_lotAndEmp_codeAndFac_code,  // 정보 조회
    findWork_processByWork_lot,                     // 공정 정보 조회
    findEmployeesByEmp_code,                        // 작업자 정보 조회
    findFacByFac_code,                              // 설비 정보 조회

    processStart,                                   // 작업 시작
    processEnd,                                     // 작업 종료
}