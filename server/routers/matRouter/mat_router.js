const express = require("express");
const router = express.Router();
const matService = require("../../services/matService/mat_service.js");
const fs = require("fs");
const ejs = require("ejs");
const path = require("path");

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
    const {rowData} = req.body;
    const {rowDataDetail} = req.body;
    const puppeteer = require("puppeteer");

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
    const template = fs.readFileSync(filePath , 'utf-8');
    const html = ejs.render(template,data);

    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'domcontentloaded' });

    const pdfBuffer = await page.pdf({format : 'A4'});
    await browser.close();

    res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=order_${data.date}.pdf`,
    });
    res.send(pdfBuffer);
})
module.exports = router;
