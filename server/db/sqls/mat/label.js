const labelList = `

 SELECT c.prod_check_code,
	    getProdName(c.prod_code) AS prod_name,
	    work_lot,
	    c.prod_code,
        pass_quantity - sum(IFNULL(quantity,0)) AS pass_quantity
FROM prod_check c  LEFT JOIN finishStore f
                  ON(c.prod_check_code = f.prod_check_code)
GROUP BY c.prod_check_code
HAVING pass_quantity > 0
:searchcondition
`

module.exports={
    labelList,
}