// 생산지시코드 자동증가
const getOrder_code = `
SELECT CONCAT('PO-',IFNULL(MAX(CAST(SUBSTR(product_order_code, 4) AS SIGNED)),100)+1) AS product_order_code
FROM product_order
`;

// 자재 요구량 조회
const findMatReqByPlan_code = `
SELECT pd.prod_code, b.mat_code, m.mat_name,
    SUM(pd.plan_quantity * b.quantity) AS req_material_quantity,
    CASE 
        WHEN MAX(s.store_quantity) IS NULL THEN '재고 정보 없음'
        WHEN SUM(pd.plan_quantity * b.quantity) > MAX(s.store_quantity) THEN '재고 부족'
        ELSE '재고 충분'
    END AS 'mat_status'
FROM plan p
	JOIN plan_detail pd ON p.plan_code = pd.plan_code
	JOIN BOM b ON pd.prod_code = b.prod_code
    JOIN mat m ON b.mat_code = m.mat_code
	LEFT JOIN 
		(SELECT  item_code,
			SUM(store_quantity) AS store_quantity
		 FROM store
		 GROUP BY item_code) s ON b.mat_code = s.item_code
WHERE p.plan_code = ? AND UPPER(b.pass_or_not) LIKE 'Y'
GROUP BY pd.prod_code, b.mat_code
ORDER BY pd.prod_code, b.mat_code;
`;

// 생산지시 목록 조회
const findAllPlanOrder = `
SELECT po.product_order_code, po.product_order_name, po.finish_status, sc.sub_code_name, po.plan_code, 
	DATE_FORMAT(po.start_date, '%Y-%m-%d') AS start_date,
    DATE_FORMAT(po.end_date, '%Y-%m-%d') AS end_date,
    CONCAT(
        getProdName(wd.prod_code),
        CASE 
            WHEN COUNT(wd.prod_code) > 1 THEN CONCAT(' 외 ', COUNT(DISTINCT wd.prod_code) - 1, '건')
            ELSE ''
        END
    ) AS prod_name
FROM product_order po
	JOIN sub_codes sc ON po.finish_status = sc.sub_code
	LEFT JOIN work_detail wd ON wd.product_order_code = po.product_order_code
GROUP BY po.product_order_code, po.product_order_name, po.finish_status, sc.sub_code_name, po.plan_code, po.start_date, po.end_date
ORDER BY po.product_order_code
`;

// 생산 지시 조회
const findAllPlanOrderByProduct_order_code = `
SELECT po.product_order_code, po.product_order_name, e.emp_name, po.plan_code, p.plan_name, po.start_date, po.end_date, po.note
FROM product_order po
	JOIN plan p ON po.plan_code = p.plan_code
    JOIN employees e ON e.emp_code = po.employee_code
WHERE product_order_code = ?
`;

// 생산 지시 상세 조회
const findAllWorkDetailByProduct_order_code = `
SELECT wd.prod_code, getProdName(wd.prod_code) AS 'prod_name', od.quantity, wd.order_quantity, wd.priority, wd.product_order_code
FROM work_detail wd
    LEFT JOIN product_order po ON po.product_order_code = wd.product_order_code
    LEFT JOIN plan p ON p.plan_code = po.plan_code
    LEFT JOIN order_detail od ON od.orders_code = p.orders_code AND od.prod_code = wd.prod_code
WHERE wd.product_order_code = ?
`;

// 생산 상품 자재 재고 조회
const findAllProdMatQtyByMat_code = `
SELECT s.lot AS 'mat_LOT', m.mat_code, m.mat_name, ms.store_date AS 'store_date',
    (COALESCE(s.inbound_quantity, 0) - COALESCE(s.dispatch_quantity, 0)) AS 'available_qty'
FROM store s
	LEFT JOIN mat_store ms ON ms.mat_LOT = s.LOT AND ms.mat_code = s.item_code
	JOIN mat m ON ms.mat_code = m.mat_code
WHERE ms.mat_code = ?
ORDER BY ms.store_date ASC
`;

