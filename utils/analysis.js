//
const axios = require("axios"); //handle api

//Keys from https://www.text2data.com
const PrivateKey = "4CA973EA-1A98-44B9-A277-78DAFE0B01C0";
const Secret = "qwerty";

//Given Text, Returns Analysis
module.exports = (DocumentText) => {
  return axios({
    method: "post",
    url: "http://api.text2data.com/v3/analyze",
    data: {
      DocumentText,
      IsTwitterContent: false,
      PrivateKey,
      Secret,
      UserCategoryModelName: "",
      DocumentLanguage: "en",
      SerializeFormat: 1,
      RequestIdentifier: "",
    },
  }).then((res) => res.data);
};
