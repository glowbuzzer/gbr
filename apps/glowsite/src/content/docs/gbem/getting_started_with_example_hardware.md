---
title: Getting started with example hardware
sort: 10
---

# GETTING START WITH EXAMPLE HARDWARE

## Introduction
This guide assumes that you want to use the recommended example hardware to get started with GBEM. Using the recommended hardware means that no C code, or indeed any other code, will need to be written by you and you will be able to get the system working end-to-end moving motors and reading and writing IO from the browser.

## Hardware Bill of Materials

The example hardware BoM:

|Manufacturer               | Part               | Description          | Qty   |
|---------------------------|--------------------|----------------------|-------|
|Raspberry Pi foundation    | Raspberry Pi 4B    | Linux SBC            | 1     |
|Beckhoff                   | EK1100             | EtherCAT coupler     | 1     |
|Beckhoff                   | EL1008             | 8 x Digital In       | 1     |
|Beckhoff                   | EL2008             | 8 x Digital Out      | 1     |
|Oriental Motor             | AZD                | Stepper drive        | 1     |
|Wago                       | PSU                | 24v PSU              | 1     |
|Wago                       | Din                |||
|||||



## Step 1 - wire up the hardware

Mains wiring the power supplies will need connecting to mains electricity and entirely your own  responsibility to do this safely with any necessary isolation, protection, filtering, and surge-protection devices that you might need in your country / organisation.

The 24V wiring scheme is as follows: 

````mermaid
graph TD
    A[24V PSU 2A] --> B[AZD motor power]
    C[24V PSU 1A] --> D[AZD logic power]
    C -->E[EK1100]
````

## Step 2 - download & flash the GBEM raspberry pi image

Download blah.img for hostbalh.com

Use win32 diskimage to write to a 32mb flash card

Insert card in SD-Card slot on the pi

Power up

ssh to the pi `./ssh root@gb-rpi`

hostname of image is  `gb-rpi` and the username is root and the password is raspberry

The image contains a version of GBEM compiled for the example hardware (#define MACHINE_EXAMPLE_HW ==1)

## run GBEM netscan

`./cd blah`

`./gbem -n -ieth0`

You should see:

`*** success`

## run GBEM cyclic

`./gbem -n -ieth0`



You should see

`blah***`

## GBC config

cd ../ gbc 

gbc

you should see blah

run demo front-end - nmp i gb-front-end

Connect

Live

Openenabled

Set D0 get light on el1008

jog
