// 생산계획코드 자동증가
const getPlan_code = `
SELECT CONCAT('PLN-',IFNULL(MAX(CAST(SUBSTR(plan_code,5) AS SIGNED)),100)+1) AS plan_code
FROM plan
`;

// 주문 목록 조회
const findAllOrders = `
SELECT o.orders_code, o.order_name, o.note, o.finish_status, 
       DATE_FORMAT(o.orders_date, '%Y-%m-%d') AS orders_date,
       DATE_FORMAT(o.del_date, '%Y-%m-%d') AS del_date,
       CONCAT(
        prod.prod_name,
        CASE 
            WHEN COUNT(od.prod_code) > 1 THEN CONCAT(' 외 ', COUNT(od.prod_code) - 1, '건')
            ELSE ''
        END
    ) AS prod_name
FROM orders o
	JOIN order_detail od ON o.orders_code = od.orders_code
	JOIN prod prod ON od.prod_code = prod.prod_code
WHERE 1=1
    :searchCondition
GROUP BY o.orders_code, o.order_name, o.orders_date, o.del_date, o.note, o.finish_status
`;

// 주문 상세 조회
const findByOrders_code = `
SELECT 
    DATE_FORMAT(o.orders_date, '%Y-%m-%d') AS orders_date,
    DATE_FORMAT(o.del_date, '%Y-%m-%d') AS del_date,
    od.orders_code,
    '' AS start_date,
    '' AS end_date,
    od.prod_code,
    getProdName(od.prod_code) AS prod_name,
    od.quantity AS quantity,
    od.quantity - COALESCE((
        SELECT SUM(dmd.delivery_quantity)
        FROM delivery_manage dm
        JOIN delivery_manage_detail dmd ON dm.delivery_code = dmd.delivery_code
        WHERE dm.orders_code = od.orders_code AND dmd.prod_code = od.prod_code
    ), 0) AS unshippedQty,
    COALESCE((
        SELECT SUM(pd.plan_quantity)
        FROM plan p
        JOIN plan_detail pd ON p.plan_code = pd.plan_code
        WHERE p.orders_code = od.orders_code AND pd.prod_code = od.prod_code
    ), 0) AS prePlannedQty,
    GREATEST(od.quantity - COALESCE((
        SELECT SUM(pd.plan_quantity)
        FROM plan p
        JOIN plan_detail pd ON p.plan_code = pd.plan_code
        WHERE p.orders_code = od.orders_code AND pd.prod_code = od.prod_code
    ), 0), 0) AS unplannedQty,
    '' AS currentPlanQty
    
FROM order_detail od
    JOIN orders o ON od.orders_code = o.orders_code
WHERE od.orders_code = ?
ORDER BY od.orders_detail_code
`;

// 주문 상세 조회 (orders_code)
const findAllOrder_detailByOrders_code = `
SELECT orders_detail_code, orders_code
FROM order_detail
WHERE orders_code = ?
`;

// 생산 계획 조회
const findAllPlan = `
SELECT p.plan_code, o.order_name, p.plan_name, p.employee_code,
        DATE_FORMAT(p.start_date, '%Y-%m-%d') AS start_date,
        DATE_FORMAT(p.end_date, '%Y-%m-%d') AS end_date,
		CONCAT(
        prod.prod_name,
        CASE 
            WHEN COUNT(pd.prod_code) > 1 THEN CONCAT(' 외 ', COUNT(DISTINCT pd.prod_code) - 1, '건')
            ELSE ''
        END
    ) AS prod_name,
    p.finish_status, od.orders_code, p.note
FROM plan p
	JOIN plan_detail pd ON p.plan_code = pd.plan_code
	LEFT JOIN ( SELECT DISTINCT orders_code, prod_code 
			FROM order_detail
	) od ON p.orders_code = od.orders_code
    LEFT JOIN orders o ON od.orders_code = o.orders_code
    JOIN prod prod ON pd.prod_code = prod.prod_code
WHERE 1=1
    :searchCondition
GROUP BY p.plan_code, o.order_name, p.plan_name, p.start_date, p.end_date, p.finish_status, od.orders_code
`;

