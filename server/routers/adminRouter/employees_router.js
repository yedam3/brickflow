const express = require("express");
const router = express.Router();
const employeesService = require("../../services/adminService/employees_service.js");

// 사원목록조회
router.get('/employees/', async (req, res) => {
    let empList = await employeesService.empList()
                                        .catch((err) => console.log(err));
    res.send(empList);
});
    
// 사원상세조회
router.get('/employees/:empno', async (req, res) => {
    let empNo = req.params.empno;
    let empInfo = await employeesService.empInfo(empNo)
                                        .catch((err) => console.log(err));
    res.send(empInfo, empInfo);
});

// 사원등록
router.post('/empsave', async(req,res) => {
    let empInfo = req.body;
    let result = await employeesService.saveEmp(empInfo)
                                        .catch((err) => console.log(err));
    res.send(result);
});

// 부서리스트
router.get('/departmentList',async(req,res) => {
    let result = await employeesService.empCodeList()
                                       .catch((err) => console.log(err));
    res.send(result);
});

// 수정
router.put('/empmodify', async(req,res) => {
    let empModify = req.body;
    let result = await employeesService.empModify(empModify)
                                        .catch((err) => console.log(err));
    res.send(result);
});

//삭제
router.delete('/empDelete/:empCode', async(req,res) => {
    let empCode = req.params.empCode;
    let result = await employeesService.empDelete(empCode)
                                       .catch((err) => console.log(err));
    res.send(result);
})
module.exports = router;