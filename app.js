const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

const submodules = [require("./backend/app")];

const app = express();

// parse application/json
// app.use(bodyParser.json());
app.use(
  bodyParser.raw({
    type: "application/jwt",
  })
);

app.set("port", process.env.PORT || 3000);
app.use("/", express.static(path.join(__dirname, "frontend")));
app.use(
  "/assets",
  express.static(
    path.join(__dirname, "/node_modules/@salesforce-ux/design-system/assets")
  )
);

submodules.forEach((sm) =>
  sm(app, {
    rootDirectory: __dirname,
  })
);

app.listen(app.get("port"), function () {
  console.log(`Express is running at localhost: ${app.get("port")}`);
});
