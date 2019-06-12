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

## 4. Deploy a MSSQL cloud database to Azure

## 5. Create a database schema for storing the device commands

## 6. Use Sequelize to build insert/update functions for database interface

## 7. Write a back-end server API with Node and Express

## 8. Build a front-end web app using create-react-app

## 9. Add Google Maps API integration

## 10. Deploy server to Azure

## 11. Deploy Client to Azure
