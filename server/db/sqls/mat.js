const autoMatCode = `SELECT CONCAT('moc-',IFNULL(MAX(CAST(SUBSTR(mat_order_code,5) AS SIGNED)),100)+1) AS mat_order_code
FROM matOrders;
`;

const matList = `
  SELECT mat_code,
       mat_name,
       unit,
       by_unit_number,
       size,
       safe_inventory
  FROM mat 
`;

module.exports = {
  autoMatCode,
  matList,
};
