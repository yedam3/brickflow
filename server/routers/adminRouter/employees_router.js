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
    res.send(empInfo);
})



module.exports = router;