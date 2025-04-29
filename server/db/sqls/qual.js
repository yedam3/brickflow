// db/sqls/qual.js
// Table : b_admin_bom

// 제품 조회
const prodList = `SELECT prod_code,
	                     prod_name
                         FROM prod;`
// BOM 조회


module.exports = {
    prodList,
    

};