// 생산 계획 상세 조회
const findPlanDetailByPlan_code = `
SELECT pd.plan_detail_code, o.orders_code, pd.prod_code,
    DATE_FORMAT(o.orders_date, '%Y-%m-%d') AS orders_date,
    DATE_FORMAT(o.del_date, '%Y-%m-%d') AS del_date,
    getProdName(pd.prod_code) AS prod_name, od.quantity,
		od.quantity - COALESCE((
        SELECT SUM(dmd.delivery_quantity)
        FROM delivery_manage dm
        JOIN delivery_manage_detail dmd ON dm.delivery_code = dmd.delivery_code
        WHERE dm.orders_code = od.orders_code AND dmd.prod_code = od.prod_code
    ), 0) AS unshippedQty,
    COALESCE((
        SELECT SUM(pd.plan_quantity)
        FROM plan p
        JOIN plan_detail pd ON p.plan_code = pd.plan_code
        WHERE p.orders_code = od.orders_code AND pd.prod_code = od.prod_code
    ), 0) AS prePlannedQty,
    GREATEST(od.quantity - COALESCE((
        SELECT SUM(pd.plan_quantity)
        FROM plan p
        JOIN plan_detail pd ON p.plan_code = pd.plan_code
        WHERE p.orders_code = od.orders_code AND pd.prod_code = od.prod_code
    ), 0), 0) AS unplannedQty,
    pd.plan_quantity AS currentPlanQty,
    p.note
FROM plan_detail pd
	JOIN plan p ON pd.plan_code = p.plan_code
    LEFT JOIN orders o ON p.orders_code = o.orders_code
    LEFT JOIN order_detail od ON o.orders_code = od.orders_code AND pd.prod_code = od.prod_code
WHERE pd.plan_code = ?
`;

// 생산 번호 체크
const existsByPlan_code = `
SELECT COUNT(*) AS 'check'
FROM plan
WHERE plan_code = ?
`;

// 주문 상태 확인 (출고완료)
const findOrder_statusByOrders_code = `
SELECT COUNT(*) AS 'status'
FROM orders
WHERE orders_code = ? AND orders_code = 'OS4'
`;

// 생산 계획 등록
const insertPlan = `
INSERT INTO plan (plan_code, orders_code, plan_name, employee_code, start_date, end_date, finish_status, note)
VALUES (?, ?, ?, ?, ?, ?, 'OC1', ?)
`;

// 생산 계획 상세 등록
const insertPlanDetail = `
INSERT INTO plan_detail (plan_detail_code, plan_code, plan_quantity, prod_code)
SELECT 
  CONCAT('PD-',IFNULL(MAX(CAST(SUBSTR(plan_detail_code,4) AS SIGNED)),100)+1),
  ?, ?, ?
FROM plan_detail
`;

// 생산 계획 수정
const updatePlanByPlan_code = `
UPDATE plan 
SET 
    plan_name = ?,
    start_date = ?,
    end_date = ?,
    note = ?
WHERE plan_code = ? AND finish_status = 'OC1';
`;

// 생산 계획 상세 수정
const updatePlanDetailByPlan_code = `
UPDATE plan_detail
SET
    prod_code = ?,
    plan_quantity = ?
WHERE plan_detail_code = ? AND plan_code IN (SELECT
                                                plan_code
                                                FROM plan
                                                WHERE finish_status = 'OC1');
`;

// 생산 계획 삭제
const deletePlanByPlan_code = `
DELETE FROM plan 
WHERE plan_code = ? AND finish_status = 'OC1'
`;

// 생산 계획 상세 삭제
const deletePlanDetailByPlan_code = `
DELETE
FROM plan_detail 
WHERE plan_code = ?
`;

// 주문 상태 변경
const updateOrdersByOrders_code = `
UPDATE orders
SET
	finish_status = ?
WHERE orders_code = ?
`;

// 주문 상세 상태 변경
const updateOrderDetailByOrders_code = `
UPDATE order_detail
SET
    finish_status = ?
WHERE orders_detail_code = ?
`;

// 제품 검색
const findAllProd = `
SELECT prod_code, prod_name, unit, by_unit_number
FROM prod
WHERE 1=1
    :searchCondition
`;

// 생산 계획 상태 확인
const findPlanFinish_statusByPlan_code = `
SELECT finish_code
FROM plan
WHERE plan_code = ?
`;

// 주문 상태 조회
const findOrdersFinish_statusByOrders_code = `
SELECT finish_status AS 'status'
FROM orders
WHERE orders_code = ?
`

module.exports = {
    getPlan_code,
    findAllOrders,
    findByOrders_code,
    findAllOrder_detailByOrders_code,       // 주문 상세 조회 (orders_code)
    findAllPlan,
    findPlanDetailByPlan_code,              // 생산 계획 상세 조회
    existsByPlan_code,
    findOrder_statusByOrders_code,
    insertPlan,
    insertPlanDetail,
    updatePlanByPlan_code,
    updatePlanDetailByPlan_code,
    deletePlanByPlan_code,
    deletePlanDetailByPlan_code,
    updateOrdersByOrders_code,              // 주문 상태 변경
    updateOrderDetailByOrders_code,         // 주문 상세 상태 변경
    findAllProd,
    findPlanFinish_statusByPlan_code,       // 생산 계획 상태 확인

    findOrdersFinish_statusByOrders_code,   // 주문 상태 조회
};