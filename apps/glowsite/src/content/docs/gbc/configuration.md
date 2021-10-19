---
title: Configuration of GBC
sort: 2
---

# Configuration of GBC

## Introduction

The`default.json` file includes a number of other JSON files that together define the configuration of the machine. These files (with the exception of fieldbus.json) need to be edited to suit your machine.

```json
"$include machine": "machine_xxx.json",
"$include fieldbus": "fieldbus.json",
"$include task": "tasks.json",
```

## `machine_xxx.json`

### Introduction

This is the most important file and defines the machine that GBC is interacting with.

The sections of this correspond to Config sections of the schema. 

### machine

`machine` maps to `MachineConfig` - add_link

Bus cycle time needs to be 1, 2, 4 and must match the bus cycle time in GBEM or GBSM and is needed to ensure the calculated trajectories match the actual cycle at which they are sent to motors

```json
"machine": {
    "default": {
    "busCycleTime": 4
    }
}
```

### stream

`stream` maps to `StreamConfig` - add_link

```json
"stream": {
    "default": {
    }
  },
```

### joint

`joint` maps to `JointConfig` - add_link

Joints correspond to the axes or motors on your machine and in this section we define their kinematic limits vmax, amax and jmax.

We also need to scale the position sent to the joints - see [scaling](scaling.md) for more details on how to set the scale factor.

These need to correspond to the joints defined in GBEM or GBSM

````json
"joint": {
    "0": {
    	"vmax": 200,
    	"amax": 4000,
    	"jmax": 80000,
    	"scale": 133.33333333
    },
    "1": {
      	"vmax": 200,
      	"amax": 4000,
      	"jmax": 80000,
      	"scale": 266.66666666
    },
    "2": {
      	"vmax": 200,
      	"amax": 4000,
      	"jmax": 80000,
      	"scale": 1000.0
    }
  }
````



### jog

`jog` maps to `JogConfig` - add_link

````  json
"jog": {
    "0": {
      	"kinematicsConfigurationIndex": 0
    }
  },
````

### kinematicsConfiguration

````json
"kinematicsConfiguration": {
    "default": {
      "frameIndex": 0,
      "participatingJoints": [
        0,
        1,
        2
      ],
      "participatingJointsCount": 3,
      "kinematicsParameters": {
        "kinematicsConfigurationType": 3,
        "xExtents": [
          -100,
          100
        ],
        "yExtents": [
          -100,
          100
        ],
        "zExtents": [
          -100,
          100
        ],
        "cartesianParameters": {
          "linearVmax": 20,
          "linearAmax": 400,
          "linearJmax": 8000,
          "tcpRotationalVmax": 100,
          "tcpRotationalAmax": 1000,
          "tcpRotationalJmax": 10000
        },
        "kinChainParams": {
          "numRows": 6,
          "numCols": 5,
          "data": [
            -90,
            0,
            0,
            0,
            0,
            0,
            0,
            -90,
            225,
            0,
            90,
            0,
            90,
            0,
            35,
            -90,
            0,
            0,
            0,
            225,
            90,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            65
          ]
        }
      }
    }
  },


````



### din, dout, ain, aout, iin, iout

These map to DinConfig



````json
  "din": {
    "0": {
      "inverted": 1
    },
    "1": {
      "inverted": 0
    },
    "2": {
      "inverted": 0
    },
    "3": {
      "inverted": 0
    }
  },
  "dout": {
    "0": {
      "inverted": 0
    },
    "1": {
      "inverted": 0
    },
    "2": {
      "inverted": 0
    },
    "3": {
      "inverted": 0
    },
    "4": {
      "inverted": 0
    },
    "5": {
      "inverted": 0
    },
    "6": {
      "inverted": 0
    },
    "7": {
      "inverted": 0
    },
    "8": {
      "inverted": 0
    },
    "9": {
      "inverted": 0
    }
  },
  "ain": {
    "0": {
    }
  },
  "aout": {
    "0": {
    }
  },
  "iin": {
    "0": {
    }
  },
  "iout": {
    "0": {
    }
  }
}
````

## `fieldbus.json`

This defines the structure of the fieldbus and is usually not to be altered.

```json
{
  "fieldbus": {
    "0": {
      "jointCount": 10,
      "RxPdo": {
        "machineStatusWordOffset": 0,
        "activeFaultOffset": 4,
        "faultHistoryOffset": 8,
        "heartbeatOffset": 12,
        "jointStatuswordOffset": 16,
        "jointActualPositionOffset": 36,
        "jointActualVelocityOffset": 76,
        "jointActualTorqueOffset": 116,
        "digitalOffset": 156,
        "digitalCount": 8,
        "analogOffset": 164,
        "analogCount": 6,
        "integerOffset": 188,
        "integerCount": 2
      },
      "TxPdo": {
        "machineControlWordOffset": 0,
        "gbcControlWordOffset": 4,
        "hlcControlWordOffset": 8,
        "heartbeatOffset": 12,
        "jointControlwordOffset": 16,
        "jointSetPositionOffset": 36,
        "jointSetVelocityOffset": 76,
        "jointSetTorqueOffset": 116,
        "digitalOffset": 156,
        "digitalCount": 10,
        "analogOffset": 164,
        "analogCount": 6,
        "integerOffset": 188,
        "integerCount": 2
      }
    }
  }

```

## `tasks.json`



```json
{
  "task": {
    "move joint": {
      "activity1": {
        "activityType": 4
      }
    },
    "move line": {
      "activity1": {
        "activityType": 1
      }
    },
    "move at velocity": {
      "activity1": {
        "activityType": 0,
        "skipToNextTriggerIndex": 1
      }
    }
  }
}
```

