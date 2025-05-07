// db/sqls/qual.js
// Table : b_admin_bom

// bom_code 자동 생성
const autoBomCode = 
`SELECT CONCAT('bom-',IFNULL(MAX(CAST(SUBSTR(BOM_code,5) AS SIGNED)),100)+1) AS BOM_code
FROM BOM`;

// process_flow_code 자동 생성
const autoProFlowCode = 
`SELECT CONCAT('pro-',IFNULL(MAX(CAST(SUBSTR(process_flow_code,5) AS SIGNED)),100)+1) AS process_flow_code
FROM process_flow`;

// BOM 관리
// 1.제품 조회
const prodList = `SELECT prod_code,
	                     prod_name
                         FROM prod`;
// 2.BOM 조회
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

// 3.BOM 저장
// 일단 다 삭제
const bomDelete = `DELETE FROM BOM
                 WHERE prod_code = ?`

// 삭제 후 다시 등록
const bomSave = `INSERT INTO BOM (bom_code, mat_code, prod_code, quantity)
                    VALUES(?, ?, ?, ?)`

module.exports 
= {
    autoBomCode,
    autoProFlowCode,
    prodList,
    bomList,
    bomDelete,
    bomSave,
}