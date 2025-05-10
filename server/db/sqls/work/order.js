// 생산지시코드 자동증가
const getOrder_code = `
SELECT CONCAT('PO-',IFNULL(MAX(CAST(SUBSTR(product_order_code, 4) AS SIGNED)),100)+1) AS product_order_code
FROM product_order
`;

// 자재 요구량 조회 (plan_code)
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
WHERE p.plan_code = ?
GROUP BY pd.prod_code, b.mat_code
ORDER BY pd.prod_code, b.mat_code;
`;

// 자재 요구량 조회 (prod_code)
const findAllMatReqByProd_code = `
SELECT prod.prod_code, b.mat_code, m.mat_name,
    SUM(? * b.quantity) AS req_material_quantity
FROM prod prod
	JOIN BOM b ON prod.prod_code = b.prod_code
    JOIN mat m ON b.mat_code = m.mat_code
	LEFT JOIN 
		(SELECT  item_code,
			SUM(store_quantity) AS store_quantity
		 FROM store
		 GROUP BY item_code) s ON b.mat_code = s.item_code
WHERE prod.prod_code = ?
GROUP BY prod.prod_code, b.mat_code
ORDER BY prod.prod_code, b.mat_code
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
const findAllProductOrderByProduct_order_code = `
SELECT po.product_order_code, po.plan_code, p.plan_name, po.product_order_name, po.employee_code, po.start_date, po.end_date, po.note
FROM product_order po
	LEFT JOIN plan p ON po.plan_code = p.plan_code
WHERE po.product_order_code = ?
`;

// 생산 지시 상세 조회
const findAllWorkDetailByProduct_order_code = `
SELECT DISTINCT wd.prod_code, prod.prod_name, pd.plan_quantity, wd.priority, wd.order_quantity, wd.product_order_detail_code
FROM work_detail wd
	JOIN product_order po ON wd.product_order_code = po.product_order_code
    LEFT JOIN plan p ON po.plan_code = p.plan_code
	LEFT JOIN plan_detail pd ON pd.plan_code = p.plan_code AND pd.prod_code = wd.prod_code
    JOIN prod prod ON wd.prod_code = prod.prod_code
WHERE wd.product_order_code = ?
`;

// 생산 지시 상세 코드 조회 (생산 지시 코드 - product_order_code)
const findProduct_order_detail_codeByProduct_order_code = `
SELECT product_order_detail_code
FROM work_detail
WHERE product_order_code = ?
`;

// 생산 상품 자재 홀드 조회 (product_order_detail_code)
const findAllMatHoldByProduct_order_detail_code = `
SELECT DISTINCT wd.prod_code, mh.mat_code, m.mat_name,
	SUM(mh.hold_quantity) AS hold_quantity,
    (wd.order_quantity * b.quantity) AS req_material_quantity
FROM mat_hold mh
	JOIN work_detail wd ON mh.product_order_detail_code = wd.product_order_detail_code
	JOIN product_order po ON wd.product_order_code = po.product_order_code
	JOIN BOM b ON wd.prod_code = b.prod_code AND mh.mat_code = b.mat_code
    JOIN mat m ON b.mat_code = m.mat_code
WHERE mh.product_order_detail_code = ?
GROUP BY wd.prod_code, mh.mat_code, m.mat_name, wd.order_quantity, b.quantity
`;

// 생산 상품 자재 LOT 조회
const findAllMat_HoldByProduct_order_detail_codeAndMat_code = `
SELECT mh.mat_code, mh.mat_LOT, mh.hold_quantity, wd.prod_code
FROM mat_hold mh
	JOIN work_detail wd ON wd.product_order_detail_code = mh.product_order_detail_code
WHERE mh.product_order_detail_code = ? AND mh.mat_code = ?
`;

// 생산 상품 자재 재고 조회
const findAllProdMatQtyByMat_code = `
SELECT b.prod_code, s.lot AS 'mat_LOT', m.mat_code, m.mat_name, ms.store_date AS 'store_date',
    (
		SUM(s.inbound_quantity) - SUM(COALESCE(s.dispatch_quantity, 0)) - COALESCE(
			(
				SELECT SUM(hold_quantity)
                FROM mat_hold mh
                WHERE mh.mat_LOT = s.lot
					AND mh.mat_code = ms.mat_code AND mh.finish_status = 'OF1'
			), 
		0)
    ) AS available_qty
FROM store s
	LEFT JOIN mat_store ms ON ms.mat_LOT = s.LOT AND ms.mat_code = s.item_code
	JOIN mat m ON ms.mat_code = m.mat_code
    JOIN BOM b ON b.mat_code = ms.mat_code
WHERE b.prod_code = 'PROD-105' AND ms.mat_code = 'mat-103'
GROUP BY b.prod_code, s.LOT, m.mat_code, m.mat_name, ms.store_date
ORDER BY ms.store_date ASC
`;

// 생산지시 상태 확인
const findStatusByPlan_code = `
SELECT finish_status AS 'status'
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
VALUES(?, COALESCE(NULL, ?), ?, ?, ?, ?, 'WS1', ?)
`;

// 생산 지시 코드 조회 (증가코드)
const findProduct_order_detail_codeLast = `
SELECT CONCAT('WD-',IFNULL(MAX(CAST(SUBSTR(product_order_detail_code, 4) AS SIGNED)),100)+1) AS product_order_detail_code
FROM work_detail
`;

// 생산 지시 상세 등록
const insertProduct_order_detail = `
INSERT INTO work_detail VALUES(?, ?, ?, ?, ?, ?)
`;

