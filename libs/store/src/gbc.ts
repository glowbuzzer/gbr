// ENUMS
export enum ONOFF {
OFF,ON
}
export enum MACHINETARGET {
MACHINETARGET_NONE,MACHINETARGET_FIELDBUS,MACHINETARGET_SIMULATION
}
export enum POSITIONREFERENCE {
ABSOLUTE,RELATIVE,MOVESUPERIMPOSED
}
export enum LINECIRCLESPLINE {
LINE,CIRCLE,SPLINE
}
export enum FRAME_ABSRELATIVE {
FRAME_ABSOLUTE,FRAME_RELATIVE
}
export enum TASK_STATE {
TASK_NOTSTARTED,TASK_RUNNING,TASK_FINISHED,TASK_PAUSED,TASK_STOPPING,TASK_CANCELLED,TASK_ERROR
}
export enum TASK_COMMAND {
TASK_IDLE,TASK_RUN,TASK_CANCEL,TASK_PAUSE,TASK_RESUME
}
export enum GTLT {
GREATERTHAN,LESSTHAN
}
export enum ACTIVITYTYPE {
ACTIVITYTYPE_NONE,ACTIVITYTYPE_MOVEJOINTS,ACTIVITYTYPE_MOVEJOINTSATVELOCITY,ACTIVITYTYPE_MOVELINE,ACTIVITYTYPE_MOVELINEATVELOCITY,ACTIVITYTYPE_MOVEARC,ACTIVITYTYPE_MOVESPLINE,ACTIVITYTYPE_MOVETOPOSITION,ACTIVITYTYPE_MOVELINEWITHFORCE,ACTIVITYTYPE_MOVETOPOSITIONWITHFORCE,ACTIVITYTYPE_GEARINPOS,ACTIVITYTYPE_GEARINVELO,ACTIVITYTYPE_GEARINDYN,ACTIVITYTYPE_SETDOUT,ACTIVITYTYPE_SETAOUT,ACTIVITYTYPE_DWELL,ACTIVITYTYPE_WAITON,ACTIVITYTYPE_SWITCHPOSE,ACTIVITYTYPE_LATCH,ACTIVITYTYPE_STRESSTEST,ACTIVITYTYPE_ENDPROGRAM,ACTIVITYTYPE_SETIOUT
}
export enum ACTIVITYSTATE {
ACTIVITY_INACTIVE,ACTIVITY_ACTIVE,ACTIVITY_COMPLETED,ACTIVITY_BLEND_ACTIVE,ACTIVITY_CANCELLED
}
export enum STRATEGYGEARINPOS {
PHASESHIFT,EARLY,LATE,SLOW
}
export enum TRIGGERTYPE {
TRIGGERTYPE_RISING,TRIGGERTYPE_FALLING,TRIGGERTYPE_NONE
}
export enum ARCTYPE {
ARCTYPE_CENTRE,ARCTYPE_RADIUS
}
export enum ARCDIRECTION {
ARCDIRECTION_CW,ARCDIRECTION_CCW
}
export enum JOINT_TYPE {
JOINT_REVOLUTE,JOINT_PRISMATIC,JOINT_SPHERICAL,JOINT_SCREW
}
export enum JOINT_CONTROLMODE {
JOINT_TORQ_CTRL,JOINT_VEL_CTRL,JOINT_POS_CTRL
}
export enum JOINT_FINITECONTINUOUS {
JOINT_FINITE,JOINT_CONTINUOUS
}
export enum KC_KINEMATICSCONFIGURATIONTYPE {
KC_SIXDOF,KC_IGUS,KC_SCARA,KC_CARTESIAN,KC_CARTESIAN_SLAVED,KC_NAKED
}
export enum KC_SHOULDERCONFIGURATION {
KC_LEFTY,KC_RIGHTY
}
export enum KC_ELBOWCONFIGURATION {
KC_EPOSITIVE,KC_ENEGATIVE
}
export enum KC_WRISTCONFIGURATION {
KC_WPOSITIVE,KC_WNEGATIVE
}
export enum BLENDTYPE {
BLENDTYPE_NONE,BLENDTYPE_OVERLAPPED
}
export enum JOGMODE {
JOGMODE_NONE,JOGMODE_JOINT,JOGMODE_CARTESIAN,JOGMODE_JOINT_STEP,JOGMODE_CARTESIAN_STEP,JOGMODE_REF_POSITION
}
export enum JOGSTATE {
JOGSTATE_NONE,JOGSTATE_STEP_ACTIVE,JOGSTATE_STEP_COMPLETE
}
export enum OPENCLOSED {
OPEN,CLOSED
}
export enum STREAMCOMMAND {
STREAMCOMMAND_RUN,STREAMCOMMAND_PAUSE,STREAMCOMMAND_STOP
}
export enum STREAMSTATE {
STREAMSTATE_IDLE,STREAMSTATE_ACTIVE,STREAMSTATE_PAUSED,STREAMSTATE_STOPPING,STREAMSTATE_STOPPED
}


