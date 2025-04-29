const matOrderCheckList = `
  SELECT m.mat_order_code,
	   d.mat_order_detailCode,
       mat_order_name,
       getComName(company_code) AS company_name,
       getMatName(d.mat_code) AS mat_name,
       request_quantity,
       CASE 
            WHEN request_quantity = SUM(IFNULL(mat_check_error,0)) THEN '반품처리'
            WHEN request_quantity = SUM(IFNULL(check_quantity,0)) THEN '검수완료'
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
   SELECT SUM(IFNULL(check_quantity,0)) AS already_check_quantity,
		 request_quantity - SUM(IFNULL(check_quantity,0)) AS not_check_quantity,
         d.mat_code,
		 getMatName(d.mat_code) mat_name,
         request_quantity,
          mat_order_code,
         d.mat_order_detailCode
         
  FROM matOrderDetail d LEFT JOIN mat_check c 
						  ON (d.mat_order_detailCode = c.mat_order_detailCode)
  WHERE d.mat_order_detailCode = ?
  GROUP BY d.mat_code,request_quantity
`

const successCheckAdd = `
  INSERT INTO mat_check (check_code,
                         mat_code,
                         check_quantity,
                         check_status,
                         check_history,
                         check_date,
                         mat_check_pass,
                         mat_check_error,
                         mat_order_detailCode)
  SELECT CONCAT('mck-',IFNULL(MAX(CAST(SUBSTR(check_code,5) AS SIGNED)),100)+1),
                ?,
                ?,
                'OG1',
                ?,
                CURDATE(),
                ?,
                0,
                ?
  FROM mat_check
`
const errCheckAdd =`
  INSERT INTO mat_check (check_code,
                         mat_code,
                         check_quantity,
                         check_status,
                         check_history,
                         check_date,
                         mat_check_pass,
                         mat_check_error,
                         mat_order_detailCode)
  SELECT CONCAT('mck-',IFNULL(MAX(CAST(SUBSTR(check_code,5) AS SIGNED)),100)+1),
                ?,
                ?,
                'OG2',
                ?,
                CURDATE(),
                0,
                ?,
                ?
  FROM mat_check
`
const errorReason = `
  INSERT INTO mat_error_reason(mat_reason_code,mat_error_name,check_code,mat_check_error,mat_error_code)
  SELECT CONCAT('mrc-',IFNULL(MAX(CAST(SUBSTR(mat_reason_code,5) AS SIGNED)),100)+1),
   ?,
   (SELECT CONCAT('mck-',IFNULL(MAX(CAST(SUBSTR(check_code,5) AS SIGNED)),100)) 
   FROM mat_check ),
   ?,
   ?
  FROM mat_error_reason`;

  const statusCheck = `
    SELECT 
		CASE
          WHEN sum(IFNULL(request_quantity,0)) =  (SELECT sum(IFNULL(mat_check_error,0))
												   FROM matOrderDetail d LEFT JOIN mat_check c
												   ON(d.mat_order_detailCode = c.mat_order_detailCode)
                                                   WHERE mat_order_code = ?
                                                   ) THEN 'MS3'
          WHEN sum(IFNULL(request_quantity,0)) = (SELECT sum(IFNULL(check_quantity,0))
                                                     FROM matOrderDetail d LEFT JOIN mat_check c
												   ON(d.mat_order_detailCode = c.mat_order_detailCode)
                                                   WHERE mat_order_code = ?
                                                   )  THEN 'MS2'
        WHEN sum(IFNULL(request_quantity,0)) > (SELECT sum(IFNULL(check_quantity,0))
                                                     FROM matOrderDetail d LEFT JOIN mat_check c
												   ON(d.mat_order_detailCode = c.mat_order_detailCode)
                                                   WHERE mat_order_code = ?
                                                   )  THEN 'MS4'
END status
FROM matOrderDetail 
WHERE mat_order_code = ?
  `
const statusUpdate  = `
  UPDATE matOrders
  SET status = ?
  WHERE mat_order_code =? 
`

module.exports = {
  matOrderCheckList,
  matCheckRender,
  successCheckAdd,
  errCheckAdd,
  errorReason,
  statusCheck,
  statusUpdate
}