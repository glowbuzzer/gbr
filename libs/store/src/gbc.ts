// ENUMS
    export enum ONOFF {
        OFF,
        ON,
    }
    export enum MACHINETARGET {
        MACHINETARGET_NONE,
        MACHINETARGET_FIELDBUS,
        MACHINETARGET_SIMULATION,
    }
    export enum POSITIONREFERENCE {
        /**  Position is specified absolutely (relative to origin) */
  ABSOLUTE ,
        /**  Position is specified relatively to current position */
  RELATIVE ,
        /**  Position is to be super-imposed on the current move */
  MOVESUPERIMPOSED ,
    }
    export enum FRAME_ABSRELATIVE {
        /**  The frame is an absolute frame */
  FRAME_ABSOLUTE ,
        /**  Frame is a relative frame */
  FRAME_RELATIVE ,
    }
    export enum TASK_STATE {
        /**  Task state is not started */
  TASK_NOTSTARTED ,
        /**  Task state is running (active) */
  TASK_RUNNING ,
        /**  Task state is finished (has run and has completed) */
  TASK_FINISHED ,
        /**  Task state is paused (was run but has been paused) */
  TASK_PAUSED ,
        /**  Task state is in the process of stopping */
  TASK_STOPPING ,
        /**  Task state is cancelled (was run but was cancelled) */
  TASK_CANCELLED ,
        /**  Task state for when an error occurs */
  TASK_ERROR ,
    }
    export enum TASK_COMMAND {
        /**  Command task to enter idle state */
  TASK_IDLE ,
        /**  Command task to run */
  TASK_RUN ,
        /**  Command task to cancel */
  TASK_CANCEL ,
        /**  Command task to pause */
  TASK_PAUSE ,
        /**  Command task to resume */
  TASK_RESUME ,
    }
    export enum GTLT {
        /**  Value is greater than */
  GREATERTHAN ,
        /**  Value is less than */
  LESSTHAN ,
    }
    export enum ACTIVITYTYPE {
        /**  No activity */
  ACTIVITYTYPE_NONE ,
        /**  Move a set of joints to a given position */
  ACTIVITYTYPE_MOVEJOINTS ,
        /**  Move a set of joints at a given velocity */
  ACTIVITYTYPE_MOVEJOINTSATVELOCITY ,
        /**  Move a kinematics configuration&#x27;s tool along a line in cartesian space to a given position (with orientation) */
  ACTIVITYTYPE_MOVELINE ,
        /**  Move a kinematics configuration&#x27;s tool along a line in cartesian space to a given position (with orientation) at a given velocity */
  ACTIVITYTYPE_MOVELINEATVELOCITY ,
        /**  Move a kinematics configuration&#x27;s tool along an arc in cartesian space to a given position (with orientation) */
  ACTIVITYTYPE_MOVEARC ,
        /**  Move a kinematics configuration&#x27;s tool along a spline in cartesian space to a given position (with orientation) */
  ACTIVITYTYPE_MOVESPLINE ,
        /**  Move a kinematics configuration&#x27;s tool to given position (with orientation) in joint space */
  ACTIVITYTYPE_MOVETOPOSITION ,
        /**  Gear in a master and slave specifying position */
  ACTIVITYTYPE_GEARINPOS ,
        /**  Gear in a master and slave specifying velocity */
  ACTIVITYTYPE_GEARINVELO ,
        /**  Set a digital out  */
  ACTIVITYTYPE_SETDOUT ,
        /**  Set an analog out */
  ACTIVITYTYPE_SETAOUT ,
        /**  Dwell (wait) for a period of time */
  ACTIVITYTYPE_DWELL ,
        /**  Wait for a trigger */
  ACTIVITYTYPE_WAITON ,
        /**  Switch a robot&#x27;s configuration */
  ACTIVITYTYPE_SWITCHPOSE ,
        /**  Latch the value of a position */
  ACTIVITYTYPE_LATCH ,
        /**  Internal stress test activity */
  ACTIVITYTYPE_STRESSTEST ,
        /**  End program activity (steamed) */
  ACTIVITYTYPE_ENDPROGRAM ,
        /**  Set an integer out */
  ACTIVITYTYPE_SETIOUT ,
    }
    export enum ACTIVITYSTATE {
        /**  Activity is inactive (not being executed) */
  ACTIVITY_INACTIVE ,
        /**  Activity is being executed */
  ACTIVITY_ACTIVE ,
        /**  Activity has finished being executed */
  ACTIVITY_COMPLETED ,
        /**  Activity is a motion activity and is currently in the blend between two moves */
  ACTIVITY_BLEND_ACTIVE ,
        /**  Activity has been cancelled */
  ACTIVITY_CANCELLED ,
    }
    export enum STRATEGYGEARINPOS {
        PHASESHIFT,
        EARLY,
        LATE,
        SLOW,
    }
    export enum TRIGGERTYPE {
        /**  Rising edge trigger (activates on the rising edge of a signal 0-&gt;1 */
  TRIGGERTYPE_RISING ,
        /**  Falling edge trigger (activates on the falling edge of a signal 1-&gt;0 */
  TRIGGERTYPE_FALLING ,
        /**  No trigger is defined */
  TRIGGERTYPE_NONE ,
    }
    export enum ARCTYPE {
        /**  Arc is specified as a centre */
  ARCTYPE_CENTRE ,
        /**  Arc is specified as a radius */
  ARCTYPE_RADIUS ,
    }
    export enum ARCDIRECTION {
        /**  Arc direction is clockwise */
  ARCDIRECTION_CW ,
        /**  Arc direction is counter-clockwise */
  ARCDIRECTION_CCW ,
    }
    export enum JOINT_FINITECONTINUOUS {
        /**  Joint is finite (defined limits on travel) */
  JOINT_FINITE ,
        /**  Joint is infinite (no travel limits) */
  JOINT_CONTINUOUS ,
    }
    export enum KC_KINEMATICSCONFIGURATIONTYPE {
        /**  The kinematics configuration will have the SIXDOF kinematics model (algorithm) applied */
  KC_SIXDOF ,
        /**  The kinematics configuration will have the IGUS kinematics model (algorithm) applied */
  KC_IGUS ,
        /**  The kinematics configuration will have the SCARA kinematics model (algorithm) applied */
  KC_SCARA ,
        /**  The kinematics configuration will have the CARTESIAN kinematics model (algorithm) applied */
  KC_CARTESIAN ,
        /**  The kinematics configuration will have the CARTESIAN_SLAVED kinematics model (algorithm) applied */
  KC_CARTESIAN_SLAVED ,
        /**  The kinematics configuration will have no kinematics model (algorithm) applied */
  KC_NAKED ,
    }
    export enum KC_SHOULDERCONFIGURATION {
        /**  for 6DOF and SCARA robots the robot is in the lefty configuration */
  KC_LEFTY ,
        /**  for 6DOF and SCARA robots the robot is in the right configuration */
  KC_RIGHTY ,
    }
    export enum KC_ELBOWCONFIGURATION {
        /**  for 6DOF and SCARA robots the robot is in the Elbow Positive configuration */
  KC_EPOSITIVE ,
        /**  for 6DOF and SCARA robots the robot is in the Elbow Negative configuration */
  KC_ENEGATIVE ,
    }
    export enum KC_WRISTCONFIGURATION {
        /**  for 6DOF robots the robot is in the wrist positive configuration */
  KC_WPOSITIVE ,
        /**  for 6DOF robots the robot is in the wrist negative configuration */
  KC_WNEGATIVE ,
    }
    export enum BLENDTYPE {
        /**  No blend used for move */
  BLENDTYPE_NONE ,
        /**  An overlapped blend to be used for move */
  BLENDTYPE_OVERLAPPED ,
    }
    export enum JOGMODE {
        /**  Jog-mode is none */
  JOGMODE_NONE ,
        /**  Jog-mode is joint (jog individual joints) */
  JOGMODE_JOINT ,
        /**  Jog-mode is cartesian (jog along cartesian axes) */
  JOGMODE_CARTESIAN ,
        /**  Jog-mode is joint step (jog in defined steps in position) */
  JOGMODE_JOINT_STEP ,
        /**  Jog-mode is cartesian step (jog in defined steps in position) */
  JOGMODE_CARTESIAN_STEP ,
        /**  TODO */
  JOGMODE_REF_POSITION ,
    }
    export enum JOGSTATE {
        /**  Current state of jogging is none (inactive) */
  JOGSTATE_NONE ,
        /**  Current state of jogging is step jogging active */
  JOGSTATE_STEP_ACTIVE ,
        /**  Current state of jogging is a step jog is complete */
  JOGSTATE_STEP_COMPLETE ,
    }
    export enum OPENCLOSED {
        /**  Tool is opened */
  OPEN ,
        /**  Tool is closed */
  CLOSED ,
    }
    export enum STREAMCOMMAND {
        /**  Run stream */
  STREAMCOMMAND_RUN ,
        /**  Pause stream */
  STREAMCOMMAND_PAUSE ,
        /**  Stop stream */
  STREAMCOMMAND_STOP ,
    }
    export enum STREAMSTATE {
        /**  Stream state is idle */
  STREAMSTATE_IDLE ,
        /**  Stream state is active */
  STREAMSTATE_ACTIVE ,
        /**  Stream state paused */
  STREAMSTATE_PAUSED ,
        /**  Stream state is in the process of stopping */
  STREAMSTATE_STOPPING ,
        /**  Stream state is stopped */
  STREAMSTATE_STOPPED ,
    }


