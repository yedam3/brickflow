const matOrderCheckList = `
  SELECT m.mat_order_code,
	   d.mat_order_detailCode,
       mat_order_name,
       getComName(company_code) AS company_name,
       getMatName(d.mat_code) AS mat_name,
       request_quantity,
       CASE 
            WHEN request_quantity = SUM(IFNULL(mat_check_pass,0)) THEN '검수완료'
            WHEN request_quantity = SUM(IFNULL(mat_check_error,0)) THEN '반품처리'
            WHEN IFNULL(check_quantity,0) = 0 THEN '검수대기'
            WHEN request_quantity > SUM(IFNULL(check_quantity,0)) THEN '검수중'
       END AS status
FROM matOrders m JOIN matOrderDetail d
                    ON (m.mat_order_code= d.mat_order_code)
				  LEFT JOIN mat_check c
                     ON (d.mat_order_detailCode = c.mat_order_detailCode)
GROUP BY        m.mat_order_code,
	   d.mat_order_detailCode,
       mat_order_name,
       getComName(company_code),
       getMatName(d.mat_code)
HAVING 1=1
:searchcondition

ORDER BY status, m.mat_order_code
`

const matCheckRender = `
    SELECT SUM(check_quantity) AS already_check_quantity,
		 request_quantity - SUM(check_quantity) AS not_check_quantity,
         d.mat_code,
		 getMatName(d.mat_code),
         request_quantity
         
  FROM matOrderDetail d JOIN mat_check c 
						  ON (d.mat_order_detailCode = c.mat_order_detailCode)
  WHERE d.mat_order_detailCode = ?
`
module.exports = {
  matOrderCheckList,
  matCheckRender
}