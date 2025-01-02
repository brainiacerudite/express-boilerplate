const express = require("express");
const config = require("../config");

const router = express.Router();

// register endpoints here
router.use(config.api.prefix, require("./app.route"));
router.use(config.api.prefix, require("./auth.route"));
router.use(config.api.prefix, require("./user.route"));

// register docs route here if any

// default route
router.get("/", (req, res) => {
  res.send(`Welcome to ${config.api.name}`);
});

module.exports = router;
