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


// 공정흐름도 관리
// 1.제품 조회
const flowProdList = `SELECT prod_code,
                      prod_name
                      FROM prod`;

// 3.공정조회
const procList = `SELECT process_flow_code,
                         process_date,
                         process_sequence,
                         emp_code,
                         prod_code,
                         pf.process_code,
                         getProdName(prod_code) as prod_name,
                         p.process_name
                  FROM process_flow pf 
                  JOIN process p
                       ON (pf.process_code = p.process_code)
                  WHERE pf.prod_code = ?`; 

// 3.공정 저장
// 일단 다 삭제
const procDelete = `DELETE FROM process_flow
                    WHERE prod_code = ?`

// 삭제 후 다시 등록
const procSave = `INSERT INTO process_flow(process_flow_code, prod_code, process_code)
                    VALUES(?, ?, ?)`


// 제품검수 관리
// 1.제품조회
const pcprodList = `SELECT prod_code,
                      prod_name
                      FROM prod`;
module.exports = {
    autoBomCode,
    prodList,
    bomList,
    bomDelete,
    bomSave,
    flowProdList,
    procList,
    autoProFlowCode,
    procDelete,
    procSave,
    pcprodList,
};