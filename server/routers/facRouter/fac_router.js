const express = require("express");
const router = express.Router();
const facService = require("../../services/facService/fac_service.js");

const multer = require("multer");
const fs = require("fs");

const path = require("path");

// 저장 경로 지정
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = path.join(__dirname, '../../uploads/facImages');
      // 폴더가 없으면 생성
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const baseName = path.basename(file.originalname, ext);
        const originalName = Buffer.from(baseName, 'latin1').toString('utf8');
        const safeName = originalName.replace(/[^a-zA-Z0-9가-힣_]/g, '').slice(0, 30);
        const uniqueName = Date.now() + '-' + safeName + ext;
        cb(null, uniqueName);
    }
});
  
  
  const upload = multer({ storage });

// // 이미지 저장 경로
// const uploadDir = path.join(__dirname, "../../uploads/facImages");
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
// }

// multer 설정
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, uploadDir),
//   filename: (req, file, cb) => {
//     const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname);
//     cb(null, uniqueName);
//   }
// });
// const upload = multer({ storage });

// 이미지 업로드 라우터
router.post("/uploadImage", upload.single("image"), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "파일이 없습니다." });
    }
  
    const fileName = req.file.filename;
    res.json({ fileName });  // 클라이언트는 fileName만 필요함
});
  
//자동증가
router.get("/autoUnCode", async (req, res) => {
    let autoUnCode = await facService.autoUnCode().catch((err)=> console.log(err));
    res.send(autoUnCode);
})
router.get("/autoReCode", async (req, res) => {
    let autoReCode = await facService.autoReCode().catch((err) => console.log(err));
    res.send(autoReCode);
})
router.get("/autoFacCode", async (req, res) => {
    let autoFacCode = await facService.autoFacCode().catch((err) => console.log(err));
    res.send(autoFacCode);
})

//
router.get("/addFac", async (req, res) => {
    const { type, keyword } = req.query;
    let facList = await facService.findAll({ type, keyword }).catch(err => console.log(err));
    res.send(facList);
});

//비가동설비 리스트
router.get("/unFacList", async (req, res)=> {
    const { type, keyword } = req.query;
    let unplayList = await facService.unplayAll({type, keyword}).catch(err => console.log(err));

    res.send(unplayList);
})
//설비등록
router.post("/addFac", async (req, res)=> {
    const {facCode} = req.body;
    let result = await facService.addFac(facCode).catch(err => console.log(err));
    res.send(result);
})
//비가동 등록
router.post("/addUnFac", async (req,res)=>{
    const {unplayFac} = req.body;
    let result = await facService.addUnFac(unplayFac).catch(err => console.log(err));
    res.send(result);
})
//비가동수리 처리
router.post("/repaireFac", async (req,res)=>{
    const {repaireFac} = req.body;
    const result = await facService.repaireFac(repaireFac).catch(err => console.log(err));
    res.send(result);

});
//설비 수정
router.put("/updateFac", async(req, res)=> {
    const {facCode} = req.body;
    let result = await facService.updateFac(facCode).catch((err) => console.log(err));
    res.send(result);
})
//비가동설비 수정
router.put("/modifyUnplay", async(req, res)=>{
    const {unplayFac} = req.body;
    let result = await facService.modifyUnplay(unplayFac).catch((err) => console.log(err));
    res.send(result);
})
//비가동 업뎃
router.put('/updateList', async (req, res) => {
    const { facStatus, facCode } = req.body;
    // 현재 시각
    const endTime = new Date();
    // DB 업데이트 로직: 상태 + 종료일시 함께 저장
    let result = await facService.updateList({ facStatus, facCode })
      .catch((err) => {
        console.log(err);
        return res.status(500).json({ error: 'DB error' });
      });
    res.send(result);
})
//값 체크
router.get('/unFacCheck', async (req, res)=> {
    const {unplayCode} = req.query;
    let list = await facService.unFacCheck(unplayCode).catch((err)=> console.log(err));
    res.send(list);
})

//비가동 설비 삭제
// router.delete('/delUnplay/:ucd', async(req,res)=>{
//     let unplayCode = req.params.ucd;
//     let result = await facService.deleteUnplay(unplayCode)
//     res.send(result);
// })

//설비 모달리스트
router.get('/facModal', async (req, res) => {
    const {facCode}= req.query;
    let list = await facService.facModal(facCode).catch((err) => console.log(err));
    res.send(list);
})

//설비 리스트
router.get ('/facList', async (req, res)=>{
    const { type, keyword }= req.query;
    let list = await facService.facList({ type, keyword }).catch((err)=> console.log(err));
    res.send(list);
})
//수리리스트
router.get ('/repList', async (req,res)=>{
    const { type, keyword} = req.query;
    let list = await facService.repList({type, keyword}).catch((err)=> console.log(err));
    res.send(list);
})

//설비 상태 리스트
router.get('/facStatus', async (req, res)=>{
    const { type, keyword} = req.query;
    let list = await facService.statuFac({ type, keyword}).catch((err) => console.log(err));

    res.send(list);
})

//비가동 사유
router.get('/reasonFac', async(req,res) => {
    let result = await facService.reason().catch((err) => console.log(err));
    res.send(result)
})
//수리결과
router.get('/facResult', async(req, res) => {
    let result = await facService.facResult().catch((err)=> console.log(err));
    res.send(result)
})
//설비상태
router.get('/statusFac', async(req,res) => {
    let result = await facService.facStatus().catch((err)=> console.log(err));
    res.send(result)
}) 
//설비유형
router.get('/facPattern', async(req, res) => {
    let result = await facService.facPattern().catch((err)=> console.log(err));
    res.send(result);
})

//비가동수리
router.get('/repaireList', async(req, res)=>{
    const { type, keyword} = req.query;
    let list = await facService.repaireList({type, keyword}).catch((err)=> console.log(err));

    res.send(list);
})


module.exports = router;