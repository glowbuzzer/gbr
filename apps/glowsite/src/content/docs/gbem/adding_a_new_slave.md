---
title: Adding slaves
sort: 7
---

# ADDING A NEW SLAVE

## Where to put the code

We add new slaves and drives as a static library per manufacturer. This means you create a new directory in `/libs` called `bandr` or `wago`  and create a `/src` and `/inc` sub-directories inside it. These directories will hold the .h and .c files for the slave (`myslave.c` & `myslave.h`). This static library will need its own basic CMakeLists.txt file and will need adding to root CMakeLists.txt file. You can follow the pattern used for the other slave libraries. 

## What goes in a `myslave.h`file?

The contents of the `myslave.h` header file are:

1. function declarations for the functions you write in `myslave.c`
2. #defines for the slave's EEPROM information - e.g. `EEP_NAME`
3. #defines for BIT numbers used by the slave - e.g. `HOMING_START_BIT_NUM`
4. #defines for indices of PDO objects - e.g. `SETPOS_PDO_DRIVE_INDEX`
5. anything needed for decoding error code strings

The examples below provide further details on these.

## What goes in a `myslave.c` file?

Each new slave *may* need the following functions writing: 

````c
MAP_SLAVE_PDO_MAPPING_FUNCTIONS -> ec_pdo_map_myslave
MAP_SLAVE_NVRAM_SDO_FUNCTIONS -> ec_nvram_sdos_myslave
MAP_SLAVE_STANDARD_SDO_FUNCTIONS -> ec_standard_sdos_myslave
MAP_SLAVE_INITIAL_PDO_FUNCTIONS -> ec_initial_pdo_myslave
````

If the slave is a drive, then more functions will be needed - see the [ADDING A NEW DRIVE](adding_a_new_drive.md) documentation.

`ec_pdo_map_myslave` - executes SDO writes at start-up to PDO map the slave

`ec_nvram_sdos_myslave` - executes SDO writes that can be written to the slave's NVRAM (usually for drives)

`ec_standard_sdos_myslave` - executes SDO writes at start-up to configured functions on the slave

`ec_initial_pdo_myslave` - executes any PDO writes you need on the first cycle of execution

The examples below explain how to write these functions and the circumstances in which they are needed.

### PDO_MAPPING_FUNCTIONS

PDO mapping is the process by which the slave is told which objects we want to appear in the Tx and Rx PDOs. 

See the examples below and the [ADDING A NEW DRIVE](addind_a_new_drive.md) for more information on how to implement this function.

### STANDARD_SDO_FUNCTIONS 

Slaves often need to be configured before they start-up. What needs to be configured is obviously highly dependent on the type of slave. The configuration of slaves is performed with writes to their SDO objects.  

A hook mechanism is provided by GBEM to call a function that you write to perform these SDO writes during the start-up phase.

To perform the actual SO writes we will use the `ethercatgetset.c` `gb_ec_sdo_write_xxxx` functions.

EtherCAT SDOs are addresses with an index and sub-index. The signature of a typical SDO writes function is:

````c
bool ec_sdo_write_uint16(uint16_t Slave, uint16_t Index, uint8_t SubIndex, uint16_t Value)
````

The function takes as parameters a `unit16_t` Slave number, `uint16_t` Index and a `unit8_t` sub-Index and in this case a `uint16_t` value to be written to the object with an SDO write.

### NVRAM_SDO_FUNCTIONS

These are usually used for drives - see [ADDING_A_NEW_DRIVE](adding_a_new_drive.md) for more details of their use in the context of drives.

There are scenarios where they might be of use for a non-drive slave where the slave has configuration parameters that need to be written to the slave's NVRAM. The function performs a series of SDO writes and then a SDO write to the register that triggers a write to NVRAM. The slave usually needs a power cycle for the settings to take effect.

### INITIAL_PDO_FUNCTIONS

