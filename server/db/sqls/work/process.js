// 생산 지시 목록 조회 - 생산 완료(WS3) 제외
const findAllProduct_order = `
SELECT work.work_data_code, wp.work_lot, po.product_order_name, wp.process_sequence, wp.order_quantity, wp.input_quantity, wp.error_quantity, wp.created_quantity,
	prod.prod_name,
	pr.process_name,
    work.fac_code,
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
    LEFT JOIN process pr ON (wp.process_code = pr.process_code)
    LEFT JOIN prod prod ON wp.prod_code = prod.prod_code
WHERE wp.order_quantity > 0	
	AND wp.order_quantity > wp.error_quantity + wp.created_quantity
    AND pr.process_type = 'PT1'
    AND IFNULL(work.work_data_code,'') = (SELECT IFNULL(MAX(wd.work_data_code),'')
                                  FROM work_data wd
								WHERE wd.worK_lot = work.work_lot)
    :searchCondition
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
WHERE wp.work_lot = ?
`;

// 정보 조회
const findProcessInfoWork_lotAndEmp_codeAndFac_code = `
SELECT wp.process_code, fc.fac_code AS 'fac_code', emp.emp_code AS 'emp_code', wp.prod_code, wp.order_quantity, wp.process_sequence,
    getProdName(wp.prod_code) AS prod_name,
    getProcessName(wp.process_code) AS process_name, 
    getFacModelName(fc.fac_code) AS model_name,
    getEmpName(emp.emp_code) AS emp_name,
    wp.input_quantity AS processed_quantity,
    (wp.order_quantity - wp.input_quantity) AS 'unprocessed_quantity',
    CASE
        WHEN wp.order_quantity <= wp.created_quantity + wp.error_quantity THEN ''
        WHEN EXISTS (
            SELECT 1 FROM work_data 
            WHERE work_lot = wp.work_lot AND process_code = wp.process_code 
            AND work_end_date IS NULL
        ) THEN (
            SELECT work_start_date FROM work_data 
            WHERE work_lot = wp.work_lot AND process_code = wp.process_code 
            AND work_end_date IS NULL
            ORDER BY work_data_code DESC LIMIT 1
        )
        ELSE ''
    END AS work_start_date,
    CASE
        WHEN (wp.order_quantity <= wp.error_quantity + wp.created_quantity) 
        THEN (SELECT MAX(work_end_date) FROM work_data 
              WHERE work_lot = wp.work_lot AND process_code = wp.process_code)
        ELSE ''
    END AS work_end_date,
    CASE
        WHEN wp.order_quantity <= wp.created_quantity + wp.error_quantity THEN 0
        WHEN EXISTS (
            SELECT 1 FROM work_data 
            WHERE work_lot = wp.work_lot AND process_code = wp.process_code 
            AND work_end_date IS NULL
        ) THEN (
            SELECT input_quantity FROM work_data 
            WHERE work_lot = wp.work_lot AND process_code = wp.process_code 
            AND work_end_date IS NULL
            ORDER BY work_data_code DESC LIMIT 1
        )
        ELSE 0
    END AS input_quantity,
    CASE
        WHEN wp.order_quantity <= wp.created_quantity + wp.error_quantity THEN 0
        WHEN EXISTS (
            SELECT 1 FROM work_data 
            WHERE work_lot = wp.work_lot AND process_code = wp.process_code 
            AND work_end_date IS NULL
        ) THEN (
            SELECT error_quantity FROM work_data 
            WHERE work_lot = wp.work_lot AND process_code = wp.process_code 
            AND work_end_date IS NULL
            ORDER BY work_data_code DESC LIMIT 1
        )
        ELSE 0
    END AS error_quantity,
    CASE
        WHEN wp.order_quantity <= wp.created_quantity + wp.error_quantity THEN 0
        WHEN EXISTS (
            SELECT 1 FROM work_data 
            WHERE work_lot = wp.work_lot AND process_code = wp.process_code 
            AND work_end_date IS NULL
        ) THEN (
            SELECT created_quantity FROM work_data 
            WHERE work_lot = wp.work_lot AND process_code = wp.process_code 
            AND work_end_date IS NULL
            ORDER BY work_data_code DESC LIMIT 1
        )
        ELSE 0
    END AS created_quantity
FROM work_process wp
    LEFT JOIN fac fc ON fc.fac_code = ?
    LEFT JOIN employees emp ON emp.emp_code = ?
WHERE wp.work_lot = ?
GROUP BY wp.process_code, fc.fac_code, emp.emp_code, wp.prod_code, wp.order_quantity, wp.process_sequence
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

// 지시 목록 조회
const findAllPlanOrderName = `
SELECT DISTINCT po.product_order_name
FROM work_process wp
	JOIN work_detail wd ON wp.product_order_detail_code = wd.product_order_detail_code
	JOIN product_order po ON wd.product_order_code = po.product_order_code
