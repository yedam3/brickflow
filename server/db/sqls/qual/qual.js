// db/sqls/qual.js
// Table : b_admin_bom

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
                        getProdName(prod_code) as prod_name
                        FROM BOM
                 WHERE prod_code = ?`;

// BOM 등록
const bomInsert = 
`INSERT INTO (mat_code, prod_name, mat_name, quantity)
VALUES(?, ?, ?, ?)`;

module.exports = {
    prodList,
    bomList,
    bomInsert,
};