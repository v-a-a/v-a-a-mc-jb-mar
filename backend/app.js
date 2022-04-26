const express = require("express");
const jsforce = require("jsforce");
const { logger } = require("./logger");

const routes = require("./routes");
const activity = require("./routes/activity");
const { getContactFields } = require("./routes/contact");

require("dotenv-safe").config();

module.exports = async function marketingCloudJBCustomActivityFilterContact(
  app,
  options
) {
  const moduleDirectory = `${options.rootDirectory}`;
  // log in
  const connection = new jsforce.Connection();
  logger.info("Connection is opened");
  await connection.login(process.env.SF_LOGIN, process.env.SF_PASSWORD);

  // setup static resources
  app.use("/dist", express.static(`${moduleDirectory}/dist`));
  app.set("view engine", "pug");

  // setup the index redirect
  app.get("/", routes.indexRedirect);

  // setup index.html route
  app.get("/index.html", routes.index(connection, moduleDirectory));

  // setup config.json route
  app.get("/config.json", routes.config);

  // app.post("/contact/create", contactCreate(connection));
  app.get("/contact/fields", getContactFields(connection));

  // app.post('/save', activity.save);
  // app.post('/edit', activity.edit);
  // app.post('/validate', activity.validate);
  app.post("/publish", activity.publish);
  app.post("/execute", activity.execute(connection));
  // app.post('/stop', activity.stop);
};