WHERE NOT EXISTS (
    SELECT 1
    FROM (
        SELECT 
            product_order_detail_code,
            SUM(error_quantity) AS total_error_quantity,
            MAX(CASE WHEN process_sequence = 1 THEN order_quantity END) AS first_order_quantity,
            MAX(CASE WHEN process_sequence = (
                SELECT MAX(process_sequence) 
                FROM work_process 
                WHERE product_order_detail_code = wp_outer.product_order_detail_code
            ) THEN created_quantity END) AS last_created_quantity
        FROM work_process wp_outer
        GROUP BY product_order_detail_code
        HAVING MAX(CASE WHEN process_sequence = 1 THEN order_quantity END) = 
               SUM(error_quantity) + 
               MAX(CASE WHEN process_sequence = (
                   SELECT MAX(process_sequence) 
                   FROM work_process 
                   WHERE product_order_detail_code = wp_outer.product_order_detail_code
               ) THEN created_quantity END)
    ) valid_orders
    WHERE valid_orders.product_order_detail_code = wp.product_order_detail_code
) AND wp.order_quantity > 0
`;

// 공정 목록 조회
const findAllProcessName = `
SELECT DISTINCT p.process_name
FROM process p
JOIN work_process wp ON p.process_code = wp.process_code
WHERE NOT EXISTS (
    SELECT 1
    FROM (
        SELECT 
            product_order_detail_code,
            SUM(error_quantity) AS total_error_quantity,
            MAX(CASE WHEN process_sequence = 1 THEN order_quantity END) AS first_order_quantity,
            MAX(CASE WHEN process_sequence = (
                SELECT MAX(process_sequence) 
                FROM work_process 
                WHERE product_order_detail_code = wp_outer.product_order_detail_code
            ) THEN created_quantity END) AS last_created_quantity
        FROM work_process wp_outer
        GROUP BY product_order_detail_code
        HAVING MAX(CASE WHEN process_sequence = 1 THEN order_quantity END) = 
               SUM(error_quantity) + 
               MAX(CASE WHEN process_sequence = (
                   SELECT MAX(process_sequence) 
                   FROM work_process 
                   WHERE product_order_detail_code = wp_outer.product_order_detail_code
               ) THEN created_quantity END)
    ) valid_orders
    WHERE valid_orders.product_order_detail_code = wp.product_order_detail_code
) AND wp.order_quantity > 0
`;
// 제품 목록 조회
const findAllProdName = `
SELECT DISTINCT pd.prod_name
FROM work_process wp
    JOIN prod pd ON wp.prod_code = pd.prod_code
WHERE NOT EXISTS (
    SELECT 1
    FROM (
        SELECT 
            product_order_detail_code,
            SUM(error_quantity) AS total_error_quantity,
            MAX(CASE WHEN process_sequence = 1 THEN order_quantity END) AS first_order_quantity,
            MAX(CASE WHEN process_sequence = (
                SELECT MAX(process_sequence) 
                FROM work_process 
                WHERE product_order_detail_code = wp_outer.product_order_detail_code
            ) THEN created_quantity END) AS last_created_quantity
        FROM work_process wp_outer
        GROUP BY product_order_detail_code
        HAVING MAX(CASE WHEN process_sequence = 1 THEN order_quantity END) = 
               SUM(error_quantity) + 
               MAX(CASE WHEN process_sequence = (
                   SELECT MAX(process_sequence) 
                   FROM work_process 
                   WHERE product_order_detail_code = wp_outer.product_order_detail_code
               ) THEN created_quantity END)
    ) valid_orders
    WHERE valid_orders.product_order_detail_code = wp.product_order_detail_code
) AND wp.order_quantity > 0
`;

// 실적 목록 조회
const findAllProcess = `
SELECT po.product_order_code, wp.product_order_detail_code, po.product_order_name, proc.process_name, prod.prod_name, wp.order_quantity,
    IFNULL(SUM(wd.input_quantity), 0) AS input_quantity,
    IFNULL(SUM(wd.error_quantity), 0) AS error_quantity,
    IFNULL(SUM(wd.created_quantity), 0) AS created_quantity,
    IFNULL(MIN(wd.work_start_date), "") AS process_start_date,
    IFNULL((
        SELECT MAX(wd2.work_end_date)
        FROM work_data wd2
        WHERE wd2.work_lot = wp.work_lot
          AND wd2.process_sequence = wp.process_sequence
          AND (
              SELECT SUM(wd3.created_quantity + wd3.error_quantity)
              FROM work_data wd3
              WHERE wd3.work_lot = wd2.work_lot
                AND wd3.process_sequence = wd2.process_sequence
                AND wd3.work_end_date <= wd2.work_end_date
          ) >= wp.order_quantity
    ), "") AS process_end_date,
    IFNULL((
		SELECT wp_first.order_quantity
		FROM work_process wp_first
		WHERE wp_first.product_order_detail_code = wp.product_order_detail_code
			AND wp_first.process_sequence = 1
	), 0) AS 'first_order_quantity'
FROM work_process wp
	LEFT JOIN work_data wd ON wp.work_lot = wd.work_lot AND wp.process_sequence = wd.process_sequence
    LEFT JOIN work_detail wd2 ON wp.product_order_detail_code = wd2.product_order_detail_code
    LEFT JOIN process proc ON wp.process_code = proc.process_code
    LEFT JOIN prod prod ON wp.prod_code = prod.prod_code
    LEFT JOIN product_order po ON wd2.product_order_code = po.product_order_code
    LEFT JOIN plan p ON po.plan_code = p.plan_code
WHERE 1=1
:searchCondition
GROUP BY wp.work_lot, wp.product_order_detail_code, wp.process_code, wp.prod_code, wp.order_quantity
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

    findAllPlanOrderName,                           // 지시 목록 조회
    findAllProcessName,                             // 공정 목록 조회
    findAllProdName,                                // 제품 목록 조회

    findAllProcess,                                 // 실적 조회
}