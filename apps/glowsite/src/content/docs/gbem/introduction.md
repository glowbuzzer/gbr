---
title: Introduction to GBEM
sort: 1
---
# Introduction to the glowbuzzer EtherCAT Masters (GBEM)

## Version

This version 2022.0.1 of the documentation.

## License

GBEM is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License version 2 as published by the Free Software Foundation.

## What does GBEM do?

GBEM provides a **framework to control EtherCAT slaves**. It allows you to easily configure a *machine* (a combination of EtherCAT IO devices and servo and stepper drives) and provides a simple interface through which you can interact with that machine without worrying about the nitty gritty details of how EtherCAT drives and IO devices work.

It is designed to be used by programmers who want to build applications to control machines. 

### Main features

* A CiA 402 based state machine framework to control machines and drives
* A configuration structure in which you can define the layout of your EtherCAT network (i.e. the structure of your machine)
* An ability to write your own PLC style functions in the C programming language to control EtherCAT IO
* A simple shared memory interface over which drives and IO can be controlled from your web stack high-level control application
* A signal, synchronous with the fieldbus bus cycle, to trigger the cyclic execution of higher level control functions
* Real-time execution - lowest achievable cycle times depends on hardware. Typically 0.5ms, 1ms or 4ms cycles are used
* A code based suitable for use on both Linux and microcontroller targets
* An EtherCAT master (based on SOEM)
* Open Source code base

A simple view of how GBEM operates is encapsulated in the following diagram.

> Diagram changes:
> make clear what in in dpm
> fix sdo->pdo rhs
> add slave check & plc threads
> remove white border

![GBEM Big Block Diagram](gbem_bbd.svg)

GBEM is written exclusively in the C (C99) programming language and designed to be highly portable across different platforms. For example, we offer a version running on the STM32 microcontroller chipset.

The EtherCAT master communication layers within GBEM are based on the SOEM (Simple Open EtherCAT master) code base from the Open EtherCAT Society <https://github.com/OpenEtherCATsociety/SOEM>.

## How GBEM fits into the GB Control chain

GBEM allows you to interface GBC with EtherCAT devices (slaves) like servo and stepper drives and different types of IO 
such as digital and analog in/outs, encoder interfaces etc.


# hellohelellelelelelelelelelelelelelelelelelelelelelelelelelelelelelelelelee
```mermaid
graph LR
    id1["Front-end"]<-->|websockets|id2[GBC];
    id2 <--> |shared mem| id3[GBEM];
    id3<-->|EtherCAT|id4[Slaves];
```
# hellohelellelelelelelelelelelelelelelelelelelelelelelelelelelelelelelelelee


We have the [Front-end] which is your browser-based control application that talks over websockets to [GBC] which is the realtime control that talks over shared memory to [GBEM] which talks over EtherCAT to your [slaves] hardware.

GBEM doesn't *have* to be interfaced with GBC. It provides a very simple shared memory interface over which xx see GBC_sim project for a simple example of how to interface with GBEM without GBC.

## Docs structure

The documentation is structured around the main tasks that users undertake:
1. Compiling and running GBEM - [COMPILING AND RUNNING](compiling_and_running.md)
1. Getting started with the example hardware - [GETTING STARTED WITH EXAMPLE HARDWARE](getting_started_with_example_hardware.md)
1. What drives are pre-configured to work with GBEM? - [DRIVE SUPPORT](drive_support.md)
1. Configuring machines drives and slaves already supported by GBEM - [CONFIGURING MACHINES](configuring_machines.md)
1. Adding support for new EtherCAT slaves (IO) - [ADDING A NEW SLAVE](adding_a_new_slave.md)
1. Adding support for new EtherCAT drives - [ADDING A NEW DRIVE](adding_a_new_drive.md)
1. Adding PLC functions to GBEM - [PLC](plc.md)
1. Understanding which files to edit - [WHICH FILES DO I EDIT](which_files_do_i_edit.md)
1. Deeper understanding of how GBEM works - [INTERNALS](internals.md)
1. Troubleshooting issues in the different layers - [TROUBLESHOOTING](troubleshooting.md) 
1. A guide to which files to edit inside GBEM - [WHICH FILES DO I EDIT](which_files_do_i_edit.md)
1. The status web interface to GBEM - [EMSTAT](emstat.md)
1. The PLC functionality in GBEM - [PLC](plc.md)
1. Troubleshooting GBEM -  [TROUBLESHOOTING](troubleshooting.md) 
1. The main GBEM configuration parameters - [gbem_config.h](gbem_config.h)

There is also a [FAQ](faq.md) and [TERMINOLOGY GUIDE](terminology_guide.md)

## What skills do I need to work with GBEM?

**Basic C programming know-how** - we have tried to keep the code-base as simple as possible and so to work with GBEM you definitely don't need to be the world's best c programmer but you do need to know how to create and debug simple c applications.

**Basic understanding of EtherCAT** - you do need to understand basically how EtherCAT slaves work. The documents and examples we have provided help to explain a lot of this but it would be helpful to read background information. You need to example know what an SDO and PDO object is, what Distributed Clocks (DC) do etc. There is oodles of information available on EtherCAT online but a lot of it has been written from a very protocol orientated perspective which is just not needed to work with EtherCAT in practice.

**Basic understanding of automation electricals** - you are going to be interacting with EtherCAT IO modules. They will need wiring up to sensors and actuators.  Depending on your experience, you may or may not need assistance with this.

**Basic understanding of Drives** - we are going to be interacting with fieldbus interfaced drives. They can be quite intimidating with instruction manuals weighing in at 100s or 1000s of pages. If you don't feel confident integrating you own drives then simply use one of the many types we have already integrated. We provide pointers to how to get them set-up in our range of drive guides.

**Understanding of machine safety** - if you are using GBEM to control machines you need to understand how to implement the safety features machines require. 

## Why not just use a conventional PLC?

You absolutely can use a conventional PLC as part of the Glowbuzzer control chain instead of GBEM. GBEM and PLCs are functionally equivalent - functions you can implement on a PLC can equally be implemented in GBEM and vice-versa.  

However, as we are specifically seeking to support software developers write machine control, GBEM provides a way for them to do that without knowing anything about PLCs. 

Also, GBEM does offer some advantages over conventional PLCs in some circumstances:

* You can use a proper IDE to develop software
* You can hook in traditional unit test frameworks to your code easily
* It works with Version Control Systems properly (e.g. github)
* You can use a "normal" programming language rather than  IEC 61131-3 languages
* It is Open Source, not proprietary
* You can easily bring in other Open Source code 
* It runs on any Linux hardware and has been ported to STM32 if you want to run on your own custom hardware
* It is much more suitable to embed into a "product" where the user doesn't want to know anything about a PLC
* PLCs feel old fashioned and awkward to use to a (relatively) modern software developer
