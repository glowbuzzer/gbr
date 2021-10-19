---
title: Response times
sort: 7
---

# Response times by Tier

GBC allows user provided code to be run in different tiers within the application. The response time between trigger events occurrring and the code being executed varies by the tier the code is deployed into. 

The tiering of response times can be summarised as:

* Front-end code (browser) - responds to event within roughly 100ms depending on browser & PC garbage collection. This time can be quicker if the websocket message exchange cycle is increased but 100ms is a rough benchmark figure.

* Ad-hoc JavaScript code or Tasks/Activities running inside GBC - respond to an event within 10-20ms - there is a very small garbage collection overhead and delay for the exchange of messages through the internal shared memory. These are JavaScript functions and are interpreted not compiled into the GBC executable
* GBEM/GBSM -  use defined c code "PLC style" functions can be deployed to the downsteam process controlling communication with the fieldbus / motor drivers. These functions can respond to an event within the bus cycle time (1ms, 2ms, 4ms etc.) in a low jitter manner. These have to be compiled into the executable code.
* Latching values on EtherCAT slave or in the motor drives - capture at microsecond accuracy

You need to place functions in the right tier for the response time you need for that function. 

Usually this is obvious based on the task in front of you.

Most of the time, 100ms response time is adequate but it all depends on what you are doing.

