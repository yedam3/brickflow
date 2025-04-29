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
    findPlanDetailByPlan_code,
    insertInstr,
};