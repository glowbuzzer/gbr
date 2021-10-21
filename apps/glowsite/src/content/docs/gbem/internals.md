---
title: GBEM Internals
sort: 13
---
# LINUX GBEM INTERNALS
## Threads (Linux POSIX pthreads)

When everything is up and running we will have the following threads running:

* ec_rxtx - realtime - `void ECRxTx(void *argument)` 
* ec_emstat - `void ec_emstat(void *argument)`spits out the emstat status.json file every few seconds 
* ec_check - `void ec_check(void *argument)`checks for slaves that are raising errors or have dropped off the network
* n x PLC threads - each PLC task that the user creates becomes a pthread 



## gberror

Simple mechanism to centralise the error codes returned from functions.

## Signals

ec_rxtx thread sends signal to process defined in xxx.

## Data types

### GBC types

### EC types


## Slave numbering

## CiA 402 state machine

GBEM uses the CiA 402 state machine extensively in its operation.

![alt text][cia402_diagram]


GBEM has the concept of the **machine state**. This is a CiA 402 state machine and is commanded by GBC and reports back its status to GBC over shared memory (DPM) in the status word. These words are accessed through:
`dpm_in->machine_word` & `dpm_out->machine_word`.

If GBC commands GBEM (by writing to shared memory) to move from `CIA_SWITCH_ON_DISABLED` to `CIA_READY_TO_SWITCH_ON`
with a `CIA_SHUTDOWN` control word, GBEM will try and advance the **machine state** to `CIA_READY_TO_SWITCH_ON`. To do this, GBEM will command all drives to also move to the `CIA_READY_TO_SWITCH_ON` state and if they succeed in making the transition and there are no active faults, then the **machine state** will advance and `CIA_READY_TO_SWITCH_ON` will be reported in the machine word.

The **machine state** implements the full CiA 402 state machine as illustrated in the cia402_diagram.

## Interface between GBEM & GBC

### Introduction

The interface between GBC is very simple. It consists of two things:

1. 200 bytes x 2 (In and Out) of dual port memory (shared mem)
1. a signal (POSIX) sent synchronously from GBEM to GBC each busy cycle to trigger a cycle of execution

The IN and OUT global buffers are:
storage : `in`
struct overlay : `dpm_in_t` & `dpm_out_t` in `dpm.c`

GBEM needs to know the Process ID (PID) of GBC in order to send signals to it. There is a default process name #pr? and it can be specified optionally on the GBEM command line -p[name].

### dpm_in

Key things that can be seen in these structs are:

```c
typedef struct {
uint32_t machine_word;
uint32_t active_fault_word;
uint32_t fault_history_word;
uint32_t  heartbeat;
uint16_t  joint_statusword[DPM_NUM_JOINTS];
int32_t joint_actual_position[DPM_NUM_JOINTS];
int32_t joint_actual_velocity[DPM_NUM_JOINTS];
int32_t joint_actual_torque[DPM_NUM_JOINTS];;
uint64_t digital;
float analog[DPM_NUM_ANALOGS];
int32_t  integer32[DPM_NUM_INT32S];
uint8_t reserved[4];
uint32_t unsigned32[DPM_NUM_UINT32S];
}__attribute__((packed)) dpm_in_t;
```

`machine word` - this follows the CiA 402 pattern and is sent by GBC to GBEM to advance its overall "machine" state machine. As the main GBEM state machine advances, GBEM automatically commands all drives to try and follow its state machine i.e. if you set the `machine_word` to `OPERATION_ENABLED` then GBEM will try and advance all drives to `OPERATION_ENABLED`.

`heartbeat` - gbem generates a heartbeat tick which is echo'd by GBC if this does not keep up it will trigger an error on GBEM.

### dpm_out

```c
typedef struct {
uint32_t machine_word;
uint32_t hlc_control_word;
uint32_t gbc_control_word;
uint32_t  heartbeat;
uint16_t  joint_controlword[DPM_NUM_JOINTS];
int32_t joint_set_position[DPM_NUM_JOINTS];
int32_t joint_set_velocity[DPM_NUM_JOINTS];
int32_t joint_set_torque[DPM_NUM_JOINTS];;
uint64_t digital;
float analog[DPM_NUM_ANALOGS];
int32_t  integer32[DPM_NUM_INT32S];
uint8_t reserved[4];
uint32_t unsigned32[DPM_NUM_UINT32S];
}__attribute__((packed)) dpm_out_t;
```





## logger

```
logger_set_stdout();
//    logger_set_log_file("gbem.log", LOG_EN);
//    logger_set_syslog("Glowbuzzer");
```





