// 생산지시코드 자동증가
const getOrder_code = `
SELECT CONCAT('PO-',IFNULL(MAX(CAST(SUBSTR(product_order_code, 4) AS SIGNED)),100)+1) AS product_order_code
FROM product_order
`;

// 생산지시 상태 확인
const findStatusByPlan_code = `
SELECT finish_status
FROM product_order
WHERE plan_code = ?;
`;

// 자재 홀드량
const getMat_HoldQty = `

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
    findStatusByPlan_code,
    getMat_HoldQty,
    insertInstr,
};