These are usually used for drives - see [ADDING_A_NEW_DRIVE](adding_a_new_drive.md) for more details of their use in the context of drives.

There are scenarios where they might be of use for a non-drive slave where the slave wants one or more PDOs written during the first cycle of execution. If this behaviour is needed then this function can be written and it will be called once at the start of cyclic data exchange with the EtherCAT network.

## Examples

### Trivial difficulty example - Beckhoff EL1008 slave

The simplest example is a slave like the EL1008. This is a Beckhoff 8 channel digital input.

Let's start by having a look at the GBEM netscan output for an EL1008.

```c
PDO mapping according to SII :
SM0 TXPDO 0x1A00 Channel 1
addr b   index: sub bitl data_type    name
[0x001B.0] 0x6000:0x01 0x01 BOOLEAN   Input
SM0 TXPDO 0x1A01 Channel 2
addr b   index: sub bitl data_type    name
[0x001B.1] 0x6010:0x01 0x01 BOOLEAN   Input
SM0 TXPDO 0x1A02 Channel 3
addr b   index: sub bitl data_type    name
[0x001B.2] 0x6020:0x01 0x01 BOOLEAN   Input
SM0 TXPDO 0x1A03 Channel 4
addr b   index: sub bitl data_type    name
[0x001B.3] 0x6030:0x01 0x01 BOOLEAN   Input
SM0 TXPDO 0x1A04 Channel 5
addr b   index: sub bitl data_type    name
[0x001B.4] 0x6040:0x01 0x01 BOOLEAN   Input
SM0 TXPDO 0x1A05 Channel 6
addr b   index: sub bitl data_type    name
[0x001B.5] 0x6050:0x01 0x01 BOOLEAN   Input
SM0 TXPDO 0x1A06 Channel 7
addr b   index: sub bitl data_type    name
[0x001B.6] 0x6060:0x01 0x01 BOOLEAN   Input
SM0 TXPDO 0x1A07 Channel 8
addr b   index: sub bitl data_type    name
[0x001B.7] 0x6070:0x01 0x01 BOOLEAN   Input
```



```c
Slave 3 data
PDI Control      : 0104
PDI Config       : 0000
Config Alias     : 0000
Checksum         : 0039
calculated     : 0039
Vendor ID        : 00000002
Product Code     : 03F03052
Revision Number  : 00100000
Serial Number    : 00000000
Mailbox Protocol : 0000
Size             : 000F = 2048 bytes
Version          : 0001
```

The netscan output is not very interesting for this slave. It shows the slave  has  8 inputs and no outputs and the inputs are all BOOLEAN. (But what else would you expect for an 8 channel digital input module!).

The netscan output does tell us the EEP_MAN (0x2), EEP_ID (0x03F0305) and EEP_REV (0x00100000) we might want to include in the machine configuration so that we can run slave checking when the control starts up. These values would be #defined in the slave's header file.

There is no .c file needed for the EL1008 as there is no code to write, it is just going to be #defines in a header file (`EL1008.h`). 

So here is the completed header file for the EL1008.

````c

//EL1008 8Ch. Dig. Input 24V, 3ms
#define EL1008_EEP_NAME 		"EL1008"
#define EL1008_EEP_MAN 			BECKHOFF_MAN
#define EL1008_EEP_ID 			0x03F03052
#define EL1008_EEP_REV 			0x13
//8 bits
#define EL1008_CH1_BIT_NUM 		0
#define EL1008_CH2_BIT_NUM 		1
#define EL1008_CH3_BIT_NUM 		2
#define EL1008_CH4_BIT_NUM 		3
#define EL1008_CH5_BIT_NUM 		4
#define EL1008_CH6_BIT_NUM 		5
#define EL1008_CH7_BIT_NUM 		6
#define EL1008_CH8_BIT_NUM 		7
````

The hash defines for the bit numbers are obviously a bit pointless but follow the pattern used for other slaves where a #defined bit or byte number is essential.

