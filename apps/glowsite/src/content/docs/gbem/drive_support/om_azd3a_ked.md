---
title: Oriental Motor AZD3A-KED
sort: 12
---

# Oriental Motor AZD3A-KED

## Introduction

This short guide reviews the Oriental Motor AZD3A-KED5 range of drives and discusses how to get them working with GBEM.

## Overview of the Oriental Motor AZD range

The Oriental Motor AZD3A-KED is multi-axis closed loop stepper motor controller. It comes in three variants based on the number of axes. 

* AZD2A-KED - 2 axes

* AZD3A-KED - 3 axes

* AZD4A-KED - 4 axes

The price is roughly €500-800 for 2-4 axes.

They exclusively support the AZ series motors. This range is extensive and includes linear actuators, hollow shaft, slides, cylinders etc. They include a battery backed absolute encoder.

There are not many competitive products in the EtherCAT multi-axis compact stepper drive market. Other options include, Beckhoff with the EL7xxx io range of slices, ZUB (Maxon),  KEB’s C6 range and and Trinamic for embedded options.

There is also the AZD-CED (AC) and AZD-KED (DC) which are single axes variants of the multi-axis drive.

These allow larger 85mm frame mortors (4Nm) AZM98/AZM911 motors to be used than the largest 60mm frame AZM69 motors of multi-axis drives. These would have roughly an equivalent rated torque of 400W-750W when compared with a tradition servo motor (albeit for operation at less than 2000rpm) .  

## Setting the home position & limits

The home (zero) position of the drive is set as follows:

1. Move motor to the home position (jog, by hand)

2. Press the EXT button (small button next to each axis) for one second and release (both LEDS blink)

3. Press switch again within 3 seconds to set the home position

The limits can be set either with the MEX software or with GBEM using the nvram SDO write functions.

## Setting the motor types

Click the [Communication] menu of the MEXE02, and select [Copy the ABZO (fixed) information to the driver in a lump].

Select ALL

Start unit info monitor and check they have been applied

## Motor range

Gear boxes - Good gearbox options using swish neugart parts and they do know their onions with regards to gearboxes and options with 3 arc minute backlash (0.05 degrees 

Brakes - electromagneic

Style - hollow shaft and linear slides and electric cylinders

Encoder - Abs sensor



Nice motors - ooze quality

Nice motor cables, extensions, make your own extensions 

Brakes

## PSU

When connecting to operate two or more motors, use so that the input current of the main power supply does not exceed 7.0 A

24/48 VDC

7.0 A

## Drive configuration software

MEX = drive config software

Windows only





![Oriental Motor AZD3A-KED](/om_azd3a_product_shot.png)

