// db/sqls/qual.js
// Table : b_admin_bom

// bom관리
const bomlist =
`SELECT BOM_code, 
        mat_code, 
        prod_code, 
        quantity, 
        bom_add_date, 
        pass_or_not, 
        emp_code
FROM BOM;`

module.exports = {
    bomlist,

};