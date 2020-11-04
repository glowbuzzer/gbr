import * as React from "react";
import {configContext, FRAME_ABSREL} from "@glowbuzzer/hooks";

const ACTIVITYTYPE = {
    MOVEATVELOCITY: 0,
    MOVELINE: 1,
    MOVEARC: 2,
    MOVESPLINE: 3,
    MOVEJOINTS: 4,
    MOVETOPOSITION: 5,
    MOVELINEWITHFORCE: 6,
    MOVETOPOSITIONWITHFORCE: 7,
    GEARINPOS: 8,
    GEARINVELO: 9,
    GEARINDYN: 10,
    SETDOUT: 11,
    SETAOUT: 12,
    DWELL: 13,
    WAITON: 14,
    SWITCHPOSE: 15,
    LATCH: 16
};

const Axis = {
    X: 0,
    Y: 1,
    Z: 2
};

function rad(angle) {
    return angle / 180 * Math.PI;
}

function make_quat(angle, axis) {
    const angle_in_rads = rad(angle) / 2; // final div 2 for quat (https://eater.net/quaternions/video/rotation)
    const xyz = [0, 1, 2].map(a => a === axis ? Math.sin(angle_in_rads) : 0); // pick the axis of rotation
    const [x, y, z] = xyz;
    return {
        w: Math.cos(angle_in_rads),
        x, y, z
    }
}

const config = {
    frames: {
        "Table": {
            translation: {
                x: 100,
                y: 0,
                z: 0
            }
        },
        "Robot": {
            translation: {
                x: 50,
                y: 100,
                z: 0
            },
            rotation: make_quat(90, Axis.Z),
            absRel: FRAME_ABSREL.FRAME_RELATIVE,
            parent: 0
        },
        "Other": {
            translation: {
                x: 100,
                y: 100,
                z: 0
            }
        },
        "Conveyor": {
            translation: {
                x: 100,
                y: 100,
                z: 0
            },
            rotation: make_quat(90, Axis.Z),
            absRel: FRAME_ABSREL.FRAME_RELATIVE,
            parent: 0
        },
        "Light beam": {
            translation: {
                x: 10,
                y: 0,
                z: 0
            },
            absRel: FRAME_ABSREL.FRAME_RELATIVE,
            parent: 3
        }
    },
    joint: {
        0: {
            negLimit: rad(-180),
            posLimit: rad(180)
        },
        1: {
            negLimit: rad(-90),
            posLimit: rad(90)
        },
        2: {
            negLimit: rad(-245),
            posLimit: rad(65)
        },
        3: {
            negLimit: rad(-200),
            posLimit: rad(200)
        },
        4: {
            jointType: 1, // prismatic
            negLimit: 0,
            posLimit: 1000
        },
        5: {
            finiteContinuous: 1 // continuous
        },
    },
    kinematicsConfiguration: {
        default: {
            participatingJoints: [0, 1, 2, 3, 4, 5],
            participatingJointsCount: 6,
            frameIndex: 1, // robot
            kinematicsParameters: {
                sixDofsParameters: {
                    linearVmax: 10000,
                    linearAmax: 100000,
                    linearJmax: 1000000,
                    tcpRotationalVmax: 100,
                    tcpRotationalAmax: 1000,
                    tcpRotationalJmax: 10000
                }
            }
        }
    },
    task: {
        "move fwd - linear": {
            "activity1": {
                activityType: ACTIVITYTYPE.MOVELINE,
            }
        },
        "move back - linear": {
            "activity1": {
                activityType: ACTIVITYTYPE.MOVELINE,
            }
        },
        "move fwd - joint": {
            "activity1": {
                activityType: ACTIVITYTYPE.MOVETOPOSITION,
            }
        },
        "move back - joint": {
            "activity1": {
                activityType: ACTIVITYTYPE.MOVETOPOSITION,
            }
        },
        "arc - linear": {
            "activity1": {
                activityType: ACTIVITYTYPE.MOVEARC,
            }
        },
        "box move": {
            "activity1": {
                activityType: ACTIVITYTYPE.MOVELINE,
                moveLine: {
                    kinematicsConfigurationIndex: 1,
                }
            },
            "activity2": {
                activityType: ACTIVITYTYPE.MOVELINE,
                moveLine: {
                    kinematicsConfigurationIndex: 1,
                }
            }
        },
        "superimp": {
            "dwell": {
                activityType: ACTIVITYTYPE.DWELL,
                dwell: {
                    ticksToDwell: 10
                }
            },
            "down": {
                activityType: ACTIVITYTYPE.MOVELINE,
                moveLine: {
                    superimposedIndex: 1
                }
            },
            "up": {
                activityType: ACTIVITYTYPE.MOVELINE,
                moveLine: {
                    superimposedIndex: 1
                }
            }
        },
        "gear in": {
            "activity1": {
                activityType: ACTIVITYTYPE.GEARINDYN,
            }
        },
    }
};

export const Provider = ({children}) => {
    return <configContext.Provider value={config}>
        {children}
    </configContext.Provider>
};
