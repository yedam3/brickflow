const countList = `
SELECT COUNT(orders_code) orderCount
FROM orders
WHERE DATE(orders_date) = CURDATE();
 

SELECT COUNT(mat_order_code) matOrderCount
FROM matOrders
WHERE DATE(request_date) = CURDATE();


SELECT COUNT(delivery_code) deliveryCount
FROM delivery_manage
WHERE DATE(delivery_date) = CURDATE();

SELECT COUNT(prod_lot) workCount
FROM finishStore
WHERE DATE(store_date) = CURDATE();
`
const lineChart = `
 SELECT getProdName(prod_code) prodName,
       DATE_FORMAT(store_date, '%a') AS day,
       SUM(IFNULL(quantity,0)) quantity
FROM finishStore
GROUP BY  getProdName(prod_code),
       DAYNAME(store_date)
`;
const barChart = `
 SELECT getMatName(mat_code) matName,
       DATE_FORMAT(delivery_date, '%a') AS day,
       sum(IFNULL(mat_out_quantity,0)) AS quantity
  FROM mat_use
  GROUP BY getMatName(mat_code),
           delivery_date
`
const pieChart = `
    SELECT 
        getProdName(a.prod_code) AS prodName,
        SUM(IFNULL(a.delivery_quantity,0))  AS quantity
    FROM delivery_manage d
    JOIN delivery_manage_detail a ON d.delivery_code = a.delivery_code
    GROUP BY a.prod_code
`
const popChart = `
    SELECT getMatName(mat_code) matName,
       SUM(IFNULL(store_quantity,0)) quantity
FROM mat_store
GROUP BY getMatName(mat_code)
`
module.exports={
    countList,
    lineChart,
    barChart,
    pieChart,
    popChart 
}