// 공정 흐름도 조회 (prod_code)
const findAllProcess_flowByProd_code = `
SELECT process_flow_code, process_sequence, prod_code, process_code
FROM process_flow
WHERE prod_code = ?
ORDER BY process_sequence ASC
`;

// 공정 초기 세팅 등록
const insertWork_process = `
INSERT INTO work_process
SELECT CONCAT('WORK-LOT-', IFNULL(MAX(CAST(SUBSTR(work_lot, 10) AS UNSIGNED)), 100) + 1),
    ?, ?, ?, ?, 0, 0, 0, ?
FROM (
    SELECT * FROM work_process 
    WHERE work_lot LIKE 'WORK-LOT-%' AND LENGTH(SUBSTR(work_lot, 10)) > 0
) AS wp
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
FROM mat_hold
`;

// 자재 홀드량 등록
const insertMat_hold = `
INSERT INTO mat_hold(mat_hold_code, product_order_detail_code, mat_LOT, hold_quantity, finish_status, mat_code)
VALUES (?, ?, ?, ?, 'OF1', ?)
`;

// 생산 지시 수정
const updateProduct_orderByProduct_order_code = `
UPDATE product_order
SET
	product_order_name = ?,
    start_date = ?,
    end_date = ?,
    note = ?
WHERE product_order_code = ?
`;

// 생산 지시 상세 수정
const updateWork_detailByProduct_order_detail_code = `
UPDATE work_detail
SET
	prod_code = ?,
    order_quantity = ?,
    priority = ?
WHERE product_order_detail_code = ?
`;

// 생산 지시 자재 홀드량 수정
const updateMat_holdByProduct_order_detail_codeAndMat_code = `
UPDATE mat_hold
SET
	mat_LOT = ?,
    hold_quantity = ?
WHERE product_order_detail_code = ? AND mat_code = ?
`;

// 생산 지시 삭제
const deleteProduct_orderByProduct_order_code = `
DELETE
FROM product_order
WHERE product_order_code = ?
`;

// 생산 지시 상세 삭제
const deleteWork_detailByProduct_order_code = `
DELETE
FROM work_detail
WHERE product_order_code = ?
`;

// 생산 지시 홀드량 삭제
const deleteMat_holdByProduct_order_detail_code = `
DELETE
FROM mat_hold
WHERE product_order_detail_code = ?
`;

// 생산 지시 공정 초기 세팅 삭제
const deleteWork_processByProduct_order_Detail_code = `
DELETE
FROM work_process
WHERE product_order_detail_code = ?
`;

// 생산 계획 코드 조회 (product_order_code)
const findPlanByProduct_order_code = `
SELECT 
`

// 생산 제품 자재 홀드량 조회 (prod_code)
const findAllMat_holdByProd_code = `
SELECT po.product_order_code, po.plan_code, p.plan_name, po.product_order_name, po.employee_code, po.start_date, po.end_date, po.note
FROM product_order po
	LEFT JOIN plan p ON po.plan_code = p.plan_code
WHERE po.product_order_code = ?
`;

module.exports = {
    getOrder_code,
    findMatReqByPlan_code,                                  // 자재 요구량 조회 (plan_code)
    findAllMatReqByProd_code,                               // 자재 요구량 조회 (prod_code)
    findAllProductOrderByProduct_order_code,
    findAllWorkDetailByProduct_order_code,                  // 생산 지시 상세 조회
    findProduct_order_detail_codeByProduct_order_code,      // 생산 지시 상세 코드 조회 (생산 지시 코드 - product_order_code)
    findAllMatHoldByProduct_order_detail_code,              // 생산 상품 자재 홀드 조회 (product_order_detail_code)
    findAllMat_HoldByProduct_order_detail_codeAndMat_code,  // 생산 상품 자재 LOT 조회
    findAllProdMatQtyByMat_code,                            // 생산 상품 자재 재고 조회

    insertProduct_order,                                    // 생산 지시 등록
    findProduct_order_detail_codeLast,                      // 생산 지시 상세 코드 조회(자동증가)
    insertProduct_order_detail,                             // 생산 지시 상세 등록
    findAllProcess_flowByProd_code,                         // 공정 흐름도 조회 (prod_code)
    insertWork_process,                                     // 생산 지시 공정 초기 세팅 등록
    updatePlanStatusByPlan_code,                            // 생산 계획 상태 변경

    findWork_detailByProduct_order_codeAndProd_code,        // 생산 지시 상세 조회 (product_order_code, prod_code)
    findWork_detailByLimit,                                 // 생산 지시 상세 조회 (LIMIT)
    findMat_hold_code,                                      // 자재 홀드 코드 조회
    insertMat_hold,                                         // 생산 자재 홀드량 등록

    updateProduct_orderByProduct_order_code,                // 생산 지시 수정
    updateWork_detailByProduct_order_detail_code,           // 생산 지시 상세 수정
    updateMat_holdByProduct_order_detail_codeAndMat_code,   // 생산 지시 자재 홀드량 수정

    findAllPlanOrder,                                       // 생산지시 목록 조회
    findStatusByPlan_code,                                  // 생산지시 상태 확인

    deleteProduct_orderByProduct_order_code,                // 생산 지시 삭제
    deleteWork_detailByProduct_order_code,                  // 생산 지시 상세 삭제
    deleteMat_holdByProduct_order_detail_code,              // 생산 지시 홀드량 삭제
    deleteWork_processByProduct_order_Detail_code,          // 생산 지시 공정 초기 세팅 삭제
};