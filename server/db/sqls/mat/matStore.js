const possilbleList = `
 SELECT o.mat_order_code,
        m.check_code,
	      m.mat_code,
        getComName(o.company_code) company_name,
        getMatName(m.mat_code) mat_name,
        m.mat_check_pass
FROM mat_check m JOIN matOrderDetail d
				   ON(m.mat_order_detailCode = d.mat_order_detailCode)
                   JOIN matOrders o
                  ON(o.mat_order_code = d.mat_order_code)
WHERE mat_check_pass > 0
GROUP BY  o.mat_order_code,
          m.check_code,
	        m.mat_code
HAVING 1=1
:searchcondition
`;

module.exports = {
  possilbleList,
}