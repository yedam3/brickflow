// db/sqls/qual/prodcheck.js

//제품검수
//1. 제품검수목록테이블 조회
const prodList = `SELECT w.process_sequence, 
                          created_quantity - SUM(IFNULL(check_quantity,0)) AS quantity ,
                          w.prod_code,
                          w.process_code,
                          getProdName(w.prod_code) as prod_name
                          FROM  work_process w  LEFT JOIN prod_check c ON(c.work_lot = w.work_lot)
                          WHERE process_sequence = (SELECT MAX(process_sequence)
                          FROM work_process w2
                          WHERE w2.product_order_detail_code = w.product_order_detail_code)
                          GROUP BY w.prod_code,w.product_order_detail_code
                          HAVING quantity > 0`;
                          
                          
                          
                          
module.exports
= {
  prodList,
}