Yes, that is all there is to it - just a single header with some simple #defines.

### Medium difficulty example - Beckhoff EL3001 slave  

The EL3001 is a single channel analog input module.

(AG something missing here??)



read pdo layout off add #defines



````c
//EL3001 1Ch. Ana. Input +/-10V
#define EL3001_EEP_NAME "EL3001"
#define EL3001_EEP_MAN BECKHOFF_MAN
#define EL3001_EEP_REV 0x00110000
#define EL3001_EEP_ID 0xbb93052

//int16
#define EL3001_VALUE_INDEX 2

//Underrange event active
#define EL3001_STATUS_UNDERRANGE_BIT_NUM 0
//        Overrange event active
#define EL3001_STATUS_OVERRANGE_BIT_NUM 1

//Value smaller/equal Limit1
#define EL3001_STATUS_LIMIT_1_1_BIT_NUM 2

//Value bigger/equal Limit1
#define EL3001_STATUS_LIMIT_1_2_BIT_NUM 3

//Value smaller/equal Limit2 &
#define EL3001_STATUS_LIMIT_2_1_BIT_NUM 4

// Bit1: Value bigger/equal Limit2
#define EL3001_STATUS_LIMIT_2_2_BIT_NUM 5

//Bit set when Over- or Underrange
#define EL3001_STATUS_ERROR_BIT_NUM 6

// TRUE when this TxPDO is not valid
#define EL3001_STATUS_TXPDO_STATE_BIT_NUM 13

// Bit toggles everytime when new value available
#define EL3001_STATUS_TXPDO_TOGGLE_BIT_NUM_8 14


````




## Complex example - Kollmorgen AKD drive

### PDO_MAPPING_FUNCTIONS

#### Deciding what mapping to use

Sometimes the default PDO mapping is not what you want. In this example we want to configure a more complex slave such as a Kollmorgen AKD drive.

We diligently read the manual for this slave and lookup the default PDO mappings. The extract from the manual says:

> 0x1701 = Position command value (4 bytes), control word (2 bytes)

> 0x1B01 = Position actual value (4 bytes), status word (2bytes) 

These default mappings look ok for the purposes of basic control of the drive. We can command the drive's control word to advance the state machine and read the status of the drive using the status word. We can set a position with the position command value and read the actual position.

But it is useful to be able to read the follow error for a drive or maybe we want to use the digital inputs on the drive. 

In the manual we saw that in the list of ready-to-use PDO mapping that Kollmorgen provide suitable (alternative) fixed PDO mapping for us. This is an extract from the manual:

> 0x1724 = Target position for cyclic synchronous position mode (4bytes), control word (2 bytes), torque feed forward (2bytes)

> 0x1b26 = Status word (2 bytes), position actual value (4 bytes), analog input value (2bytes), digital inputs (4bytes), follow error actual value (4bytes)

#### Writing the (re)mapping code

Remapping the slave is accomplished by writing a series of SDOs to the slave a start-up.

GBEM provides a struct to help with the PDO mapping. This is :

```c
typedef struct {
    uint8_t number_of_entries;
    uint16_t SM_assignment_index;
} map_SM_assignment_object_t;
```

EtherCAT slaves have a number of sync managers. Basically, these control transmission of the PDO objects to the EtherCAT network. In the scenarios we are concerned with, we are interested in sync managers SM2 and SM3 (0x1c12 SM2 RxPDO & 0x1c13 SM3 TxPDO).

* SM2 handles things going onto the EtherCAT network (confusingly this is called the RxPDO)

* SM3 handles things coming off the EtherCAT network (confusingly this is called the TxPDO)

So we start by creating the SM assignment structs. We will need two, one for SM2 and one for SM3. In the case of the AKD drive, we are just writing a single PDO mapping (often we will use a series of these) so for the AKD drive the `.number_of_entries` is 1. The addresses of SM2 and SM3 are always 0x1c12 and 0x1c13.

