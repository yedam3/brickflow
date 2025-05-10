const express = require("express");
const bcrypt = require("bcrypt"); 
const router = express.Router();
const loginService = require("../../services/loginService/login_service.js");

router.post('/login', async (req, res) => {
  const { id, pwd } = req.body;

  let result = await loginService.login(id);
  console.log(result);
  
  //해당 id가 없으면 아이디 맞지않음
  if (result[0].empCount == 0) {
    res.send({ result: 'idIncorrect' });
    return;
  }
  //  // 1. 비밀번호 해시
  const saltRounds = 10;
  const hashedPwd = await bcrypt.hash(pwd, saltRounds);
  console.log(hashedPwd);
  // DB에서 가져온 해시값
  const hashedPwdFromDB = result[0].pwd;

  // 입력한 비밀번호와 해시값 비교
  const isMatch = await bcrypt.compare(pwd, hashedPwdFromDB);
  
  // 비밀번호가 맞지 않음
  if (!isMatch) {
    res.send({ result: 'pwdIncorrect' });
    return;
  }

  let department = result[0].departmentName;
  let empName = result[0].emp_name;
  req.session.empId = id;
  req.session.dep = department;
  req.session.empName = empName;

  console.log(req.session);
  res.send({ result: 'success' });
});

//세션값 가져오기
router.get('/session', (req, res) => {
  if (req.session.empId) {
    res.send({
      isLogin: true,
      id: req.session.empId,
      empName: req.session.empName,
      dep: req.session.dep
    });
  } else {
    res.send({ isLogin: false });
  }
});
//로그아웃
router.post('/logout',(req,res) => {
  req.session.destroy();
  res.send({result : 'success'});
})

module.exports = router;
