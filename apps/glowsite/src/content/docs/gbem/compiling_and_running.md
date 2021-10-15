---
title: Compiling & Running
sort: 2
---

# COMPILING & RUNNING

## Compiling
To compile and run outside of an IDE. The steps are:

```shell
mkdir build
cd build
cmake ..
make
```

There is a single main executable, GBEM, which is run with a number of command line options. 

To do any substantial development with GBEM, the code will need to be imported into your IDE of choice (for example JetBrains CLion <https://www.jetbrains.com/clion>). The provided CMakeLists files provides a basis for IDEs that use CMake but the code is simple and should be easy to import into any IDE.

## Command line options

The main command line modes are:

1. cyclic "-c" - run GBEM in cyclic mode (normal)
2. netscan "-n" - run GBEM in netscan mode (**without** applying PDO mapping) 
3. netscan "-m" - run GBEM in netscan mode (**with** applying PDO mapping
4. machine config - "" - run GBEM to check and print machine configuration

Also specific modes

1. EEPROM
2. (AG something missing?)

> GBC (AG something missing?)

## gbemi.ini file

This file sets key GBEM parameters needed at start-up.

````shs
[Platform]
platform = rpi

````

Tell GBEM what platform you are running on.



## ramdisk directory

If running on Linux platforms that use an SD card or eMMC as its filesystem, and you want to use emstat to write a json file each  xxxx

Create a mount point:

```shell
sudo mkdir /mnt/ramdisk
```

Enter it in `/etc/fstab`, so that a RAM disk is automatically generated upon start-up. First edit the `fstab` file

````shell
sudo nano /etc/fstab
````

In the file add the line:

````shell
tmpfs /mnt/ramdisk tmpfs nodev,nosuid,size=50M 0 0
````

This allows you to save 50 MB of data to `/mnt/ramdisk`. After a restart, you can use the following command to confirm the disk has been created and its size.

````shell
sudo df -h
````

 

## Running for the first time

> This assumes you have:
>
> * GBEM installed on a Linux platform with a preempt kernel
> * Have the right NIC connected to an EtherCAT network with one or more slaves on it which are powered up
> * Have configured a machine see [CONFIGURING MACHINES](configuring_machines.md) or have following [GETTING STARTED WITH EXAMPLE HARDWARE](getting_started_with_example_hardware.md)

Start out by doing a netscan. This is `./gbem -n -ieth0`. This will send out on the EtherCAT network a BRD (Broadcast Read) of address 0, and all fully functional slaves in the network will respond to this request.

The netscan will either produce an error message 😕 or a blizzard of config information ​🙂.​

If you get an error message then it is time to read the troubleshooting guide. If you have found some slaves, the next step is check the machine config by running `./gbem -d -ith0`. This will either confirm that the machine configuration is valid or will produce error messages explaining where the misconfiguration lies.

Finally you can run GBEM in cyclic mode with `./gbem -c -ieth0`. This will boot the EtherCAT network and then try and connect over shared memory to GBC (or a program you write to control GBEM over shared memory).

## GBEM config

**`gbem_config.h` & `map_config.h` && `log.h`**

As well as the configuration for machines and the configuration and code for drives and slaves, GBEM has three config files:

`gbem_config.h` contains  compile time #defines it is well commented and self-explanatory

`map_config.h`contains the #defines to control which machine target GBEM is being compiled for and some #defines for things like the maximum length of drive error messages

`log.h` xxxxx

## Preempt-RT kernel patching

GBEM needs a low latency kernel. The Linux preempt-RT kernel patch can provide this.

These instructions perform a **cross-compile** i.e. the kernel is compiled on a host and transferred to target. This example is for the Raspberry Pi 4B but a similar approach can be taken for other targets.

### Download the sources

Create a directory, `rpi_new_kernel` on your PC, and a subdirectory `rpi_rt_kernel` inside that directory for the compiled files as:

```sh
mkdir ~/rpi_new_kernel
cd ~/rpi_new_kernel 
mkdir rpi_rt_kernel
```

Then, clone the following repositories:

```sh
git clone https://github.com/raspberrypi/linux.git -b rpi-4.19.y-rt
git clone https://github.com/raspberrypi/tools.git
```

### Configuration

Next set the environment variables needed for the cross-compilation of the kernel:

```sh
export ARCH=arm
export CROSS_COMPILE=~/rpi_new_kernel/tools/arm-bcm2708/gcc-linaro-arm-linux-gnueabihf-raspbian-x64/bin/arm-linux-gnueabihf-
export INSTALL_MOD_PATH=~/rpi_new_kernel/rpi_rt_kernel
export INSTALL_DTBS_PATH=~/rpi_new_kernel/rpi_rt_kernel
export KERNEL=kernel7l
cd ~/rpi_new_kernel/linux/
make bcm2711_defconfig
```

### Cross compiling the Kernel

To compile the kernel you need to type the following:

```sh
make -j8 zImage 
make -j8 modules 
make -j8 dtbs 
make -j8 modules_install 
make -j9 dtbs_install
```

The `-jX` parameter is set according to the number of processors that your PC.

The last line returned after installing `modules_install` reports the kernel version that you compiled, e.g.:

```sh
DEPMOD  4.19.59-rt23-v7l+
```

You'll need this information for the kernel deployment. Then, make just a blob of data at the end of the kernel image typing:

```sh
mkdir $INSTALL_MOD_PATH/boot
./scripts/mkknlimg ./arch/arm/boot/zImage $INSTALL_MOD_PATH/boot/$KERNEL.img
cd $INSTALL_MOD_PATH/boot
mv $KERNEL.img kernel7_rt.img
```

### Transfer the Kernel

After the compilation is completed, compress all files to transfer them to the Raspberry Pi:

```sh
cd $INSTALL_MOD_PATH
tar czf ../rt-kernel.tgz *
```

Then, transfer the resulting '.tgz' file to the Raspberry Pi using `scp` and your ssh credentials:

```sh
~/rpi-kernel/rt-kernel$ cd ..
~/rpi-kernel$ scp rt-kernel.tgz pi@<ipaddress>:/tmp
```

Change `<ipaddress>` to the corresponding IP of your Raspberry Pi.

### Installing the Kernel Image, Modules & Device Tree Overlays

```sh
cd /tmp
tar xzf rt-kernel.tgz
cd boot
sudo cp -rd * /boot/
cd ../lib
sudo cp -dr * /lib/
cd ../overlays
sudo cp -d * /boot/overlays
cd ..
cp -d bcm* /boot/
```

Add the following entry to `/boot/config.txt`:

```sh
# Add the following option:
kernel=kernel7_rt.img
```

Reboot the Raspberry Pi and test if the kernel is working by typing:

```sh
uname -r
4.19.59-rt23-v7l+
```

## Forcing variables

If enabled with the #defines `CTRL_ENABLE_FORCING` (force EtherCAT PDO variables) and PLC_ENABLE_FORCING (force PLC variables) in `GBEM_config.h` you can force the value of a variable using the debugger. Most debuggers/IDEs offer the capability to pause the execution of a running program under the debugger and once paused give you the ability to change the value of a variable whilst the code is executing under the debugger.

In the following screen shot (taken from the JetBrains CLion IDE) shows that we have navigated to our machine map .c file whilst the debugger is paused and clicked on the `map_iomap[]` variable and then navigated to the the line in the iomap we want to force and can set a value and a Boolean active flag to force the val to our desired value. The value is a union of the available types so you will need to select the one that corresponds to type you want to force.

![Forcing a variable in the IDE](E:\gb-dev\monorepo\apps\GBEM\end_user_docs\forcing_a_variable.png)

This is a little clumsy to use but it does provide an invaluable test/debugging tool in certain situations.

