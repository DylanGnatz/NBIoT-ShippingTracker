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

## 2. Register the narrowband SIM with Twilio

## 3. Create and upload the Breakout sketch to the DevKit

## 4. Deploy a MSSQL cloud database to Azure

## 5. Create a database schema for storing the device commands

## 6. Use Sequelize to build insert/update functions for database interface

## 7. Write a back-end server API with Node and Express to accept HTTP requests from the client and Twilio webhooks

## 8. Build a web app for accessing tracking data using create-react-app

## 9. Add Google Maps API integration to provide map view of GPS location

## 10. Deploy server to Azure

## 11. Deploy Client to Azure