// 생산 상품 자재 홀드 조회
const findAllMatHoldByProdcut_order_detail_code = `
SELECT wd.prod_code, b.mat_code, m.mat_name, b.quantity AS required_per_unit,
    (b.quantity * wd.order_quantity) AS total_input_qty
FROM work_detail wd
	JOIN BOM b ON b.prod_code = wd.prod_code
	JOIN mat m ON m.mat_code = b.mat_code
WHERE wd.product_order_code = ?
ORDER BY wd.prod_code, b.mat_code

`;

// 생산지시 상태 확인
const findStatusByPlan_code = `
SELECT finish_status
FROM product_order
WHERE plan_code = ?;
`;

// 생산계획 조회 (생산 지시)
const findPlanDetailByPlan_code = `
SELECT p.plan_code, p.plan_name, p.start_date, p.end_date, 
       p.employee_code, e.emp_name, p.note
FROM plan p
    LEFT JOIN employees e ON p.employee_code = e.emp_code
WHERE p.plan_code = ?
`;

// 상품 공정 흐름도 조회
const findProcess_flowByProd_code = `

`;

// 생산 지시 등록
const insertProduct_order = `
INSERT INTO product_order(product_order_code, plan_code, product_order_name, employee_code, start_date, end_date, finish_status, note)
VALUES(?, ?, ?, ?, ?, ?, 'WS1', ?)
`;

// 생산 지시 코드 자동증가
const findProduct_order_detail_code = `
SELECT CONCAT('WD-',IFNULL(MAX(CAST(SUBSTR(product_order_detail_code, 4) AS SIGNED)),100)+1) AS product_order_detail_code
FROM work_detail
`;

// 생산 지시 상세 등록
const insertProduct_order_detail = `
INSERT INTO work_detail VALUES(?, ?, ?, ?, ?, ?)
`;

// 생산 계획 상태 변경
const updatePlanStatusByPlan_code = `
UPDATE plan
SET
    finish_status = ?
WHERE plan_code = ?
`;

// 생산 지시 상세 조회 (product_order_code, prod_code)
const findWork_detailByProduct_order_codeAndProd_code = `
SELECT product_order_detail_code, prod_code, order_quantity, priority, process_flow_code, product_order_code
FROM work_detail
WHERE product_order_code = ? AND prod_code = ?
`;

// 생산 지시 상세 조회 (LIMIT)
const findWork_detailByLimit = `
SELECT *
FROM work_detail
ORDER BY product_order_detail_code DESC
LIMIT ?
`;

// 자재 홀드 코드 조회
const findMat_hold_code = `
SELECT CONCAT('MH-',IFNULL(MAX(CAST(SUBSTR(mat_hold_code, 4) AS SIGNED)),100)+1) AS mat_hold_code
FROM mat_hold;
`;

// 자재 홀드량 등록
const insertMat_hold = `
INSERT INTO mat_hold(mat_hold_code, product_order_detail_code, mat_LOT, hold_quantity, finish_status, mat_code)
VALUES (?, ?, ?, ?, 'OF1', ?);
`;

module.exports = {
    getOrder_code,
    findMatReqByPlan_code,
    findAllPlanOrderByProduct_order_code,
    findAllWorkDetailByProduct_order_code,
    findAllProdMatQtyByMat_code,                        // 생산 상품 자재 재고 조회
    insertProduct_order,                                // 생산 지시 등록
    findProduct_order_detail_code,                      // 생산 지시 코드 조회
    insertProduct_order_detail,                         // 생산 지시 상세 등록
    updatePlanStatusByPlan_code,                        // 생산 계획 상태 변경
    findWork_detailByProduct_order_codeAndProd_code,    // 생산 지시 상세 조회 (product_order_code, prod_code)
    findWork_detailByLimit,                             // 생산 지시 상세 조회 (LIMIT)
    findMat_hold_code,                                  // 자재 홀드 코드 조회
    insertMat_hold,                                     // 생산 자재 홀드량 등록

    findAllMatHoldByProdcut_order_detail_code,

    findAllPlanOrder,
    findStatusByPlan_code,
};