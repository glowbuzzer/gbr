---
title: Adding drives
sort: 8
---

# ADDING A NEW DRIVE

## Introduction

Adding support for a new type of drive requires the implementation of a set of C functions to support various operations needed to control a drive, like reading its status word, writing a position to the drive and reading an error message from the  drive. We can't provide standard functions to control any drive because all drives tend to work in a very similar manner but with slight differences. 

If the drive follows the CiA 402 specification closely, implementing these functions a trivial exercise and the existing examples can just be largely copied and pasted. However, if your drive supports more exotic interfaces or has fancy extra features which you want to use, then this may be more complicated. 

In GBEM adding a new drive a set of extra steps on top of those required to add a new slave so it is worth reviewing the documentation for adding a new slave as well as the instructions in this section - [ADDING A NEW SLAVE](adding_a_new_slave.md).

## First steps
If you have ever commissioned a fieldbus drive before, you will already know that it is a bit of a painful process irrespective of the software you are integrating it with. There is, working out the wiring for the safety features to get it to move at all, a slightly baffling tuning process, a dense forest of configuration options to wade through and a "helpful" 500 page manual.

These are the steps we suggest you follow to implement a new drive interface for a new drive:

1. Take a quick look at the "getting started" guide provided by the drive manufacturer to get the overall lay of the land.
1. Implement the most basic possible wiring scheme required to get the drive to an operational state. (Obviously the drive will be outside the machine just sitting on the workbench at this stage).
1. Use the drive manufacturer's configuration software to try and get the drive to move (if the manufacturer provides such software).
1. Plug the drive into an EtherCAT network and run the GBEM with the netscan option to see if it can be seen and to have a look at its default PDO mapping.
1. Dive into the manufacturer's drive documentation to work out the PDO mapping you want to use, [see here](#Write the slave functions).
1. Dive into the manufacturer's docs to work out the start-up SDOs and any initial PDO writes that are needed.
1. Write the functions to perform the initial SDO writes, [see here](#) .
1. Write the cyclic functions to communicate with the drives PDOs, [see here](#Write the cyclic functions).
1. Test the drive, [see here](#Test the drive).

## What are the key functions provided by GBEM that you will need to use?

In the functions you write to support a new drive, you will need to read and write SDO and PDO objects.  In fact, pretty much all the functions actually do is read and write PDOs and SDOs from the slaves. PDO read/writes occur cyclically at the EtherCAT bus frequency (1ms 4ms etc.). SDO read/writes occur at start-up. 

Inside the EtherCAT library of GBEM, there are the files `ethercatgetset.h` and `ethercatgetset.c`. These files define and implement the functions you need to perform SDO and PDO reads and writes.

SDO read/write function names follow the pattern `ec_sdo_write_xxxx` & `ec_sdo_read_xxxx` where `xxxx` is the type e.g. `uint16`.

PDO get/set function names follow the pattern `ec_pdo_set_output_xxxx` & `ec_pdo_get_input_xxxx` where `xxxx` is the type e.g. `uint16`.

SDO functions take three parameters: the slave number, the index and the sub-index you want to read from or write to.

SDOs are addressed using both an index and sub-index with the following structure:

| Byte 0                                    | Byte 1:3 (multiplexor)         | Byte 4:7 (data)         |
| ----------------------------------------- | ------------------------------ | ----------------------- |
| Command specifier  (upload/download etc.) | 16 bit index + 8 bit sub-index | 1-4 byte parameter data |

PDO functions take two parameters: the slave number and the byte number in the iomap you want to get or set. The byte number in the iomap is usually a #define that is created in the slave's header file when you add a new slave to GBEM.

The slave number is an integer that represents the position of the slave on the network (note, index starts at 1). It is also usually a #define in the slaves header file.

## Where to put the code for a new drive

Drives code is placed in static libraries compiled into the main GBEM code. To add a library for your new drive, create a directory in `/libs` called `mydrivemanufacturer`.  Inside this directory create "src" and "inc" sub-directories and create a cMakeLists.txt file following the pattern used in the other drive libraries and then add the path of the new library to the root the cMakeLists.txt. 

Inside the new src and inc directories create a pair of files called `mydrive.c` & `mydrive.h`.  Inside these files we will create the functions and #defines needed to support the new drive.

There are two types of drive functions that have to be written:

1. *slave functions* which configure the slave itself (e.g. configure the slave's PDO map)
2. *drive functions* most of which which are called cyclically to exchange data with the drive each cycle (e.g. write a set position to a drive)

We discuss how to write these sets of functions in the next sections of this document.

There is also the drive's header file that will need writing. This contains mainly #defines for constants and functions declarations for the functions above.

## Write the slave functions

The prototypes and suggested names of the required start-up functions that are needed for a drive are detailed below. You will need to write new functions for your drive for each of these although they are all optional based on what you need to configure on your drive.

```c
gberror_t ec_pdo_map_mydrive(uint16_t slave){};
gberror_t ec_nvram_sdo_mydrive(uint16_t slave){};
gberror_t ec_nvram_write_mydrive(uint16_t slave){};
gberror_t ec_standard_sdo_mydrive(uint16_t slave){};
gberror_t ec_initial_pdo_mydrive((int16_t slave){};
```

### `ec_pdo_map_mydrive` 

This function performs a series of SDO writes to apply a PDO (re)mapping to the slave.

PDO mapping is deciding what data is included in the cyclic exchange between master and slave.

There are three options:

1. take the default that the drive manufacturer has decide the drive will start-up with 
1. request a pre-defined PDO configuration from the list the manufacturer provides
1. go &aacute; la carte where you pick objects from the slave's object dictionary individually

Which option you do pick? There are some mandatory objects GBEM needs mapped. These are the core CiA 402 objects:

* drive status word (uint16_t encoding of the status of the drive)
* drive control word (uint16_t encoding that allow us to interact with the drive)
* actual position (int32_t) the position of drive
* set position (int32_t) the position we want the drive to be in
* modes of operation (get/set) (if you want to access them with an PDO rather than SDO)

There are also some useful things that it makes it easier to use GBEM so if these can be provided in the PDO mapping then it is good to configure the PDO in such a way as to provide them:

* follow error indication 
* error code

> Some drives require the drive manufacturer's configuration software to be used to create the PDO map and save it to the drive's NVRAM. In this case you can't configure the PDO mapping through GBEM and the functions to do the PDO mapping are not needed.

To create the PDO mapping see the section in the slave document [ADDING A NEW SLAVE](adding_a_new_slave.md)

If you are using the drive's default PDO mapping this function wont be needed and its entry in the machine map will be NULL.

If you want (or have) to create PDO map using the drive then this function will need to be written. 

See the section in the slave document [ADDING A NEW SLAVE](adding_a_new_slave.md) for more information on how to write the `ec_pdo_map_mydrive` function.

> This function is optional - if you are using the default PDO mapping for the drive then this function is not needed and the entry in the machine map will be NULL

### `ec_nvram_sdo_mydrive`

> If you don't want to use the drive manufacturer's software to configure things like soft-limits, directions etc. which need writing to NVRAM then this function is not needed and can be a NULL in the machine map.


This function performs a series of SDO writes to slave objects that are subsequently saved to the slave's NVRAM.

What objects a drive stores in NVRAM is very dependent on the drive manufacturer but usually this is:

* limits applied to the movement of the drive (often expressed as a +ve rotation limit and a -ve rotation limit)
* direction the drive moves in
* sometimes specific motor parameters are stored in the NVRAM

The objects:

`map_drive_pos_limit[]`

`map_drive_pos_limit[]`

`map_drive_direction[]`

are provided in the machine map to store these parameters and the `ec_nvram_sdo_mydrive` needs to perform the SDO writes to set these parameters to the drive.

Here is an example of the function: 

```c
gberror_t ec_nvram_sdos_mydrive(const uint16_t slave) {   
	if (!ec_sdo_write_int32(slave, MYDRIVE_MIN_LIMIT_SDO_INDEX, MYDRIVE_MIN_LIMIT_SDO_SUB_INDEX, map_drive_neg_limit[slave])){
        return E_SDO_WRITE_FAILURE;
    }
    if (!ec_sdo_write_int32(slave, MYDRIVE_MAX_LIMIT_SDO_INDEX, MYDRIVE_MAX_LIMIT_SDO_SUB_INDEX, map_drive_pos_limit[slave])){
        return E_SDO_WRITE_FAILURE;
    }
    if (!ec_sdo_write_int32(slave, MYDRIVE_DIRECTION_SDO_INDEX,MYDRIVE_DIRECTION_SDO_SUB_INDEX, map_drive_direction[slave])){
        return E_SDO_WRITE_FAILURE;
    }
    gberror_t grc = ec_write_nvram_akd(slave);
    if (grc != E_SUCCESS) {
        return E_NVRAM_WRITE_FAILURE;
    } else {
        return E_SUCCESS;
    }
}
```

First it performs a series of SDO writes using the `ec_sdo_write_xxxx` functions from `ethercatgetset.c`. The #defines for the addresses (`xxxx_SDO_INDEX` and `xxxx_SDO_SUB_INDEX`) have come from the drive's reference manual are have been stored in the `mydrive.h` file.

If an `ec_sdo_Owrite_xxxx` call fails we return `E_SDO_WRITE_FAILURE` (an error code defined in the gberror library).

After doing the SDO writes, it calls a function `ec_write_nvram_akd(slave)` (which you need to provide) which triggers the saving of the previously written parameters to NVRAM with another SDO write.

> This function is optional - if you don't need to save particular configuration settings to the drive's NVRAM then this function it is not needed and the entry in the machine map will be NULL

### `ec_nvram_write_mydrive`

> If you don't want to use the drive manufacturer's software to configure things like soft-limits, directions etc. which need writing to NVRAM then this function is not needed and can be a NULL in the machine map

This function performs an SDO write that triggers an NVRAM write on the drive to save certain objects to NVRAM. Usually this is just a single SDO. Usually after writing this SDO the drive will need to be power cycled before the saved settings take effect but this behaviour varies by drive.

It is called from the  `ec_nvram_sdo_mydrive` function.

Here is an example implementation of the function:

```c
gberror_t ec_write_nvram_mydrive(const uint16_t slave) {
    if (!ec_sdo_write_uint32(map_drive_to_slave[slave], MYDRIVE_WRITE_CONFIG_SDO_INDEX,
                               MYDRIVE_WRITE_CONFIG_SDO_SUB_INDEX, MYDRIVE_WRITE_CONFIG_SDO_VALUE)) {
        return E_SDO_WRITE_FAILURE;
    }
    return E_SUCCESS;
}
```

> This functional is optional - if you don't need to save particular configuration settings to the drive's NVRAM then this function it is not needed

### `ec_standard_sdo_mydrive`

Drives may need a set of SDOs writing to them during start-up to configure various drive functions. The drive's instruction manual will provide the details you need. Key things to think about:

* **How does the drive's modes of operation get set? ** 'Modes of Operation' defines how a drive is controlled. Examples would be: CSP (Cyclic Synchronous Position), CSV (Cyclic Synchronous Velocity), CST (Cyclic Synchronous Torque). The mode needs setting before we are able to use the drive. Some drives want the modes-of-operation to be set cyclically in a PDO object but if it needs to be set via an SDO object then it will need to be set in `ec_standard_sdo_mydrive` function.
* **How does the drive handle units and scaling?** Does the drive need SDOs set to configure the units and scaling for position?
* **Does the drive need to be told the interpolation period?** Some drives work this out from the EtherCAT bus cycle but others need it explicitly defining
* **Does the motor attached to the drive need configuration parameters defining?** Does the motor model need to be defined? Current settings? 
* **If the drive is a servo do the tuning parameters need writing**? This may be stored in the NVRAM (see above) or may need setting at start-up with an SDO write
* **Does the quick stop mode need defining?** Drives have different behaviours on what happens when a quick stop occurs. Sometimes this behaviour is settable with an SDO write. Examples of behaviours: Disable drive function, Ramp down and go to switch on disabled, Ramp down and stay in quick stop active. GBEM expects quick stop to transition into Switch on Disabled so an SDO write for this behaviour may be needed.

Once you have determined what SDOs need to be written you need to write the `ec_standard_sdo_mydrive` itself. It is very simple. In `ethercatgetset.c` are a set of SDO write functions called `ec_sdo_write_****`. There is a different function for different target data types. 

In the example below, we are only setting one SDO which is the SDO for setting the Modes of Operation. Here we have defined the drive's .h file #defines for the hex addresses for the index and sub-index for the SDO to makes things a bit easier.

````c
gberror_t ec_standard_sdos_mydrive(const uint16_t slave) {
        if (!ec_sdo_write_int8(slave, MYDRIVE_MOO_SET_SDO_INDEX, MYDRIVE_MOO_SET_SDO_SUB_INDEX, CIA_MOO_CSP)) {
        	return E_SDO_WRITE_FAILURE;
    	}
    return E_SUCCESS;
}
````

`MYDRIVE_MOO_SET_SDO_INDEX` will be the hex address for the SDO and `MYDRIVE_MOO_SET_SDO_SUB_INDEX` will be uint of the SDO's sub-index. `CIA_MOO_CSP` is a CiA 402 defined uint8_t and the #define lives in the cia402.h file in the cia402 library.

> This function is optional - if you don't need to set specific configuration settings on a drive as it starts up  then this function it is not needed and the entry in the machine map will be NULL Most drives will need some initial SDOs setting.

### `ec_initial_pdo_mydrive`

Some drives need PDOs writing when the drive first initialises. An example of this would be a drive that needs the Modes of Operation set. We want to do this as soon as the drive starts up. The `ec_initia_pdo_mydrive` function allows you to do this.  

If you provide this function then, in the first cycle after the boot, the PDOs writes contained within the function will be written to the drive at once.

An example of this function is shown below. It writes the Modes of Operation with a function of the `ecs_set_output_xxxx` series.

```c
gberror_t ec_initial_pdo_mydrive(const uint16_t slave) {
	ec_pdo_set_output_int8(slave, MYDRUVE_MOOSET_PDO_DRIVE_INDEX, CIA_MOO_CSP);
	return E_SUCCESS;
}
```

> This function is optional - if you don't need to perform some initial PDO writes at start-up then this function it is not needed and the entry in the machine map will be NULL.

## Write the cyclic functions

### Introduction

The prototypes of the required cyclic functions that are needed for a drive are detailed below.

```c
int8_t get_moo_pdo_mydrive(uint16_t drive)
int8_t get_moo_sdo_mydrive(uint16_t drive)
bool get_follow_error_mydrive(uint16_t drive)
bool get_remote_mydrive(uint16_t drive)
uint8_t get_error_string_pdo_mydrive(uint16_t drive)
uint8_t get_error_string_sdo_mydrive(uint16_t drive)
gberror_t set_ctrl_wrd_mydrive(uint16_t drive, uint16_t ctrlwrd)
uint16_t get_stat_wrd_mydrive(uint16_t drive)
int32_t get_actpos_wrd_mydrive(uint16_t drive)
gberror_t set_setpos_wrd_mydrive(uint16_t drive, int32_t setpos)
```

(It looks like there are a lot of them but they usually all follow the same pattern).

In this section we will go through the functions one-by-one discussing their implementation.

### `get_moo_pdo_mydrive` & `get_moo_sdo_mydrive`

This function needs to get the Modes of Operation (CSP, CSV etc.) for a drive. Either with a PDO or SDO depending on what the drive supports.

We test that all drives have their Modes of Operation set correctly when GBEM runs and generates an error if there is an issue. We do this because we don't want a drive to be in, for example, cyclic synchronous velocity mode (CSV) and start sending it position values - that would produce some very unexpected movements!

There is a set of #defines in cia402.h for the standard values (e.g. `CIA_MOO_CSP`) that we can use in this function. Usually the Modes of Operation will be an uint8_t or int8_t and so if we are reading a PDO value we will use one of the `ethercatgetset` functions,  most likely `ec_pdo_get_input_uint8`.

If the drive doesn't support reading the Modes of Operation then this function needs to be "hardcoded" to return `CIA_MOO_CSP`.

An example implementation is shown below:

````c
int8_t ec_get_moo_sdo_mydrive(const uint16_t drive) {
    int8_t ib8;
    if (!ec_sdo_read_int8(map_drive_to_slave[drive], MYDRIVE_MOO_GET_SDO_INDEX, MYDRIVE_MOO_GET_SDO_SUB_INDEX, &ib8)) {
        return 0;
    } else {
        return (ib8);
    }
}
````

The function is very simple, it reads the SDO using the `ec_sdo_read_int8` function and returns the value.

> This function is mandatory - GBEM needs some way to determine the Modes of Operation for a drive. If your drive doesn't need this feature you will still have to write the function and return the correct mode. There will always need to be an entry in the machine map for either the SDO or PDO version of this function.

### `get_follow_error_mydrive`

This function returns a bool which is true if the drive has a follow error and false if it is following the set position correctly.

So this function needs to work out if the drive has a follow error. Different drives work with follow errors in different ways.

* **Drive has no support for follow errors** - this function will just return false
* **Drive provides the actual follow error value in a PDO** - the function will need to read the PDO with for example an `ec_pdo_get_input_int32`function and then threshold the returned value. If the follow error is greater than XXXX then return true and if less then return false
* **Drive provides the follow error as a flag in the high-byte of the status word** - the function will need to read the status word and test the bit and return true/false appropriately.

An example of a get_follow_error function is shown below:

````c
bool ec_get_follow_error_mydrive(const uint16_t drive) {
    uint16_t drive_stat_wrd;
    drive_stat_wrd = ec_get_stat_wrd_mydrive(drive);

    if (BIT_CHECK(drive_stat_wrd, CIA_FOLLOW_ERROR_BIT_NUM)) {
        return true;
    }
    return false;
}
````

The drive gets the status word (using a function we write as part of drive interface) and checks the follow error bit and returns true/false accordingly.

> This function is mandatory - GBEM needs some way to determine whether a drive has a follow error. If your drive doesn't need this feature you will still have to write the function and return false. There will always need to be an entry in the machine map for this function.

### `get_remote_mydrive` 

"Remote" is a feature of the CiA 402 specification that is supposed to signify that the drive is ready for remote operation. Some drives don't have this feature. Drives that do usually have a bit in the status word defined as the "remote bit". 

Because the bit we want to inspect is in the status word, we want to re-use the function we have already written to get the status word. Then we call function to retrieve the status word (a uint16_t).

Then we inspect the status word for the remote bit number and see if it has been set.

```c
bool ec_get_remote_mydrive(const uint16_t drive) {
	drive_stat_wrd = ec_get_stat_wrd_mydrive(drive);
	if (BIT_CHECK(drive_stat_wrd, CIA_REMOTE_BIT_NUM)) {
    	return true;
	}
	return false;
}
```

> This functional is mandatory - GBEM needs some way to determine whether a drive has the remote set. If your drive doesn't need this feature you will still have to write the function and return true. There will always need to be an entry in the machine map for this function.

### `get_error_string_pdo_mydrive` & `get_error_string_sdo_mydrive`

This function is called when an error occurs. What we want to return from this function is a string that describes what is wrong with the drive - e.g. "Motor overheat".

Now, the drive manufacturers have come up with every imaginable scheme to represent error codes and error strings within their drives so this function can take a wide variety of forms.

One of the common patterns is the drive provides an SDO address from which an error code can be read. Once you have read the error code, the function will need to implement a look-up table to convert the numeric code to a string to return.

Here is a simple example of a function to look-up an error code. Our function returns a pointer to `uint8_t` which will be text error message. Frist we read a PDO which will return a `uint16_t` error code. Then we look up this string in an array of structs containing the error codes and their text descriptions and will return the matching one.

````c
uint8_t *ec_get_error_string_pdo_mydrive(const uint16_t drive) {
   uint16_t drive_error_code = ec_pdo_get_input_uint16(map_drive_to_slave[drive], MYDRIVE_ERROR_CODE_PDO_DRIVE_INDEX);
   for (int i = 0; i < NUM_OF_MYDRIVE_ERROR_STRINGS; i++) {
        if (mydrive_alarm_code[i].error_id == drive_error_code) {
            return &mydrive_alarm_code[i].text_string);
        }
    }
}

const mydrive_error_string_t  mydrive_alarm_code[NUM_OF_MYDRIVE_ERROR_STRINGS] = {
        {0x0,  "AZD: No warning"},
        {0x10, "AZD: Excessive position deviation"},
        {0x20, "AZD: Overcurrent"},
        {0x21, "AZD: Main circuit overheat"},
        {0x22, "AZD: Overvoltage"},
        {0x23, "AZD: Main power off"}
}

````



There has been work done by the ETG and there is a library etg (AG - some missing text here?)

> This function is mandatory.  GBEM needs some way to determine a drive's error message. If your drive doesn't need this feature you will still have to write the function and return some kind of string e.g. "Error messages not supported". There will always need to be an entry in the machine map for this function.

### `set_ctrl_wrd_mydrive`

This function is very simple. It writes the control word to the drive with a PDO write.

It is often a one line function:

````c
gberror_t ec_set_ctrl_wrd_mydrive(const uint16_t drive, const uint16_t ctrlwrd) {
    ec_pdo_set_output_uint16(map_drive_to_slave[drive], MYDRIVE_CONTROLWORD_PDO_INDEX, ctrlwrd);
    return E_SUCCESS;
}
````

> This function is mandatory - GBEM needs some way to set the control word. There will always need to be an entry in the machine map for this function.

### `get_stat_wrd_mydrive`

Again, this function is very simple. It reads the status word from the drive.

`return ec_pdo_get_input_uint16(map_drive_to_slave[drive], MYDRIVE_STATWRD_DRIVE_INDEX);`

It is assumed that the status word is a `uint16_t`. If the drive returns a longer status word it can be cast to a uint16_t in this function preserving the CiA 402 elements we need to drive the GBEM state machine. 

> This function is mandatory - GBEM needs some way to get the status word. There will always need to be an entry in the machine map for this function.

### `get_actpos_wrd_mydrive`

This function needs to get the actual position from a drive and return an int32. This is going to require a read from the EtherCAT network and so we use the ec_pdo_get_input series of functions to read an int32 from the slave accessing PDO object at MYDRIVE_ACTPOS_DRIVE_INDEX which is the PDO offset you defined earlier.

`return ec_pdo_get_input_int32(map_drive_to_slave[drive], MYDRIVE_ACTPOS_DRIVE_INDEX);`

(Yes, that is it just one line!).

`MYDRIVE_ACTPOS_DRIVE_INDEX` is the #defined index of the slave's actpos in the PDO mapping for the slave that we defined when we worked out the PDO mapping that we would use for the slave. 

There can be extra complexities such as when one actual drive slave supports multiple drives and the examples cover these more exotic cases.

We assume that drives take a int32_t setpos and actpos.

> This function is mandatory - GBEM needs some way to get the actpos. There will always need to be an entry in the machine map for this function.

### `set_setpos_wrd_mydrive`

This function is very simple. It writes the setpos to the drive.

It is often going to be a one line function:

`ec_pdo_set_output_int32(map_drive_to_slave[drive], MYDRIVE_ACTPOS_DRIVE_INDEX, setpos);`

>  This functional is mandatory - GBEM needs some way to set the setpos. There will always need to be an entry in the machine map for this function.

## Test the drive

Once the drive functions have been written they need to be linked into a machine map. See the documentation [CONFIGURING MACHINES](configuring_machines.md).

The procedure for this is:

run `GBEM -m -ieth0` to check the PDO mapping

run `GBEM -d -ieth0` to check and print the machine configuration and report any errors

run `GBEM -c -ith0` to run GBEM in cyclic mode

If GBEM is configured to print out user messages, after running GBEM in cyclic mode, the console will be filled with interesting information about the status of the boot of GBEM and the EtherCAT network. *Study this output carefully.* 

If the boot is successful, the next step is to run up GBC and the front-end and see if you can jog the drives. 

## Additional considerations

### How do you home a drive?

Most of the drives we use when we need referenced positioning have absolute encoders fitted that remember their position over a power cycle. The cost of the encoder now tends to be less than the cost of the mechanical arrangements needed to support limit and/or homing switches. However, if you do need to home a drive with switches then there are a number of possible approaches:

1. use the drive's own in built in homing functions where the limit switches are connected to the drives own inputs << recommended>>
2. write code in the front-end (react.js) to home the drive
3. write c code in the GBEM PLC to home the drive

If the suggested approach is taken then the steps that need to be followed are: 

1. Add to the standard SDO functions for the drive the SDO writes needed to home the drive. These are likely to be:
   1. Homing mode
   2. Speed for homing operations (search for switch and search for zero)
   3. Homing switch DIN address
2. In the machine map, in `MAP_DRIVE_RUN_HOMING`, flag drives that need to undergo homing
3. Write a homing_exec function for the drive



````c
paste in hom  (AG something missing?)
````



The homing exec function is called cyclically, so the coding style must reflect a function that is called cyclically.

> IMPORTANT - To do drive based homing you need to have Modes of Operation set with a PDO not with an SDO so a suitable PDO mapping will need to be set-up

### What is the role of the configuration software provided by the manufacturer?

Most drive manufacturers bundle some software with their drives that allows you to configure, test and tune their drives.

This software is very useful. If we are commissioning a new drive that we haven't worked with before, our first step is to get it moving with the manufacturer's own software.

This software is a good place to prove that your electrical wiring for the drive is correct.

The software also often provides good insight into what steps are needed to make this particular drive move.

Finally, some drives have configuration options that can't be set with SDO writes and can only be set within the drive manufacturer's configuration software.
