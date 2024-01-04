/* eslint-disable @typescript-eslint/ban-types */
// noinspection JSUnusedGlobalSymbols

export * from "./gbc_extra"

export const GbcSchemaChecksum = "812015ad18899b1c4c0d046228ab269e"

// CONSTANTS
export const GbcConstants = {
    DEFAULT_HLC_HEARTBEAT_TOLERANCE: 2000,
    JOINT_CONTROL_WORD_CST_POS_VEL_DISABLE_BIT: 1,
}

// ENUMS
    export enum FAULT_CAUSE {
        FAULT_CAUSE_ESTOP_BIT_NUM                          = (0),
        FAULT_CAUSE_DRIVE_FAULT_BIT_NUM                    = (1),
        FAULT_CAUSE_GBC_FAULT_REQUEST_BIT_NUM              = (2),
        FAULT_CAUSE_HEARTBEAT_LOST_BIT_NUM                 = (3),
        FAULT_CAUSE_LIMIT_REACHED_BIT_NUM                  = (4),
        FAULT_CAUSE_DRIVE_STATE_CHANGE_TIMEOUT_BIT_NUM     = (5),
        FAULT_CAUSE_DRIVE_FOLLOW_ERROR_BIT_NUM             = (6),
        FAULT_CAUSE_DRIVE_NO_REMOTE_BIT_NUM                = (7),
        FAULT_CAUSE_ECAT_BIT_NUM                           = (8),
        FAULT_CAUSE_DRIVE_ALARM_BIT_NUM                    = (9),
        FAULT_CAUSE_GBC_OPERATION_ERROR_BIT_NUM            = (10),
        FAULT_CAUSE_DRIVE_MOOERROR_BIT_NUM                 = (11),
        FAULT_CAUSE_ECAT_SLAVE_ERROR_BIT_NUM               = (12),
        FAULT_CAUSE_PLC_SIGNALLED_ERROR_BIT_NUM            = (13),
        FAULT_CAUSE_HOMING_ERROR_BIT_NUM                   = (14),
        FAULT_CAUSE_GBC_TO_PLC_CON_ERROR_BIT_NUM           = (15),
        FAULT_CAUSE_MOVE_NOT_OP_EN_BIT_NUM                 = (16),
        FAULT_CAUSE_CST_CSV_POSITION_LIMIT_ERROR_BIT_NUM   = (17),
        FAULT_CAUSE_CST_CSV_VELOCITY_LIMIT_ERROR_BIT_NUM   = (18),
    }
    export enum STATUS_WORD_GBEM {
        STATUS_WORD_GBEM_ALIVE_BIT_NUM                      = (16),
        STATUS_WORD_GBEM_BOOT_IN_PROGRESS_BIT_NUM           = (17),
        STATUS_WORD_GBEM_BOOTED_BIT_NUM                     = (18),
        STATUS_WORD_GBEM_HOMING_NEEDED_BIT_NUM              = (19),
        STATUS_WORD_GBEM_WAITING_FOR_START_HOMING_BIT_NUM   = (20),
        STATUS_WORD_GBEM_HOMING_IN_PROGRESS_BIT_NUM         = (21),
        STATUS_WORD_GBEM_HOMING_ERROR_BIT_NUM               = (23),
        STATUS_WORD_GBEM_HOMING_ATTAINED_BIT_NUM            = (24),
    }
    export enum CONTROL_WORD_GBC_GBEM {
        CONTROL_WORD_GBC_OPERATION_ERROR_BIT_NUM           = (16),
        CONTROL_WORD_GBEM_START_HOMING_BIT_NUM             = (17),
        CONTROL_WORD_GBC_REQUEST_FAULT_BIT_NUM             = (18),
        CONTROL_WORD_GBEM_REBOOT_BIT_NUM                   = (20),
    }
    export enum CONFIG_STATUS {
        CONFIG_STATUS_NONE,
        CONFIG_STATUS_RELOAD,
        CONFIG_STATUS_RELOAD_FULL,
        CONFIG_STATUS_LOADED,
    }
    export enum LIMITPROFILE {
        /**  Use default limits */
  LIMITPROFILE_DEFAULT ,
        /**  Use jogging limits */
  LIMITPROFILE_JOGGING ,
        /**  Use rapid move limits */
  LIMITPROFILE_RAPIDS ,
    }
    export enum MACHINETARGET {
        MACHINETARGET_NONE,
        MACHINETARGET_FIELDBUS,
        MACHINETARGET_SIMULATION,
    }
    export enum OPERATION_ERROR {
        OPERATION_ERROR_NONE,
        OPERATION_ERROR_HLC_HEARTBEAT_LOST,
        OPERATION_ERROR_OPERATION_NOT_ENABLED,
        OPERATION_ERROR_INVALID_ARC,
        OPERATION_ERROR_TOOL_INDEX_OUT_OF_RANGE,
        OPERATION_ERROR_JOINT_LIMIT_EXCEEDED,
        OPERATION_ERROR_KINEMATICS_FK_INVALID_VALUE,
        OPERATION_ERROR_KINEMATICS_IK_INVALID_VALUE,
        OPERATION_ERROR_KINEMATICS_INVALID_KIN_CHAIN_PARAMS,
        OPERATION_ERROR_JOINT_DISCONTINUITY,
        OPERATION_ERROR_JOINT_OVER_SPEED,
        OPERATION_ERROR_INVALID_ROTATION,
        OPERATION_ERROR_CONFIG_RELOADED,
        OPERATION_ERROR_KINEMATICS_ENVELOPE_VIOLATION,
        OPERATION_ERROR_KINEMATICS_NEAR_SINGULARITY,
    }
    export enum POSITIONREFERENCE {
        /**  Position is specified absolutely (relative to origin) */
  ABSOLUTE ,
        /**  Position is specified relatively to current position */
  RELATIVE ,
        /**  Position is to be super-imposed on the current move */
  MOVESUPERIMPOSED ,
    }
    export enum ROTATIONINTERPOLATION {
        /**  Use shortest SLERP between start and end rotations */
  ROTATIONINTERPOLATION_SHORT_SLERP ,
        /**  Use longest SLERP between start and end rotations */
  ROTATIONINTERPOLATION_LONG_SLERP ,
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
        /**  Pause program activity (streamed) */
  ACTIVITYTYPE_PAUSEPROGRAM ,
        /**  End program activity (streamed) */
  ACTIVITYTYPE_ENDPROGRAM ,
        /**  Move a set of joints to a given position */
  ACTIVITYTYPE_MOVEJOINTS ,
        /**  Move a set of joints at a given velocity */
  ACTIVITYTYPE_MOVEJOINTSATVELOCITY ,
        /**  Move a kinematics configuration's tool along a line in cartesian space to a given position (with orientation) */
  ACTIVITYTYPE_MOVELINE ,
        /**  Move a kinematics configuration's tool along a line in cartesian space at a given velocity without changing orientation */
  ACTIVITYTYPE_MOVEVECTORATVELOCITY ,
        /**  Move a kinematics configuration's tool about an axis cartesian space at a given angular velocity without changing position */
  ACTIVITYTYPE_MOVEROTATIONATVELOCITY ,
        /**  Move a kinematics configuration's tool along an arc in cartesian space to a given position (with orientation) */
  ACTIVITYTYPE_MOVEARC ,
        /**  Move instantly to a given position in cartesian space (with orientation) */
  ACTIVITYTYPE_MOVEINSTANT ,
        /**  Move a kinematics configuration's tool to given position (with orientation) in joint space */
  ACTIVITYTYPE_MOVETOPOSITION ,
        /**  Set a digital out  */
  ACTIVITYTYPE_SETDOUT ,
        /**  Set an integer out */
  ACTIVITYTYPE_SETIOUT ,
        /**  Set an analog out */
  ACTIVITYTYPE_SETAOUT ,
        /**  Dwell (wait) for a period of time */
  ACTIVITYTYPE_DWELL ,
        /**  Start/stop spindle */
  ACTIVITYTYPE_SPINDLE ,
        /**  Move joints to given end position and velocity using interpolation */
  ACTIVITYTYPE_MOVEJOINTSINTERPOLATED ,
        /**  @ignore Reserved for future use */
  ACTIVITYTYPE_RESERVED3 ,
        /**  @ignore Reserved for future use */
  ACTIVITYTYPE_RESERVED4 ,
        /**  @ignore Gear in a master and slave specifying position */
  ACTIVITYTYPE_GEARINPOS ,
        /**  @ignore Gear in a master and slave specifying velocity */
  ACTIVITYTYPE_GEARINVELO ,
        /**  @ignore Switch a robot's configuration */
  ACTIVITYTYPE_RESERVED5 ,
        /**  Set tool offset */
  ACTIVITYTYPE_TOOLOFFSET ,
        /**  @ignore Latch the value of a position */
  ACTIVITYTYPE_LATCH ,
        /**  @ignore Internal stress test activity */
  ACTIVITYTYPE_STRESSTEST ,
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
        /**  @ignore */
  PHASESHIFT ,
        /**  @ignore */
  EARLY ,
        /**  @ignore */
  LATE ,
        /**  @ignore */
  SLOW ,
    }
    export enum TRIGGERTYPE {
        /**  Rising edge trigger (activates on the rising edge of a signal 0->1 */
  TRIGGERTYPE_RISING ,
        /**  Falling edge trigger (activates on the falling edge of a signal 1->0 */
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
    export enum SPINDLEDIRECTION {
        /**  Spindle direction is clockwise */
  SPINDLEDIRECTION_CW ,
        /**  Spindle direction is counter-clockwise */
  SPINDLEDIRECTION_CCW ,
    }
    export enum JOINT_TYPE {
        /**  Joint type is prismatic (linear) - linear units */
  JOINT_PRISMATIC ,
        /**  Joint type is revolute (rotary) - radians units */
  JOINT_REVOLUTE ,
    }
    export enum JOINT_MODEOFOPERATION {
        /**  Joint mode of operation is none */
  JOINT_MODEOFOPERATION_NONE   = 0 ,
        /**  Joint is to be controlled in position mode */
  JOINT_MODEOFOPERATION_CSP    = 1 ,
        /**  Joint is to be controlled in velocity mode */
  JOINT_MODEOFOPERATION_CSV    = 2 ,
        /**  Joint is to be controlled in torque mode */
  JOINT_MODEOFOPERATION_CST    = 4 ,
        /**  Joint is to be controlled in homing mode */
  JOINT_MODEOFOPERATION_HOMING = 8 ,
    }
    export enum JOINT_FINITECONTINUOUS {
        /**  Joint is finite (defined limits on travel) */
  JOINT_FINITE ,
        /**  Joint is infinite (no travel limits) */
  JOINT_CONTINUOUS ,
    }
    export enum JOINT_TORQUE_MODE {
        /**  Torque is automatically controlled according to position (when in JOINT_MODEOFOPERATION_CST) */
  JOINT_TORQUE_MODE_DEFAULT   = 0 ,
        /**  If JOINT_MODEOFOPERATION_CST is supported, drive will switch to this mode and gravity compensation will be applied */
  JOINT_TORQUE_MODE_GRAVITY   = 1 ,
        /**  @ignore - not supported yet */
  JOINT_TORQUE_MODE_DIRECT    = 2 ,
    }
    export enum KC_KINEMATICSCONFIGURATIONTYPE {
        /**  The kinematics configuration will have no kinematics model (algorithm) applied */
  KC_NAKED ,
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
        /**  The kinematics configuration will have the TWO_LINK kinematics model (algorithm) applied */
  KC_TWO_LINK ,
        /**  The kinematics configuration will use a custom user supplied c function */
  KC_CUSTOM ,
        /**  The kinematics configuration will have the REVOLUTE_DELTA kinematics model (algorithm) applied */
  KC_REVOLUTE_DELTA ,
        /**  The kinematics configuration will have the ANGLED_LINEAR_DELTA kinematics model (algorithm) applied */
  KC_ANGLED_LINEAR_DELTA ,
        /**  The kinematics configuration will have the RRPR_SCARA kinematics model (algorithm) applied */
  KC_RRPR_SCARA ,
        /**  The kinematics configuration will have the PRISMATIC_STEWART kinematics model (algorithm) applied */
  KC_PRISMATIC_STEWART ,
        /**  The kinematics configuration will have the PUMA kinematics model (algorithm) applied */
  KC_PUMA ,
        /**  The kinematics configuration will have the FIVE_AXIS kinematics model (algorithm) applied */
  KC_FIVE_AXIS ,
        /**  The kinematics configuration will have the WMR kinematics model (algorithm) applied */
  KC_WMR ,
        /**  The kinematics configuration will have the MOVEABLE_SIXDOF kinematics model (algorithm) applied */
  KC_MOVEABLE_SIXDOF ,
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
    export enum SYNCTYPE {
        /**  No sync for move */
  SYNCTYPE_NONE ,
        /**  Ensure move is of specified duration in milliseconds */
  SYNCTYPE_DURATION_MS ,
        /**  Ensure move ends at the specified clock tick (not currently supported) */
  SYNCTYPE_AT_TICK ,
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
        /**  Stream state paused from user interface */
  STREAMSTATE_PAUSED ,
        /**  Stream state paused by activity */
  STREAMSTATE_PAUSED_BY_ACTIVITY ,
        /**  Stream state is in the process of stopping */
  STREAMSTATE_STOPPING ,
        /**  Stream state is stopped */
  STREAMSTATE_STOPPED ,
    }
    export enum TRIGGERON {
        /**  No trigger */
  TRIGGERON_NONE ,
        /**  Trigger on analog input */
  TRIGGERON_ANALOG_INPUT ,
        /**  Trigger on digital input */
  TRIGGERON_DIGITAL_INPUT ,
        /**  Trigger on integer input */
  TRIGGERON_INTEGER_INPUT ,
        /**  Trigger on countdown timer */
  TRIGGERON_TIMER ,
        /**  Trigger on absolute clock value */
  TRIGGERON_TICK ,
    }
    export enum TRIGGERACTION {
        TRIGGERACTION_NONE,
        TRIGGERACTION_CANCEL,
        TRIGGERACTION_START,
    }



// STRUCTS
            
            export type SharedMemHeader = {
            
                        
                        status?:CONFIG_STATUS;
            }
            
            export type LimitConfiguration = {
            
                        /**  Velocity limit */
                        vmax?:number;
                        /**  Acceleration limit */
                        amax?:number;
                        /**  Jerk limit */
                        jmax?:number;
            }
            
            export type MachineConfig = {
            
                    /** Name for this configuration item */
                    name?: string
            
                        /**  The bus cycle time (in milliseconds) */
                        busCycleTime?:number;
                        /**  The frequency of status updates (between 20 and 1000, in milliseconds) */
                        statusFrequency?:number;
                        /**  Whether one of the digital inputs should be treated as estop */
                        estopEnabled?:boolean;
                        /**  Which digital input should be treated as estop, if estopEnabled is true */
                        estopInput?:number;
                        /**  The amount of time (in milliseconds) before GBC will fault if it has not received a heartbeat, default 2000 */
                        heartbeatTimeout?:number;
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
                        /**  Indicates an operation error in GBC that is recoverable */
                        operationError?:OPERATION_ERROR;
                        /**  @ignore Reserved for internal use */
                        operationErrorMessage?:string[];
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
            
                    /** Name for this configuration item */
                    name?: string
            
                        /**  Indicates that buffer must be full or end program activity issued before stream will start executing */
                        enableEndProgram?:boolean;
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
            Configuration parameters for move parameters
             */
            export type MoveParametersConfig = {
            
                    /** Name for this configuration item */
                    name?: string
            
                        /**  Vmax (max velocity) for move */
                        vmax?:number;
                        /**  Percentage of vmax to be used for move */
                        vmaxPercentage?:number;
                        /**  Percentage of amax to be used for move */
                        amaxPercentage?:number;
                        /**  Percentage of jmax to be used for move */
                        jmaxPercentage?:number;
                        /**  Linear and angular limit profile to use for move */
                        limitConfigurationIndex?:number;
                        /**  Type of blend to be used for the move */
                        blendType?:BLENDTYPE;
                        /**  Blend time percentage to be used for the move */
                        blendTimePercentage?:number;
                        /**  Tolerance to be applied to the blend  */
                        blendTolerance?:number;
                        /**  Tool to be used for the move */
                        toolIndex?:number;
                        
                        syncType?:SYNCTYPE;
                        
                        syncValue?:number;
                        
                        optimizeJointDistance?:boolean;
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
                        /**  Translation vector object */
                        translation?:Vector3;
                        /**  Rotation quaternion object  */
                        rotation?:Quat;
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
                        translation?:Vector3;
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
            Configuration parameters for arcs
             */
            export type ArcsConfig = {
            
                        /**  Whether the arc is defined by centre or radius */
                        arcType?:ARCTYPE;
                        /**  Is the arc direction CW or CCW (clockwise or counter-clockwise) */
                        arcDirection?:ARCDIRECTION;
                        /**  Destination position for the arc */
                        destination?:CartesianPosition;
                        /**  Local rotation of arc, useful for plane switching */
                        plane?:Quat;
                        /**  Whether to use shortest or longest SLERP between start and end rotations */
                        rotationInterpolation?:ROTATIONINTERPOLATION;
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
            
                        /**  The position including translation and rotation */
                        position?:CartesianPosition;
                        /**  The robot configuration (shoulder/elbow/wrist), if applicable */
                        configuration?:number;
            }
            
            export type TriggerOnAnalogInput = {
            
                        
                        input?:number;
                        
                        when?:GTLT;
                        
                        value?:number;
            }
            
            export type TriggerOnDigitalInput = {
            
                        
                        input?:number;
                        
                        when?:TRIGGERTYPE;
            }
            
            export type TriggerOnIntegerInput = {
            
                        
                        input?:number;
                        
                        when?:GTLT;
                        
                        value?:number;
            }
            
            export type TriggerOnTimer = {
            
                        
                        delay?:number;
            }
            
            export type TriggerOnTick = {
            
                        
                        value?:number;
            }
            
            export type TriggerParams = {
            
                        
                        type?:TRIGGERON;
                        
                        action?:TRIGGERACTION;
    //              Start of Union
                        
                         analog?: TriggerOnAnalogInput,
                        
                         digital?: TriggerOnDigitalInput,
                        
                         integer?: TriggerOnIntegerInput,
                        
                         timer?: TriggerOnTimer,
                        
                         tick?: TriggerOnTick,
    //              End of Union
            }
            /** 
            Config parameters for Tasks
             */
            export type TaskConfig = {
            
                    /** Name for this configuration item */
                    name?: string
            
                        /**  Number of activities in this task */
                        activityCount?:number;
                        /**  First activity in this task  */
                        firstActivityIndex?:number;
                        
                        triggers?:TriggerParams[];
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
            /** Configuration parameters for a PID controller */
            export type PidConfig = {
            
                        /**  Proportional gain */
                        kp?:number;
                        /**  Integral gain */
                        ki?:number;
                        /**  Derivative gain */
                        kd?:number;
                        /**  Maximum value of the integral term */
                        maxIntegral?:number;
                        /**  Minimum value of the integral term */
                        minIntegral?:number;
                        /**  Sample time in milliseconds */
                        sampleTime?:number;
            }
            /** 
            Configuration parameters for joint
             */
            export type JointConfig = {
            
                    /** Name for this configuration item */
                    name?: string
            
                        
                        jointType?:JOINT_TYPE;
                        /**  List of limits to be applied to the joint for different types of move */
                        limits?:LimitConfiguration[];
                        /**  Default control mode for the joint */
                        preferredMode?:JOINT_MODEOFOPERATION;
                        /**  Bitwise combination of supported modes */
                        supportedModes?:number;
                        /**  Bitwise combination of supported torque modes */
                        supportedTorqueModes?:number;
                        /**  Default scale factor to be applied to a joint's pos/vel/acc/torque before transfer to the fieldbus */
                        scale?:number;
                        /**  Scale factor to be applied to a joint's position to/from the fieldbus */
                        scalePos?:number;
                        /**  Scale factor to be applied to a joint's velocity to/from the fieldbus */
                        scaleVel?:number;
                        /**  Scale factor to be applied to a joint's torque to/from the fieldbus */
                        scaleTorque?:number;
                        /**  @ignore */
                        pow10?:number;
                        /**  Negative soft limit for the travel of the joint, before scale/inverted flag is applied */
                        negLimit?:number;
                        /**  Positive soft limit for the travel of the joint, before scale/inverted flag is applied */
                        posLimit?:number;
                        /**  Indicates that a joint's motion is inverted. Equivalent to using a negative scale factor */
                        inverted?:boolean;
                        
                        finiteContinuous?:JOINT_FINITECONTINUOUS;
                        
                        isVirtualInternal?:boolean;
                        
                        isVirtualFromEncoder?:boolean;
                        
                        correspondingJointNumberOnPhysicalFieldbus?:number;
                        
                        correspondingJointNumberOnVirtualFieldbus?:number;
                        /**  PID configuration for the joint, where 0 index is for CSV, and the other two are for CST */
                        pidConfig?:PidConfig[];
            }
            /** 
            Status of joint
             */
            export type JointStatus = {
            
                        /**  CiA 402 status word for the joint */
                        statusWord?:number;
                        /**  Actual position of the joint */
                        actPos?:number;
                        /**  Actual velocity of the joint */
                        actVel?:number;
                        /**  Actual torque of the joint */
                        actTorque?:number;
            }
            /** 
            Command parameters for joint
             */
            export type JointCommand = {
            
                        /**  CiA 402 control word for a drive (not used when using GBEM which controls the drives) */
                        controlWord?:number;
                        /**  Torque to be applied to the joint. Exact behaviour depends on the direct torque mode */
                        setTorque?:number;
                        /**  Torque mode to be used for the joint */
                        torqueMode?:JOINT_TORQUE_MODE;
            }
            
            export type MatrixInstanceDouble = {
            
                        /**  Number of rows in matrix */
                        numRows?:number;
                        /**  Number of columns in matrix */
                        numCols?:number;
                        /**  Data for matrix */
                        data?:number[];
                        /**  Array of flags indicating if the joint angle should be inverted during FK/IK kinematics */
                        invJointAngles?:number[];
            }
            
            export type RollPitchYaw = {
            
                        /**  Roll */
                        r?:number;
                        /**  Pitch */
                        p?:number;
                        /**  Yaw */
                        y?:number;
            }
            /** URDF frame for a joint, used for inverse dynamics */
            export type UrdfFrame = {
            
                        /**  Origin of frame */
                        translation?:Vector3;
                        /**  Roll, pitch, yaw of frame */
                        rpy?:RollPitchYaw;
            }
            /** Rigid body inertia for a kinematics configuration */
            export type RigidBodyInertia = {
            
                        /**  Mass of rigid body */
                        m?:number;
                        /**  Center of mass of rigid body */
                        h?:Vector3;
                        /**  Moment of inertia about X axis */
                        Ixx?:number;
                        /**  Moment of inertia about Y axis */
                        Iyy?:number;
                        /**  Moment of inertia about Z axis */
                        Izz?:number;
                        /**  Moment of inertia about XY axis */
                        Ixy?:number;
                        /**  Moment of inertia about XZ axis */
                        Ixz?:number;
                        /**  Moment of inertia about YZ axis */
                        Iyz?:number;
            }
            /** Inverse dynamic parameters for a kinematics configuration */
            export type InverseDynamicParameters = {
            
                        /**  URDF frame for the joint */
                        urdfFrame?:UrdfFrame;
                        /**  Rigid body inertia for the joint */
                        rigidBodyInertia?:RigidBodyInertia;
                        
                        jointOffset?:number;
                        
                        jointScale?:number;
                        
                        jointInertia?:number;
                        /**  Joint axis for the joint */
                        jointAxis?:Vector3;
                        
                        damping?:number;
                        
                        friction?:number;
            }
            
            export type SphericalEnvelope = {
            
                        /**  Center of spherical envelope (default 0, 0, 0) */
                        center?:Vector3;
                        /**  Inner and outer radius of spherical envelope (disabled by default) */
                        radius?:number[];
            }
            
            export type VelocityScaling = {
            
                        /**  Whether auto velocity scaling is enabled */
                        enabled?:boolean;
                        /**  Trigger to activate velocity scaling */
                        trigger?:TriggerOnDigitalInput;
                        /**  Scale factor when active, between 0 and 1 */
                        scaleFactor?:number;
            }
            /** Configuration parameters for a kinematics configuration */
            export type KinematicsConfigurationConfig = {
            
                    /** Name for this configuration item */
                    name?: string
            
                        /**  Kinematics configuration type. That is, the kinematics model that will be used. Used as discriminator for the union */
                        kinematicsConfigurationType?:KC_KINEMATICSCONFIGURATIONTYPE;
                        /**  Defines the supported configurations a robot. Bit 0 is wrist, bit 1 elbow, bit 2 shoulder. Higher bits are user-defined */
                        supportedConfigurationBits?:number;
                        /**  Frame index this kinematics configuration will use */
                        frameIndex?:number;
                        /**  Array of physical joint indices use in this kinematics configuration */
                        participatingJoints?:number[];
                        /**  Number of joints */
                        participatingJointsCount?:number;
                        /**  Extent (size) of workspace in X */
                        extentsX?:number[];
                        /**  Extent (size) of workspace in Y */
                        extentsY?:number[];
                        /**  Extent (size) of workspace in Z */
                        extentsZ?:number[];
                        /**  Scale factor to apply to X axis */
                        scaleX?:number;
                        /**  Scale factor to apply to Y axis */
                        scaleY?:number;
                        /**  Scale factor to apply to Z axis */
                        scaleZ?:number;
                        /**  List of linear limits to be applied to the kinematics configuration for different types of move */
                        linearLimits?:LimitConfiguration[];
                        /**  List of angular limits to be applied to the kinematics configuration for different types of move */
                        angularLimits?:LimitConfiguration[];
                        /**  Auto velocity scaling parameters for the kinematics configuration */
                        velocityScaling?:VelocityScaling;
                        /**  Matrix containing the DH parameters for the kinematics model */
                        kinChainParams?:MatrixInstanceDouble;
                        /**  Inverse dynamic parameters for the kinematics model */
                        inverseDynamicParams?:InverseDynamicParameters[];
                        /**  Spherical envelope for the kinematics configuration */
                        sphericalEnvelope?:SphericalEnvelope;
                        /**  Inner and outer radius of cylindrical envelope (disabled by default) */
                        cylindricalEnvelope?:number[];
                        /**  Interpolation interval for the kinematics configuration in milliseconds. Must be a multiple of the bus cycle time */
                        interpolationInterval?:number;
            }
            /** Status of a kinematics configuration */
            export type KinematicsConfigurationStatus = {
            
                        /**  Feed rate target value */
                        froTarget?:number;
                        /**  Feed rate actual value */
                        froActual?:number;
                        /**  Configuration (for example, shoulder/elbow/wrist) of the kinematics configuration */
                        configuration?:number;
                        /**  @ignore (not exposed) */
                        cartesianActPos?:Vector3;
                        /**  @ignore (not exposed) */
                        cartesianActOrientation?:Quat;
                        /**  @ignore (not exposed) */
                        cartesianActVel?:Vector3;
                        /**  @ignore (not exposed) */
                        cartesianActAcc?:Vector3;
                        /**  Indicates if soft limits (machine extents) are disabled */
                        limitsDisabled?:boolean;
                        /**  Indicates if the robot is near a singularity */
                        isNearSingularity?:number;
                        /**  Current tool index */
                        toolIndex?:number;
            }
            
            export type KinematicsConfigurationCommand = {
            
                        /**  Not used */
                        doStop?:boolean;
                        /**  Whether soft joint limits should be disabled */
                        disableLimits?:boolean;
                        /**  Desired feed rate, with 1 being normal and zero being stopped. A value of 2 would give double normal speed, for example */
                        fro?:number;
                        /**  Optional logical translation applied to all moves */
                        translation?:Vector3;
                        /**  Optional logical rotation applied to all moves */
                        rotation?:Quat;
            }
            /** 
            Configuration parameters for a digital input
             */
            export type DinConfig = {
            
                    /** Name for this configuration item */
                    name?: string
            
                        /**  Defines if the input signal is inverted */
                        inverted?:boolean;
            }
            /** 
            Status of Digital In
             */
            export type DinStatus = {
            
                        /**  State of the digital input */
                        actValue?:boolean;
            }
            /** 
            Command for a digital input
             */
            export type DinCommand = {
            
                        /**  Defines if the digital input state is to be overridden */
                        override?:boolean;
                        /**  State of the digital input */
                        setValue?:boolean;
            }
            /** 
            Configuration parameters for Digital Outs (dout)
             */
            export type DoutConfig = {
            
                    /** Name for this configuration item */
                    name?: string
            
                        /**  Defines if the ouput signal is inverted */
                        inverted?:boolean;
                        /**  Indicates that in simulation mode, the output is looped back to the digital input given. Note that loopback to digital input 0 is not supported. */
                        loopback?:number;
            }
            /** 
            Status of Digital Outs (dout)
             */
            export type DoutStatus = {
            
                        /**  State of the Digital Out */
                        effectiveValue?:boolean;
            }
            /** 
            Command for Digital Outs (dout)
             */
            export type DoutCommand = {
            
                        /**  Defines if the Dout state is to be overridden */
                        override?:boolean;
                        /**  State of the Digital Out */
                        setValue?:boolean;
            }
            /** 
            Configuration parameters for an analogue input
             */
            export type AinConfig = {
            
                    /** Name for this configuration item */
                    name?: string
            
                        /**  @ignore Flag to indicate this analog input should control the position of a virtual axis (joint) */
                        useForVirtualAxis?:boolean;
                        /**  @ignore Index of joint used for virtual axis (sim) */
                        jointIndexForVirtualAxis?:number;
            }
            /** 
            Status of an analog input
             */
            export type AinStatus = {
            
                        /**  Actual value of the analog input */
                        actValue?:number;
            }
            /** 
            Command for an analog input
             */
            export type AinCommand = {
            
                        /**  Defines if the analog input state is to be overridden */
                        override?:boolean;
                        /**  State of the analog input */
                        setValue?:boolean;
            }
            /** 
            Configuration parameters for Analog Outs (aout - floats)
             */
            export type AoutConfig = {
            
                    /** Name for this configuration item */
                    name?: string
            
            }
            /** 
            Status of an analog output. The status includes the effective value which is 
            either the value set by {@link AoutCommand} if `override` flag is set, 
            or the last value set by an activity (`setAout` in {@link ActivityCommand} or {@link ActivityStreamItem}).
             */
            export type AoutStatus = {
            
                        /**  Effective value of analog out */
                        effectiveValue?:number;
            }
            /** 
            Command for Analog Outs (aout - floats)
             */
            export type AoutCommand = {
            
                        /**  Whether to override the value of the analog out that might be set by an activity */
                        override?:boolean;
                        /**  Desired value of the analog out (ignored if override not set) */
                        setValue?:number;
            }
            /** 
            Configuration parameters for an integer input
             */
            export type IinConfig = {
            
                    /** Name for this configuration item */
                    name?: string
            
            }
            /** 
            Status of an integer input
             */
            export type IinStatus = {
            
                        /**  value of iin */
                        actValue?:number;
            }
            /** 
            Command for an integer input
             */
            export type IinCommand = {
            
                        /**  Defines if the integer input state is to be overridden */
                        override?:boolean;
                        /**  State of the integer input */
                        setValue?:boolean;
            }
            
            export type IoutConfig = {
            
                    /** Name for this configuration item */
                    name?: string
            
            }
            
            export type IoutStatus = {
            
                        /**  Effective value of the iout (integer out) */
                        effectiveValue?:number;
            }
            
            export type IoutCommand = {
            
                        /**  Override the value of the iout (integer out) set by the HLC */
                        override?:boolean;
                        /**  Value to set the iout (integer out) to */
                        setValue?:number;
            }
            /** 
            Parameters for move joints activity
             */
            export type MoveJointsActivityParams = {
            
                        /**  Index of the Kinematics Configuration (KC) to use */
                        kinematicsConfigurationIndex?:number;
                        /**  Array of joint positions */
                        jointPositionArray?:number[];
                        
                        positionReference?:POSITIONREFERENCE;
                        /**  Index of the move parameters (amax, vmax etc.) to be used for the move */
                        moveParamsIndex?:number;
            }
            /** @ignore */
            export type MoveJointsActivityStatus = {
            
                        /**  Percentage through move we currently are */
                        percentageComplete?:number;
            }
            /** 
            Command for a running move joints activity
             */
            export type MoveJointsActivityCommand = {
            
                        /**  Triggers the activity to stop and skip to the next in a task */
                        skipToNext?:boolean;
            }
            /** 
            Parameters for a streamed move joints activity
             */
            export type MoveJointsStream = {
            
                        /**  Index of the Kinematics Configuration (KC) to use */
                        kinematicsConfigurationIndex?:number;
                        
                        positionReference?:POSITIONREFERENCE;
                        
                        jointPositionArray?:number[];
                        
                        moveParams?:MoveParametersConfig;
            }
            /** 
            Parameters for move joints interpolated activity
             */
            export type MoveJointsInterpolatedActivityParams = {
            
                        /**  Index of the Kinematics Configuration (KC) to use */
                        kinematicsConfigurationIndex?:number;
                        /**  Array of joint positions */
                        jointPositionArray?:number[];
                        /**  Array of joint velocities */
                        jointVelocityArray?:number[];
                        /**  Timecode for the move */
                        timecode?:number;
                        /**  Index of the move parameters (amax, vmax etc.) to be used for the move */
                        moveParamsIndex?:number;
            }
            /** @ignore */
            export type MoveJointsInterpolatedActivityStatus = {
            
            }
            /** @ignore */
            export type MoveJointsInterpolatedActivityCommand = {
            
            }
            /** 
            Parameters for a streamed move joints interpolated activity
             */
            export type MoveJointsInterpolatedStream = {
            
                        /**  Index of the Kinematics Configuration (KC) to use */
                        kinematicsConfigurationIndex?:number;
                        
                        jointPositionArray?:number[];
                        /**  Array of joint velocities */
                        jointVelocityArray?:number[];
                        /**  Duration of the move */
                        duration?:number;
                        
                        moveParams?:MoveParametersConfig;
            }
            /** 
            Parameters for a move joints at velocity activity
             */
            export type MoveJointsAtVelocityActivityParams = {
            
                        /**  Index of the Kinematics Configuration (KC) to use */
                        kinematicsConfigurationIndex?:number;
                        /**  Index of the move parameters (amax, vmax etc.) to be used for the move */
                        moveParamsIndex?:number;
                        /**  Array of joints to be used for the moveJointsAtVelocity */
                        jointVelocityArray?:number[];
            }
            /** @ignore */
            export type MoveJointsAtVelocityActivityStatus = {
            
            }
            /** 
            Command for a running move joints at velocity activity
             */
            export type MoveJointsAtVelocityActivityCommand = {
            
                        /**  Triggers the activity to stop and skip to the next in a task */
                        skipToNext?:boolean;
            }
            /** 
            Parameters for a streamed move joints at velocity activity
             */
            export type MoveJointsAtVelocityStream = {
            
                        /**  Index of the Kinematics Configuration (KC) to use */
                        kinematicsConfigurationIndex?:number;
                        
                        moveParams?:MoveParametersConfig;
                        
                        jointVelocityArray?:number[];
            }
            /** 
            Parameters for a move line activity
             */
            export type MoveLineActivityParams = {
            
                        /**  Index of the Kinematics Configuration (KC) to use */
                        kinematicsConfigurationIndex?:number;
                        /**  Index of the move parameters (amax, vmax etc.) to be used for the move */
                        moveParamsIndex?:number;
                        /**  Line object for move */
                        line?:CartesianPosition;
                        /**  @ignore */
                        superimposedIndex?:number;
            }
            /** @ignore */
            export type MoveLineActivityStatus = {
            
            }
            /** 
            Command for a running move line activity
             */
            export type MoveLineActivityCommand = {
            
                        /**  Triggers the activity to stop and skip to the next in a task */
                        skipToNext?:boolean;
            }
            /** 
            Parameters for a streamed move line activity
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
            Parameters for a move vector at velocity activity
             */
            export type MoveVectorAtVelocityActivityParams = {
            
                        /**  Index of the Kinematics Configuration (KC) to use */
                        kinematicsConfigurationIndex?:number;
                        /**  Index of the move parameters (amax, vmax etc.) to be used for the move */
                        moveParamsIndex?:number;
                        /**  The vector (direction) to move in */
                        vector?:CartesianVector;
            }
            /** @ignore */
            export type MoveVectorAtVelocityActivityStatus = {
            
            }
            /** 
            Command for a running move vector at velocity activity
             */
            export type MoveVectorAtVelocityActivityCommand = {
            
                        /**  Triggers the activity to stop and skip to the next in a task */
                        skipToNext?:boolean;
            }
            /** 
            Parameters for a streamed move vector at velocity activity
             */
            export type MoveVectorAtVelocityStream = {
            
                        /**  Index of the Kinematics Configuration (KC) to use */
                        kinematicsConfigurationIndex?:number;
                        
                        moveParams?:MoveParametersConfig;
                        
                        vector?:CartesianVector;
            }
            /** 
            Parameters for a move rotation at velocity activity
             */
            export type MoveRotationAtVelocityActivityParams = {
            
                        /**  Index of the Kinematics Configuration (KC) to use */
                        kinematicsConfigurationIndex?:number;
                        /**  Index of the move parameters (amax, vmax etc.) to be used for the move */
                        moveParamsIndex?:number;
                        /**  The axis of rotation */
                        axis?:CartesianVector;
            }
            /** @ignore */
            export type MoveRotationAtVelocityActivityStatus = {
            
            }
            /** 
            Command for a running move rotation at velocity activity
             */
            export type MoveRotationAtVelocityActivityCommand = {
            
                        /**  Triggers the activity to stop and skip to the next in a task */
                        skipToNext?:boolean;
            }
            /** 
            Parameters for a streamed move rotation at velocity activity
             */
            export type MoveRotationAtVelocityStream = {
            
                        /**  Index of the Kinematics Configuration (KC) to use */
                        kinematicsConfigurationIndex?:number;
                        
                        moveParams?:MoveParametersConfig;
                        /**  The axis of rotation */
                        axis?:CartesianVector;
            }
            /** 
            Parameters for a move arc activity
             */
            export type MoveArcActivityParams = {
            
                        /**  Index of the Kinematics Configuration (KC) to use */
                        kinematicsConfigurationIndex?:number;
                        
                        superimposedIndex?:number;
                        /**  Index of the move parameters (amax, vmax etc.) to be used for the move */
                        moveParamsIndex?:number;
                        
                        arc?:ArcsConfig;
            }
            /** @ignore */
            export type MoveArcActivityStatus = {
            
            }
            /** 
            Command for a running move arc activity
             */
            export type MoveArcActivityCommand = {
            
                        /**  Triggers the activity to stop and skip to the next in a task */
                        skipToNext?:boolean;
            }
            /** 
            Parameters for a streamed move arc activity
             */
            export type MoveArcStream = {
            
                        /**  Index of the Kinematics Configuration (KC) to use */
                        kinematicsConfigurationIndex?:number;
                        
                        moveParams?:MoveParametersConfig;
                        
                        arc?:ArcsConfig;
                        
                        superimposedIndex?:number;
            }
            /** 
            Parameters for a move instant activity
             */
            export type MoveInstantActivityParams = {
            
                        /**  Index of the Kinematics Configuration (KC) to use */
                        kinematicsConfigurationIndex?:number;
                        
                        moveParams?:MoveParametersConfig;
                        
                        position?:CartesianPosition;
            }
            /** @ignore */
            export type MoveInstantActivityStatus = {
            
            }
            /** @ignore */
            export type MoveInstantActivityCommand = {
            
            }
            /** 
            Parameters for a streamed move arc activity
             */
            export type MoveInstantStream = {
            
                        /**  Index of the Kinematics Configuration (KC) to use */
                        kinematicsConfigurationIndex?:number;
                        
                        moveParams?:MoveParametersConfig;
                        
                        position?:CartesianPosition;
            }
            /** 
            Parameters for a move to position activity
             */
            export type MoveToPositionActivityParams = {
            
                        /**  Index of the Kinematics Configuration (KC) to use */
                        kinematicsConfigurationIndex?:number;
                        /**  Index of the move parameters (amax, vmax etc.) to be used for the move */
                        moveParamsIndex?:number;
                        
                        cartesianPosition?:CartesianPositionsConfig;
            }
            /** @ignore */
            export type MoveToPositionActivityStatus = {
            
            }
            /** 
            Command for a running move to position activity
             */
            export type MoveToPositionActivityCommand = {
            
                        /**  Triggers the activity to stop and skip to the next in a task */
                        skipToNext?:boolean;
            }
            /** 
            Parameters for a streamed move to position activity
             */
            export type MoveToPositionStream = {
            
                        /**  Index of the Kinematics Configuration (KC) to use */
                        kinematicsConfigurationIndex?:number;
                        
                        moveParams?:MoveParametersConfig;
                        
                        cartesianPosition?:CartesianPositionsConfig;
            }
            /** 
            Parameters for a set digital output activity
             */
            export type SetDoutActivityParams = {
            
                        /**  The index of the digital output to set */
                        doutToSet?:number;
                        /**  The value to set */
                        valueToSet?:boolean;
            }
            /** @ignore */
            export type SetDoutActivityStatus = {
            
            }
            /** @ignore */
            export type SetDoutActivityCommand = {
            
            }
            /** 
            Parameters for a set analog output activity
             */
            export type SetAoutActivityParams = {
            
                        /**  The index of the analog output to set */
                        aoutToSet?:number;
                        /**  The value to set */
                        valueToSet?:number;
            }
            /** @ignore */
            export type SetAoutActivityStatus = {
            
            }
            /** @ignore */
            export type SetAoutActivityCommand = {
            
            }
            /** 
            Parameters for a set integer output activity
             */
            export type SetIoutActivityParams = {
            
                        /**  The index of the integer output to set */
                        ioutToSet?:number;
                        /**  The value to set */
                        valueToSet?:number;
            }
            /** @ignore */
            export type SetIoutActivityStatus = {
            
            }
            /** @ignore */
            export type SetIoutActivityCommand = {
            
            }
            /** 
            Parameters for a dwell activity
             */
            export type DwellActivityParams = {
            
                        /**  Number of ticks that you want to wait for */
                        ticksToDwell?:number;
            }
            /** @ignore */
            export type DwellActivityStatus = {
            
            }
            /** 
            Command for a running dwell activity
             */
            export type DwellActivityCommand = {
            
                        /**  Triggers the activity to stop and skip to the next in a task */
                        skipToNext?:boolean;
            }
            /** 
            Configuration for a spindle
             */
            export type SpindleConfig = {
            
                    /** Name for this configuration item */
                    name?: string
            
                        /**  Index of the digital output used to turn on the spindle */
                        enableDigitalOutIndex?:number;
                        /**  Index of the digital output used to control direction of spindle */
                        directionDigitalOutIndex?:number;
                        /**  If set, clockwise direction command will drop digital output on `directionIndex` */
                        directionInvert?:boolean;
                        /**  Index of the analogue output used to control the spindle speed */
                        speedAnalogOutIndex?:number;
            }
            /** 
            Parameters for a spindle activity
             */
            export type SpindleActivityParams = {
            
                        /**  Index of the spindle in the configuration */
                        spindleIndex?:number;
                        /**  Whether to enable or disable the spindle */
                        enable?:boolean;
                        /**  Direction of the spindle */
                        direction?:SPINDLEDIRECTION;
                        /**  Speed of the spindle */
                        speed?:number;
            }
            /** @ignore */
            export type SpindleActivityStatus = {
            
            }
            /** 
            @ignore Command parameters for spindle
             */
            export type SpindleActivityCommand = {
            
            }
            /** 
            Parameters for a change of tool offset activity
             */
            export type ToolOffsetActivityParams = {
            
                        /**  Index of the Kinematics Configuration (KC) to use */
                        kinematicsConfigurationIndex?:number;
                        /**  Index of the tool */
                        toolIndex?:number;
            }
            /** @ignore */
            export type GearInVeloActivityParams = {
            
                        /**  Kinematics configuration to use for the master */
                        masterKinematicsConfigurationIndex?:number;
                        /**  Kinematics configuration to use for the slave */
                        slaveKinematicsConfigurationIndex?:number;
                        
                        gearingFrameIndex?:number;
                        
                        gearRatio?:number;
                        
                        syncActivationDelay?:number;
            }
            /** @ignore */
            export type GearInVeloActivityStatus = {
            
                        /**  Percentage through move we currently are */
                        percentageComplete?:number;
                        
                        gearInFailed?:boolean;
                        
                        gearedIn?:boolean;
            }
            /** @ignore */
            export type GearInVeloActivityCommand = {
            
                        /**  Triggers the activity to stop and skip to the next in a task */
                        skipToNext?:boolean;
                        
                        updatedRatio?:number;
                        
                        updateRation?:boolean;
            }
            /** @ignore */
            export type GearInPosActivityParams = {
            
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
            /** @ignore */
            export type GearInPosActivityStatus = {
            
                        /**  Percentage through move we currently are */
                        percentageComplete?:number;
                        
                        gearInFailed?:boolean;
                        
                        gearedIn?:boolean;
            }
            /** @ignore */
            export type GearInPosActivityCommand = {
            
                        /**  Triggers the activity to stop and skip to the next in a task */
                        skipToNext?:boolean;
                        
                        updatedRatioMaster?:number;
                        
                        updatedRatioSlave?:number;
                        
                        updatedMasterSyncPosition?:CartesianPosition;
                        
                        updatedSlaveSyncPosition?:CartesianPosition;
            }
            /** @ignore */
            export type StressTestActivityParams = {
            
            }
            /** @ignore */
            export type StressTestActivityStatus = {
            
            }
            /** @ignore */
            export type StressTestActivityCommand = {
            
            }
            /** @ignore */
            export type StressTestActivityStream = {
            
            }
            /** 
            This is a union discriminated by activityType. 
             */
            export type ActivityConfig = {
            
                    /** Name for this configuration item */
                    name?: string
            
                        /**  IMPORTANT: This is the discriminator for the union */
                        activityType?:ACTIVITYTYPE;
                        
                        triggers?:TriggerParams[];
    //              Start of Union
                        /**  Configuration parameters for move joints activity */
                         moveJoints?: MoveJointsActivityParams,
                        /**  Configuration parameters for move joints activity */
                         moveJointsInterpolated?: MoveJointsInterpolatedActivityParams,
                        /**  Configuration parameters for move joints at velocity activity */
                         moveJointsAtVelocity?: MoveJointsAtVelocityActivityParams,
                        /**  Configuration parameters for move line activity */
                         moveLine?: MoveLineActivityParams,
                        /**  Configuration parameters for move vector at velocity activity */
                         moveVectorAtVelocity?: MoveVectorAtVelocityActivityParams,
                        /**  Configuration parameters for move rotation at velocity activity */
                         moveRotationAtVelocity?: MoveRotationAtVelocityActivityParams,
                        /**  Configuration parameters for move arc activity */
                         moveArc?: MoveArcActivityParams,
                        /**  Configuration parameters for a instant move activity */
                         moveInstant?: MoveInstantActivityParams,
                        /**  Configuration parameters for move to position activity */
                         moveToPosition?: MoveToPositionActivityParams,
                        /**  @ignore Configuration parameters for gear in position activity */
                         gearInPos?: GearInPosActivityParams,
                        /**  @ignore Configuration parameters for gear in velocity activity */
                         gearInVelo?: GearInVeloActivityParams,
                        /**  Configuration parameters for set dout activity */
                         setDout?: SetDoutActivityParams,
                        /**  Configuration parameters for set aout activity */
                         setAout?: SetAoutActivityParams,
                        /**  Configuration parameters for set aout activity */
                         setIout?: SetIoutActivityParams,
                        /**  Configuration parameters for dwell activity */
                         dwell?: DwellActivityParams,
                        /**  Configuration parameters for spindle activity */
                         spindle?: SpindleActivityParams,
                        /**  Configuration parameters for stress test activity */
                         stressTest?: StressTestActivityParams,
    //              End of Union
            }
            /** Status of an activity */
            export type ActivityStatus = {
            
                        /**  Current state of the activity */
                        state?:ACTIVITYSTATE;
                        /**  User defined. Used by Glowbuzzer React to correlate activities */
                        tag?:number;
    //              Start of Union
                        /**  @ignore */
                         moveJoints?: MoveJointsActivityStatus,
                        /**  @ignore */
                         moveJointsInterpolated?: MoveJointsInterpolatedActivityStatus,
                        /**  @ignore */
                         moveJointsAtVelocity?: MoveJointsAtVelocityActivityStatus,
                        /**  @ignore */
                         moveLine?: MoveLineActivityStatus,
                        /**  @ignore */
                         moveVectorAtVelocity?: MoveVectorAtVelocityActivityStatus,
                        /**  @ignore */
                         moveRotationAtVelocity?: MoveRotationAtVelocityActivityStatus,
                        /**  @ignore */
                         moveArc?: MoveArcActivityStatus,
                        /**  @ignore */
                         moveInstant?: MoveInstantActivityStatus,
                        /**  @ignore */
                         moveToPosition?: MoveToPositionActivityStatus,
                        /**  @ignore */
                         gearInPos?: GearInPosActivityStatus,
                        /**  @ignore */
                         gearInVelo?: GearInVeloActivityStatus,
                        /**  @ignore */
                         setDout?: SetDoutActivityStatus,
                        /**  @ignore */
                         setAout?: SetAoutActivityStatus,
                        /**  @ignore */
                         setIout?: SetIoutActivityStatus,
                        /**  @ignore */
                         dwell?: DwellActivityStatus,
                        /**  @ignore */
                         spindle?: SpindleActivityStatus,
                        /**  @ignore */
                         stressTest?: StressTestActivityStatus,
    //              End of Union
            }
            /** 
            This is a union. There is no discriminator for this union as the Activity will have been configured with a specific type of activity and these are the commands that act on this type.
             */
            export type ActivityCommand = {
            
    //              Start of Union
                        /**  Move joints command object for activity */
                         moveJoints?: MoveJointsActivityCommand,
                        /**  Move joints command object for activity */
                         moveJointsInterpolated?: MoveJointsInterpolatedActivityCommand,
                        /**  Move joints at velocity command object for activity */
                         moveJointsAtVelocity?: MoveJointsAtVelocityActivityCommand,
                        /**  Move line command object for activity */
                         moveLine?: MoveLineActivityCommand,
                        /**  Move line at velocity command object for activity */
                         moveVectorAtVelocity?: MoveVectorAtVelocityActivityCommand,
                        /**  Move rotation at velocity command object for activity */
                         moveRotationAtVelocity?: MoveRotationAtVelocityActivityCommand,
                        /**  @ignore */
                         moveArc?: MoveArcActivityCommand,
                        /**  Move instant command object for activity */
                         moveInstant?: MoveInstantActivityCommand,
                        /**  Move to position command object for activity */
                         moveToPosition?: MoveToPositionActivityCommand,
                        /**  Gear in position command object for activity */
                         gearInPos?: GearInPosActivityCommand,
                        /**  Gear in velocity command object for activity */
                         gearInVelo?: GearInVeloActivityCommand,
                        /**  @ignore - no command properties */
                         setDout?: SetDoutActivityCommand,
                        /**  @ignore - no command properties */
                         setAout?: SetAoutActivityCommand,
                        /**  @ignore - no command properties */
                         setIout?: SetIoutActivityCommand,
                        /**  Set dwell command object for activity */
                         dwell?: DwellActivityCommand,
                        /**  Set spindle command object for activity */
                         spindle?: SpindleActivityCommand,
                        /**  Set stress test command object for activity */
                         stressTest?: StressTestActivityCommand,
    //              End of Union
            }
            /** 
            This is a union
             */
            export type ActivityStreamItem = {
            
                        /**  Discriminator - the type of activity */
                        activityType?:ACTIVITYTYPE;
                        /**  User defined. Used by Glowbuzzer React to track gcode line */
                        tag?:number;
                        
                        triggers?:TriggerParams[];
    //              Start of Union
                        /**  Parameters for a streamed move joints */
                         moveJoints?: MoveJointsStream,
                        /**  Parameters for a streamed move joints interpolated */
                         moveJointsInterpolated?: MoveJointsInterpolatedStream,
                        /**  Parameters for a streamed move joints at velocity */
                         moveJointsAtVelocity?: MoveJointsAtVelocityStream,
                        /**  Parameters for a streamed move line */
                         moveLine?: MoveLineStream,
                        /**  Parameters for a streamed move vector at velocity */
                         moveVectorAtVelocity?: MoveVectorAtVelocityStream,
                        /**  Parameters for a streamed move rotation at velocity */
                         moveRotationAtVelocity?: MoveRotationAtVelocityStream,
                        /**  Parameters for a streamed move arc */
                         moveArc?: MoveArcStream,
                        /**  Parameters for a streamed instant move */
                         moveInstant?: MoveInstantStream,
                        /**  Parameters for a streamed move to position */
                         moveToPosition?: MoveToPositionStream,
                        /**  Parameters for a streamed set dout */
                         setDout?: SetDoutActivityParams,
                        /**  Parameters for a streamed set aout */
                         setAout?: SetAoutActivityParams,
                        /**  Parameters for a streamed set iout */
                         setIout?: SetIoutActivityParams,
                        /**  Parameters for a streamed dwell */
                         dwell?: DwellActivityParams,
                        /**  Parameters for a streamed spindle change */
                         spindle?: SpindleActivityParams,
                        /**  Parameters for a streamed setting of tool offset */
                         setToolOffset?: ToolOffsetActivityParams,
                        /**  Parameters for a streamed stress test */
                         stressTest?: StressTestActivityStream,
    //              End of Union
            }
            
            export type SoloActivityConfig = {
            
                    /** Name for this configuration item */
                    name?: string
            
            }
            export type SoloActivityStatus = ActivityStatus
            export type SoloActivityCommand = ActivityStreamItem
            /** 
            Configuration parameters for frame
             */
            export type FramesConfig = {
            
                    /** Name for this configuration item */
                    name?: string
            
                        /**  Translation of the frame */
                        translation?:Vector3;
                        /**  Rotation of the frame */
                        rotation?:Quat;
                        /**  Index of the parent frame, if positionReference is POSITIONREFERENCE.RELATIVE */
                        parentFrameIndex?:number;
                        /**  Whether the frame is absolute or relative to a parent frame */
                        positionReference?:POSITIONREFERENCE;
                        /**  Allows you to use this frame as a workspace offset, where G54 is workspace offset 1 and so on */
                        workspaceOffset?:number;
            }
            /** 
            Command parameters for frame
             */
            export type FramesCommand = {
            
            }
            /** @ignore */
            export type FramesStatus = {
            
            }
            /** 
            Configuration parameters for point
             */
            export type PointsConfig = {
            
                    /** Name for this configuration item */
                    name?: string
            
                        /**  Frame for point */
                        frameIndex?:number;
                        /**  Translation (location) of the point */
                        translation?:Vector3;
                        /**  Rotation of the point */
                        rotation?:Quat;
                        /**  Robot configuration (shoulder, elbow, wrist) */
                        configuration?:number;
            }
            /** 
            Configuration parameters for a tool
             */
            export type ToolConfig = {
            
                    /** Name for this configuration item */
                    name?: string
            
                        /**  Translation of the tool */
                        translation?:Vector3;
                        /**  Rotation of the tool */
                        rotation?:Quat;
                        /**  Diameter of the tool */
                        diameter?:number;
            }

// TS-ONLY STRUCTS

