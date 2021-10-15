---
title: Invertek Optidrive P2
sort: 9
---

# Invertek Optidrive P2

## Introduction

This short guide reviews the Invertek OptiDrive range of inverters and discusses how to get them working with GBEM.

There are a wide range of inverters with an EtherCAT interface available on the market. Ones we have worked with include

* Lenze i500 & i550 - 

* Omron (Yaskawa) - there is an EtherCAT option board available for many of the Omron inverters - Q2 series, RX2, MX etc.

* Schneider ATV340/900 - 

Some support the CiA402 state machine using in CSV mode and some implement simpler control strategy. The OptiDrive implements a simpler control algorithm.

## Control strategy from GBEM

PLC

Front end

enable at boot





We are using an ODP-2-2-4400-3KF42-SN model.

This has the following i/o specifications:

* INPUT - 380-440V 3 phase @11A

* OUTPUT - 0-500V 9.5A KW 3 phase

<img src="/invertek_optidrive_p2_product_shot.png" alt="Invertek Optidrive P2" style="zoom:33%;" />



We are using it with a standard issue 3 phase motor.



The Invertek Optidrive P series inverters have an optional fieldbus interface - OPT-2-ETCAT-IN. This is a little card that slides into the VFD with two Ethernet ports on it to connect to the fieldbus.

<img src="invertek_optidrive_p2_ethercat.png" alt="Optidrive EtherCAT card" style="zoom:33%;" />

Our aim is to control the motor's velocity using GBC/GBEM and control motor start/stop.

## Enabling fieldbus control on the inverter

Set the drive to Fieldbus control mode by setting:

* parameter P1-12 = 4
* parameter P1-14 = 101 (Advanced Parameter Access enable)

This can be done using the keypad on the front of the drive. Parameters are automatically saved after editing.

## SDOs

ADI-0019 -?

## EtherCAT interface

The EtherCAT cyclic interface (PDOs) consists of two arrays:

* uint16_t controlword [4]

* uint16_t statusword[4]

### Control word

#### PDO Word 1 

| **Bit** | **Name**         | **Description**                                              |
| ------- | ---------------- | ------------------------------------------------------------ |
| 0       | Drive Run        | 0 : Drive Stop   1 : Drive Run                               |
| 1       | Fast Stop Select | 0 : No Function   1 : Drive Stop with  Deceleration Ramp 2   |
| 2       | Fault Reset      | 0 : No Function   1 : Rising Edge fault reset  request       |
| 3       | Coast Stop       | 0 : No Function   1 : Drive Coasts to stop.  Overrides bit 0 |
| 4 - 15  | Not Used         |                                                              |

#### PDO Word 2

Function : Frequency Setpoint

#### PDO Word 3



### Status word

#### Word 1

| **Bit** | **Logic 0**               | **Logic 1**                                                  | **Notes**                                                    |
| ------- | ------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| 0       | Drive Stopped             | Drive Running                                                | Indicates when the output to  the motor is enabled           |
| 1       | Drive Healthy             | Drive Fault (Tripped)                                        | Indicates when the drive has  tripped. The fault code is     |
| 2       | Auto Control Mode         | Hand Control Mode                                            | Optidrive HVAC Only. Indicates  when Hand control is selected |
| 3       | OK                        | Inhibit                                                      | Indicates the status of the  STO / Hardware Inhibit circuit  |
| 4       | OK                        | Maintenance Time Reached                                     | Indicates that the  programmable System Maintenance Time Interval has expired |
| 5 – 7   | Not Used                  | No Function Assigned                                         |                                                              |
| 8 - 15  | Last / Current Fault Code | Indicates the last or current  fault code. For further fault code information, refer to the Optidrive User  Guide |                                                              |

#### PDO Word 2 : Fixed Function : Output Frequency

#### PDO Word 3 : Output Current

Data to be transferred in this word can be selected by the User in drive parameter P5-12. The possible settings are as follows :-
0: Motor current – Output current to 1 decimal place, e.g. 100 = 10.0 Amps
1: Power (x.xx kW) Output power in kW to two decimal places, e.g. 400 = 4.00kW
2: Digital input status – Bit 0 indicates digital input 1 status, bit 1 indicates digital input 2 status etc.
3: Analog Input 2 Signal Level - 0 to 1000 = 0 to 100.0%
4: Drive Heatsink Temperature – 0 to 100 = 0 to 100°C
5: User register 1 – User Defined Register 1 Value
6: User register 2– User Defined Register 1 Value
7: P0-80 value – User Selected data value.

#### PDO Word 4 : User Defined

Data to be transferred in this word can be selected by the User in drive parameter P5-08. The possible settings are as follows :-
0 : Output Torque – 0 to 2000 = 0 to 200.0%
1 : Output Power – Output power in kW to two decimal places, e.g. 400 = 4.00kW
2 : Digital Input Status – Bit 0 indicates digital input 1 status, bit 1 indicates digital input 2 status etc.
3 : Analog Input 2 Signal Level – 0 to 1000 = 0 to 100.0%
4 : Drive Heatsink Temperature – 0 to 100 = 0 to 100°C



The frequency data is a 16bit signed integer with one decimal place. E.g. value 123 means 12.3Hz. Value -234 (0xFF16) means -23.4Hz

max is 500 = 5000 = 0x1388 (32,767 = max int 16)

