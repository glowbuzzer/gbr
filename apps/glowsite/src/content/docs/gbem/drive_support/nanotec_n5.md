---
title: Nanotec N5
sort: 11
---

# Nanotec N5

## Introduction

This short guide reviews the Nanotec N5 range of drives and discusses how to get them working with GBEM.

<img src="/nanotec_n5_product_shot.png" alt="Nanotec N5" style="zoom:30%;" />

## Connectors

X1 - Ethernet

X2 - Encoder and Hall sensor connection 

X3 - Digital/analog inputs and outputs 

X4 - Brake connection 

X5 - Motor connection 

X6 - Voltage supply

X7 - EtherCAT IN 

X8 - EtherCAT OUT 

X9 - External logic supply, input voltage +24 V DC Voltage supply for encoder, input voltage +24 V DC





X6 - For version N5-1 (low current): 12 V - 72 V ±5% DC

* 1 -  shield

* 2 - +ve

* 3 - gnd



X1 - Ethernet DHCP or set your PC to 192.168.2.1

## BoM

encoder noe2-050k14

motor st41442l-0804-b

## Drive commissioning software

Plug-n-drive studio

Install



0x60C2 Interpolation Time Period can be 4ms - sync time always 1ms << this is important



0x603f error code uint16 - 

0x1003 error stack with 8 errors uint32

in 0x1003

upper 8 bits = error number







## motor

st4118-k2v1825 - NEMA 17



## netscan

````c
*** Starting network scanning output ***
Slave: 1
 Name: Drive
 Output size: 0bits
 Input size: 0bits
 State: 2
 Delay: 0[ns]
 Has DC: 1
 DCParentport: 0
 Activeports: 0.1.0.0
 Configured address: 1001
 Man: 0000026c ID: 00000007 Rev: 06720000
 SM0 A:1000 L: 128 F:00010026 Type:1
 SM1 A:1080 L: 128 F:00010022 Type:2
 SM2 A:1100 L:   0 F:00010024 Type:3
 SM3 A:1180 L:   0 F:00010020 Type:4
 FMMUfunc 0:1 1:2 2:3 3:0
 MBX length wr: 128 rd: 128 MBX protocols : 0c
 CoE details: 0d FoE details: 01 EoE details: 00 SoE details: 00
 Ebus current: 0[mA]
 only LRD/LWR:0
PDO mapping according to CoE :
  SM2 outputs
        [byte_offset] [addr b  ] 	 [index:sub  ] [bitl] [data_type   ] [name                                    ]
        [0          ] [0xFFF84D98.0] [0x6040:0x00] [0x10]
        [2          ] [0xFFF84D9A.0] [0x607A:0x00] [0x20]
        [6          ] [0xFFF84D9E.0] [0x3202:0x00] [0x20]
        [10         ] [0xFFF84DA2.0] [0x6060:0x00] [0x08]
  SM3 inputs
        [byte_offset] [addr b  ] [index: sub ] [bitl] [data_type   ] [name                                    ]
        [0          ] [0xFFF84D98.0] [0x6041:0x00] [0x10]
        [2          ] [0xFFF84D9A.0] [0x6064:0x00] [0x20]
        [6          ] [0xFFF84D9E.0] [0x0000:0x00] [0x00]
*** End of network scanning output ***
*** Start of eeprom output ***
1 slaves found.
Slave 1 data
 PDI Control      : 0605
 PDI Config       : 0E0B
 Config Alias     : 0000
 Checksum         : 0040
   calculated     : 0040
 Vendor ID        : 0000026C
 Product Code     : 00000007
 Revision Number  : 06720000
 Serial Number    : 00000000
 Mailbox Protocol : 000C
 Size             : 007F = 16384 bytes
 Version          : 0001
*** End of eeprom output ***
````

