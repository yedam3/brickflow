// env 파일을 읽어들이는 코드 => 가능한 가장 첫번쨰 줄에 작성 
require("dotenv").config({ path: "./db/configs/dbConfig.env" });
const express = require("express");
const app = express();
// 미들웨어 등록 영역
// 1. body parser
// content-type : application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false , limit: '20mb' }));
// content-type : application/json
app.use(express.json({ limit: '20mb' }));

//세션 이용
const session =require('express-session');
//cors 이용
const cors = require('cors');

// Server 실행
app.listen(3000, () => {
    console.log("Server Start");
    console.log("http://localhost:3000");
});

//세션설정
let sessionSettion = session({
    secret : '@$@)_TQWATI)_QW%Q^TEWYJIOWE!_$#!@$()',
    resave :false,
    saveUninitialized :false,
    //세션을 얼마나 가지고 있을건지 설정
    cookie :{
        httpOnly : true,
        secure : false,
        //유효기간
        maxAge : 60000000000000

    }
})
// 라우팅 등록 영역
const salesRouter = require("./routers/salesrouter/sales_router.js");
const deliveryRouter = require("./routers/salesrouter/delivery_router.js");
const returnRouter = require("./routers/salesrouter/return_router.js");

const workRouters = require("./routers/workRouter/work_routers.js");
const matRouter = require("./routers/matRouter/mat_router.js");
const matCheckRouter = require("./routers/matRouter/mat_check_router.js");
const qualRouter = require("./routers/qualRouter/prodCheck_router.js");
const facRouter = require("./routers/facRouter/fac_router.js");
const agTest = require("./routers/agTest_router.js");

const matRedayRouter = require("./routers/matRouter/mat_stroe_router.js");

const proceRouter = require('./routers/proceRouter/proce_Router.js');
const prodTestRouter = require('./routers/prodTestRouter/prodTest_router.js');

const processRouter = require('./routers/adminRouter/processFlow_router.js');
const bomRotuer = require('./routers/adminRouter/bom_router.js');

const labelRouter = require('./routers/matRouter/label_router.js');

const mainPageRouter = require('./routers/mainRouter/main_router.js');

const loginRoter = require('./routers/loginRouter/login_router.js');
const prodCheckRouter = require('./routers/qualRouter/prodCheck_router.js');
const salesFinishRouter = require('./routers/salesrouter/finish_router.js');

const path = require('path');

const employeesRouter = require('./routers/adminRouter/employees_router.js');
const companyRouter = require('./routers/adminRouter/companry_router.js');
// 기본 라우팅
app.get("/", (req, res) => {
    res.send("Welcome!!");
});
//세션활용
app.use(sessionSettion);
// //CORS 모든 정책활용
app.use(cors());
// 라우터 모듈 등록
app.use("/sales", salesRouter);
app.use("/sales", deliveryRouter);
app.use("/sales", returnRouter);

app.use("/mat", matRouter);
app.use("/work", workRouters);
app.use("/fac", facRouter);
app.use("/", agTest);

app.use("/mat", matCheckRouter);

app.use('/mat',matRedayRouter);
app.use('/proce',proceRouter);
app.use('/test',prodTestRouter);

app.use('/admin',processRouter);
app.use('/admin',bomRotuer);
app.use('/label',labelRouter);

app.use('/main',mainPageRouter);
app.use('/',loginRoter);

app.use('/uploads/facImages', express.static(path.join(__dirname, 'uploads/facImages')));

app.use('/admin',employeesRouter);
app.use('/admin', companyRouter);


app.use('/qual',prodCheckRouter);
app.use('/sales',salesFinishRouter);
app.use('/qual',prodCheckRouter);
