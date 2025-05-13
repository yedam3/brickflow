//sqlList.js
const sales = require('./sqls/sales/sales.js');
const delivery = require('./sqls/sales/delivery.js');
const mat = require('./sqls/mat/mat.js');
const fac = require('./sqls/fac/fac.js');
const prodcheck = require('./sqls/qual/prodcheck.js');
const agTest = require('./sqls/agTest.js')
const matCheck = require('./sqls/mat/matCheck.js');
const matStore = require('./sqls/mat/matStore.js');

const work = require('./sqls/work/work.js');
const order = require('./sqls/work/order.js');
const process = require('./sqls/work/process.js');

const procedure = require('./sqls/prodTest/procedure.js')
const prodTest = require('./sqls/prodTest/prodTest.js')

const bom = require('./sqls/admin/bom.js');
const processFlow = require('./sqls/admin/processFlow.js');
const label = require('./sqls/mat/label.js');
const mainPage = require('./sqls/mainPage/mainPage.js');
const login = require('./sqls/login/login.js');
const employees = require('./sqls/admin/employees.js');



const prodFinished = require('./sqls/sales/finish.js')
module.exports = {
    ...sales,
    ...mat,
    ...fac,
    ...prodcheck,
    ...agTest,
    ...matCheck,
    ...matStore,
    ...work,        // 생산 - 
    ...order,       // 생산 - 지시
    ...process,     // 생산 - 공정
    ...procedure,
    ...prodTest,
    ...bom,
    ...processFlow,
    ...label,
    ...mainPage,
    ...delivery,
    ...login,
    ...employees,
    ...prodFinished,
}