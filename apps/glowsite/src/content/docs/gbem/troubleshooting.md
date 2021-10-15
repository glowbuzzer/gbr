---
title: Troubleshooting
sort: 14
---
# TROUBLESHOOTING

## What do I do if netscan fails to find any slaves of the EtherCAT network?

netscan doesn't actually do very much. It makes a call to the `sys/socket.h` `socket` to create a RAW packet socket then connects the socket to the NIC using the NIC's name. Then it does a BRD call on the EtherCAT network which all slaves are expected to respond to. So there isn't a huge amount to go wrong in this chain and if it isn't something obvious then it is likely to be pretty low level.

Things to look at:
* **Run as root user**. GBEM needs to switch the Ethernet interface on the Linux platform into promiscuous mode and root privilege is needed to do this. There are ways round the having to be the root user using the Linux `sudo setcap` with `cap_net_admin` / `cap_net_raw` for scenarios that specifically need this but for development especially running as root is easiest.
* **The EtherCAT network and slaves**. Is the EtherCAT network wired correctly? Everything that needs power has power? Good network cables? Try swapping the order the slaves appear on the network around. Try having a single known working slave as the first and only slave on the network? Can you see the slaves from another EtherCAT master? What are the LEDs on the slaves telling you?
* **Linux NIC configuration.** GBEM will work in virtualised environments but needs careful config. Can you test on a non-virtual platform e.g. Raspberry Pi to rule things out?


Things not to bother looking at:
* **Linux realtimeness **- netscan will run perfectly happily on a non-real-time Linux platform
* **Any config of GBEM** - the netscan code base doesn't rely on any of the configuration done in GBEM 

If these steps fail the next step will be to get wireshark running (see below) and see what EtherCAT traffic there is on the network. It may be possible to use the Linux `tcpdump` on the master to capture network traffic rather than wireshark on a laptop which may be easier on some platforms. Wireshark on the network will confirm:

1. If there is any EtherCAT traffic on the network
2. Is the BRD request being sent out
3. Are any slaves responding to the BRD

## Useful ETG documents

https://www.ethercat.org/download/documents/EtherCAT_Diagnosis_For_Users.pdf

There is also a good document from the ETG for developers but registration (free) with the ETG is needed to get a uname and password to th

## I am having problems with a particular slave

In the code for the marker `/* ADD READ REG */` which is a good point to add a register read at the end of start-up that can help diagnose

ec_check should be reading and printing to stdout AL messages but you can directly read teh reg here

DLSTAT is teh link status and gives an indication on the status of the network link on teh slave

```c
ECT_REG_DLSTAT
    ECT_REG_ALSTATCODE
```

## How do I enable debug logging?

First level is logging is user messages. These are normal flow of execution. These are enabled with the `GBEM_UM_EN`
#define or a -D macro to be used by the pre-processor

-D name Predefine name as a macro, with definition 1.

-D name=definition The contents of definition are tokenized and processed as if they appeared during translation phase
three in a ‘#define’ directive.

some of these will spit out so much data that unlikely you can run a bus

LL_TRACE

## The boot process does not complete

If the boot process does not complete then there is probably something nasty in one or more of your slave configuration functions or slave configuration generally.

Configuration things to check:

Are you slave #defines in the mymachine_map.h in the order the slaves appear on the network?

 ````
 #define MAP_EK1100_1 	            1
 #define MAP_EL2008_1 	            2
 #define MAP_EL1008_1 	            3
 #define MAP_EL2022_1 	            4
 #define MAP_AKD_1 	                5
 #define MAP_AKD_2 	                6
 
 
 #define MAP_NUM_SLAVES              6
 #define MAP_NUM_DRIVES              2
 ````

Things to check in your slave function functions:

There are three sets of functions to check:

- `MAP_SLAVE_PDO_MAPPING_FUNCTIONS`
  - If any the PDO remapping SDO writes fail, 
