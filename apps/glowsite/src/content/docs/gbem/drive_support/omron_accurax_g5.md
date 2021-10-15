---
title: OMROM ACCURAX G5
sort: 13
---

# OMROM ACCURAX G5

## Introduction

This short guide reviews the Omrom Accurax G5 range of drives and discusses how to get them worikng with GBEM.

<img src="/omron_g5_product_shot.png" alt="Omron G5" style="zoom:30%;" />

## Overview of the G5 drive range

The range extends from 0.1kW to 7.5kW with both single phase and three phase models. The available fieldbus interfaces are EtherCAT interfaces and MECHATROLINK II (a 10Mbs serial protocol originally developed by Yaskawa). 

The model we are are working with is the R88D-KN01H-ECT which is a 230v single phase 0.1KW with an EtherCAT interface

There is a pretty good range of motors available for these drives with the usual options of brakes and battery backed absolute encoders.

They include an ISO13849-1 Performance Level C/D STO facility to integrate with your old school safety relays or whizzy safety PLC functions.

Fancy features these drive support that we like:

* Notch filters / Damping filters - all mechanical systems have a natural resonant frequency and if you excite it you get nasty vibrations that are compounded by the servo loops. Notch filters are a good way to reduce this effect by placing a band rejection filter around the troublesome frequencies.
* Real time auto tuning - is a very powerful feature that estimates in real-time the load characteristic according to the motor speed and the
  force command and operates the machine by automatically setting the gain according to the result of the estimation
* Backlash compensation - is a common feature on drives but the Omron implementation is particularly well done. It on triggers on any changes in direction the motor incurs.
* Fully closed loop (encoder on load) - again a common feature on drives 

In our opinion these are really nicely designed drives. With many drives, if feels like the design engineers have done the minimum necessary to get a "just about working" product whereas with the Omron drives they feel polished, well thought through and they have actually thought about what a user would need.

Has a proper 64 bit DC reference clock register.

These drives are based on the Panasonic Minas drives now (Omron drives used to be Yaskawa drives re-badged).

## BoM used for our testing

The components we used for our testing were:

* R88D-KN01H-EC - drive
* R88A-CRKA003CR-E - Encoder cable
* R88A-CAKA003SR-E - Motor power cable
*  R88M - ??? - G5 series AC servo motor (in this case a dinky little motor)

## Connectors

R88A-CNK81S safety connector CN8

R88A-CNW01C control io connector CN1

I/O connector kit -50 pins-(for CN1) R88A-CNU11C



CN1 = control io

CN2 = encoder connection

CN4 = external encoder connector

CN5 = analog monitor

CN8 = safety connector

CN7 - usb to CX-drive



**CN1**

General purpose cable R88A-CPG002S

XW2Z-100J-B24  Terminal block cable

## Wiring up

For testing the drive, the wiring is very simple. There is a small plug supplied with the drive to disable the STO feature which makes things a bit easier. 

The drive just needs a 200-240VAC power supply. There is no 24v "logic power" supply needed. 200-240VAC is supplied to both 

L1 & L3 - live and neutral for motor power

L1C & L2C - live and neutral for control power (converted to DC control voltages internally)



CN1 provides access to Digital Ins and Outs but isn;t needed for a basic test.

Ground terminals are screw ring terminals



CN7 is the usb connector a MICRO usb cable is needed which is a touch unfortunate given these are increasingly rare these days.



Production wiring will need the usual range of filters, breakers/isolators, contactors with surge supression and the usual gubbins needed. The drive's manual provides detaills.



## Omron drive configuration software

### Introduction

Omrom provide a drive configuration utility called CX-DRIVE. This can be purchased either as a stand-alone piece of software or it is included in the CX-ONE automation suite. This is available on a 30 day free trial. This software is not essential but is handy to initially test the drive and in scenarios where you want to do custom tuning of the servo's loops, update the firmware or if you are having issues and want to do diagnosis / testing.

The CX-Drive software has a vintage feel to it - it is a trip back in time to Neolithic era software applications. If you are running a high resolution screen you are going to need to get the magnifying glass out.

We had to do a bit of USB driver jigger-pokery to get the software to see our drive. This is involved manually installing the USB drives from `C:\Program Files (x86)\OMRON\CX-One\CX-Drive\DRIVERS\G5-Series`.

### Create a new config

File menu -> New drive



* Plug-in the drive





Plug in and run

Power up and the first thing we see is a 87 alarm - 

this is 0x87.0 `{0x87, 0, "Immediate Stop Input Error"}`

We can disable this 



## Our ratings for the Omron G5

````text

