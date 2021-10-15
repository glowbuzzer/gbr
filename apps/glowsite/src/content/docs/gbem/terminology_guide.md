---
title: Terminology guide
sort: 16
---
# TERMINOLOGY GUIDE

## General

* NIC - network interface card
* Preempt-RT - a patch to the Linux kernel that increases its real-time capabilities
* 

## GBEM

* iomap - the mapping between EtherCAT slave IO and GBC and PLC variables. For example, a digital input on a PDO (e.g. channel 1 on an EL1008 module) can be mapped to a GBC IO so that
* machine - collection
* 
* drive
* index

## EtherCAT

* EEP (EEPROM) in these documents refers to the slave's EEPROM (non-volatile memory). In EtherCAT the slave's EEPROM contains x?x?
* ESI (EtherCAT Slave Information) file is the XML based device description file for slaves. You can turn ESI files into SSI binaries that are written to the slave's EEPROM 
* DC (Distributed Clock) is the mechanism by which the EtherCAT master and slaves achieve time synchronisation. The distributed clock is usually exposed in the EtherCAT as pair of interrupts (or GPIO outs) called SYNC0 and SYNC1. These interrupts are used by the slaves to trigger a sequence of actions. Synchronised motion control applications always required DC. If DC is being used the first node in the network must be capable of being a DC master.
* Bus cycle time - cycle time - cycle period - cycle frequency - the frequency of exchange of cyclic data on the EtherCAT network
* SOEM - is an Open Source EtherCAT master stack 
* Sync Managers, e.g. SM2 and SM3, refer to EtherCAT sync managers. SM2 is for cyclic outputs and SM3 for cyclic inputs. Slaves that exchange data between master and slave bidirectionally have both SM2 and SM3 sync managers. Slaves that just exchange data unidirectionally have a single sync manager. SM0/1 never has PDOs assigned just for mailbox stuff.
* PDO (Process data objects) are used in EtherCAT to cyclically transfer variables in real-time (e.g. a drive's set position) and status (e.g. a drive's actual position). With the help of the PDO mapping, the objects from the object dictionary are assigned to either receive data (RxPDO, Master to Slave direction) or transmit data (TxPDO, Slave to Master direction).
* SDO (Service Data Objects) are used to exchange parameters between master and slave devices in a EtherCAT Network. This isn’t done in real-time. They provide read and write access to all entries in the device object dictionary. Used for things like reading/writing configuration parameters and reading error messages
* Master/slave are terms that refer to the two types of devices that EtherCAT networks can have. Usually, one master can communicate with one or more slaves.
* Object dictionary is the list of objects (variables) and their addresses in the EtherCAT slaves memory 
* ESC is shorthand for EtherCat Slave
* CoE is CANopen over EtherCAT. This allows the complete CANopen profile family to be utilized via EtherCAT so for example, when we talk about SDOs for example these are CANopen concepts not EtherCAT concepts.
* EoE is Ethernet over EtherCAT this allows normal Ethernet traffic to be tunnelled through an EtherCAT network. It has a number of uses and one of the main one is that you connect drive manufacturers configuration software to an EtherCAT slave without having to plug into a separate RJ45 port.

* The "AL status code" is located in ESC registers "0x134" and "0x135" and can be read out by the master. This
  code reflects the current slave error state

## Drives

* Modes of operation is the used to describe the mode the drive operates in. What that means is best explain by looking at the list of options in CiA 402.

```c
#define PROFILE_POSITION_MODE       1 /*Position Profile mode*/
#define VELOCITY_MODE               2 /*Velocity mode*/
#define PROFILE_VELOCITY_MOCE       3 /*Velocity Profile mode*/
#define PROFILE_TORQUE_MODE         4 /*Torque Profile mode*/
#define HOMING_MODE                 6 /*Homing mode*/
#define INTERPOLATION_POSITION_MODE 7 /*Interpolation Position mode*/
#define CYCLIC_SYNC_POSITION_MODE   8 /*Cyclic Synchronous Position mode*/
#define CYCLIC_SYNC_VELOCITY_MODE   9 /*Cyclic Synchronous Velocity mode*/
#define CYCLIC_SYNC_TORQUE_MODE     10/*Cyclic Synchronous Torque mode*/

```

* NVRAM - non-volatile memory. In these documents this usually refers to the non-volatile storage on drives 

* Limits - soft limits - position limit - contraints on the envelope of movement of a drive. Moving outside the envelope will usually cause a drive to stop and error.
* SetPos ,SetVel, SetAcc/SetTorque - 
* ActPos, ActVel, ActAcc/ActTorque - 
* Feedback in the context of drives means the 
* Absolute encoder - an encoder that 
* Multi-turn encoder - an encoder that 
* Interpolation time with respect to a drive often is synonymous with cycle time
* Homing means moving a drive to a know position, the home position
* The Touch probe function on a drive provides the capability to save the current position of a drive very accurately at a point in time (usually in response to a sensor input). It is a sub-set of a drive's homing capabilities. 
