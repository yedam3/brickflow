//검사대기 리스트
const testReadyList = `
SELECT o.product_order_name,
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
GROUP BY  o.product_order_name,
       p.work_lot,
	   p.prod_code
HAVING 1=1 
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

 module.exports = {
    testReadyList,
    testMenuList
 }