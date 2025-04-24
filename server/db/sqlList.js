const sales = require('./sqls/sales.js');
const work = require('./sqls/work.js');
const mat = require('./sqls/mat.js');
const fac = require('./sqls/fac.js');
const qual = require('./sqls/qual.js');

module.exports = {
    ...work,
    ...sales,
    // ...work,
    // ...mat,
    // ...fac,
    // ...qual,
}