// STRUCTS
        
        export type Header = {
                    /**  Flags if the shared memory data has been updated */
                    updated?:boolean;
        }

        
        export type MachineConfig = {
                    /**  The bus cycle time (in milliseconds) */
                    busCycleTime?:number;
        }

        
        export type MachineStatus = {
                    /**  CiA 402 status word for the machine as a whole */
                    statusWord?:number;
                    /**  Word containing any active faults the machine may have */
                    activeFault?:number;
                    /**  Word containing the fault history (faults that were active when the machine entered the fault state) */
                    faultHistory?:number;
                    /**  Heartbeat (integer that increments each cycle) */
                    heartbeat?:number;
                    /**  What the current target of the machine is - e.g. is it is simulation mode */
                    target?:MACHINETARGET;
                    /**  Number of times we have tried to connect to the target */
                    targetConnectRetryCnt?:number;
        }

        
        export type MachineCommand = {
                    /**  CiA 402 control word for the machine */
                    controlWord?:number;
                    /**  HLC (High-Level-Control) control word */
                    hlcControlWord?:number;
                    /**  Heartbeat (integer that increments each cycle) */
                    heartbeat?:number;
                    /**  What target we want the machine to connect to - e.g. fieldbus, simulation */
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

        /** 
        Common Pdo Layout
         */
        export type FieldbusTxPdoLayout = {
                    /**  Offset (in bytes) in the fieldbus process data to the machine control word (CiA 402) */
                    machineControlWordOffset?:number;
                    /**  Offset (in bytes) in the fieldbus process data to the GBC control word  */
                    gbcControlWordOffset?:number;
                    /**  Offset (in bytes) in the fieldbus process data to the HLC (High-Level-Control) control word */
                    hlcControlWordOffset?:number;
                    /**  Offset (in bytes) in the fieldbus process data to the joint control word */
                    jointControlwordOffset?:number;
                    /**  Offset (in bytes) in the fieldbus process data to the joint set position word */
                    jointSetPositionOffset?:number;
                    /**  Offset (in bytes) in the fieldbus process data to the joint set velocity word */
                    jointSetVelocityOffset?:number;
                    /**  Offset (in bytes) in the fieldbus process data to the joint set torque world */
                    jointSetTorqueOffset?:number;
                    /**  Offset (in bytes) in the fieldbus process data to the heartbeat values */
                    heartbeatOffset?:number;
                    /**  Offset (in bytes) in the fieldbus process data to the digital (ins/outs) values */
                    digitalOffset?:number;
                    /**  Number of digital (ins/outs) used in the fieldbus process data */
                    digitalCount?:number;
                    /**  Offset (in bytes) in the fieldbus process data to the analog (ins/outs) values */
                    analogOffset?:number;
                    /**  Number of analog (ins/outs) used in the fieldbus process data */
                    analogCount?:number;
                    /**  Offset (in bytes) in the fieldbus process data to the integer (ins/outs) values */
                    integerOffset?:number;
                    /**  Number of integer (ins/outs) used in the fieldbus process data */
                    integerCount?:number;
        }

        /** 
        Common Pdo Layout
         */
        export type FieldbusRxPdoLayout = {
                    /**  Offset (in bytes) in the fieldbus process data to the machine status word (CiA 402) */
                    machineStatusWordOffset?:number;
                    /**  Offset (in bytes) in the fieldbus process data to the active fault word */
                    activeFaultOffset?:number;
                    /**  Offset (in bytes) in the fieldbus process data to the fault history word */
                    faultHistoryOffset?:number;
                    /**  Offset (in bytes) in the fieldbus process data to the joint status word */
                    jointStatuswordOffset?:number;
                    /**  Offset (in bytes) in the fieldbus process data to the joint actual position word */
                    jointActualPositionOffset?:number;
                    /**  Offset (in bytes) in the fieldbus process data to the joint actual velocity word */
                    jointActualVelocityOffset?:number;
                    /**  Offset (in bytes) in the fieldbus process data to the joint actual torque word */
                    jointActualTorqueOffset?:number;
                    /**  Offset (in bytes) in the fieldbus process data to the heartbeat values */
                    heartbeatOffset?:number;
                    /**  Offset (in bytes) in the fieldbus process data to the digital (ins/outs) values */
                    digitalOffset?:number;
                    /**  Number of digital (ins/outs) used in the fieldbus process data */
                    digitalCount?:number;
                    /**  Offset (in bytes) in the fieldbus process data to the analog (ins/outs) values */
                    analogOffset?:number;
                    /**  Number of analog (ins/outs) used in the fieldbus process data */
                    analogCount?:number;
                    /**  Offset (in bytes) in the fieldbus process data to the integer (ins/outs) values */
                    integerOffset?:number;
                    /**  Number of integer (ins/outs) used in the fieldbus process data */
                    integerCount?:number;
        }

        /** 
        Configuration parameters for fieldbus
         */
        export type FieldbusConfig = {
                    /**  Number of joints stored in the fieldbus process data */
                    jointCount?:number;
                    /**  TxPdo object */
                    TxPdo?:FieldbusTxPdoLayout;
                    /**  RxPdo object */
                    RxPdo?:FieldbusRxPdoLayout;
        }

        /** 
        Configuration parameters for move parameters
         */
        export type MoveParametersConfig = {
                    /**  Vmax (max velocity) for move */
                    vmax?:number;
                    /**  Percentage of vmax to be used for move */
                    vmaxPercentage?:number;
                    /**  Percentage of amax to be used for move */
                    amaxPercentage?:number;
                    /**  Percentage of jmax to be used for move */
                    jmaxPercentage?:number;
                    /**  Type of blend to be used for the move */
                    blendType?:BLENDTYPE;
                    /**  Blend time percentage to be used for the move */
                    blendTimePercentage?:number;
                    /**  Tolerance to be applied to the blend  */
                    blendTolerance?:number;
                    /**  Tool to be used for the move */
                    toolIndex?:number;
        }

        /** 
        Parameters for vector 3
         */
        export type Vector3 = {
                    /**  Cartesian position on x axis */
                    x?:number;
                    /**  Cartesian position on y axis */
                    y?:number;
                    /**  Cartesian position on x axis */
                    z?:number;
        }

        /** 
        Parameters for a quaternion
         */
        export type Quat = {
                    /**  Quaternion orientation coefficient */
                    w?:number;
                    /**  Quaternion orientation coefficient */
                    x?:number;
                    /**  Quaternion orientation coefficient */
                    y?:number;
                    /**  Quaternion orientation coefficient */
                    z?:number;
        }

        /** 
        Parameters for a cartesian position
         */
        export type CartesianPosition = {
                    /**  Whether the position is absolute or relative */
                    positionReference?:POSITIONREFERENCE;
                    /**  Position vector object */
                    position?:Vector3;
                    /**  Orientation quaternion object  */
                    orientation?:Quat;
                    /**  Index of the frame the position is with respect to */
                    frameIndex?:number;
        }

        /** 
        Parameters for an absolute / relative position
         */
        export type PositionAbsRel = {
                    /**  Whether the position is absolute or relative */
                    positionReference?:POSITIONREFERENCE;
                    /**  Position vector object */
                    position?:Vector3;
        }

        /** 
        Parameters for a cartesian vector
         */
        export type CartesianVector = {
                    /**  Vector itself (x,y,z) */
                    vector?:Vector3;
                    /**  Index of frame for vector */
                    frameIndex?:number;
        }

        
        export type DoubleValue = {
                    
                    value?:number;
        }

        /** 
        Parameters for a joint position
         */
        export type JointPosition = {
                    
                    positionReference?:POSITIONREFERENCE;
                    
                    value?:number;
        }

        /** 
        Configuration parameters for lines
         */
        export type LinesConfig = {
                    /**  Destination of the line */
                    destination?:CartesianPosition;
        }

        /** 
        Configuration parameters for arcs
         */
        export type ArcsConfig = {
                    /**  Whether the arc is defined by centre or radius */
                    arcType?:ARCTYPE;
                    /**  Is the arc direction CW or CCW (clockwise or counter-clockwise) */
                    arcDirection?:ARCDIRECTION;
                    /**  Destination position for the arc */
                    destination?:CartesianPosition;
//              Start of Union
                    /**  Is the centre defined absolutely or relatively */
                     centre?: PositionAbsRel,
                    /**  Radius of the arc */
                     radius?: DoubleValue,
//              End of Union
        }

        /** 
        Parameters for cartesian positions
         */
        export type CartesianPositionsConfig = {
                    
                    position?:CartesianPosition;
                    
                    configuration?:number;
        }

        /** 
        Config parameters for Tasks
         */
        export type TaskConfig = {
                    /**  Number of activities in this task */
                    activityCount?:number;
                    /**  First activity in this task  */
                    firstActivityIndex?:number;
                    /**  Link to trigger to cancel task */
                    cancelTriggerOnIndex?:number;
                    /**  Link to trigger to start task */
                    startTriggerOnIndex?:number;
        }

        /** 
        Status parameters for Tasks
         */
        export type TaskStatus = {
                    /**  Object representing the current state of the task */
                    taskState?:TASK_STATE;
                    /**  Current activity that is running */
                    currentActivityIndex?:number;
        }

        /** 
        Command parameters for Tasks
         */
        export type TaskCommand = {
                    /**  Command object for task */
                    taskCommand?:TASK_COMMAND;
        }

        /** 
        Configuration parameters for Jog
         */
        export type JogConfig = {
                    /**  Kinematics configuration to use for the jog */
                    kinematicsConfigurationIndex?:number;
        }

        /** 
        Status of Jog
         */
        export type JogStatus = {
                    /**  Current state of the jog */
                    state?:JOGSTATE;
        }

        /** 
        Command parameters for moveToPosition
         */
        export type JogCommand = {
                    /**  Commanded mode for jogging */
                    mode?:JOGMODE;
                    /**  Commanded size of the jog step */
                    stepSize?:number;
                    /**  Percentage of the jog vmax to be useed for the jog */
                    speedPercentage?:number;
                    /**  Two bits per joint in the kc, 0&#x3D;no move, 1&#x3D;move pos, 2&#x3D;move neg */
                    jogFlags?:number;
                    /**  For cartesian jog only - position to jog to */
                    position?:CartesianPosition;
        }

        /** 
        Configuration parameters for joint
         */
        export type JointConfig = {
                    /**  joint&#x27;s vmax (maximum velocity) */
                    vmax?:number;
                    /**  joint&#x27;s amax (maximum acceleration) */
                    amax?:number;
                    /**  joint&#x27;s jmax (maximum jerk) */
                    jmax?:number;
                    /**  maximum velocity to be used for jogging */
                    jogVmax?:number;
                    /**  maximum acceleration to be used for jogging */
                    jogAmax?:number;
                    /**  maximum jerk to be used for jogging */
                    jogJmax?:number;
                    /**  scale factor to be applied to a joint&#x27;s position for transfer to the fieldbus */
                    scale?:number;
                    /**  TODO */
                    pow10?:number;
                    /**  negative soft limit for the travel of the joint */
                    negLimit?:number;
                    /**  positive soft limit for the travel of the joint */
                    posLimit?:number;
                    /**  flags that a joint&#x27;s motion is inverted */
                    isInverted?:boolean;
                    
                    finiteContinuous?:JOINT_FINITECONTINUOUS;
                    
                    isVirtualInternal?:boolean;
                    
                    isVirtualFromEncoder?:boolean;
                    
                    correspondingJointNumberOnPhysicalFieldbus?:number;
                    
                    correspondingJointNumberOnVirtualFieldbus?:number;
        }

        /** 
        Status of joint
         */
        export type JointStatus = {
                    /**  CiA 402 status word for the joint */
                    statusWord?:number;
                    /**  Actual Position of the joint */
                    actPos?:number;
                    /**  Actual Velocitys of the joint */
                    actVel?:number;
                    /**  Actual Acceleration of the joint */
                    actAcc?:number;
        }

        /** 
        Command parameters for joint
         */
        export type JointCommand = {
                    /**  CiA 402 control word for a drive (not used when using GBEM which controls the drives) */
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
                    /**  Scale factor to apply to X axis */
                    scaleX?:number;
                    /**  Scale factor to apply to Y axis */
                    scaleY?:number;
                    /**  Scale factor to apply to Z axis */
                    scaleZ?:number;
                    /**  Vmax (max velocity) to be applied to cartesian moves */
                    linearVmax?:number;
                    /**  Amax (max acceleration) to be applied to cartesian moves */
                    linearAmax?:number;
                    /**  Jmax (max jerk) to be applied to cartesian moves */
                    linearJmax?:number;
                    /**  Vmax (max velocity) to be applied to jogging moves */
                    jogVmax?:number;
                    /**  Amax (max acceleration) to be applied to jogging moves */
                    jogAmax?:number;
                    /**  Jmax (max jerk) to be applied to jogging moves */
                    jogJmax?:number;
                    /**  Rotational Vmax (max velocity) to be applied to cartesian moves */
                    tcpRotationalVmax?:number;
                    /**  Rotational Amax (max acceleration) to be applied to cartesian moves */
                    tcpRotationalAmax?:number;
                    /**  Rotational Jmax (max jerk) to be applied to cartesian moves */
                    tcpRotationalJmax?:number;
        }

        
        export type SixDofKinematicsParameters = {
                    /**  Scale factor to apply to X axis */
                    scaleX?:number;
                    /**  Scale factor to apply to Y axis */
                    scaleY?:number;
                    /**  Scale factor to apply to Z axis */
                    scaleZ?:number;
                    /**  Vmax (max velocity) to be applied to cartesian moves */
                    linearVmax?:number;
                    /**  Amax (max acceleration) to be applied to cartesian moves */
                    linearAmax?:number;
                    /**  Jmax (max jerk) to be applied to cartesian moves */
                    linearJmax?:number;
                    /**  Vmax (max velocity) to be applied to jogging moves */
                    jogVmax?:number;
                    /**  Amax (max acceleration) to be applied to jogging moves */
                    jogAmax?:number;
                    /**  Jmax (max jerk) to be applied to jogging moves */
                    jogJmax?:number;
                    /**  Rotational Vmax (max velocity) to be applied to cartesian moves */
                    tcpRotationalVmax?:number;
                    /**  Rotational Amax (max acceleration) to be applied to cartesian moves */
                    tcpRotationalAmax?:number;
                    /**  Rotational Jmax (max jerk) to be applied to cartesian moves */
                    tcpRotationalJmax?:number;
        }

        
        export type ScaraKinematicsParameters = {
                    /**  Scale factor to apply to X axis */
                    scaleX?:number;
                    /**  Scale factor to apply to Y axis */
                    scaleY?:number;
                    /**  Scale factor to apply to Z axis */
                    scaleZ?:number;
                    /**  Vmax (max velocity) to be applied to cartesian moves */
                    linearVmax?:number;
                    /**  Amax (max acceleration) to be applied to cartesian moves */
                    linearAmax?:number;
                    /**  Jmax (max jerk) to be applied to cartesian moves */
                    linearJmax?:number;
                    /**  Vmax (max velocity) to be applied to jogging moves */
                    jogVmax?:number;
                    /**  Amax (max acceleration) to be applied to jogging moves */
                    jogAmax?:number;
                    /**  Jmax (max jerk) to be applied to jogging moves */
                    jogJmax?:number;
                    /**  Rotational Vmax (max velocity) to be applied to cartesian moves */
                    tcpRotationalVmax?:number;
                    /**  Rotational Amax (max acceleration) to be applied to cartesian moves */
                    tcpRotationalAmax?:number;
                    /**  Rotational Jmax (max jerk) to be applied to cartesian moves */
                    tcpRotationalJmax?:number;
        }

        
        export type MatrixInstanceDouble = {
                    /**  Number of rows in matrix */
                    numRows?:number;
                    /**  Number of columns in matrix */
                    numCols?:number;
                    /**  Data for matrix */
                    data?:number[];
        }

        
        export type KinematicsParameters = {
                    /**  Kinematics configuration type - i.e. the kinematics model that will be used. Used as discriminator for the union */
                    kinematicsConfigurationType?:KC_KINEMATICSCONFIGURATIONTYPE;
                    /**  Extent (size) of workspace in X */
                    xExtents?:number[];
                    /**  Extent (size) of workspace in Y */
                    yExtents?:number[];
                    /**  Extent (size) of workspace in Z */
                    zExtents?:number[];
//              Start of Union
                    /**  This is a union */
                     scaraParameters?: ScaraKinematicsParameters,
                    /**  This is a union */
                     sixDofsParameters?: SixDofKinematicsParameters,
                    /**  This is a union */
                     cartesianParameters?: CartesianKinematicsParameters,
//              End of Union
                    /**  Matrix containing the DH parameters for the kinematics model */
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
                    
                    isStopping?:boolean;
                    
                    isMoving?:boolean;
                    
                    isNearSingularity?:boolean;
        }

        
        export type KinematicsConfigurationCommand = {
                    
                    doStop?:boolean;
                    
                    froPercentage?:number;
        }

        /** 
        Configuration parameters for Digital Ins (din)
         */
        export type DinConfig = {
                    /**  Defines if the input signal is inverted */
                    inverted?:boolean;
        }

        /** 
        Status of Digital In
         */
        export type DinStatus = {
                    /**  state of the Digital In */
                    actState?:ONOFF;
        }

        /** 
        Configuration parameters for Digital Outs (dout)
         */
        export type DoutConfig = {
                    /**  Defines if the ouput signal is inverted */
                    inverted?:boolean;
        }

        /** 
        Status of Digital Outs (dout)
         */
        export type DoutStatus = {
                    /**  State of the Digital Out */
                    actState?:ONOFF;
        }

        /** 
        Commands for Digital Outs (dout)
         */
        export type DoutCommand = {
                    /**  Defines if the Dout state is to be overridden */
                    override?:boolean;
                    /**  state of the Digital Out */
                    state?:ONOFF;
        }

        /** 
        Configuration parameters for Analog Ins (ain - floats)
         */
        export type AinConfig = {
                    /**  Flag to indicate this analog input should control the position of a virtual axis (joint) */
                    useForVirtualAxis?:boolean;
                    /**  Index of joint used for virtual axis (sim) */
                    jointIndexForVirtualAxis?:number;
        }

        /** 
        Status of Analog Ins (ain - floats)
         */
        export type AinStatus = {
                    /**  Actual value of the analog input */
                    actValue?:number;
        }

        /** 
        Configuration parameters for Analog Outs (aout - floats)
         */
        export type AoutConfig = {
        }

        /** 
        Status of  Analog Outs (aout - floats)
         */
        export type AoutStatus = {
                    /**  Actual value of analog out */
                    actValue?:number;
        }

        /** 
        Command for Analog Outs (aout - floats)
         */
        export type AoutCommand = {
                    /**  Override the value of the analog out (set by the front-end) */
                    override?:boolean;
                    /**  Value to set the analog out to */
                    value?:number;
        }

        /** 
        Configuration parameters for Integer Ins (iin)
         */
        export type IinConfig = {
        }

        /** 
        Status of Analog Ins (ain - floats)
         */
        export type IinStatus = {
                    /**  value of iin */
                    actValue?:number;
        }

        
        export type IoutConfig = {
        }

        
        export type IoutStatus = {
                    /**  Actual value of the iout (integer out) */
                    actValue?:number;
        }

        
        export type IoutCommand = {
                    /**  Override the value of the iout (integer out) set by the HLC */
                    override?:boolean;
                    /**  Value to set the iout (integer out) to */
                    value?:number;
        }

        /** 
        Configuration parameters for moveJoints
        &lt;Ref&gt;{@link JogCommand}&lt;/Ref&gt;
         */
        export type MoveJointsConfig = {
                    /**  Index of the Kinematics Configuration (KC) to use */
                    kinematicsConfigurationIndex?:number;
        }

        /** 
        Status of moveJoints
         */
        export type MoveJointsStatus = {
                    /**  Percentage through move we currently are */
                    percentageComplete?:number;
        }

        /** 
        Command parameters for MoveJoints
         */
        export type MoveJointsCommand = {
                    /**  Array of joint positions */
                    jointPositionArray?:number[];
                    
                    positionReference?:POSITIONREFERENCE;
                    /**  Index of the move parameters (amax, vmax etc.) to be used for the move */
                    moveParamsIndex?:number;
                    /**  Triggers the activity to stop and skip to the next in a task */
                    skipToNext?:boolean;
        }

        /** 
        Parameters for streamed moveJoints
         */
        export type MoveJointsStream = {
                    /**  Index of the Kinematics Configuration (KC) to use */
                    kinematicsConfigurationIndex?:number;
                    
                    positionReference?:POSITIONREFERENCE;
                    
                    jointPositionArray?:number[];
                    
                    moveParams?:MoveParametersConfig;
        }

        /** 
        Configuration parameters for MoveJointsAtVelocity
         */
        export type MoveJointsAtVelocityConfig = {
                    /**  Index of the Kinematics Configuration (KC) to use */
                    kinematicsConfigurationIndex?:number;
        }

        /** 
        Status of MoveJointsAtVelocity
         */
        export type MoveJointsAtVelocityStatus = {
                    /**  Signals that the move as reached its programmed speed */
                    atSpeed?:boolean;
        }

        /** 
        Command parameters for MoveJointsAtVelocity
         */
        export type MoveJointsAtVelocityCommand = {
                    /**  Index of the move parameters (amax, vmax etc.) to be used for the move */
                    moveParamsIndex?:number;
                    /**  Array of joints to be used for the moveJointsAtVelocity */
                    jointVelocityArray?:number[];
                    /**  Triggers the activity to stop and skip to the next in a task */
                    skipToNext?:boolean;
        }

        /** 
        Parameters for streamed MoveJointsAtVelocity
         */
        export type MoveJointsAtVelocityStream = {
                    /**  Index of the Kinematics Configuration (KC) to use */
                    kinematicsConfigurationIndex?:number;
                    
                    moveParams?:MoveParametersConfig;
                    
                    jointVelocityArray?:number[];
        }

        /** 
        Configuration parameters for moveLine
         */
        export type MoveLineConfig = {
                    /**  Index of the Kinematics Configuration (KC) to use */
                    kinematicsConfigurationIndex?:number;
                    
                    superimposedIndex?:number;
        }

        /** 
        Status of MoveJoints
         */
        export type MoveLineStatus = {
                    /**  Percentage through move we currently are */
                    percentageComplete?:number;
        }

        /** 
        Command parameters for MoveLine
         */
        export type MoveLineCommand = {
                    /**  Index of the move parameters (amax, vmax etc.) to be used for the move */
                    moveParamsIndex?:number;
                    /**  Index of line to use for move */
                    lineIndex?:number;
                    /**  Triggers the activity to stop and skip to the next in a task */
                    skipToNext?:boolean;
        }

        /** 
        Parameters for streamed moveLine
         */
        export type MoveLineStream = {
                    /** The kinematics configuration to use for the move qq */
                    kinematicsConfigurationIndex?:number;
                    
                    moveParams?:MoveParametersConfig;
                    /**  Line object for move */
                    line?:CartesianPosition;
                    
                    superimposedIndex?:number;
        }

        /** 
        Configuration parameters for moveLineAtVelocity.
         */
        export type MoveLineAtVelocityConfig = {
                    /**  Index of the Kinematics Configuration (KC) to use */
                    kinematicsConfigurationIndex?:number;
        }

        /** 
        Status of MoveLineAtVelocity
         */
        export type MoveLineAtVelocityStatus = {
                    
                    atSpeed?:boolean;
        }

        /** 
        Command parameters for moveLineAtVelocity
         */
        export type MoveLineAtVelocityCommand = {
                    /**  Index of the move parameters (amax, vmax etc.) to be used for the move */
                    moveParamsIndex?:number;
                    
                    line?:CartesianVector;
                    /**  Triggers the activity to stop and skip to the next in a task */
                    skipToNext?:boolean;
        }

        /** 
        Parameters for streamed moveLineAtVelocity
         */
        export type MoveLineAtVelocityStream = {
                    /**  Index of the Kinematics Configuration (KC) to use */
                    kinematicsConfigurationIndex?:number;
                    
                    moveParams?:MoveParametersConfig;
                    
                    line?:CartesianVector;
        }

        /** 
        Configuration parameters for moveArc.
         */
        export type MoveArcConfig = {
                    /**  Index of the Kinematics Configuration (KC) to use */
                    kinematicsConfigurationIndex?:number;
                    
                    superimposedIndex?:number;
        }

        /** 
        Status of MoveArc
         */
        export type MoveArcStatus = {
                    /**  Percentage through move we currently are */
                    percentageComplete?:number;
        }

        /** 
        Command parameters for moveArc
         */
        export type MoveArcCommand = {
                    /**  Index of the move parameters (amax, vmax etc.) to be used for the move */
                    moveParamsIndex?:number;
                    
                    arcIndex?:number;
                    /**  Triggers the activity to stop and skip to the next in a task */
                    skipToNext?:boolean;
        }

        /** 
        Parameters for streamed moveArc
         */
        export type MoveArcStream = {
                    /**  Index of the Kinematics Configuration (KC) to use */
                    kinematicsConfigurationIndex?:number;
                    
                    moveParams?:MoveParametersConfig;
                    
                    arc?:ArcsConfig;
                    
                    superimposedIndex?:number;
        }

        /** 
        Configuration parameters for moveSpline
         */
        export type MoveSplineConfig = {
                    /**  Index of the Kinematics Configuration (KC) to use */
                    kinematicsConfigurationIndex?:number;
        }

        /** 
        Status of MoveSpline
         */
        export type MoveSplineStatus = {
                    /**  Percentage through move we currently are */
                    percentageComplete?:number;
        }

        /** 
        Command parameters for moveSpline
         */
        export type MoveSplineCommand = {
                    /**  Index of the move parameters (amax, vmax etc.) to be used for the move */
                    moveParamsIndex?:number;
                    
                    splineIndex?:number;
                    /**  Triggers the activity to stop and skip to the next in a task */
                    skipToNext?:boolean;
        }

        /** 
        Configuration parameters for moveToPosition
         */
        export type MoveToPositionConfig = {
                    /**  Index of the Kinematics Configuration (KC) to use */
                    kinematicsConfigurationIndex?:number;
        }

        /** 
        Status of MoveToPosition
         */
        export type MoveToPositionStatus = {
                    /**  Percentage through move we currently are */
                    percentageComplete?:number;
        }

        /** 
        Command parameters for moveToPosition
         */
        export type MoveToPositionCommand = {
                    
                    cartesianPositionIndex?:number;
                    /**  Index of the move parameters (amax, vmax etc.) to be used for the move */
                    moveParamsIndex?:number;
                    /**  Triggers the activity to stop and skip to the next in a task */
                    skipToNext?:boolean;
        }

        /** 
        Parameters for streamed moveToPosition
         */
        export type MoveToPositionStream = {
                    /**  Index of the Kinematics Configuration (KC) to use */
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

        /** 
        Configuration parameters for waitOn
         */
        export type WaitOnConfig = {
                    /**  Trigger upon which to wait */
                    waitOnTriggerIndex?:number;
        }

        /** 
        Status of waitOn
         */
        export type WaitOnStatus = {
                    /**  Signals the waitOn is in waiting state */
                    waiting?:boolean;
        }

        /** 
        Command parameters for waitOn
         */
        export type WaitOnCommand = {
                    /**  Triggers the activity to stop and skip to the next in a task */
                    skipToNext?:boolean;
        }

        /** 
        Configuration parameters for dwell
         */
        export type DwellConfig = {
                    /**  Number of ticks that you want to wait for */
                    ticksToDwell?:number;
        }

        /** 
        Status of Dwell
         */
        export type DwellStatus = {
                    /**  Number of ticks that are remaining in the dwell */
                    remainingTicks?:number;
        }

        /** 
        Command parameters for dwell
         */
        export type DwellCommand = {
                    /**  Triggers the activity to stop and skip to the next in a task */
                    skipToNext?:boolean;
        }

        /** 
        Configuration parameters for latchPos
         */
        export type LatchPosConfig = {
                    
                    cartesianLatch?:boolean;
                    /**  Index of the Kinematics Configuration (KC) to use */
                    kinematicsConfigurationIndex?:number;
                    
                    jointLatch?:boolean;
                    
                    latchTriggerIndex?:number;
        }

        /** 
        Status of latchPos
         */
        export type LatchPosStatus = {
                    
                    latched?:boolean;
                    
                    latchedCartesianPosition?:CartesianPosition;
                    
                    latchedJointArray?:JointPosition[];
        }

        /** 
        Command parameters for latchPos
         */
        export type LatchPosCommand = {
                    /**  Triggers the activity to stop and skip to the next in a task */
                    skipToNext?:boolean;
        }

        /** 
        Configuration parameters for switchPose
         */
        export type SwitchPoseConfig = {
                    /**  Index of the Kinematics Configuration (KC) to use */
                    kinematicsConfigurationIndex?:number;
                    
                    newJointConfiguration?:number;
                    /**  Index of the move parameters (amax, vmax etc.) to be used for the move */
                    moveParamsIndex?:number;
        }

        /** 
        Status of switchPose
         */
        export type SwitchPoseStatus = {
                    /**  Percentage through move we currently are */
                    percentageComplete?:number;
        }

        /** 
        Command parameters for switchPose
         */
        export type SwitchPoseCommand = {
                    /**  Triggers the activity to stop and skip to the next in a task */
                    skipToNext?:boolean;
        }

        /** 
        Configuration parameters for gearInVelo
         */
        export type GearInVeloConfig = {
                    /**  Kinematics configuration to use for the master */
                    masterKinematicsConfigurationIndex?:number;
                    /**  Kinematics configuration to use for the slave */
                    slaveKinematicsConfigurationIndex?:number;
                    
                    gearingFrameIndex?:number;
                    
                    gearRatio?:number;
                    
                    syncActivationDelay?:number;
        }

        /** 
        Status of gearInVelo
         */
        export type GearInVeloStatus = {
                    /**  Percentage through move we currently are */
                    percentageComplete?:number;
                    
                    gearInFailed?:boolean;
                    
                    gearedIn?:boolean;
        }

        /** 
        Command parameters for gearInVelo
         */
        export type GearInVeloCommand = {
                    /**  Triggers the activity to stop and skip to the next in a task */
                    skipToNext?:boolean;
                    
                    updatedRatio?:number;
                    
                    updateRation?:boolean;
        }

        /** 
        Configuration parameters for gearInPos
         */
        export type GearInPosConfig = {
                    /**  Kinematics configuration to use for the master */
                    masterKinematicsConfigurationIndex?:number;
                    /**  Kinematics configuration to use for the slave */
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

        /** 
        Status of gearInPos
         */
        export type GearInPosStatus = {
                    /**  Percentage through move we currently are */
                    percentageComplete?:number;
                    
                    gearInFailed?:boolean;
                    
                    gearedIn?:boolean;
        }

        /** 
        Command parameters for gearInPos
         */
        export type GearInPosCommand = {
                    /**  Triggers the activity to stop and skip to the next in a task */
                    skipToNext?:boolean;
                    
                    updatedRatioMaster?:number;
                    
                    updatedRatioSlave?:number;
                    
                    updatedMasterSyncPosition?:CartesianPosition;
                    
                    updatedSlaveSyncPosition?:CartesianPosition;
        }

        
        export type StressTestConfig = {
        }

        
        export type StressTestStatus = {
        }

        
        export type StressTestCommand = {
        }

        
        export type StressTestStream = {
        }

        /** 
        This is a union discriminated by activityType. 
         */
        export type ActivityConfig = {
                    /**  IMPORTANT: This is the discriminator for the union */
                    activityType?:ACTIVITYTYPE;
                    /**  Index of trigger for skip-to-next */
                    skipToNextTriggerIndex?:number;
                    /**  Type of trigger for skip to next  */
                    skipToNextTriggerType?:TRIGGERTYPE;
//              Start of Union
                    /**  Configuration parameters for move joints activity */
                     moveJoints?: MoveJointsConfig,
                    /**  Configuration parameters for move joints at velocity activity */
                     moveJointsAtVelocity?: MoveJointsAtVelocityConfig,
                    /**  Configuration parameters for move line activity */
                     moveLine?: MoveLineConfig,
                    /**  Configuration parameters for move line at velocity activity */
                     moveLineAtVelocity?: MoveLineAtVelocityConfig,
                    /**  Configuration parameters for move arc activity */
                     moveArc?: MoveArcConfig,
                    /**  Configuration parameters for move arc activity */
                     moveSpline?: MoveSplineConfig,
                    /**  Configuration parameters for move to position activity */
                     moveToPosition?: MoveToPositionConfig,
                    /**  Configuration parameters for gear in position activity */
                     gearInPos?: GearInPosConfig,
                    /**  Configuration parameters for gear in velocity activity */
                     gearInVelo?: GearInVeloConfig,
                    /**  Configuration parameters for set dout activity */
                     setDout?: SetDoutConfig,
                    /**  Configuration parameters for set aout activity */
                     setAout?: SetAoutConfig,
                    /**  Configuration parameters for set aout activity */
                     setIout?: SetIoutConfig,
                    /**  Configuration parameters for dwell activity */
                     dwell?: DwellConfig,
                    /**  Configuration parameters for wait on activity */
                     waitOn?: WaitOnConfig,
                    /**  Configuration parameters for switch pose activity */
                     switchPose?: SwitchPoseConfig,
                    /**  Configuration parameters for latch position activity */
                     latchPos?: LatchPosConfig,
                    /**  Configuration parameters for stress test activity */
                     stressTest?: StressTestConfig,
//              End of Union
        }

        /** 
        This is a union
         */
        export type ActivityStatus = {
                    /**  current state of the activity */
                    state?:ACTIVITYSTATE;
                    /**  User defined. Used by Glowbuzzer React to track gcode line */
                    tag?:number;
//              Start of Union
                    /**  Status of the move joints activity */
                     moveJoints?: MoveJointsStatus,
                    /**  Status of the move joints at velocity activity */
                     moveJointsAtVelocity?: MoveJointsAtVelocityStatus,
                    /**  Status of the move line activity */
                     moveLine?: MoveLineStatus,
                    /**  Status of the move line at velocity activity */
                     moveLineAtVelocity?: MoveLineAtVelocityStatus,
                    /**  Status of the move arc activity */
                     moveArc?: MoveArcStatus,
                    /**  Status of the move spline activity */
                     moveSpline?: MoveSplineStatus,
                    /**  Status of the move to position activity */
                     moveToPosition?: MoveToPositionStatus,
                    /**  Status of the gear in position activity */
                     gearInPos?: GearInPosStatus,
                    /**  Status of the gear in velocity activity */
                     gearInVelo?: GearInVeloStatus,
                    /**  Status of the set dout activity */
                     setDout?: SetDoutStatus,
                    /**  Status of the set aout activity */
                     setAout?: SetAoutStatus,
                    /**  Status of the set iout activity */
                     setIout?: SetIoutStatus,
                    /**  Status of the set dwell activity */
                     dwell?: DwellStatus,
                    /**  Status of the wait on activity */
                     waitOn?: WaitOnStatus,
                    /**  Status of the switch pose activity */
                     switchPose?: SwitchPoseStatus,
                    /**  Status of the latch pos activity */
                     latchPos?: LatchPosStatus,
                    /**  Status of the stress test activity */
                     stressTest?: StressTestStatus,
//              End of Union
        }

        /** 
        This is a union. There is no discriminator for this union as the Activity will have been configured with a specific type of activity and these are the commands that act on this type.
         */
        export type ActivityCommand = {
//              Start of Union
                    /**  Move joints command object for activity */
                     moveJoints?: MoveJointsCommand,
                    /**  Move joints at velocity command object for activity */
                     moveJointsAtVelocity?: MoveJointsAtVelocityCommand,
                    /**  Move line command object for activity */
                     moveLine?: MoveLineCommand,
                    /**  Move line at velocity command object for activity */
                     moveLineAtVelocity?: MoveLineAtVelocityCommand,
                    /**  Move arc command object for activity */
                     moveArc?: MoveArcCommand,
                    /**  Move spline command object for activity */
                     moveSpline?: MoveSplineCommand,
                    /**  Move to position command object for activity */
                     moveToPosition?: MoveToPositionCommand,
                    /**  Gear in position command object for activity */
                     gearInPos?: GearInPosCommand,
                    /**  Gear in velocity command object for activity */
                     gearInVelo?: GearInVeloCommand,
                    /**  Set dout command object for activity */
                     setDout?: SetDoutCommand,
                    /**  Set aout command object for activity */
                     setAout?: SetAoutCommand,
                    /**  Set iout command object for activity */
                     setIout?: SetIoutCommand,
                    /**  Set dwell command object for activity */
                     dwell?: DwellCommand,
                    /**  Set wait on command object for activity */
                     waitOn?: WaitOnCommand,
                    /**  Set switch pose command object for activity */
                     switchPose?: SwitchPoseCommand,
                    /**  Set latch position  command object for activity */
                     latchPos?: LatchPosCommand,
                    /**  Set stress test command object for activity */
                     stressTest?: StressTestCommand,
//              End of Union
                    /**  Trigger a skip to next on the activity */
                    skipToNext?:boolean;
        }

        /** 
        This is a union
         */
        export type ActivityStreamItem = {
                    /**  Discriminator - the type of activity */
                    activityType?:ACTIVITYTYPE;
                    /**  User defined. Used by Glowbuzzer React to track gcode line */
                    tag?:number;
//              Start of Union
                    /**  Parameters for a streamed move joints */
                     moveJoints?: MoveJointsStream,
                    /**  Parameters for a streamed move joints at velocity */
                     moveJointsAtVelocity?: MoveJointsAtVelocityStream,
                    /**  Parameters for a streamed move line */
                     moveLine?: MoveLineStream,
                    /**  Parameters for a streamed move line at velocity */
                     moveLineAtVelocity?: MoveLineAtVelocityStream,
                    /**  Parameters for a streamed move arc */
                     moveArc?: MoveArcStream,
                    /**  Parameters for a streamed move to position */
                     moveToPosition?: MoveToPositionStream,
                    /**  Parameters for a streamed set dout */
                     setDout?: SetDoutCommand,
                    /**  Parameters for a streamed set aout */
                     setAout?: SetAoutCommand,
                    /**  Parameters for a streamed set iout */
                     setIout?: SetIoutCommand,
                    /**  Parameters for a streamed dwell */
                     dwell?: DwellConfig,
                    /**  Parameters for a streamed stress test */
                     stressTest?: StressTestStream,
//              End of Union
        }

        /** 
        This is a union
         */
        export type ActivityMetrics = {
//              Start of Union
//              End of Union
        }

        
        export type SoloActivityConfig = {
        }

        export type SoloActivityStatus = ActivityStatus
        export type SoloActivityCommand = ActivityStreamItem
        /** 
        Configuration parameters for frame
         */
        export type FramesConfig = {
                    /**  Translation of the frame */
                    translation?:Vector3;
                    /**  Rotation of the frame */
                    rotation?:Quat;
                    /**  Link to the parent of the frame */
                    parent?:number;
                    /**  Whether the frame is referenced with an absolute or relative position */
                    absRel?:FRAME_ABSRELATIVE;
        }

        /** 
        Command parameters for frame
         */
        export type FramesCommand = {
                    /**  Translation to be applied to the frame */
                    translation?:Vector3;
                    /**  Rotation to be applied to the frame */
                    rotation?:Quat;
                    /**  Should the frame&#x27;s value be overridden */
                    override?:boolean;
        }

        
        export type FramesStatus = {
        }

        /** 
        Configuration parameters for tool
         */
        export type ToolConfig = {
                    /**  Index of tool */
                    toolIndex?:number;
                    /**  Index of frame the tool is referenced to */
                    frameIndex?:number;
        }

        /** 
        Status of tool
         */
        export type ToolStatus = {
                    /**  Tool open/closed state */
                    openOrClosed?:OPENCLOSED;
        }

        /** 
        Comamnds for tool
         */
        export type ToolCommand = {
                    /**  Command tool open/closed */
                    openOrClose?:OPENCLOSED;
        }

        
        export type TriggerOnConfig = {
                    /**  Index of analog input to act as a trigger */
                    aiIndex?:number;
                    /**  Threshold for analog in at which trigger occurs */
                    threshold?:number;
                    /**  Trigger occurs at threshold greater or less than */
                    aiThreholdGreaterLessThan?:GTLT;
                    /**  Index of digital input to act as a trigger */
                    diIndex?:number;
                    /**  State that triggers */
                    diTriggerState?:ONOFF;
                    /**  Filter for trigger */
                    numberofTicksBeforeTrigger?:number;
        }


