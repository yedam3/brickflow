// 생산지시코드 자동증가
const getOrder_code = `
SELECT CONCAT('PO-',IFNULL(MAX(CAST(SUBSTR(product_order_code, 4) AS SIGNED)),100)+1) AS product_order_code
FROM product_order
`;

// 자재 요구량 조회
const findMatReqByPlan_code = `
SELECT pd.prod_code, b.mat_code, m.mat_name,
    SUM(pd.plan_quantity * b.quantity) AS req_material_quantity,
    MAX(s.store_quantity) AS material_input_qunatity,
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
WHERE p.plan_code = ?;
`;

// 생산지시 등록
const insertInstr = `

`;

module.exports = {
    getOrder_code,
    findMatReqByPlan_code,

    findAllPlanOrder,
    findStatusByPlan_code,
    insertInstr,
};