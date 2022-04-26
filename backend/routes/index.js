const configJSON = require("../config/config-json");
const { getRecordTypes } = require("./contact");

exports.indexRedirect = function (req, res) {
  console.log("redirect redirect redirect redirect");
  return res.redirect("/index.html");
};

exports.index = function (connection, moduleDirectory) {
  return async (req, res) => {
    try {
      return res.render(`${moduleDirectory}/backend/views/index`, {
        roles: await getRecordTypes(connection),
      });
    } catch (err) {
      console.error(err);
      res.status(401).json({ error: "Bad login" });
    }
    // return res.sendFile(`${moduleDirectory}/views/index`);
  };
};

exports.config = function (req, res) {
  // Journey Builder looks for config.json when the canvas loads.
  // We'll dynamically generate the config object with a function
  return res.status(200).json(configJSON(req));
};
