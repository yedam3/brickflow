// 생산 지시 목록 조회 - 생산 완료(WS3) 제외
const findProduct_orderByNotWS3 = `
SELECT product_order_code, plan_code, product_order_name, employee_code, start_date, end_date, finish_status, note
FROM product_order
WHERE finish_status NOT LIKE 'WS3'
`;

module.exports = {
    findProduct_orderByNotWS3,              // 생산 지시 목록 조회 - 생산 완료(WS3) 제외
}