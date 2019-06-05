const tedious = require("tedious");
const Sequelize = require("sequelize");

//DB Connection info
const DB_UNAME = "gnatzd";
const DB_PASS = "1023323Dlwg!";
const DB_SERV = "shipping-tracker.database.windows.net";
const DB_NAME = "shipping-tracker-db";
const TABLE_NAME = "dbo.TrackingEvents";

const sequelize = new Sequelize(DB_NAME, DB_UNAME, DB_PASS, {
  host: DB_SERV,
  dialect: "mssql",
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },
  dialectOptions: {
    options: {
      encrypt: true
    }
  }
});

const TrackingEvent = sequelize.define(
  "TrackingEvent",
  {
    // attributes
    EventID: {
      type: Sequelize.STRING,
      allowNull: false
    },
    EventTime: {
      type: Sequelize.STRING,
      allowNull: false
    },
    SIMID: {
      type: Sequelize.STRING,
      allowNull: false
    },
    Temperature: {
      type: Sequelize.FLOAT,
      allowNull: false
    },
    Humidity: {
      type: Sequelize.FLOAT,
      allowNull: false
    },
    Latitude: {
      type: Sequelize.FLOAT,
      allowNull: false
    },
    IsNorth: {
      type: Sequelize.BOOLEAN,
      allowNull: false
    },
    Longitude: {
      type: Sequelize.FLOAT,
      allowNull: false
    },
    IsWest: {
      type: Sequelize.BOOLEAN,
      allowNull: false
    }
  },
  {}
);

function addEvent(EID, ET, SIM, temp, hum, lat, IN, long, IW) {
  TrackingEvent.sync({}).then(() => {
    TrackingEvent.create({
      EventID: EID,
      EventTime: ET,
      SIMID: SIM,
      Temperature: temp,
      Humidity: hum,
      Latitude: lat,
      IsNorth: IN,
      Longitude: long,
      IsWest: IW
    });
  });
}

function getEventsBySIM(SIM) {
  return TrackingEvent.findAll({
    where: {
      SIMID: SIM
    },
    order: [["updatedAt", "DESC"]]
  });
}

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch(err => {
    console.error("Unable to connect to the database:", err);
  });

module.exports.addEvent = addEvent;
module.exports.getEventsBySIM = getEventsBySIM;
