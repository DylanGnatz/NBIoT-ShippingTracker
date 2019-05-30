#include <Seeed_ws2812.h>

#include <BreakoutSDK.h>
#include <board.h>
#include<stdio.h>
#include "DHT.h"

static const char *device_purpose = "Monitor GPS and environmental factors for a shipment";

static const char *psk_key ="xxxxx";

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