Overall ease of use :				★★★☆☆ ()
Drive configuration software :		★☆☆☆☆ (fiddly to install, no support for high-res screens, 1990s feel to it)
Features :							★★★★★ (excellent)
Range of motors :					★★★★☆ (bit short on shaft options for the motors)		
Quality of motors :					★★★☆☆ (outdated motor connectors, hard to make custom cables
Gearbox options :					★★★★★ (Excellent,)
Price :								★★★☆☆ (Roughly €700 for 3A drive excluding cables and motor)
````



## Titbits

The overrun limit protection function only works in fully closed loop mode (encoder on load) don't mistake this for 

If you are using a single phase drive, rather than a three phase model, wire live and neutral to L1 and L3. 



## Essential config in CX-Drive to get the drive moving

Pn400.0  -> 0 disabled - power cycle

(This is accessible through 3400 hex 00 hex Input Signal Selection 1 4 bytes (INT32) )



## nescan (gbem -n -ieth0)

````c
Slave: 1
 Name: R88D-KN01H-ECT
 Output size: 0bits
 Input size: 0bits
 State: 2
 Delay: 0[ns]
 Has DC: 1
 DCParentport: 0
 Activeports: 1.0.0.0
 Configured address: 1001
 Man: 00000083 ID: 00000005 Rev: 00020001
 SM0 A:1800 L: 256 F:00010026 Type:1
 SM1 A:1c00 L: 256 F:00010022 Type:2
 SM2 A:1100 L:  12 F:00010064 Type:3
 SM3 A:1200 L:  28 F:00010022 Type:4
 FMMUfunc 0:1 1:2 2:0 3:0
 MBX length wr: 256 rd: 256 MBX protocols : 04
 CoE details: 2f FoE details: 00 EoE details: 00 SoE details: 00
 Ebus current: 0[mA]
 only LRD/LWR:0
PDO mapping according to CoE :
  SM2 outputs
        [byte_offset] [addr b  ] [index:sub  ] [bitl] [data_type   ] [name                                    ]
        [0          ] [0xFFF89EA0.0] [0x6040:0x00] [0x10] [UNSIGNED16  ] [Controlword                             ]
        [2          ] [0xFFF89EA2.0] [0x607A:0x00] [0x20] [INTEGER32   ] [Target position                         ]
        [6          ] [0xFFF89EA6.0] [0x60B8:0x00] [0x10] [UNSIGNED16  ] [Touch probe function                    ]
        [8          ] [0xFFF89EA8.0] [0x60FE:0x01] [0x20] [UNSIGNED32  ] [Physical outputs                        ]
  SM3 inputs
        [byte_offset] [addr b  ] [index: sub ] [bitl] [data_type   ] [name                                    ]
        [0          ] [0xFFF89EA0.0] [0x603F:0x00] [0x10] [UNSIGNED16  ] [Error code                              ]
        [2          ] [0xFFF89EA2.0] [0x6041:0x00] [0x10] [UNSIGNED16  ] [Statusword                              ]
        [4          ] [0xFFF89EA4.0] [0x6064:0x00] [0x20] [INTEGER32   ] [Position actual value                   ]
        [8          ] [0xFFF89EA8.0] [0x6077:0x00] [0x10] [INTEGER16   ] [Torque actual value                     ]
        [10         ] [0xFFF89EAA.0] [0x60F4:0x00] [0x20] [INTEGER32   ] [Following error actual value            ]
        [14         ] [0xFFF89EAE.0] [0x60B9:0x00] [0x10] [UNSIGNED16  ] [Touch probe status                      ]
        [16         ] [0xFFF89EB0.0] [0x60BA:0x00] [0x20] [INTEGER32   ] [Touch probe pos1 pos value              ]
        [20         ] [0xFFF89EB4.0] [0x60BC:0x00] [0x20] [INTEGER32   ] [Touch probe pos2 pos value              ]
        [24         ] [0xFFF89EB8.0] [0x60FD:0x00] [0x20] [UNSIGNED32  ] [Digital inputs                          ]
*** End of network scanning output ***
*** Start of eeprom output ***
1 slaves found.
Slave 1 data
 PDI Control      : 0C08
 PDI Config       : 0C00
 Config Alias     : 0000
 Checksum         : 00A9
   calculated     : 00A9
 Vendor ID        : 00000083
 Product Code     : 00000005
 Revision Number  : 00020001
 Serial Number    : 11020083
 Mailbox Protocol : 0004
 Size             : 000F = 2048 bytes
 Version          : 0001
*** End of eeprom output ***
````



R88D-KN01H-ECT

