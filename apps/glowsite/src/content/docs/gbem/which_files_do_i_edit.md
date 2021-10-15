---
title: Which files do i edit?
sort: 4
---
# WHICH FILES DO I EDIT?

## Adding new machines using existing slaves and drives

You are going to be working in the `/libs/machine_mapping` static lib.

You will create two files for your machine to hold your machine configuration:

` /libs/machine_mapping/inc/my_machine_map.h` 

` /libs/machine_mapping/src/my_machine_map.c`

And in `/libs/machine_mapping/inc/map_config.h` you will add in a new #define for your new machine 

## Adding a new drive

Your will create a new static library inside a new directory you will create. `/libs/my_drive_mfr`

Inside 

The header file you create will need to include in your my_machine_map.h file.

## Adding new slaves

Your will create a new static library inside a new directory you will create. `/libs/my_slave_mfr`

## Changing general config

`/apps/GEBM/shared/inc/gbem_config.h`

