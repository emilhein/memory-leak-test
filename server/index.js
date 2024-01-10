const express = require("express");
const path = require('path');
// const { fileURLToPath } = require('url');

// let __filename = fileURLToPath(
//     import.meta.url); // get the resolved path to the file
// const __dirname = path.dirname(__filename);
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "../public")));



app.use(express.static(path.join(__dirname, "public")));
module.exports = app
// export default app;