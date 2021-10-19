---
title: Tasks and Activities
sort: 4
---

# Tasks and Activities in GBC

## Introduction



## Tasks

Within GBC, Tasks are an assembly of Activities that are executed in sequence in response to an event occurring. GBC can have multiple tasks defined and tasks can contain multiple Activities.

GBC will execute a Task based on its current state (E.g. whether it is already running or has finished) and whether the task's Trigger has fired. The trigger for a task would typically be an event like a IO being set or tasks can be triggered from front-end code.

Tasks allow for JavaScript code to be run is response to events occurring or periodically without using the front-end code (browser based). See [response times](response_times.md) for more details on the response time of code in different layers of GBC. 



trigger from 

## Activities

### Introduction

Within GBC, an Activity is a machine control primitive. They generally do one of two things:

* Read and write to the machine's IO. E.g. set a Digital Out or read an Analogue Input)
* Move joints (motors) either individually or as a set in concert. E.g. rotate a motor at 50rpm or move a robot along a path)


Activities can be invoked in three different ways:

1. As a`solo activity` invoked by sending a websockets message from the front-end control JavaScript to GBC - wrap activity in solo activity - essentially commands - have banks of solo activities - not queued - solo activities map to kc - issue a new one old one gets cancelled - one at a time model - front end API implements as a promise - await on a solo activity
2. As a `streamed activity` used for continuous motion. E.g. streaming a gcode program - support blending - pause and resume - classic queue for flow control - capacity to check so don't overfil - front end code handles this for you. Send end program activity to kick it off if you dfont fill buffer  if you fill buffer will kick off acutomaically - gcode reference impl for this - not exclusively
3. From a Task executing on GBC that either cyclically or in response to an event executes the Activity)

### The set of Activities

* MoveJoints
* MoveLine

* SetDout, SetAout, 
* Dwell

