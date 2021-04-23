const express = require("express");
const bodyParser = require("body-parser");
const ObjectId = require("mongodb").ObjectId;
const { response } = require("express");
const router = express.Router();

// bodyParse setup
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

module.exports = (params) => {
  const { client } = params;
  router.get("/", async (req, res) => {
    try {
      let userDbData = await client
        .db("Save_Business_DB")
        .collection("Save_Business_Users")
        .findAll({})
        .toArray();
    } catch (e) {
      console.log("error on endpoint", e);
      return next(e);
    }
  });
  router.post("/c", async function (req, res) {
    let userDbData = await client
      .db("Save_Business_DB")
      .collection("Save_Business_Users")
      .insertOne(req.body);

    // res.redirect("/view/layout/saveBusiness.ejs");
  });

  return router;
};
