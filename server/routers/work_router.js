const express = require("express");
const router = express.Router();
const workService = require("../services/work_service.js");

router.get("/books", async (req, res) => {
    let bookList = await workService.findAll().catch((err) => console.log(err));
    res.send(bookList);
});

module.exports = router;