const Company = require("../models/company");
const analize = require("../utils/analysis");

function getAll(req, res, next) {
  Company.find({}, (err, results) => {
    if (err) return next(err);
    results = results.sort((a, b) => {
      console.log(a.analysis.DocSentimentValue, a.name);
      return a.analysis.DocSentimentValue - b.analysis.DocSentimentValue;
    });
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

/*prettier-ignore*/

function addFeedback(req, res, next) {
  //Get Compnay by id
  Company.findOne({ _id: req.body.companyId }, async (err, company) => {
    if (err) return next(err); //if company doesn't exist, stop
    if (!res.locals.user) //if user isn't signed in send a login link
      return res.send("Not signed in, <a href='/users/login'>Login</a>");

    let comment = {//define the comment
      student: res.locals.user._id,
      content: req.body.content,
      date: Date.now(),
    };
    company.comments.push(comment);//add the comment to company's comments

    {
      //combine all comments, add a "."
      // (combining is done to reduce analysis api usage)
      let AllComments = company.comments.map((item) => item.content).join(". ");
      //run the analysis API
      let analysisResult = await analize(AllComments);
      //update the anaylsis result to the company IF the analysis succeded
      if (analysisResult.DocSentimentResultString != null)
        company.analysis = analysisResult;
    }

    company.save(); //saves results to company's database
    Company.find({}, async (err, companies)=>{
      res.render('profile', {isFeedbackAdded: true, companies  });//CANCEllED: redirect to refresh the page
    })
                                                  //for no reason: refresh the page :|
  });
}

function deleteComments(req, res, next) {
  Company.findOneAndUpdate(
    { _id: req.params.id },
    { comments: [], analysis: undefined },
    (err) => {
      if (err) return next(err);
      res.redirect("/users/profile");
    }
  );
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

module.exports = {
  getAll,
  getOne,
  addFeedback,
  add,
  remove,
  update,
  deleteComments,
};
