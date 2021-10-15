---
title: Adding PLC functions
sort: 11
---
# PLC

## Introduction

GBEM includes a PLC. This allows you write code (in C) that is executed cyclically (synchronised with the EtherCAT bus cycle) that can interact with EtherCAT IO and exchange data with GBC and do other processing that you may need.

This is useful in a number of scenarios:

1. You want to pre-process data read off the the EtherCAT slaves before passing it to GBC. Example of this in practice:
   - You have a signal from an encoder that you want to differentiate or integrate before passing it to GBC. GBEM can run code at bus cycle time (e.g. 1ms or 4ms) which is much faster than GBC receives its data. This means the integral or differential would be more accurately calculated in GBEM. GBEM PLC provides a function to do the differentiating and integrating and allows the mapping of EtherCAT PDO (the encoder value) onto a PLC input variable and a PLC output variable onto a GBC input variable.
2. You want to latch a value with accurate time synchronisation. Example of this is practice:
   - A digital in is set and you want to capture an encoder value at exactly the time the digital in is triggered. This could be for homing a machine or for measuring a position very accurately. This could be done in GBC, but the time delay in passing the trigger to GBC will cause the position latch to be inaccurate if it is done in browser based code (obviously the level of inaccuracy depends on how fast the machine is moving and how fast you are updating the front-end but typically you are looking at 100ms delay in processing signals in the front-end).
3. You have some simple IO and don't want to write the react.js code to handle the processing and would rather do it some c code.

## Writing PLC code

### Introduction

Often IO is mapped to GBC IO and then it is passed cyclically up to the front-end (browser based code) and can be controlled there. Sometimes though it is useful to control IO inside GBEM in c code - this is PLC based code.

### Register task

Inside `plc_init.c`, there is a function, `plc_register_task_user`. This is point you register your function that you want to be called by the PLC. This is how you create a PCL task.

````c
void plc_register_tasks_user(void){
    plc_register_tasks(plc_mytask1, 12, 1, "Task1");
}
````

The `plc_register_tasks` function has the signature:

````c
gberror_t plc_register_tasks(void *function, const uint8_t cycle_time, const uint8_t priority, const char *name)
````

`function` is a pointer to your PLC task function

`cycle_time` is the time in ms for teh cycle of the PLC task

`priority`is a `uint8_t` representing the priority of the PLC task - 0 high and 255 low

`name` is the string name used to identify the PLC tasks

### Write the task code

Your task function will be called cyclically at the `cycle_time` you defined when you registered the task. It must be written in such a way as it returns as quickly as possible.

A typical task function would be:

````c
void *plc_mytask1(void *argument) {
    PLC_TASK_START
    if (plc_din1) {
    	printf("Button 1 pressed\n");
	}
    PLC_TASK_END
}
````

If your PLC code includes things like:

```c
while (!din1){
do something interesting
}
```

It just is not going to work. The thread of execution will spin in that loop, and although tasks a run as separate processes, if you are running many tasks GBEM will ultimately run out of resources. Additionally tasks with long running loops obvisously can't be called at your `cycle_time` as, well, they are still running the previous integration. 

Two macros need to bracket your code, `PLC_TASK_START`&`PLC_TASK_END`.

### Handling IO

Define as globals in your task function

extern in the machine map







timing debugger

## PLC stdlib

### Introduction

PLC stdlib is a set of handy PLC style functions for use in GBEM tasks.

### Contents

They include:

* PULSE GENERATORS
  * `plcsl_clock_pulse` - generates a clock with a variable time period
  * `plcsl_clock_div` - divides a clock signal
* COUNTERS
  * `plcsl_ctu` - up counter
  * `plcsl_ctd` - down counter
  * `plcsl_ctud` - up/down counter
  * `plcsl_ton` - on delay timer
  * `plcsl_tof` - off delay timer
  * `plcsl_tp` - pulse timer
* EDGE DETECTION
  * `plcsl_r_trig` - rising edge trigger
  * `plcsl_f_trig` - falling edge trigger
* SIGNAL PROCESSING
  * `plcsl_differentiate` - differentiates a signal
  * `plcsl_integrate` - integrates a singal
* BISTABLE
  * `plcsl_sr` - set/reset bistable
  * `plcsl_rs` - reset/set bistable

* MISC
  * `plcsl_hysterisis` - applies hysteresis to a signal

### Pattern

Provide a pattern to follow to develop your own c code PLC functions

