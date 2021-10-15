---
title: Status messages (EMSTAT)
sort: 12
---

# EMSTAT

## Introduction

emstat provides a "live" view of what is going on inside of GBEM.

GBEM writes a a json file to the filesystem periodically (every couple of seconds). This status file contains:

- status of the machine (what state the machine is in) and when control word it is receiving
- status of GBC IO (digital ins and outs)
- the state of drives
- the state of the slaves

Then there is a simple web (react.js) that displays the contents of the JSON file that is served up by an HTTP server.

## Details

If GBEM has User Messages enabled, it will output to console various messages about its state but it is not possible to examine everything, for example the state of a drive state.

Therefore, the emstat framework is provided. This consists of two parts:

1. process that runs within GBEM and periodically (every few seconds) produces a JSON file status of machine, drives and
   EtherCAT network
1. an example react app for you to customised is provided (emstat)

produces a file every n secs when n is defined by `JSON_STATUS_UPDATE_PERIOD_SECS`

emstat is enabled with the define `ENABLE_EMSTAT`

this file is served by the GBC HTTP server.

