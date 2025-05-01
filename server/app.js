// env 파일을 읽어들이는 코드 => 가능한 가장 첫번쨰 줄에 작성 
require("dotenv").config({ path: "./db/configs/dbConfig.env" });
const express = require("express");
const app = express();
// 미들웨어 등록 영역
// 1. body parser
// content-type : application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));
// content-type : application/json
app.use(express.json());
// Server 실행
app.listen(3000, () => {
    console.log("Server Start");
    console.log("http://localhost:3000");
});
// 라우팅 등록 영역
const salesRouter = require("./routers/salesrouter/sales_router.js");
const workRouters = require("./routers/workRouter/work_routers.js");
const matRouter = require("./routers/matRouter/mat_router.js");
const matCheckRouter = require("./routers/matRouter/mat_check_router.js");
const qualRouter = require("./routers/qualRouter/qual_router.js");
const facRouter = require("./routers/facRouter/fac_router.js");
const agTest = require("./routers/agTest_router.js");
const adminRouter = require("./routers/adminRouter/admin_router.js");

const matRedayRouter = require("./routers/matRouter/mat_stroe_router.js");

const proceRouter = require('./routers/proceRouter/proce_Router.js');
const prodTestRouter = require('./routers/prodTestRouter/prodTest_router.js');
// 기본 라우팅
app.get("/", (req, res) => {
    res.send("Welcome!!");
});
// 라우터 모듈 등록
app.use("/sales", salesRouter);
app.use("/mat", matRouter);
app.use("/work", workRouters);
app.use("/fac", facRouter);
app.use("/qual", qualRouter);
app.use("/", agTest);

app.use("/mat", matCheckRouter);
app.use("/admin", adminRouter);

app.use('/mat',matRedayRouter);
app.use('/proce',proceRouter);
app.use('/test',prodTestRouter);