- `MAP_SLAVE_STANDARD_SDO_FUNCTIONS`
  - If a SDO write fails then the boot will not complete sucessfully. The GBEM user messages should report the address of teh failure. 
- `MAP_SLAVE_INITIAL_PDO_FUNCTIONS`
  - There isn;t much to go wrong here



DC clock config



## I have real-time troubles - help!

#### Are you doing any (lots!) of SDO read/writes during cyclic exchange?

The SDO reads are not supposed to be performed in the main loop that cycles at the bus cycle time. It is just about possible to do SDO read/writes in a lower priority thread but problems can occur.

#### Linux kernel difficulties

The starting point if you suspect the Linux kernel latency is causing issues is to run cyclic test.

```shell
git clone git://git.kernel.org/pub/scm/linux/kernel/git/clrkwllms/r-tests.git`
cd rt-tests
make
```

Then run with:

```shell
./cyclictest -a -t -n -p99
```

If your system is not filled with real-time goodness you will see something like this:

```shell
T: 0 ( 3431) P:99 I:1000 C: 100000 Min:      5 Act:   10 Avg:   14 Max:   39242
T: 1 ( 3432) P:98 I:1500 C:  66934 Min:      4 Act:   10 Avg:   17 Max:   39661
```

Whereas if a real-time kernel is doing what it should you will see something like this:

```shell
T: 0 ( 3407) P:99 I:1000 C: 100000 Min:      7 Act:   10 Avg:   10 Max:      18
T: 1 ( 3408) P:98 I:1500 C:  67043 Min:      7 Act:    8 Avg:   10 Max:      22
```

The right-hand column show's a worst case latency of 18usec on core 1 and 22usec on core 2

## isolcpus

isolcpus is the best way in Linux to isolate CPU cores. This allows you to bind things to different core.

```shell
sudo nano /boot/cmdline.txt
```



```shell
# Add one of the following options at the end of the line
isolcpus=3      # isolate the CPU nr 3
isolcpus=1,2,3  # isolate the CPUs nr 1, 2 & 3
```

To define the affinity of interruptions to a specific CPU type e.g.:

````
sudo echo 3 > /proc/irq/62/smp_affinity
sudo echo 3 > /proc/irq/62/smp_affinity_list
````



cat /proc/interrupts



````
taskset -c 3 python      # only one CPU
taskset -c 1,2,3 python  # multiple CPUs
````





## running as root

sudo setcap cap_net_admin,cap_net_raw=eip slaveinfo?

## clocks

gettime use mono and adjust with
#TROUBLESHOOTING

## Error codes

simple global error table gb

E_SUCCESS

## Wireshark

### Introduction

EtherCAT uses standard everyday Ethernet frames. This means Wireshark (the most commonly used & free network protocol analysis tool) can be used to analyse traffic from GBEM. You can download Wireshark [here](https://www.wireshark.org)

You will need to insert an unmanaged Ethernet switch into your EtherCAT network to make it easy to sniff the network with Wireshark. This is shown in the diagram below.

````mermaid
graph LR;
  id1[GBEM]---id2[Switch]---id3[EtherCAT Slave 1]---id4[EtherCAT Slave 2];

  id2---id5[Laptop running wireshark];
````



1. Run Wireshark on your laptop
2. Capture from  the correct "Local area connection" that corresponds to your Ethernet port that is connected to the switch
3. Use the start / stop buttons to capture traffic
4. Put your thinking cap on and work out what is going on

Useful capture filters:

* `ether proto 0x88a4` (EtherCAT over Ethernet only)

Useful post capture filters:

* See [this list](https://www.wireshark.org/docs/dfref/e/ecat.html) for the datagram filters
* & [this list](https://www.wireshark.org/docs/dfref/e/ecat_mailbox.html) for the EtherCAT mailbox filters

### Diagnosing specific problems with wireshark

#### Slave start-up and state machine diagnosis

#### SDO read write diagnosis

#### PDO read write diagnosis

#### DC clock configuration diagnosis

