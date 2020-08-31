const Company = require("../models/company");
const analize = require("../utils/analysis");

function getAll(req, res, next) {
  Company.find({}, (err, results) => {
    if (err) return next(err);
    res.render("companies", { results });
  });
}

function getOne(req, res, next) {
  Company.findOne({ _id: req.params.id })
    .populate("comments.student")
    .exec((err, results) => {
      if (err) return next(err);
      res.render("company", { results });
    });
}

function add(req, res, next) {
  let company = new Company({
    name: req.body.name,
    description: req.body.description,
    image: req.body.profile_pic,
  });

  company.save((err) => {
    if (err) return next(err);
    res.redirect("/users/profile");
  });
}

function remove(req, res, next) {
  Company.deleteOne({ _id: req.params.id }, (err) => {
    if (err) return next(err);
    res.redirect("/users/profile");
  });
}

function addFeedback(req, res, next) {
  Company.findOne({ _id: req.body.companyId }, async (err, company) => {
    if (err) return next(err);
    if (!res.locals.user)
      return res.send("Not signed in, <a href='/users/login'>Login</a>");
    let comment = {
      student: res.locals.user._id,
      content: req.body.content,
      date: Date.now(),
    };
    if (!company) return res.send(":(");
    company.comments.push(comment);

    {
      //combine all comments
      let AllComments = company.comments.map((item) => item.content).join(". ");
      //run the analysis API
      let analysisResult = await analize(AllComments);
      //check that analysis works
      if (analysisResult.DocSentimentResultString != null) {
        company.analysis =
          analysisResult.DocSentimentPolarity +
          analysisResult.DocSentimentValue;
        //saves results to company's database
      }
    }

    company.save();
    res.redirect(`/companies/${company.id}`);
  });
}

function update(req, res, next) {
  let update = {
    _id: req.params.id,
    name: req.body.name,
    description: req.body.description,
    image: req.body.profile_pic,
  };

  Company.findOneAndUpdate({ _id: req.params.id }, update, (err) => {
    if (err) return next(err);
    res.redirect("/users/profile");
  });
}

module.exports = { getAll, getOne, addFeedback, add, remove, update };
