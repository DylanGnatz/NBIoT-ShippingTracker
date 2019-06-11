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