````c
map_SM_assignment_object_t map_SM2_akd = {
        .number_of_entries = 1,
        .SM_assignment_index = 0x1c12};

map_SM_assignment_object_t map_SM3_akd = {
        .number_of_entries = 1,
        .SM_assignment_index = 0x1c13};
````

Next, we need to create an array of the addresses of the fixed mappings we want to use. You will recollect we found these in the AKD instructional manual and they were 0x1724 and 0x1b26. For different slaves these arrays will often contain a handful of entries.

````c
uint16_t map_SM2_index_of_assigned_PDO_akd[ECM_MAX_PDO_MAPPING_ENTRIES] = {
        0x1724,
};

uint16_t map_SM3_index_of_assigned_PDO_akd[ECM_MAX_PDO_MAPPING_ENTRIES] = {
        0x1b26};        
````

Next, we write the c code to apply the SDO write to effect the PDO mapping. These use the `ethercatgetset.c` functions to write SDOs.

The sequence used to write PDO mapping is:

1. clear the SM2 and SM3 assignment indexes
2. write the SM3 and SM3 assignment objects
3. write the number of entries written in step 2

So we write a c function called `ec_pdo_map_akd` with the signature shown below to perform the series of SDO writes. This function will be automatically called during the start-up of the slave so that when it has finished booting the PDO mapping has been applied.

````c
gberror_t ec_pdo_map_akd(const uint16_t slave) {
	//clear the SM2 index
    if (!ec_sdo_write_uint8(slave, map_SM2_akd.SM_assignment_index, 0, 0)) {
        return E_SDO_WRITE_FAILURE;
    }

	//clear the SM3 index
	if (!ec_sdo_write_uint8(slave, map_SM3_akd.SM_assignment_index, 0, 0)) {
        return E_SDO_WRITE_FAILURE;
    }

	//write the SM2 entries in a loop
    for (int i = 0; i < map_SM2_akd.number_of_entries; i++) {
        if (!ec_sdo__write_uint16(slave, map_SM2_akd.SM_assignment_index, i + 1,
                                   map_SM2_index_of_assigned_PDO_akd[i])) {
            return E_SDO_WRITE_FAILURE;
        }
    }
	
	//write the SM3 entries in a loop
    for (int i = 0; i < map_SM3_akd.number_of_entries; i++) {
        if (!gec_sdo_write_uint16(slave, map_SM3_akd.SM_assignment_index, i + 1,
                                   map_SM3_index_of_assigned_PDO_akd[i])) {
            return E_SDO_WRITE_FAILURE;
        }
    }

	// set the SM2 assignment object number of entries to actual number (sub-index 0)
    if (!ec_sdo_write_uint8(slave, map_SM2_akd.SM_assignment_index, 0, map_SM2_akd.number_of_entries)) {
        return E_SDO_WRITE_FAILURE;
    }
    
	// set the SM3 assignment object number of entries to actual number (sub-index 0)
    if (!ec_sdo_write_uint8(slave, map_SM3_akd.SM_assignment_index, 0, map_SM3_akd.number_of_entries)) {
        return E_SDO_WRITE_FAILURE;
    }

	//all applied correctly
    return E_SUCCESS;
}
````

Once this function has been written and linked into the machine map, netscan -m can be run.

The output of this is shown below:

````c

