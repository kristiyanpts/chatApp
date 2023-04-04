const path = require("path");

module.exports = {
  entry: "./src/app.js",
  mode: "development",
  output: {
    path: path.resolve("/public/", "dist"),
    filename: "bundle.js",
  },
};
