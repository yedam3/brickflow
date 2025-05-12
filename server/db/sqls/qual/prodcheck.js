// db/sqls/qual/prodcheck.js

// prod_check_code 자동 생성
const autoProdCheckCode = 
`SELECT CONCAT('pcc-',IFNULL(MAX(CAST(SUBSTR(prod_check_code,5) AS SIGNED)),100)+1) AS prod_check_code
FROM prod_check`;

// error_reason_code 자동 생성
const autoErrorReasonCode = 
`SELECT CONCAT('err-',IFNULL(MAX(CAST(SUBSTR(error_reason_code,5) AS SIGNED)),100)+1) AS error_reason_code
FROM error_standard`;

//제품검수
//1. 제품검수목록테이블 조회
const prodCheckList = `SELECT w.process_sequence, 
                              created_quantity - SUM(IFNULL(check_quantity,0)) AS quantity ,
                              w.prod_code,
                              w.work_lot,
                              getProdName(w.prod_code) as prod_name
                        FROM  work_process w  LEFT JOIN prod_check c ON(c.work_lot = w.work_lot)
                        WHERE process_sequence = (SELECT MAX(process_sequence)
                        FROM work_process w2
                        WHERE w2.product_order_detail_code = w.product_order_detail_code)
                        GROUP BY w.prod_code,w.product_order_detail_code
                        HAVING quantity > 0`;

//2. 제품검수 저장
// 먼저 다 삭제 안하고 등록만 하는 이유
// : 행추가 행삭제도 없고 수정도 없어서

const prodCheckSave = `INSERT INTO prod_check(prod_check_code, prod_code, check_date, pass_quantity, error_quantity, work_lot,check_quantity)
                          VALUES(?, ?, NOW(), ?, ?, ?,?)`;
const errorstandardSave = `INSERT INTO error_standard(error_reason_code, prod_code, check_list,  prod_check_code, check_error_quantity)
                          VALUES(?, ?, ?, ?, ?)`


module.exports = {
  autoProdCheckCode,
  prodCheckList,
  prodCheckSave,
  errorstandardSave,
  autoErrorReasonCode,
}