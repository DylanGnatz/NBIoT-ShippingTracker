const app = require("./app");

var datetime = new Date().toLocaleString();
var result = app.insertQuery(1234, "abcdefg", 34, 23, 0, 1, 0, 0);
console.log(result);
