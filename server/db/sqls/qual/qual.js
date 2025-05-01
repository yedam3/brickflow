// db/sqls/qual.js
// Table : b_admin_bom

// bom_code 자동 생성
const autoBomCode = 
`SELECT CONCAT('bom-',IFNULL(MAX(CAST(SUBSTR(BOM_code,5) AS SIGNED)),100)+1) AS BOM_code
FROM BOM`;

// 제품 조회
const prodList = `SELECT prod_code,
	                     prod_name
                         FROM prod`;
// BOM 조회
const bomList = `SELECT bom_code,
		                mat_code,
                        prod_code,
                        quantity,
                        bom_add_date,
                        pass_or_not,
                        emp_code,
                        getMatName(mat_code) as mat_name,
                        getProdName(prod_code) as prod_names
                        FROM BOM
                 WHERE prod_code = ?`;

// BOM 등록
const bomInsert = 
`INSERT INTO BOM (bom_code, mat_code, prod_code, quantity)
VALUES(?, ?, ?, ?)`;

module.exports = {
    autoBomCode,
    prodList,
    bomList,
    bomInsert,
};