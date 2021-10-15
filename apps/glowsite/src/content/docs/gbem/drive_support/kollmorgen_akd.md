---
title: Kollmorgen AKD
sort: 10
---

# Kollmorgen AKD

## Introduction

This short guide reviews the Kollmorgen AKD range of drives and discusses how to get them working with GBEM.

![AKD AKD2G](/akd_akd2g_product shot.png)

## Overview of the AKD drive range

Introduced to the market in 2010 the AKD drive was amongst the first wave of EtherCAT drives and has been widely used in differing applications.

The product range spreads from the AKD-x00306, 1.1kW single phase drive to the AKD-x04807, 32kW three phase model. Recently introduced is the AKD2G  models. AKD2G model range includes dual axis in a single chassis models and have all have a whizzy TFT screen on the drive which is actually a step on on from the AKD model's dual 7 segment display in terms of usefullness.

There are lots of feedback options include the Kollmorgen specific SFD and EnData and HIPERFACE and resolver.

AKD drives have 11 digital and 2 analog IOs and they are opto-isolated. AKD2G have 16 IO. 

The motor range is excellent and includes:

* DDR motors (https://www.kollmorgen.com/en-us/products/motors/direct-drive/direct-drive-linear-and-rotary-motors/) 
* Frameless motors
* Linear motors and linear actuators
* Stainless steel, washable, food grade

They all support a STO with the AKD2G models supporting dual channel.

Cables are field constructible with connectors available.

In terms of motors, the standard AKD motor is the AKM. Recently introduced is the AKM2G . The AKM2G range includes motors with low-voltage windings (24 to 96 volts) and singel cable options.

For the purpose of this review we used a standard AKD-x00306 drive with an AKM motor.

## Our ratings for the Kollmorgen AKD (not AKD2G)

````shell
Overall ease of use :				★★★☆☆ ()
Drive configuration software :		★★★★☆ (Kollmorgen studio is pretty damn good)
Drive features :					★★★☆☆ (Does the basics but low on fancy features)
Range of motors :					★★★★★ (There is a very good range of motors)	
Quality of Motors :					★★★★★ (Hard to fault the quality of the Kollmorgen motors)
Gearbox options :					★★★★★ (Excellent,)
Price :								★★★☆☆ (Roughly €800 for 3A drive excluding cables and motor)
````



## Commissioning process

1. Basic wiring
   1. X1 - 24V 0V and pin 3 (STO) to 24V
   2. X2 - connect motor (usually motor power cables are pre-wired with this connector)
   3. X10 - feedback connector (usually the motor encoder cable is pre-wired with this connector)
   4. X8 - pin 3 0V and pin 4 24V (hardware enable)
   5. X3 AC power (L1 and L2 with L3 unconnected for single phase). This is important as wiring L1, L2, L3 connectors varies between manufacturers. 
2. Install Kollmorgen workbench
3. Set the S1 and S2 rotary switches to 0 for DHCP. For static is S1 = 3 and S2 = 5 you get a 192.168.0.35 IP address
4. Connect X11 port on side of drive to your network or PC
5. Set the PC IP address to match drives if using statics
6. Press the B1 on the side of the drive (a little button you need a paperclip to press) to confirm P address - the IP address flashes up on LED display (you may need to video it on your phone to capture it!)
7. Run the Kollmorgen workbench software which should auto find drive or there are buttons to press in the UI to trigger a scan
8. In the software, you can set the service IP address to a new IP address
9. Give the drive a friendly name - this is pretty essential if you are working with lots of drives with different parameters 
10. Update the drive's firmware. This is essential for working with GBEM as a couple of bugs in the Kollmorgen firmware cause issues and there are later firmware features we need.
11. Jog drive in the Kollmorgen software to test that things are golden

## Drive commissioning software

Kollmorgen workbench

Free

quite good





