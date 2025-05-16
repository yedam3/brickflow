const express = require("express");
const router = express.Router();
const matService = require("../../services/matService/mat_service.js");
const fs = require("fs");
const ejs = require("ejs");
const path = require("path");
const puppeteer = require("puppeteer");

let browser;  // 전역 변수로 선언

// 서버가 시작할 때 한번만 실행하는 함수
async function initBrowser() {
  if (!browser) {
    //크롬을 여는 것과 같음 launch()
    browser = await puppeteer.launch({
    //리눅스 서버에서 보안 모듈로 인해 옵션을 설정
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    // 브라우저를 화면 없이 백그라운드에서 실행 
    // 만약 true로 실행되면 화면에는 안보이지만 내부에서 크롬창이 띄워지고 보여짐
      headless: true,
    });
    console.log("펴터시작.");
  }
}

// 라우터 파일이 로드될 때 브라우저 초기화 시작
initBrowser()
.catch(err => {
  console.error("퍼피티어 에러", err);
});

//MatCode 자동증가
router.get("/autoMatCode", async (req, res) => {
    
    let autoMatCode = await matService.autoMatCode()
                                      .catch((err)=> console.log(err));
    res.send(autoMatCode);
});

//자재리스트
router.get("/matList", async (req, res) => {
    //쿼리 스트링 형식으로 받기
    const { type, keyword } = req.query;
    let matList = await matService.matList({type,keyword})
                                      .catch((err)=> console.log(err));
    res.send(matList);
});

//업체리스트
router.get("/comList", async (req, res) => {
    //쿼리 스트링 형식으로 받기
    const { type, keyword } = req.query;
    let comList = await matService.comList({type,keyword})
                                      .catch((err)=> console.log(err));
    res.send(comList);
});


//발주등록
router.post('/matOrderAdd',async(req,res)=>{
    const { matOrder, matOrderDetail } = req.body;
    let result = await matService.matOrderAdd(matOrder,matOrderDetail);
    res.send(result)
})

//발주리스트
router.get("/orderList", async (req, res) => {
    //쿼리 스트링 형식으로 받기
    const { type, keyword } = req.query;
    let comList = await matService.orderList({type,keyword})
                                      .catch((err)=> console.log(err));
    res.send(comList);
});
//메인그리드 Render
router.get("/render", async (req, res) => {
    //쿼리 스트링 형식으로 받기
    const { orderCode } = req.query;
    let list = await matService.orderRender(orderCode)
                                      .catch((err)=> console.log(err));
    res.send(list);
});
//상세그리드 Render
router.get("/detailRender", async (req, res) => {
    //쿼리 스트링 형식으로 받기
    const { orderCode } = req.query;
    let list = await matService.orderDetailRender(orderCode)
                                      .catch((err)=> console.log(err));
    res.send(list);
});
//값체크
router.get('/orderCheck',async (req,res)=>{
    const {orderCode} = req.query;
    let list= await matService.orderCheck(orderCode)
                               .catch((err)=> console.log(err));
    res.send(list);
})
//발주 수정
router.put('/modify',async(req,res)=>{
    const {matOrder,matOrderDetail} = req.body;
    let result = await matService.modifyOrder(matOrder,matOrderDetail)
                                 .catch((err)=> console.log(err));
    res.send(result);
})
//발주 삭제
router.delete('/delete/:ocd',async(req,res)=>{
    let orderCdoe = req.params.ocd;
    let result = await matService.deleteOrder(orderCdoe)
    res.send(result);
})
 
// //pdf다운로드
router.post('/pdfDownload',async(req,res) => {
    
    const {rowData,rowDataDetail} = req.body;
    
    const data = {
        mat_order_code : rowData[0].mat_order_code,
        mat_order_name : rowData[0].mat_order_name,
        company_name : rowData[0].company_name,
        request_date : rowData[0].request_date,
        note : rowData[0].note,
        delivery_date : rowData[0].delivery_date,
        detail: rowDataDetail.map(info => ({
            mat_name  : info.mat_name,
            request_quantity : info.request_quantity
        }))
    }
    //ejs 경로찾기
    const filePath  = path.join(__dirname,'/MatPdf.ejs');
    //ejs 파일 읽기
    const template = fs.readFileSync(filePath , 'utf-8');
    // ejs rendr에서 html에 닮기
    const html = ejs.render(template,data);
   
    //쓰던 browser 재활용
    const page = await browser.newPage();
    //해상도 낮춰서 속도 향상 시키기
    await page.setViewport({ width: 1280, height: 720 }); 
    await page.setContent(html, { waitUntil: 'domcontentloaded' });

    const pdfBuffer = await page.pdf({format : 'A4'});
    //페이지 닫기
    await page.close();
     res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=${data.mat_order_code}.pdf`,
    });
    res.send(pdfBuffer);
})
module.exports = router;
