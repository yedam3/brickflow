const express = require("express");
const router = express.Router();
const adminService = require("../../services/adminService/admin_service.js");

router.get('/admin/bom', async (req, res) => {
    res.send("");
});

module.exports = router;