---
title: Supported drives overview
sort: 3
---

# DRIVE SUPPORT OVERVIEW

## What drives does GBEM support?

We have written the drivers for and tested with a wide variety of EtherCAT drives from different manufacturers.

The parameters will need adapting for different models in the range and the exact motor you use.

All drives listed as tested have been

## Servo/Steppers

### Oriental Motor

| Model     | Documentation            | Driver  software                               | Test machine  |
| --------- | ------------------------ | ---------------------------------------------- | ------------- |
| AZD2A-KED | See AZD3A                | library `oriental_motor` code in `azdxa-ked.c` | see AZD3A     |
| AZD3A-KED | [AZD3A](om_azd3a_ked.md) | library `oriental_motor` code in `azdxa-ked.c` | cartesian_map |
| AZD4A-KED | See AZD3A                | library `oriental_motor` code in `azdxa-ked.c` | see AZD3A     |
| AZD-KED   | ?                        | library `oriental_motor` code in `azd-ked.c`   | ?             |

### Beckhoff

| Model  | Documentation       | Driver  software                      | Test machine    |
| ------ | ------------------- | ------------------------------------- | --------------- |
| EL7031 | [EL7031](el7031.md) | library `beckhoff` code in `el7031.c` | EL7031_test_map |
| EL7041 | [EL7041](el7041.md) | library `beckhoff` code in `el7041.c` | EL7041_test_map |
| EL7037 | [EL7037](el7037.md) | library `beckhoff` code in `el7037.c` | EL7037_test_map |
| EL7047 | [EL7047](el7047.md) | library `beckhoff` code in `el7047.c` | none            |
| EL7211 | [EL7211](el7211.md) | library `beckhoff` code in `el7211.c` |                 |
| EL2522 | [EL2522](el2522.md) | library `beckhoff` code in `el2522.c` | EL2522_test_map |
| AX5101 |                     | library `beckhoff` code in `ax5101.c` |                 |

## Delta

| Model | Documentation | Driver  software | Test machine |
| ----- | ------------- | ---------------- | ------------ |
| ASDA  |               |                  |              |

## Omron

| Model      | Documentation | Driver  software      | Test machine |
| ---------- | ------------- | --------------------- | ------------ |
| Accurax G5 |               | library `omoron` in ? |              |
|            |               |                       |              |
|            |               |                       |              |
|            |               |                       |              |

Based on panasonic

### JVL

| Model      | Documentation | Driver  software   | Test machine |
| ---------- | ------------- | ------------------ | ------------ |
| MIS series |               | library `jvl` in ? |              |



### Cannon automata

| Model | Documentation | Driver  software | Test machine |
| ----- | ------------- | ---------------- | ------------ |
| SMC3  |               |                  |              |



### Nanotec

| Model  | Documentation | Driver  software | Test machine |
| ------ | ------------- | ---------------- | ------------ |
| N5-1-1 |               |                  |              |



### Kollmorgen

| Model | Documentation | Driver  software                 | Test machine |
| ----- | ------------- | -------------------------------- | ------------ |
| AKD   |               | library `kollmorgen` code in ?.c |              |

### Trinamic

| Model | Documentation | Driver  software | Test machine |
| ----- | ------------- | ---------------- | ------------ |
| ?     |               |                  |              |

## BLDC drives





## Inverter drives

### invertek

| Model | Documentation | Driver  software | Test machine |
| ----- | ------------- | ---------------- | ------------ |
|       |               |                  |              |

## Drives we would like to get hold of to test

* Bosch Rexroth IndraDrive CoE

- Schneider Electric Lexium32
- Newer Kollmorgen
- maxpos bldc or EL7411

