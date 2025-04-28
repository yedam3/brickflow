
// 주문 목록 조회
const findAllOrders = `
SELECT o.orders_code, 
       o.order_name, 
       o.orders_date, 
       o.del_date, 
       o.note, 
       o.finish_status, 
       CONCAT(
        getProdName(od.prod_code),
        CASE 
            WHEN COUNT(od.prod_code) > 1 THEN CONCAT(' 외 ', COUNT(od.prod_code) - 1, '건')
            ELSE ''
        END
    ) AS prod_name
FROM orders o
JOIN order_detail od ON o.orders_code = od.orders_code
GROUP BY o.orders_code, o.order_name, o.orders_date, o.del_date, o.note, o.finish_status;
`;

// 주문 상세 조회
const findByOrders_code = `
SELECT od.orders_code, o.orders_date, o.del_date, getProdName(od.prod_code), od.quantity,
       AS unshippedQty,
       AS prePlannedQty,
       AS unplannedQty,
       AS currentPlanQty
FROM order_detail od
	JOIN orders o ON od.orders_code = o.orders_code
WHERE o.orders_code = ?
`;

// 생산 계획 등록

// 생산 계획 조회

module.exports = {
    findAllOrders,
};