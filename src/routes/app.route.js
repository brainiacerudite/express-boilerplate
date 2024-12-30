const express = require("express");
const exampleController = require("../controllers/example.controller");

const router = express.Router();

router.get("/example", exampleController.example);

module.exports = router;
