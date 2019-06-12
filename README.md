# Build your own shipment IoT GPS tracker/environmental monitor by leveraging narrowband with T-Mobile and Twilio

The global logistics market is projected to reach [\$15.5 trillion by 2023](https://www.prnewswire.com/news-releases/global-logistics-market-to-reach-us155-trillion-by-2023-research-report-published-by-transparency-market-research-597595561.html). Narrowband technology has the potential to revolutionize this industry by enabling billions of low-cost, long-range IoT devices with battery life up to 10 years. With narrowband, customers can poll the GPS location and environmental conditions of our shipment at regular intervals, allowing the them to remotely review the status of their shipment and ensure that their cargo is being transported at the optimal temperature and humidity.

To demonstrate this concept, let's build our own full-stack prototype of a NB-IoT shipment tracker, using T-Mobile's Narrowband Network and the Twilio NB-IoT DevKit and Breakout SDK. Following this guide, you will learn how to:

- Write and deploy a Breakout SDK sketch to the NB-IoT devkit.
- Transmit commands to Twilio via the T-Mobile Narrowband network.
- Deploy a relational database to the cloud with Azure SQL
- Create a back-end API with Node.js and Express to accept commands from our DevKit and serve requests from our client for data from the database.
- Send our tracker data to the server via webhooks from Twilio
- Create a front-end web app with React to allow our end-user to access tracking data.
- Deploy our client and server to Azure

## Requirements

### Hardware

- [Twilio DevKit for T-Mobile Narrowband](https://www.twilio.com/docs/wireless/quickstart/alfa-developer-kit) including:
  - [Twilio Narrowband SIM](https://www.twilio.com/wireless/narrowband)
  - Alfa developer board
  - LTE antenna
  - GPS antenna
  - Grove temperature/humidity sensor
  - Micro-usb cable
  - Lithium battery

### Software

- [Arduino IDE](https://www.arduino.cc/en/Main/Software)
- [Twilio Breakout SDK](https://github.com/twilio/Breakout_Arduino_Library/tree/master/src/BreakoutSDK)
- [Visual Studio Code](https://code.visualstudio.com/) (for convenient deployment to Azure)
- [Node.js](https://nodejs.org/en/)
- [React](https://reactjs.org/)

### Accounts

- [Twilio](https://www.twilio.com/)
- [Microsoft Azure Trial Account](https://azure.microsoft.com/en-us/) (includes \$200 of free credit)
- [Google Developer Account](https://developers.google.com/) (for access to the Google Maps API)

## 1. Configure the DevKit and Arduino IDE

For a detailed tutorial on how to setup your NB-IoT DevKit and Arduino environment , check out [this guide](https://www.twilio.com/blog/pioneer-nb-iot-with-twilios-alfa-development-kit).

Remove the components from your DevKit. Attach the lithium battery, temperature/humidity sensor, LTE antenna, GPS antenna, and micro USB cable to the board. Connect the board to your computer with the mico USB cable.

Download the [Breakout Arduino SDK from GitHub](https://www.twilio.com/blog/pioneer-nb-iot-with-twilios-alfa-development-kit) and add it as a .zip library in the Arduino IDE.

In the IDE, navigate to Arduino -> Preferences and paste the following URL in the field called "Additional Board Manager URLS."

https://raw.githubusercontent.com/Seeed-Studio/Seeed_Platform/master/package_seeeduino_boards_index.json

Navigate to Tools -> Board -> Boards Manager and install the board manager "Seeed STM32F4 Boards version 1.2.3+".

Select the appropriate board and port from the Tools menu. The board is called "Wio Tracker LTE".

## 2. Register the narrowband SIM with Twilio

Pop out the T-Mobile Narrowband Nano SIM (the smallest size), from the SIM card. Log in to Twilio and [register the SIM Card](https://www.twilio.com/console/wireless/sims/register) with the registration code located on the back of the card. Pop the nano SIM into SIM slot on the DevKit board.

## 3. Create and upload the Breakout sketch to the DevKit

The Breakout SDK offers several example sketches for getting started with the various sensors (File -> Examples -> Breakout Arduino Library -> Sensors). We'll use the Temperature/Humidity example as our template and modify it according to our needs:

```C++
#include <DHT.h>

#include <board.h>
#include <BreakoutSDK.h>
#include <stdio.h>
//https://github.com/Seeed-Studio/Grove_Temperature_And_Humidity_Sensor
#include <DHT.h>

/** Change this to your device purpose */
static const char *device_purpose = "Dev-Kit";
/** Change this to your key for the SIM card inserted in this device
 *  You can find your PSK under the Breakout SDK tab of your Narrowband SIM detail at
 *  https://www.twilio.com/console/wireless/sims
*/
static const char *psk_key = "00112233445566778899aabbccddeeff";

/** This is the Breakout SDK top API */
Breakout *breakout = &Breakout::getInstance();

#define SENSOR_PIN (D38)
#define LOOP_INTERVAL (1 * 1000)
#define SEND_INTERVAL (10 * 60 * 1000)
#define DHTTYPE DHT11   // DHT 11

DHT dht(SENSOR_PIN, DHTTYPE);

void setup() {
  dht.begin();
  // Feel free to change the log verbosity. E.g. from most critical to most verbose:
  //   - errors: L_ALERT, L_CRIT, L_ERR, L_ISSUE
  //   - warnings: L_WARN, L_NOTICE
  //   - information & debug: L_INFO, L_DB, L_DBG, L_MEM
  // When logging, the additional L_CLI level ensure that the output will always be visible, no matter the set level.
  owl_log_set_level(L_INFO);
  LOG(L_WARN, "Arduino setup() starting up\r\n");

  // Set the Breakout SDK parameters
  breakout->setPurpose(device_purpose);
  breakout->setPSKKey(psk_key);
  breakout->setPollingInterval(10 * 60);  // Optional, by default set to 10 minutes

  // Powering the modem and starting up the SDK
  LOG(L_WARN, "Powering on module and registering...");
  breakout->powerModuleOn();

  LOG(L_WARN, "... done powering on and registering.\r\n");
  LOG(L_WARN, "Arduino loop() starting up\r\n");
}

/**
 * This is just a simple example to send a command and write out the status to the console.
 */

void sendCommand(const char * command) {
  if (breakout->sendTextCommand(command) == COMMAND_STATUS_OK) {
    LOG(L_INFO, "Tx-Command [%s]\r\n", command);
  } else {
    LOG(L_INFO, "Tx-Command ERROR\r\n");
  }
}

void loop()
{
  static unsigned long last_send = 0;

  if ((last_send == 0) || (millis() - last_send >= SEND_INTERVAL)) {
    last_send = millis();

    float temperature = dht.readTemperature();
    float humidity = dht.readHumidity();

    LOG(L_INFO, "Current temperature [%f] degrees celcius\r\n", temperature);
    LOG(L_INFO, "Current humidity [%f]\r\n", humidity);
    char commandText[512];
    snprintf(commandText, 512, "Current humidity [%4.2f] and current temp [%4.2f]", humidity, temperature);
    sendCommand(commandText);
  }

  breakout->spin();

  delay(LOOP_INTERVAL);
}
```

This provides a good start for our sketch, and already provides us the code to log temperature and humidity, but not GPS. Luckily, there is another example that shows how to transmit GPS data. Let's open the GPS example and transfer some of the code to our Temperature/Humidity example.

All of the code we need to modify our sketch is found in the loop() function, specifically:

```C++
gnss_data_t data;
  breakout->getGNSSData(&data);

  if (data.valid && ((last_send == 0) || (millis() - last_send >= SEND_INTERVAL))) {
    last_send = millis();

    if (data.valid) {
      char commandText[512];
      snprintf(commandText, 512, "Current Position:  %d %7.5f %s  %d %7.5f %s\r\n", data.position.latitude_degrees,
          data.position.latitude_minutes, data.position.is_north ? "N" : "S", data.position.longitude_degrees,
          data.position.longitude_minutes, data.position.is_west ? "W" : "E");
      sendCommand(commandText);
    }
  }
```

Now we know how to get GNSS Data from the GPS antenna, and to access the coordinates held in that gnss_data_t object. With this code, we can write the the following lines to add to our stock sketch:

```C++
 gnss_data_t data;
    breakout->getGNSSData(&data);
    last_send = millis();
    int deg_latitude = data.position.latitude_degrees;
    int deg_longitude = data.position.longitude_degrees;
    float min_latitude = data.position.latitude_minutes;
    float min_longitude = data.position.longitude_minutes;
    String north_south = data.position.is_north ? "N" : "S";
    String east_west = data.position.is_west ? "W" : "E";
```

This collects all of the data needed to transmit to our tracker database, which we can send with the lines:

```C++
LOG(L_INFO, "GPS Location: [%d] degrees [%4.2f] minutes %s [%d] degrees [%7.5f] minutes %s \n", deg_latitude, min_latitude, north_south.c_str(), deg_longitude, min_longitude, east_west.c_str());
    char commandText[512];
    snprintf(commandText, 512, "{<hum>: %4.2f, <temp>: %4.2f, <deglat>: %d, <minlat>: %4.2f, <n_s>: <%s>, <deglong>: %d, <minlong>: %4.2f, <e_w>: <%s>}", humidity, temperature, deg_latitude, min_latitude, north_south.c_str(), deg_longitude, min_longitude, east_west.c_str());
    breakout->sendTextCommand(commandText);
```

Specifically, let's look closer at the line:

```C++
 snprintf(commandText, 512, "{<hum>: %4.2f, <temp>: %4.2f, <deglat>: %d, <minlat>: %4.2f, <n_s>: <%s>, <deglong>: %d, <minlong>: %4.2f, <e_w>: <%s>}", humidity, temperature, deg_latitude, min_latitude, north_south.c_str(), deg_longitude, min_longitude, east_west.c_str());
```

This line formats our command buffer to send our data to Twilio. Eventually, our data is going to be sent via webhook to a back-end Node.js server to be inserted into our SQL database. As such, we want to format our data in a way that it can be easily parsed in JavaScript. The easiest way to do this is to format our data so that it resembles JSON formatting. The only difference between the above formatting and a JSON is that instead of encasing our key strings in ' " ' characters, we have encased them in "<" and ">". This is because C++ interprets the ' " ' character as the end of a string, unless an escape character ' \ ' is used, but we would prefer not to embed our command with a ton of extra escape characters that the server will need to parse out. So, we use "<>" as stand ins for quotes, and our Node server can easily reformat the string by replacing these characters with quotes later on. More on that later.

Finally, let's change our polling interval from the default 10 minutes:

```C++
#define SEND_INTERVAL (10 * 60 * 1000)
```

to 1 minute:

```C++
#define SEND_INTERVAL (1 * 60 * 1000)
```

Below is the finished sketch. Make sure to edit the psk_key variable to point to a string holding your SIM's PSK, which you can find in your Twilio account by clicking on the SIM you registered.

```C++
#include <Seeed_ws2812.h>

#include <BreakoutSDK.h>
#include <board.h>
#include<stdio.h>
#include "DHT.h"

static const char *device_purpose = "Monitor GPS and environmental factors for a shipment";

static const char *psk_key ="ENTER_PSK_HERE";

Breakout *breakout = &Breakout::getInstance();

#define SENSOR_PIN (D38)
#define LOOP_INTERVAL (1 * 1000)
#define SEND_INTERVAL (1 * 60 * 1000)
#define DHTTYPE DHT11   // DHT 11

DHT dht(SENSOR_PIN, DHTTYPE);

/**
 * light turning yellow to green
 */
WS2812 strip = WS2812(1, RGB_LED_PIN);

void enableLed() {
  pinMode(RGB_LED_PWR_PIN, OUTPUT);
  digitalWrite(RGB_LED_PWR_PIN, HIGH);
  strip.begin();
  strip.brightness = 5;
}

void setup() {
  // put your setup code here, to run once:
  owl_log_set_level(L_INFO);
  LOG(L_WARN, "Arduino setup() starting up\r\n");

  enableLed();
  //changes colors
  strip.WS2812SetRGB(0, 0x20, 0x20, 0x00);
  strip.WS2812Send();

  breakout->setPurpose(device_purpose);
  breakout->setPSKKey(psk_key);
  breakout->setPollingInterval(1 * 60);  // Optional, by default set to 10 minutes

  // Powering the modem and starting up the SDK
  LOG(L_WARN, "Powering on module and registering...");
  breakout->powerModuleOn();

  LOG(L_WARN, "... done powering on and registering.\r\n");
  LOG(L_WARN, "Arduino loop() starting up\r\n");

}

void sendCommand(const char * command) {
  if (breakout->sendTextCommand(command) == COMMAND_STATUS_OK) {
    LOG(L_INFO, "Tx-Command [%s]\r\n", command);
    } else {
      LOG(L_INFO, "Tx-Command ERROR\r\n");
  }
}


void loop() {
  // put your main code here, to run repeatedly:
  static unsigned long last_send = 0;

  if ((last_send == 0) || (millis() - last_send >= SEND_INTERVAL)) {
    gnss_data_t data;
    breakout->getGNSSData(&data);
    last_send = millis();
    int deg_latitude = data.position.latitude_degrees;
    int deg_longitude = data.position.longitude_degrees;
    float min_latitude = data.position.latitude_minutes;
    float min_longitude = data.position.longitude_minutes;
    String north_south = data.position.is_north ? "N" : "S";
    String east_west = data.position.is_west ? "W" : "E";
    float temperature = dht.readTemperature();
    float humidity = dht.readHumidity();

    LOG(L_INFO, "Current temperature [%f] degrees celcius\r\n", temperature);
    LOG(L_INFO, "Current humidity [%f]\r\n", humidity);
    LOG(L_INFO, "GPS Location: [%d] degrees [%4.2f] minutes %s [%d] degrees [%7.5f] minutes %s \n", deg_latitude, min_latitude, north_south.c_str(), deg_longitude, min_longitude, east_west.c_str());
    char commandText[512];
    snprintf(commandText, 512, "{<hum>: %4.2f, <temp>: %4.2f, <deglat>: %d, <minlat>: %4.2f, <n_s>: <%s>, <deglong>: %d, <minlong>: %4.2f, <e_w>: <%s>}", humidity, temperature, deg_latitude, min_latitude, north_south.c_str(), deg_longitude, min_longitude, east_west.c_str());
    breakout->sendTextCommand(commandText);
  }

  breakout->spin();

  delay(LOOP_INTERVAL);
}
```

Now we can check if our sketch is working correctly. While connected by USB to your computer, press and hold the BOOT0 button, then press and release the RST button, and finally release the BOOT0 button. Your DevKit is now in bootloader mode, allowing you to upload your sketch to it. In the Arduino IDE, press the Upload arrow. In the console, you should see the progress of downloading the sketch onto the board. Once the console prints "File downloaded successfully", you can press the RST button on the DevKit to begin running the sketch.

Open the serial monitor to view the logs from the DevKit. It will likely take a few minutes to connect and register with the Narrowband network, but once it does, the DevKit will begin logging and transmitting its environmental data.

To see if your DevKit is transmitting data to Twilio, navigate to Wireless SIM Cards on your Twilio Dashboard. Click on the SIM card you registered earlier and open the "Commands" tab. You should see a list of commands sent by the DevKit, which is polling once each minute. We're now officially transmitting data via Narrowband! Pretty cool, right?

Now that your DevKit is up and running, let's build the rest of our infrastructure.

## 4. Deploy a MSSQL cloud database to Azure

We'll start by deploying a cloud SQL database to Azure, which we can use to store our tracking data.

On the Azure portal, click "SQL databases" under the Azure services header. Click add to create a new database. Create a resource group, enter a database name, and create a new server.

Since we are only building a prototype, we can configure the database to use minimal DTUs and storage. Click "configure" and select the "basic" tab. Click "Apply." Navigate to "Review + Create", and click "Create" to Deploy your database. You now have an empty SQL database deployed to the cloud!

## 5. Create a database schema for storing the device commands

Before we create our back-end API, let's begin creating functions to interface with our database that our Express app will call to insert and query data. First, though, we need to create our overall structure of our project. Create a folder that will hold your back-end files, and call it "API." Navigate to the folder in your terminal and type "npm init" to create a new Node project.

We will use an ORM called [Sequelize](http://docs.sequelizejs.com/) to work with our database.

In your Node project, install Sequelize by using the command:

```
npm install sequelize
```

Now we can get started working with our Azure SQL database. We'll start with a few lines that declare our connection information to Sequelize. Replace the DB connection info variables with the ones unique to your Azure database.

```JavaScript
const Sequelize = require("sequelize");

//DB Connection info
const DB_UNAME = "xxxxx";
const DB_PASS = "xxxxx";
const DB_SERV = "xxxxx";
const DB_NAME = "xxxxx";

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
```

Next, to establish the connection with the database:

```JavaScript
sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch(err => {
    console.error("Unable to connect to the database:", err);
  });
```

We now have a working connection to our cloud database, but our database has no tables or data. Let's define the database schema. Our project is simple and will only require one table, TrackingEvents:

```JavaScript
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
```

We have successfully defined what our table will look like, but it won't actually exist in our database until we create an insert method. Let's get on with it!

## 6. Use Sequelize to build insert/update functions for database interface

Next, we build an insert function for our database:

```JavaScript
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
```

This function will take all of our data parameters as input, and create a new TrackingEvent in the TrackingEvents table.

Finally, we need a query function to return our tracking data when our client queries by SIM ID, so we add:

```JavaScript
function getEventsBySIM(SIM) {
  return TrackingEvent.findAll({
    where: {
      SIMID: SIM
    },
    order: [["updatedAt", "DESC"]]
  });
}
```

This will return a list of events, most recent first, as we would like to display them on our web app.

Our final database functions code looks like:

```JavaScript
const Sequelize = require("sequelize");

//DB Connection info
const DB_UNAME = "xxxxx";
const DB_PASS = "xxxxx";
const DB_SERV = "xxxxx";
const DB_NAME = "xxxxx";

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
```

## 7. Write a back-end server API with Node and Express

Now that we have the necessary functions to work with our database, we can begin constructing an Express API to serve HTTP requests from Twilio and our eventual front-end client.

First, let's install our dependencies using npm:

- [Express](https://expressjs.com/) (the web app framework we will use for our API)

  - `npm install express`

- [bodyParser](https://www.npmjs.com/package/body-parser) (allows us to parse the body of HTTP requests to our server)
  - `npm install body-parser`
- [uuid](https://www.npmjs.com/package/uuid) (a utility we will use to generate custom event IDs to serve as primary keys for each tracking event)
  - `npm install uuid`

Our API is actually quite simple, and looks like:

```JavaScript
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
  let lat = helpers.convToDD(obj.deglat, obj.minlat);
  let long = helpers.convToDD(obj.deglong, obj.minlong);
  let n_s = obj.n_s == "N" ? 1 : 0;
  let e_w = obj.e_w == "W" ? 1 : 0;

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
```

As you can see, our API services two types of HTTP request

- /fromSIM POST requests
  - Accepts webhooks from Twilio that include tracking data, parses the body, and inserts the data as a new TrackingEvent using our Sequelize functions.
- /getEvents GET requests
  - Services requests from the client for a full list of TrackingEvents associated with a SIM ID.

Finally, we need to build a couple of helper functions to parse and format our data.

- getDateTimeString() returns the current date and time in string format.
- parseString() parses our DevKit data string and replaces the '<>' characters with '"'
- convToDD() converts GPS locations from degrees:minutes format to decimal degrees.x
  Here is the helpers.js code:

```JavaScript
function getDateTimeString() {
  const date = new Date();
  return (
    date.getFullYear() +
    "-" +
    (date.getMonth() + 1).toString().padStart(2, "0") +
    "-" +
    date
      .getDate()
      .toString()
      .padStart(2, "0") +
    ":" +
    date
      .getHours()
      .toString()
      .padStart(2, "0") +
    ":" +
    date
      .getMinutes()
      .toString()
      .padStart(2, "0") +
    ":" +
    date
      .getSeconds()
      .toString()
      .padStart(2, "0")
  );
}

function parseString(inStr) {
  outStr = inStr.replace(/>/g, '"');
  outStr = outStr.replace(/</g, '"');
  return outStr;
}

function convToDD(deg, min) {
  return deg + min / 60;
}

module.exports.getDateTimeString = getDateTimeString;
module.exports.parseString = parseString;
module.exports.convToDD = convToDD;
```

## 8. Build a front-end web app using create-react-app

App.js

```JavaScript
import React, { Component } from "react";
import "./App.css";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import TrackingTable from "./TrackingTable";
import GraphView from "./GraphView";
import Helmet from "react-helmet";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      submitted: false,
      SIMID: ""
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleChange(event) {
    this.setState({ SIMID: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    console.log(this.state.submitted);
    this.setState({ submitted: true });
  }

  render() {
    return (
      <div className="App">
        <Helmet bodyAttributes={{ style: "background-color : #42f4e2" }} />
        <Container-Fluid>
          <Row>
            <Col />
            <Col>
              <br />
              <h1>Welcome to the NB-IoT ShipTracker!</h1>

              <Form onSubmit={this.handleSubmit}>
                <Form.Group
                  controlId="formSIMID"
                  value={this.state.value}
                  onChange={this.handleChange}
                >
                  <Form.Label>
                    Please enter your SIM ID below to track your shipment:
                  </Form.Label>
                  <Form.Control placeholder="SIM ID" />
                </Form.Group>
                <Button variant="primary" type="submit" size="lg">
                  Track
                </Button>
              </Form>
            </Col>
            <Col />
          </Row>
          <br />
          {this.state.submitted ? (
            <div>
              <h1> Tracking Data for SIM {this.state.SIMID} </h1>
              <TrackingTable SIMID={this.state.SIMID} />
              <GraphView SIMID={this.state.SIMID} />
            </div>
          ) : null}
        </Container-Fluid>
      </div>
    );
  }
}

export default App;
```

TrackingTable.js

```JavaScript
import React, { Component } from "react";
import TrackingLine from "./TrackingLine";
import Table from "react-bootstrap/Table";
import axios from "axios";

class TrackingTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      SIMID: props.SIMID,
      events: []
    };
  }
  componentDidMount() {
    axios.get(`/getEvents/${this.state.SIMID}`).then(res => {
      const events = res.data.events;
      this.setState({ events: res.data.events });
      console.log("state: ");
      console.log(this.state.events);
    });
  }

  render() {
    return (
      <Table striped bordered hover variant="dark">
        <thead>
          <tr>
            <th scope="col">Tracking ID</th>
            <th scope="col">Tracking Time</th>
            <th scope="col">Temperature</th>
            <th scope="col">Humidity</th>
            <th scope="col">Latitude</th>
            <th scope="col">North/South</th>
            <th scope="col">Longitude</th>
            <th scope="col">East/West</th>
            <th scope="col">View on Google Maps</th>
          </tr>
        </thead>
        <tbody>
          {this.state.events.map(line => (
            <TrackingLine
              key={line.id}
              eventID={line.EventID}
              eventTime={line.EventTime}
              temperature={line.Temperature}
              humidity={line.Humidity}
              latitude={line.Latitude}
              northSouth={line.NorthSouth}
              longitude={line.Longitude}
              eastWest={line.EastWest}
            />
          ))}
        </tbody>
      </Table>
    );
  }
}

export default TrackingTable;
```

TrackingLine.js

```JavaScript
import React, { Component } from "react";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Button from "react-bootstrap/Button";
import Popover from "react-bootstrap/Popover";
import MapView from "./MapView";
import "./App.css";

class TrackingLine extends Component {
  constructor(props) {
    super(props);
    this.state = {
      eventID: this.props.eventID,
      eventTime: this.props.eventTime,
      temperature: this.props.temperature,
      humidity: this.props.humidity,
      latitude: this.props.latitude,
      northSouth: this.props.isNorth ? "N" : "S",
      longitude: this.props.longitude,
      eastWest: this.props.isWest ? "W" : "E",
      showMap: false
    };
  }

  render() {
    return (
      <tr>
        <th scope="row">{this.state.eventID}</th>
        <td>{this.state.eventTime}</td>
        <td>{this.state.temperature}</td>
        <td>{this.state.humidity}</td>
        <td>{this.state.latitude}</td>
        <td>{this.state.northSouth}</td>
        <td>{this.state.longitude}</td>
        <td>{this.state.eastWest}</td>
        <td>{MapsPopout(this.state.latitude, this.state.longitude)}</td>
      </tr>
    );
  }
}

const MapsPopout = (lat, lng) => (
  <div className="maps-popout">
    <OverlayTrigger
      trigger="click"
      placement="left"
      overlay={popover(lat, lng)}
    >
      <Button variant="success">Map</Button>
    </OverlayTrigger>
  </div>
);

const popover = (lat, lng) => (
  <Popover id="popover-basic" title="Tracking Location">
    <MapView latitude={lat} longitude={lng} />
  </Popover>
);

export default TrackingLine;
```

## 9. Add Google Maps API integration

MapView.js

```JavaScript
import React, { Component } from "react";
import { Map, GoogleApiWrapper } from "google-maps-react";

const mapStyles = {
  width: "100%",
  height: "100%"
};

const API_KEY = "ENTER_GOOGLE_API_KEY";

export class MapView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      latitude: this.props.latitude,
      longitude: this.props.longitude
    };
  }
  render() {
    return (
      <Map
        google={this.props.google}
        zoom={14}
        style={mapStyles}
        initialCenter={{
          lat: this.state.latitude,
          lng: this.state.longitude
        }}
      />
    );
  }
}

export default GoogleApiWrapper({
  apiKey: API_KEY
})(MapView);
```

## 10. Deploy server to Azure

## 11. Deploy Client to Azure

```

```
