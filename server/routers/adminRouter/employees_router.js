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
    let {empList, empInfo} = req.body;
    let result = await employeesService.empSave(empList,empInfo)
                                        .catch((err) => console.log(err));
    res.send(result);
});

// 부서리스트
router.get('/departmentList',async(req,res) => {
    let result = await employeesService.departmentList()
                                       .catch((err) => console.log(err));
    res.send(result);
})

module.exports = router;