var express = require("express");
var router = express.Router();
var companyController = require("../controllers/company");

router.get("/", function (req, res, next) {
  companyController.getAll(req, res, next);
});

router.get("/:id", function (req, res, next) {
  companyController.getOne(req, res, next);
});

router.post("/", function (req, res, next) {
  companyController.add(req, res, next);
});

router.post("/feedback", function (req, res, next) {
  companyController.addFeedback(req, res, next);
});

router.put("/:id", function (req, res, next) {
  companyController.update(req, res, next);
});

router.get("/:id/DELETE", function (req, res, next) {
  companyController.remove(req, res, next);
});

router.get("/:id/comments/DELETE", function (req, res, next) {
  companyController.deleteComments(req, res, next);
});

module.exports = router;