// STRUCTS

        export type Header = {

                    updated?:boolean;
        }


        export type MachineConfig = {

                    busCycleTime?:number;
        }


        export type MachineStatus = {

                    statusWord?:number;

                    activeFault?:number;

                    faultHistory?:number;

                    heartbeat?:number;

                    target?:MACHINETARGET;

                    targetConnectRetryCnt?:number;
        }


        export type MachineCommand = {

                    controlWord?:number;

                    hlcControlWord?:number;

                    heartbeat?:number;

                    target?:MACHINETARGET;
        }


        export type StreamConfig = {
        }


        export type StreamStatus = {

                    streamState?:STREAMSTATE;

                    tag?:number;

                    time?:number;
        }


        export type StreamCommand = {

                    streamCommand?:STREAMCOMMAND;
        }


        export type FieldbusTxPdoLayout = {

                    machineControlWordOffset?:number;

                    gbcControlWordOffset?:number;

                    hlcControlWordOffset?:number;

                    jointControlwordOffset?:number;

                    jointSetPositionOffset?:number;

                    jointSetVelocityOffset?:number;

                    jointSetTorqueOffset?:number;

                    heartbeatOffset?:number;

                    digitalOffset?:number;

                    digitalCount?:number;

                    analogOffset?:number;

                    analogCount?:number;

                    integerOffset?:number;

                    integerCount?:number;
        }


        export type FieldbusRxPdoLayout = {

                    machineStatusWordOffset?:number;

                    activeFaultOffset?:number;

                    faultHistoryOffset?:number;

                    jointStatuswordOffset?:number;

                    jointActualPositionOffset?:number;

                    jointActualVelocityOffset?:number;

                    jointActualTorqueOffset?:number;

                    heartbeatOffset?:number;

                    digitalOffset?:number;

                    digitalCount?:number;

                    analogOffset?:number;

                    analogCount?:number;

                    integerOffset?:number;

                    integerCount?:number;
        }


        export type FieldbusConfig = {

                    jointCount?:number;

                    TxPdo?:FieldbusTxPdoLayout;

                    RxPdo?:FieldbusRxPdoLayout;
        }


        export type MoveParametersConfig = {

                    vmax?:number;

                    vmaxPercentage?:number;

                    amaxPercentage?:number;

                    jmaxPercentage?:number;

                    blendType?:BLENDTYPE;

                    blendTimePercentage?:number;

                    blendTolerance?:number;

                    toolIndex?:number;
        }


        export type Vector3 = {

                    x?:number;

                    y?:number;

                    z?:number;
        }


        export type Quat = {

                    w?:number;

                    x?:number;

                    y?:number;

                    z?:number;
        }


        export type CartesianPosition = {

                    positionReference?:POSITIONREFERENCE;

                    position?:Vector3;

                    orientation?:Quat;

                    frameIndex?:number;
        }


        export type PositionAbsRel = {

                    positionReference?:POSITIONREFERENCE;

                    position?:Vector3;
        }


        export type CartesianVector = {

                    vector?:Vector3;

                    frameIndex?:number;
        }


        export type DoubleValue = {

                    value?:number;
        }


        export type JointPosition = {

                    positionReference?:POSITIONREFERENCE;

                    value?:number;
        }


        export type JointVelocity = {

                    value?:number;
        }


        export type JointVelocityArray = {

                    value?:number[];
        }


        export type JointAcceleration = {

                    value?:number;
        }


        export type JointAccelerationArray = {

                    value?:number[];
        }


        export type Cartesian3dPosition = {

                    x?:number;

                    y?:number;

                    z?:number;
        }


        export type ListOfJoints = {

                    joint?:boolean[];
        }


        export type ListofKinematicsConfigurations = {

                    kinematicsConfiguration?:boolean[];
        }


        export type Circle = {

                    acw?:boolean;

                    radius?:number;

                    destinationPosition?:CartesianPosition;
        }


        export type Spline = {

                    point?:number[];
        }


        export type LinesConfig = {

                    destination?:CartesianPosition;
        }


        export type ArcsConfig = {

                    arcType?:ARCTYPE;

                    arcDirection?:ARCDIRECTION;

                    destination?:CartesianPosition;
//              Start of Union
                    centre?: PositionAbsRel,
                    radius?: DoubleValue,
//              End of Union
        }


        export type CartesianPositionsConfig = {

                    position?:CartesianPosition;

                    configuration?:number;
        }


        export type TaskConfig = {

                    activityCount?:number;

                    firstActivityIndex?:number;

                    cancelTriggerOnIndex?:number;

                    startTriggerOnIndex?:number;
        }


        export type TaskStatus = {

                    taskState?:TASK_STATE;

                    currentActivityIndex?:number;
        }


        export type TaskCommand = {

                    taskCommand?:TASK_COMMAND;
        }


        export type JogConfig = {

                    kinematicsConfigurationIndex?:number;
        }


        export type JogStatus = {

                    state?:JOGSTATE;
        }


        export type JogCommand = {

                    mode?:JOGMODE;

                    stepSize?:number;

                    speedPercentage?:number;

                    jogFlags?:number;

                    position?:CartesianPosition;
        }


        export type JointConfig = {

                    jointType?:JOINT_TYPE;

                    jointControlMode?:JOINT_CONTROLMODE;

                    vmax?:number;

                    amax?:number;

                    jmax?:number;

                    jogVmax?:number;

                    jogAmax?:number;

                    jogJmax?:number;

                    scale?:number;

                    pow10?:number;

                    negLimit?:number;

                    posLimit?:number;

                    hasBrake?:boolean;

                    isInverted?:boolean;

                    finiteContinuous?:JOINT_FINITECONTINUOUS;

                    isVirtualInternal?:boolean;

                    isVirtualFromEncoder?:boolean;

                    correspondingJointNumberOnPhysicalFieldbus?:number;

                    correspondingJointNumberOnVirtualFieldbus?:number;
        }


        export type JointStatus = {

                    statusWord?:number;

                    actPos?:number;

                    actVel?:number;

                    actAcc?:number;
        }


        export type JointCommand = {

                    doHoming?:boolean;

                    controlWord?:number;
        }


        export type SixDofJointConfiguration = {

                    shoulderConfiguration?:KC_SHOULDERCONFIGURATION;

                    elbowConfiguration?:KC_ELBOWCONFIGURATION;

                    wristConfiguration?:KC_WRISTCONFIGURATION;
        }


        export type ScaraJointConfiguration = {

                    shoulderConfiguration?:KC_SHOULDERCONFIGURATION;

                    elbowConfiguration?:KC_ELBOWCONFIGURATION;
        }


        export type JointConfiguration = {

                    kinematicsConfigurationType?:KC_KINEMATICSCONFIGURATIONTYPE;
//              Start of Union
                    sixDofConfiguration?: SixDofJointConfiguration,
                    scaraConfiguration?: ScaraJointConfiguration,
//              End of Union
        }


        export type CartesianKinematicsParameters = {

                    scaleX?:number;

                    scaleY?:number;

                    scaleZ?:number;

                    linearVmax?:number;

                    linearAmax?:number;

                    linearJmax?:number;

                    jogVmax?:number;

                    jogAmax?:number;

                    jogJmax?:number;

                    tcpRotationalVmax?:number;

                    tcpRotationalAmax?:number;

                    tcpRotationalJmax?:number;
        }


        export type SixDofKinematicsParameters = {

                    linearVmax?:number;

                    linearAmax?:number;

                    linearJax?:number;

                    jogVax?:number;

                    jogAmax?:number;

                    jogJmax?:number;

                    tcpRotationalVmax?:number;

                    tcpRotationalAmax?:number;

                    tcpRotationalJmax?:number;
        }


        export type ScaraKinematicsParameters = {

                    linearVmax?:number;

                    linearAmax?:number;

                    linearJax?:number;

                    jogVax?:number;

                    jogAmax?:number;

                    jogJmax?:number;
        }


        export type MatrixInstanceDouble = {

                    numRows?:number;

                    numCols?:number;

                    data?:number[];
        }


        export type KinematicsParameters = {

                    kinematicsConfigurationType?:KC_KINEMATICSCONFIGURATIONTYPE;

                    xExtents?:number[];

                    yExtents?:number[];

                    zExtents?:number[];
//              Start of Union
                    scaraParameters?: ScaraKinematicsParameters,
                    sixDofsParameters?: SixDofKinematicsParameters,
                    cartesianParameters?: CartesianKinematicsParameters,
//              End of Union

                    kinChainParams?:MatrixInstanceDouble;
        }


        export type KinematicsConfigurationConfig = {

                    kinematicsConfigurationIndex?:number;

                    frameIndex?:number;

                    participatingJoints?:number[];

                    participatingJointsCount?:number;

                    kinematicsParameters?:KinematicsParameters;
        }


        export type KinematicsConfigurationStatus = {

                    froTarget?:number;

                    froActual?:number;

                    atSpeed?:boolean;

                    currentJointConfiguration?:number;

                    cartesianActPos?:Vector3;

                    cartesianActOrientation?:Quat;

                    cartesianActVel?:Vector3;

                    cartesianActAcc?:Vector3;

                    isHomed?:boolean;

                    isStopping?:boolean;

                    isMoving?:boolean;

                    isNearSingularity?:boolean;
        }


        export type KinematicsConfigurationCommand = {

                    doStop?:boolean;

                    froPercentage?:number;
        }


        export type DinConfig = {

                    inverted?:boolean;
        }


        export type DinStatus = {

                    actState?:ONOFF;
        }


        export type DoutConfig = {

                    inverted?:boolean;
        }


        export type DoutStatus = {

                    actState?:ONOFF;
        }


        export type DoutCommand = {

                    override?:boolean;

                    state?:ONOFF;
        }


        export type AinConfig = {

                    useForVirtualAxis?:boolean;

                    jointIndexForVirtualAxis?:number;
        }


        export type AinStatus = {

                    actValue?:number;
        }


        export type AoutConfig = {
        }


        export type AoutStatus = {

                    actValue?:number;
        }


        export type AoutCommand = {

                    override?:boolean;

                    value?:number;
        }


        export type IinConfig = {
        }


        export type IinStatus = {

                    actValue?:number;
        }


        export type IoutConfig = {
        }


        export type IoutStatus = {

                    actValue?:number;
        }


        export type IoutCommand = {

                    override?:boolean;

                    value?:number;
        }


        export type MoveJointsConfig = {

                    kinematicsConfigurationIndex?:number;
        }


        export type MoveJointsStatus = {

                    percentageComplete?:number;
        }


        export type MoveJointsCommand = {

                    jointPositionArray?:number[];

                    positionReference?:POSITIONREFERENCE;

                    moveParamsIndex?:number;

                    skipToNext?:boolean;
        }


        export type MoveJointsStream = {

                    kinematicsConfigurationIndex?:number;

                    positionReference?:POSITIONREFERENCE;

                    jointPositionArray?:number[];

                    moveParams?:MoveParametersConfig;
        }


        export type MoveJointsAtVelocityConfig = {

                    kinematicsConfigurationIndex?:number;
        }


        export type MoveJointsAtVelocityStatus = {

                    atSpeed?:boolean;
        }


        export type MoveJointsAtVelocityCommand = {

                    moveParamsIndex?:number;

                    jointVelocityArray?:number[];

                    skipToNext?:boolean;
        }


        export type MoveJointsAtVelocityStream = {

                    kinematicsConfigurationIndex?:number;

                    moveParams?:MoveParametersConfig;

                    jointVelocityArray?:number[];
        }


        export type MoveLineConfig = {

                    kinematicsConfigurationIndex?:number;

                    superimposedIndex?:number;
        }


        export type MoveLineStatus = {

                    percentageComplete?:number;
        }


        export type MoveLineCommand = {

                    moveParamsIndex?:number;

                    lineIndex?:number;

                    skipToNext?:boolean;
        }

        /**
            Execute a cartesian straight line move.

            Please note the following:
            - Bullet 1
            - Bullet 2

            See also [MoveLineCommand](MoveLineCommand)
         */
        export type MoveLineStream = {
                    /** The kinematics configuration to use for the move */
                    kinematicsConfigurationIndex?:number;

                    moveParams?:MoveParametersConfig;

                    line?:CartesianPosition;

                    superimposedIndex?:number;
        }


        export type MoveLineAtVelocityConfig = {

                    kinematicsConfigurationIndex?:number;
        }


        export type MoveLineAtVelocityStatus = {

                    atSpeed?:boolean;
        }


        export type MoveLineAtVelocityCommand = {

                    moveParamsIndex?:number;

                    line?:CartesianVector;

                    skipToNext?:boolean;
        }


        export type MoveLineAtVelocityStream = {

                    kinematicsConfigurationIndex?:number;

                    moveParams?:MoveParametersConfig;

                    line?:CartesianVector;
        }


        export type MoveArcConfig = {

                    kinematicsConfigurationIndex?:number;

                    superimposedIndex?:number;
        }


        export type MoveArcStatus = {

                    percentageComplete?:number;
        }


        export type MoveArcCommand = {

                    moveParamsIndex?:number;

                    arcIndex?:number;

                    skipToNext?:boolean;
        }


        export type MoveArcStream = {

                    kinematicsConfigurationIndex?:number;

                    moveParams?:MoveParametersConfig;

                    arc?:ArcsConfig;

                    superimposedIndex?:number;
        }


        export type MoveSplineConfig = {

                    kinematicsConfigurationIndex?:number;
        }


        export type MoveSplineStatus = {

                    percentageComplete?:number;
        }


        export type MoveSplineCommand = {

                    moveParamsIndex?:number;

                    splineIndex?:number;

                    skipToNext?:boolean;
        }


        export type MoveToPositionConfig = {

                    kinematicsConfigurationIndex?:number;
        }


        export type MoveToPositionStatus = {

                    percentageComplete?:number;
        }


        export type MoveToPositionCommand = {

                    cartesianPositionIndex?:number;

                    moveParamsIndex?:number;

                    skipToNext?:boolean;
        }


        export type MoveToPositionStream = {

                    kinematicsConfigurationIndex?:number;

                    moveParams?:MoveParametersConfig;

                    cartesianPosition?:CartesianPositionsConfig;
        }


        export type SetDoutConfig = {
        }


        export type SetDoutStatus = {
        }


        export type SetDoutCommand = {

                    doutToSet?:number;

                    valueToSet?:boolean;
        }


        export type SetAoutConfig = {
        }


        export type SetAoutStatus = {
        }


        export type SetAoutCommand = {

                    aoutToSet?:number;

                    valueToSet?:number;
        }


        export type SetIoutConfig = {
        }


        export type SetIoutStatus = {
        }


        export type SetIoutCommand = {

                    ioutToSet?:number;

                    valueToSet?:number;
        }


        export type WaitOnConfig = {

                    waitOnTriggerIndex?:number;
        }


        export type WaitOnStatus = {

                    waiting?:boolean;
        }


        export type WaitOnCommand = {

                    skipToNext?:boolean;
        }


        export type DwellConfig = {

                    ticksToDwell?:number;
        }


        export type DwellStatus = {

                    remainingTicks?:number;
        }


        export type DwellCommand = {

                    skipToNext?:boolean;
        }


        export type LatchPosConfig = {

                    cartesianLatch?:boolean;

                    kinematicsConfigurationIndex?:number;

                    jointLatch?:boolean;

                    latchTriggerIndex?:number;
        }


        export type LatchPosStatus = {

                    latched?:boolean;

                    latchedCartesianPosition?:CartesianPosition;

                    latchedJointArray?:JointPosition[];
        }


        export type LatchPosCommand = {

                    skipToNext?:boolean;
        }


        export type SwitchPoseConfig = {

                    kinematicsConfigurationIndex?:number;

                    newJointConfiguration?:number;

                    moveParamsIndex?:number;
        }


        export type SwitchPoseStatus = {

                    percentageComplete?:number;
        }


        export type SwitchPoseCommand = {

                    skipToNext?:boolean;
        }


        export type GearInVeloConfig = {

                    masterKinematicsConfigurationIndex?:number;

                    slaveKinematicsConfigurationIndex?:number;

                    gearingFrameIndex?:number;

                    gearRatio?:number;

                    syncActivationDelay?:number;
        }


        export type GearInVeloStatus = {

                    percentageComplete?:number;

                    gearInFailed?:boolean;

                    gearedIn?:boolean;
        }


        export type GearInVeloCommand = {

                    skipToNext?:boolean;

                    updatedRatio?:number;

                    updateRation?:boolean;
        }


        export type GearInPosConfig = {

                    masterKinematicsConfigurationIndex?:number;

                    slaveKinematicsConfigurationIndex?:number;

                    gearingFrameIndex?:number;

                    gearRatio?:number;

                    strategyToUse?:STRATEGYGEARINPOS;

                    gearRatioMaster?:number;

                    gearRatioSlave?:number;

                    masterSyncPosition?:CartesianPosition;

                    slaveSyncPosition?:CartesianPosition;

                    syncActivationDelay?:number;
        }


        export type GearInPosStatus = {

                    percentageComplete?:number;

                    gearInFailed?:boolean;

                    gearedIn?:boolean;
        }


        export type GearInPosCommand = {

                    skipToNext?:boolean;

                    updatedRatioMaster?:number;

                    updatedRatioSlave?:number;

                    updatedMasterSyncPosition?:CartesianPosition;

                    updatedSlaveSyncPosition?:CartesianPosition;
        }


        export type GearInDynConfig = {

                    masterKinematicsConfigurationIndex?:number;

                    slaveKinematicsConfigurationIndex?:number;

                    gearingFrameIndex?:number;

                    gearRatio?:number;
        }


        export type GearInDynStatus = {

                    gearInFailed?:boolean;

                    gearedIn?:boolean;
        }


        export type GearInDynCommand = {

                    skipToNext?:boolean;
        }


        export type GearInDynMetrics = {

                    timeToGearIn?:number;
        }


        export type StressTestConfig = {
        }


        export type StressTestStatus = {
        }


        export type StressTestCommand = {
        }


        export type StressTestStream = {
        }


        export type ActivityConfig = {

                    activityType?:ACTIVITYTYPE;

                    skipToNextTriggerIndex?:number;

                    skipToNextTriggerType?:TRIGGERTYPE;
//              Start of Union
                    moveJoints?: MoveJointsConfig,
                    moveJointsAtVelocity?: MoveJointsAtVelocityConfig,
                    moveLine?: MoveLineConfig,
                    moveLineAtVelocity?: MoveLineAtVelocityConfig,
                    moveArc?: MoveArcConfig,
                    moveSpline?: MoveSplineConfig,
                    moveToPosition?: MoveToPositionConfig,
                    gearInPos?: GearInPosConfig,
                    gearInVelo?: GearInVeloConfig,
                    gearInDyn?: GearInDynConfig,
                    setDout?: SetDoutConfig,
                    setAout?: SetAoutConfig,
                    setIout?: SetIoutConfig,
                    dwell?: DwellConfig,
                    waitOn?: WaitOnConfig,
                    switchPose?: SwitchPoseConfig,
                    latchPos?: LatchPosConfig,
                    stressTest?: StressTestConfig,
//              End of Union
        }


        export type ActivityStatus = {

                    state?:ACTIVITYSTATE;

                    tag?:number;
//              Start of Union
                    moveJoints?: MoveJointsStatus,
                    moveJointsAtVelocity?: MoveJointsAtVelocityStatus,
                    moveLine?: MoveLineStatus,
                    moveLineAtVelocity?: MoveLineAtVelocityStatus,
                    moveArc?: MoveArcStatus,
                    moveSpline?: MoveSplineStatus,
                    moveToPosition?: MoveToPositionStatus,
                    gearInPos?: GearInPosStatus,
                    gearInVelo?: GearInVeloStatus,
                    gearInDyn?: GearInDynStatus,
                    setDout?: SetDoutStatus,
                    setAout?: SetAoutStatus,
                    setIout?: SetIoutStatus,
                    dwell?: DwellStatus,
                    waitOn?: WaitOnStatus,
                    switchPose?: SwitchPoseStatus,
                    latchPos?: LatchPosStatus,
                    stressTest?: StressTestStatus,
//              End of Union
        }


        export type ActivityCommand = {
//              Start of Union
                    moveJoints?: MoveJointsCommand,
                    moveJointsAtVelocity?: MoveJointsAtVelocityCommand,
                    moveLine?: MoveLineCommand,
                    moveLineAtVelocity?: MoveLineAtVelocityCommand,
                    moveArc?: MoveArcCommand,
                    moveSpline?: MoveSplineCommand,
                    moveToPosition?: MoveToPositionCommand,
                    gearInPos?: GearInPosCommand,
                    gearInVelo?: GearInVeloCommand,
                    gearInDyn?: GearInDynCommand,
                    setDout?: SetDoutCommand,
                    setAout?: SetAoutCommand,
                    setIout?: SetIoutCommand,
                    dwell?: DwellCommand,
                    waitOn?: WaitOnCommand,
                    switchPose?: SwitchPoseCommand,
                    latchPos?: LatchPosCommand,
                    stressTest?: StressTestCommand,
//              End of Union

                    skipToNext?:boolean;
        }


        export type ActivityStreamItem = {

                    activityType?:ACTIVITYTYPE;

                    tag?:number;
//              Start of Union
                    moveJoints?: MoveJointsStream,
                    moveJointsAtVelocity?: MoveJointsAtVelocityStream,
                    moveLine?: MoveLineStream,
                    moveLineAtVelocity?: MoveLineAtVelocityStream,
                    moveArc?: MoveArcStream,
                    moveToPosition?: MoveToPositionStream,
                    setDout?: SetDoutCommand,
                    setAout?: SetAoutCommand,
                    setIout?: SetIoutCommand,
                    dwell?: DwellConfig,
                    stressTest?: StressTestStream,
//              End of Union
        }


        export type ActivityMetrics = {
//              Start of Union
                    gearInDyn?: GearInDynMetrics,
//              End of Union
        }


        export type SoloActivityConfig = {
        }

        export type SoloActivityStatus = ActivityStatus
        export type SoloActivityCommand = ActivityStreamItem

        export type FramesConfig = {

                    translation?:Vector3;

                    rotation?:Quat;

                    parent?:number;

                    absRel?:FRAME_ABSRELATIVE;
        }


        export type FramesCommand = {

                    translation?:Vector3;

                    rotation?:Quat;

                    override?:boolean;
        }


        export type FramesStatus = {
        }


        export type ToolConfig = {

                    toolIndex?:number;

                    frameIndex?:number;
        }


        export type ToolStatus = {

                    openOrClosed?:OPENCLOSED;
        }


        export type ToolCommand = {

                    openOrClose?:OPENCLOSED;
        }


        export type TriggerOnConfig = {

                    aiIndex?:number;

                    vaiIndex?:number;

                    threshold?:number;

                    aiThreholdGreaterLessThan?:GTLT;

                    diIndex?:number;

                    vdiIndex?:number;

                    diTriggerState?:ONOFF;

                    numberofTicksBeforeTrigger?:number;
        }