PDO mapping according to CoE :
  SM2 outputs
        [byte_offset] [addr b  ] 		[index:sub  ] [bitl] [data_type   ] [name                                    ]
        [0          ] [0xFFF84EA8.0] 	[0x607A:0x00] [0x20] // Target position INT32
        [4          ] [0xFFF84EAC.0] 	[0x6040:0x00] [0x10] // CANopen controlworld UINT16
        [6          ] [0xFFF84EAE.0] 	[0x60B2:0x00] [0x10] // Torque feed forward UINT16
  SM3 inputs
        [byte_offset] [addr b  ] 		[index: sub ] [bitl] [data_type   ] [name                                    ]
        [0          ] [0xFFF84EA8.0] 	[0x6041:0x00] [0x10] // CANopen statusword UINT16
        [2          ] [0xFFF84EAA.0] 	[0x6064:0x00] [0x20] // Position actual value INT32
        [6          ] [0xFFF84EAE.0] 	[0x6077:0x00] [0x10] // Torque actual value INT16
        [8          ] [0xFFF84EB0.0] 	[0x60FD:0x00] [0x20] // Digital inputs UINT32
        [12         ] [0xFFF84EB4.0] 	[0x3470:0x04] [0x10] // Analog input INT16
        [14         ] [0xFFF84EB6.0] 	[0x60F4:0x00] [0x20] // Follow error actual value INT32

````

We can quickly see that the PDO mapping has been successfully applied. We can further confirm this by looking up the objects detailed in the netscan output e.g. `0x607A` in the Kollmorgen manual and we can confirm it is indeed "Target position INT32". The comments in the above output have been added by looking up the hex values in the Kollmorgen manual.

On the left hand side of the netscan output we can see the `byte_offset` values to create #defines for the objects we want to use in our code.

````c
#define AKD_SETPOS_PDO_INDEX                    0 //4 bytes
#define AKD_CONTROLWORD_PDO_INDEX               4 //2 bytes

#define AKD_STATUSWORD_PDO_INDEX                0 //2bytes
#define AKD_ACTPOS_PDO_INDEX                    2 //4 bytes
#define AKD_ACTTORQ_PDO_INDEX                   6 //2 bytes
#define AKD_FOLLOWERROR_ACTVAL_PDO_INDEX        14 //4bytes
````

### STANDARD_SDO_FUNCTIONS

For the example AKD drive we have a considerable number of SDOs to write at start-up. We will write a function called `ec_standard_sdos_akd` which will be linked into the array of functions in the machine map file.

The contents of the function is very simple. It is just a set of SDO writes.

````c
gberror_t ec_standard_sdos_akd(const uint16_t slave) {

//interpolation time index
//0x60C:0x2
//int8
    if (!ec_sdo_write_int8(slave, 0x60C2, 0x2, -3)) {
        return E_SDO_WRITE_FAILURE;
    }

//interpolation time period
//0x60C2:0x1
//uint8
    if (!ec_sdo_write_int8(slave, 0x60C2, 0x1, MAP_CYCLE_TIME)) {
        LL_ERROR(GBEM_GEN_LOG_EN, "GBEM: AKD error applying custom sdo (interpolation time period)");
        return E_SDO_WRITE_FAILURE;
    }

//FBUS.PARAM02:
//This parameter activates the synchronization feature of the AKD.
    if (!ec_sdo_write_uint32(slave, 0x36E6, 0x0, 1)) {
        LL_ERROR(GBEM_GEN_LOG_EN, "GBEM: AKD error applying custom sdo (activate the synchronization feature)");
        return E_SDO_WRITE_FAILURE;
    }

//param04 - This parameter enables (1) or disables (0) the synchronization supervision of the CANOpen or EtherCAT fieldbus
//0x36E8:0x0
//uint32
    if (!ec_sdo_write_uint32(slave, 0x36E8, 0x0, 1)) {
        LL_ERROR(GBEM_GEN_LOG_EN, "GBEM: AKD error applying custom sdo (activate the synchronization supervision)");
        return E_SDO_WRITE_FAILURE;
    }

````

### INITIAL_PDO_FUNCTIONS

For the AKD drive, we are setting the Modes of Operation using an SDO write in the STANDARD_SDO_FUNCTIONS so there is no need for any initial PDO writes. 

### MAP_SLAVE_NVRAM_SDO_FUNCTIONS

For the AKD drive, will use the Kollmorgen workbench software to configure and save the drive soft-limits and directions so we will not write a NVRAM function.

