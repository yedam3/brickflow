//sqlList.js
const sales = require('./sqls/sales/sales.js');
const delivery = require('./sqls/sales/delivery.js');
const work = require('./sqls/work/work.js');
const order = require('./sqls/work/order.js');
const mat = require('./sqls/mat/mat.js');
const fac = require('./sqls/fac/fac.js');
const qual = require('./sqls/qual/qual.js');
const agTest = require('./sqls/agTest.js')
const matCheck = require('./sqls/mat/matCheck.js');
const matStore = require('./sqls/mat/matStore.js');

const procedure = require('./sqls/prodTest/procedure.js')
const prodTest = require('./sqls/prodTest/prodTest.js')

const label = require('./sqls/mat/label.js');
const mainPage = require('./sqls/mainPage/mainPage.js');





module.exports = {
    ...work,
    ...sales,
    ...work,
    ...order,
    ...mat,
    ...fac,
    ...qual,
    ...agTest,
    ...matCheck,
    ...matStore,
    ...procedure,
    ...prodTest,
    ...label,
    ...mainPage,
    ...delivery,
}