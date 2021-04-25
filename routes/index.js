const express = require("express");
const router = express.Router();
const user = require("./db");

module.exports = (params) => {
  router.use(function (req, res, next) {
    console.log(req.url, "@");
    next();
  });

  router.use("/user", user(params));

  return router;
};
