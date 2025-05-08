// 생산 지시 목록 조회 - 생산 완료(WS3) 제외
const findAllProduct_order = `
SELECT po.product_order_code, getProdName(wp.prod_code) AS prod_name, wp.process_sequence, wp.order_quantity, wp.input_quantity, wp.created_quantity, wp.error_quantity,
	CASE
        WHEN (wp.created_quantity + (wp.error_quantity - wp.order_quantity)) = wp.input_quantity AND wp.input_quantity > 0 THEN '부분생산완료'
        WHEN (wp.created_quantity + (wp.error_quantity - wp.order_quantity)) < wp.input_quantity THEN '생산중'
        ELSE '지시중'
    END AS 'finish_status'
FROM work_process wp
	JOIN work_detail wd ON wd.product_order_detail_code = wp.product_order_detail_code
	JOIN product_order po ON po.product_order_code = wd.product_order_code AND po.finish_status NOT LIKE 'WS3'
WHERE wp.order_quantity > 0
`;

// 사원 목록 조회
const findAllEmployees = `

`;

// 설비 조회
const findAllFac = `

`;

module.exports = {
    findAllProduct_order,              // 생산 지시 목록 조회 - 생산 완료(WS3) 제외
    findAllEmployees,                  // 사원 목록 조회
    // 설비 조회
}