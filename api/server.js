const db_sequelize = require("./db_sequelize");
const helpers = require("./helpers");
const uuid = require("uuid");
const express = require("express");
const bodyParser = require("body-parser");
// Set up the express app
const app = express();

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

app.post("/fromSIM", function(req, res) {
  console.log(req.body);
  let command = req.body.Command;
  let commandF = helpers.parseString(command);
  obj = JSON.parse(commandF);
  console.log(obj);
  let EID = uuid.v1();
  let timestamp = helpers.getDateTimeString();
  let SIM = req.body.SimSid;
  let temp = obj.temp;
  let hum = obj.hum;
  let n_s = obj.n_s == "N" ? 1 : -1;
  let e_w = obj.e_w == "E" ? 1 : -1;
  let lat = helpers.convToDD(obj.deglat, obj.minlat, n_s);
  let long = helpers.convToDD(obj.deglong, obj.minlong, e_w);

  let result = db_sequelize.addEvent(
    EID,
    timestamp,
    SIM,
    temp,
    hum,
    lat,
    n_s,
    long,
    e_w
  );
  console.log(result);
  res.json({
    created: true
  });
});

app.get("/getEvents/:SIM", function(req, res) {
  SIM = req.params.SIM;
  db_sequelize.getEventsBySIM(SIM).then(function(result) {
    res.json({
      events: result
    });
  });
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`server running on port 3000`);
});
