const db_functions = require("./db_functions");
const datetime = require("./datetime");
const uuid = require("uuid");
const express = require("express");
const bodyParser = require("body-parser");
// Set up the express app
const app = express();

//DB Connection info
const DB_UNAME = "xxxxx";
const DB_PASS = "xxxxx";
const DB_SERV = "xxxxx";
const DB_NAME = "xxxxx";
const TABLE_NAME = "xxxxx";

function insertQuery(
  EID,
  SIM,
  temp,
  hum,
  latitude,
  north_south,
  longitude,
  east_west
) {
  let timestamp = datetime.getDateTimeString();
  let is_north = north_south == "N" ? 1 : 0;
  let is_west = east_west == "W" ? 1 : 0;
  let query = `INSERT INTO ${TABLE_NAME} VALUES ('${EID}', '${timestamp}', '${SIM}', ${temp}, ${hum}, ${latitude}, ${is_north}, ${longitude}, ${is_west});`;
  console.log(query);
  let result = db_functions.query(query, DB_UNAME, DB_PASS, DB_SERV, DB_NAME);
  return result;
}

function parseString(inStr) {
  outStr = inStr.replace(/>/g, '"');
  outStr = outStr.replace(/</g, '"');
  return outStr;
}

function convToDD(deg, min) {
  return deg + min / 60;
}

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

app.get("/track"), function(req, res) {};

app.post("/fromSIM", function(req, res) {
  console.log(req.body);
  let command = req.body.Command;
  let commandF = parseString(command);
  obj = JSON.parse(commandF);

  let EID = uuid.v1();
  let SIM = req.body.SimSid;
  let temp = obj.temp;
  let hum = obj.hum;
  let lat = convToDD(obj.deglat, obj.minlat);
  let long = convToDD(obj.deglong, obj.minlong);
  let n_s = obj.n_s;
  let e_w = obj.e_w;

  let result = insertQuery(EID, SIM, temp, hum, lat, n_s, long, e_w);
  res.json({
    created: true
  });
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
