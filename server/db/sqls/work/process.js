// 생산 지시 목록 조회 - 생산 완료(WS3) 제외
const findAllProduct_order = `
SELECT po.product_order_code, wp.process_sequence, wp.order_quantity, wp.input_quantity, wp.created_quantity, wp.error_quantity,
	getProdName(wp.prod_code) AS prod_name,
	getProcessName(wp.process_code) AS process_name,
	IFNULL(work.work_start_date, "") AS 'work_start_date', IFNULL(work.work_end_date, "") AS 'work_end_date',
	CASE
        WHEN (wp.created_quantity + (wp.error_quantity - wp.order_quantity)) = wp.input_quantity AND wp.input_quantity > 0 THEN 'PP3'
        WHEN (wp.created_quantity + (wp.error_quantity - wp.order_quantity)) < wp.input_quantity THEN 'PP2'
        ELSE 'PP1'
    END AS 'finish_status'
FROM work_process wp
	JOIN work_detail wd ON wd.product_order_detail_code = wp.product_order_detail_code
	JOIN product_order po ON po.product_order_code = wd.product_order_code AND po.finish_status NOT LIKE 'WS3'
    LEFT JOIN work_data work ON work.work_lot LIKE wp.work_lot
WHERE wp.order_quantity > 0 AND (wp.order_quantity = wp.input_quantity) = 0
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

module.exports = {
    findAllProduct_order,               // 생산 지시 목록 조회 - 생산 완료(WS3) 제외
    findAllEmployees,                   // 사원 목록 조회
    findAllFac,                         // 설비 목록 조회
}