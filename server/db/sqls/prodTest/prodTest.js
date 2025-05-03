//검사대기 리스트
const testReadyList = `
SELECT o.product_order_name,
       d.product_order_detail_code,
       p.work_lot,
	   p.prod_code,
       getProdName(p.prod_code) AS prod_name,
       p.order_quantity,
       p.process_code,
       (SELECT sum(input_quantity)
							FROM work_process
                            WHERE work_lot = p.work_lot) AS already_test,
       p.order_quantity - (SELECT sum(input_quantity)
							FROM work_process
                            WHERE work_lot = p.work_lot) AS not_test
FROM work_process p JOIN work_detail d 
                      ON(p.product_order_detail_code = d.product_order_detail_code)
				    JOIN product_order o
                      ON(o.product_order_code = d.product_order_code)
					 JOIN process m
                       ON(p.process_code = m.process_code)
WHERE m.process_type = 'PT2'
AND p.order_quantity > 0
GROUP BY  o.product_order_name,
       p.work_lot,
	   p.prod_code
HAVING 1=1 
AND not_test > 0
:searchcondition
 `
const testMenuList = `
 SELECT test_name,
       test_item,
       pass_standard,
       process_code
FROM check_standard
WHERE process_code =?
`
const testAdd = `
    INSERT INTO prod_check_finish(test_proc_code,
                              work_lot,
                              pass_or_not,
                              test_item,
                              test_name,
                              test_value)
 SELECT CONCAT('tpc-',IFNULL(MAX(CAST(SUBSTR(test_proc_code,5) AS SIGNED)),100)+1),?,?,?,?,?
 FROM prod_check_finish;
`
const workProcessUpdate = `
 CALL addTest(?, ?, ?, ?,@result);
 SELECT @result as result;
`
 module.exports = {
    testReadyList,
    testMenuList,
    testAdd,
    workProcessUpdate
 }