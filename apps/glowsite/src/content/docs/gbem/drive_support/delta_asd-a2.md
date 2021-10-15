---
title: Delta ASD-A2
sort: 3
---

# Delta ASD-A2

## Introduction

This short guide reviews the Delta ASD-A2-0421-E drive and discusses how to get them working with GBEM. 

## Overview of drive range

The drive range covers 50W-to-15kW in single and three phase models.

Motors are the ECMA series in frames of size 40mm, 60mm, 80mm 86mm, 100mm, 130mm, 180mm & 220mm.

The motor options are somewhat limited but the basics in terms of electromagnetic brakes, different shaft options etc. 

Encoders are just a 20-bit incremental, 17 bit absolute single turn and 16-bit multi-turn.

The usual connectors are in the form of leads out of the motor to TE MATE-N-LOK connector though an IP67 barrel connector option is available.



<img src="/asd_a2_0421_e_product_shot.png" alt="ASD_A2_0421_E" style="zoom:50%;" />

The drive features are pretty basic but this is reflected in the price with for example the ASD-A2-0421-E model being about €400 (excluding cables and motor).

They do though support most of the essential features:

* Full Closed-loop Control (second feedback signal) this must be 5V differential ABZ style interface 
* Two notch filters for blocking resonances are available
* Absolute encoders are supported (think 17 bit only and 16 bit on multi-turn)
* STO (dual channel)



The motor encoder and digital IO connectors are of the SCSI type. Terminating these yourself without the proper crimp tool is a right pain in the arse.

For the purposes of our evaluation we are using:

ASD-A2-0421-E - A2 series - 400W - Single Phase - EtherCAT,  

Motor xxx

Drive cable ASD-ABPW0003

Encoder cable ASD-ABEN0003

## Wiring

Single phase models derive their internal control volatge from a mains volatge applied to L1C and L2C. 3 phase versions need a separate 24V control voltage supply.



L1=R=L, L2=S=N, L3=T



Motor UVW connects up

CN2 for encoder via the ASD-ABPW0003 cable (SCSI connector)



STO - comes with a handy PCB  you can slot into CN-STO to disable this function.



CN1 - 26 pin SCSI - IO - 4x DO, 7 x DI also encoder out (differntial) signals + power 24v

CN2 - 20 pin SCSI - motor encoder connector 

CN5 - dsub 9 - encoder for full closed loop

CN6 - RJ45 - pair of EtherCAT ports

CN7 - extension DI connector

CN-STO - STO connector

## Setup

P1-01 to 0x0Ch for EtherCAT communication and CANopen as the application layer.



## Drive commissioning software

The ASDA-Soft drive commissioning software is available free of charge. It comes from the dark ages of computing but just about functions. It needs a USB standard A (the square one) to standard B (to go in your laptop) cable.



