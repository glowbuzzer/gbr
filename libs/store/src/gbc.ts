/* eslint-disable @typescript-eslint/ban-types */
// noinspection JSUnusedGlobalSymbols

export * from "./gbc_extra"

export const GbcSchemaChecksum = "5b12e066d814a6987cf926db474af2ee"

// CONSTANTS
export const GbcConstants = {
    DEFAULT_HLC_HEARTBEAT_TOLERANCE: 2000,
    MAX_NUMBER_OF_WHEELS_IN_AGV: 4,
    JOINT_CONTROL_WORD_CST_POS_VEL_DISABLE_BIT: 1,
}

// ENUMS
    export enum FAULT_CAUSE {
        FAULT_CAUSE_SAFETY_BIT_NUM                          = (0),
        FAULT_CAUSE_DRIVE_FAULT_BIT_NUM                    = (1),
        FAULT_CAUSE_GBC_FAULT_REQUEST_BIT_NUM              = (2),
        FAULT_CAUSE_HEARTBEAT_LOST_BIT_NUM                 = (3),
        FAULT_CAUSE_LIMIT_REACHED_BIT_NUM                  = (4),
        FAULT_CAUSE_DRIVE_STATE_CHANGE_TIMEOUT_BIT_NUM     = (5),
        FAULT_CAUSE_DRIVE_FOLLOW_ERROR_BIT_NUM             = (6),
        FAULT_CAUSE_DRIVE_NO_REMOTE_BIT_NUM                = (7),
        FAULT_CAUSE_ECAT_BIT_NUM                           = (8),
        FAULT_CAUSE_DRIVE_WARNING_BIT_NUM                  = (9),
        FAULT_CAUSE_GBC_OPERATION_ERROR_BIT_NUM            = (10),
        FAULT_CAUSE_DRIVE_MOOERROR_BIT_NUM                 = (11),
        FAULT_CAUSE_ECAT_SLAVE_ERROR_BIT_NUM               = (12),
        FAULT_CAUSE_PLC_SIGNALLED_ERROR_BIT_NUM            = (13),
        FAULT_CAUSE_HOMING_ERROR_BIT_NUM                   = (14),
        FAULT_CAUSE_GBC_TO_PLC_CON_ERROR_BIT_NUM           = (15),
        FAULT_CAUSE_MOVE_NOT_OP_EN_BIT_NUM                 = (16),
        FAULT_CAUSE_DRIVE_STATE_MISMATCH_BIT_NUM           = (17),
        FAULT_CAUSE_FSOE_ERROR_BIT_NUM                     = (18),
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
    export enum FSOE_SLAVE_HIGH_LEVEL_STATE {
        FSOE_SLAVE_HIGH_LEVEL_STATE_NONE                   = (0),
        FSOE_SLAVE_HIGH_LEVEL_STATE_PROCESS_DATA           = (1),
        FSOE_SLAVE_HIGH_LEVEL_STATE_RESET                  = (2),
        FSOE_SLAVE_HIGH_LEVEL_STATE_SESSION                = (3),
        FSOE_SLAVE_HIGH_LEVEL_STATE_CONNECTION             = (4),
        FSOE_SLAVE_HIGH_LEVEL_STATE_PARAMETER              = (5),
        FSOE_SLAVE_HIGH_LEVEL_STATE_FAILSAFEDATA           = (6),
        FSOE_SLAVE_HIGH_LEVEL_STATE_UNKNOWN                = (7),
    }
    export enum FSOE_SLAVE_TYPE {
        FSOE_SLAVE_TYPE_NONE                               = (0),
        FSOE_SLAVE_TYPE_SYNAPTICON                         = (1),
        FSOE_SLAVE_TYPE_EL1904                             = (2),
        FSOE_SLAVE_TYPE_EL2904                             = (3),
        FSOE_SLAVE_TYPE_SCU_1_EC                           = (4),
        FSOE_SLAVE_TYPE_EL6900                             = (5),
        FSOE_SLAVE_TYPE_EL6910                             = (6),
        FSOE_SLAVE_TYPE_ELM7231                            = (7),
    }
    export enum FSOE_MASTER_HIGH_LEVEL_STATE {
        FSOE_MASTER_HIGH_LEVEL_STATE_NONE                  = (0),
        FSOE_MASTER_HIGH_LEVEL_STATE_START_UP              = (1),
        FSOE_MASTER_HIGH_LEVEL_STATE_SENDCONFIG            = (2),
        FSOE_MASTER_HIGH_LEVEL_STATE_STARTUP_BUS           = (3),
        FSOE_MASTER_HIGH_LEVEL_STATE_RUN                   = (4),
        FSOE_MASTER_HIGH_LEVEL_STATE_STOP                  = (5),
        FSOE_MASTER_HIGH_LEVEL_STATE_ERROR                 = (6),
        FSOE_MASTER_HIGH_LEVEL_STATE_ALARM                 = (7),
        FSOE_MASTER_HIGH_LEVEL_STATE_NO_NETWORK            = (8),
    }
    export enum GBEM_REQUEST {
        GBEM_REQUEST_NONE                                 = (0),
        GBEM_REQUEST_SDO_READ                             = (1),
        GBEM_REQUEST_SDO_WRITE                            = (2),
        GBEM_REQUEST_GET_VERSION                          = (3),
        GBEM_REQUEST_GET_FILE                             = (4),
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
    export enum MODBUSERRORCODES {
        /**  Modbus slave didn't initialise correctly */
  MODBUS_NO_SLAVE_INIT ,
        /**  Modbus no error */
  MODBUS_NO_ERROR ,
        /**  Modbus timeout error */
  MODBUS_COMMS_TIMEOUT ,
        /**  Modbus CRC error */
  MODBUS_BAD_CRC ,
        /**  Modbus bad data */
  MODBUS_BAD_DATA ,
        /**  Modbus bad function */
  MODBUS_BAD_FUNCTION ,
        /**  Modbus bad exception code */
  MODBUS_BAD_EXCEPTION ,
        /**  Modbus too much data */
  MODBUS_TOO_MUCH_DATA ,
        /**  Modbus bad slave */
  MODBUS_BAD_SLAVE ,
        /**  Modbus internal timeout */
  MODBUS_INTERNAL_TIMEOUT ,
        /**  Modbus connection reset */
  MODBUS_CONNECTION_RESET ,
        /**  Modbus invalid argument */
  MODBUS_INVALID_ARGUMENT ,
        /**  Modbus interrupted */
  MODBUS_INTERRUPTED ,
        /**  Modbus exception illegal function */
  MODBUS_EX_ILLEGAL_FUNCTION ,
        /**  Modbus exception illegal data address */
  MODBUS_EX_ILLEGAL_DATA_ADDRESS ,
        /**  Modbus exception illegal data value */
  MODBUS_EX_ILLEGAL_DATA_VALUE ,
        /**  Modbus exception slave or server failure */
  MODBUS_EX_SLAVE_OR_SERVER_FAILURE ,
        /**  Modbus exception acknowledge */
  MODBUS_EX_ACKNOWLEDGE ,
        /**  Modbus exception slave or server busy */
  MODBUS_EX_SLAVE_OR_SERVER_BUSY ,
        /**  Modbus exception negative acknowledge */
  MODBUS_EX_NEGATIVE_ACKNOWLEDGE ,
        /**  Modbus exception memory parity */
  MODBUS_EX_MEMORY_PARITY ,
        /**  Modbus exception gateway path */
  MODBUS_EX_GATEWAY_PATH ,
        /**  Modbus exception gateway target */
  MODBUS_EX_GATEWAY_TARGET ,
        /**  Modbus EL6021 RX FIFO full */
  MODBUS_EL6021_RX_FIFO_FULL ,
        /**  Modbus EL6021 parity error */
  MODBUS_EL6021_PARITY_ERROR ,
        /**  Modbus EL6021 framing error */
  MODBUS_EL6021_FRAMING_ERROR ,
        /**  Modbus EL6021 overrun error */
  MODBUS_EL6021_OVERRUN_ERROR ,
        /**  Modbus EL6021 slave didn't initialise */
  MODBUS_EL6021_NO_SLAVE_INIT ,
        /**  Modbus general error */
  MODBUS_GENERAL_ERROR ,
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
        OPERATION_ERROR_MODBUS_WRITE_FAILURE,
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
        /**  Set an unsigned digital out */
  ACTIVITYTYPE_SET_UIOUT ,
        /**  Set a signed external digital out */
  ACTIVITYTYPE_SET_EXTERNAL_IOUT ,
        /**  @ignore Gear in a master and slave specifying position */
  ACTIVITYTYPE_GEARINPOS ,
        /**  @ignore Gear in a master and slave specifying velocity */
  ACTIVITYTYPE_GEARINVELO ,
        /**  Set an external digital out */
  ACTIVITYTYPE_SET_EXTERNAL_DOUT ,
        /**  Set tool offset */
  ACTIVITYTYPE_TOOLOFFSET ,
        /**  Set an unsigned external digital out */
  ACTIVITYTYPE_SET_EXTERNAL_UIOUT ,
        /**  Set mass of the current payload */
  ACTIVITYTYPE_SET_PAYLOAD ,
        /**  Set a digital out on modbus */
  ACTIVITYTYPE_SETMODBUSDOUT ,
        /**  Set an unsigned integer out onmodbus */
  ACTIVITYTYPE_SETMODBUSUIOUT ,
        /**  Set initial position for a kinematics configuration */
  ACTIVITYTYPE_SETINITIALPOSITION ,
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
        /**  High level trigger (activates when signal is high) */
  TRIGGERTYPE_HIGH ,
        /**  Low level trigger (activates when signal is low) */
  TRIGGERTYPE_LOW ,
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
        /**  The kinematics configuration will have the KC_AGV kinematics model (algorithm) applied */
  KC_AGV ,
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
    export enum KC_AUXILIARYAXISTYPE {
        /**  No auxiliary axis (default) */
  KC_AUXILIARYAXIS_NONE ,
        /**  Linear auxiliary axis in X */
  KC_AUXILIARYAXIS_X ,
        /**  Linear auxiliary axis in Y */
  KC_AUXILIARYAXIS_Y ,
        /**  Linear auxiliary axis in Z */
  KC_AUXILIARYAXIS_Z ,
    }
    export enum KC_ENVELOPE_CONSTRAINT_TYPE {
        /**  No envelope constraint */
  KC_ENVELOPE_CONSTRAINT_NONE ,
        /**  Plane envelope constraint */
  KC_ENVELOPE_CONSTRAINT_PLANE ,
        /**  Box envelope constraint */
  KC_ENVELOPE_CONSTRAINT_BOX ,
        /**  Cylinder envelope constraint */
  KC_ENVELOPE_CONSTRAINT_CYLINDER ,
        /**  Sphere envelope constraint */
  KC_ENVELOPE_CONSTRAINT_SPHERE ,
    }
    export enum KC_ENVELOPE_CONSTRAINT_AXIS {
        /**  X Axis */
  KC_ENVELOPE_CONSTRAINT_AXIS_X ,
        /**  Y Axis */
  KC_ENVELOPE_CONSTRAINT_AXIS_Y ,
        /**  Z Axis */
  KC_ENVELOPE_CONSTRAINT_AXIS_Z ,
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
    export enum INTERFACE {
        /**  Tool is controlled by digital IOs */
  IO ,
        /**  Tool is controlled by Modbus */
  Modbus ,
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
        /**  Trigger on safe digital input */
  TRIGGERON_SAFE_DIGITAL_INPUT ,
        /**  Trigger on unsigned integer input */
  TRIGGERON_UNSIGNED_INTEGER_INPUT ,
        /**  Trigger on integer input */
  TRIGGERON_INTEGER_INPUT ,
        /**  Trigger on unsigned integer input */
  TRIGGERON_EXTERNAL_UNSIGNED_INTEGER_INPUT ,
        /**  Trigger on integer input */
  TRIGGERON_EXTERNAL_INTEGER_INPUT ,
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
    export enum SERIAL_CONTROL_WORD {
        SERIAL_TRANSMIT_REQUEST_BIT_NUM                     = (0),
        SERIAL_RECEIVE_ACCEPTED_BIT_NUM                     = (1),
        SERIAL_INIT_REQUEST_BIT_NUM                         = (2),
    }
    export enum SERIAL_STATUS_WORD {
        SERIAL_TRANSMIT_ACCEPTED_BIT_NUM                    = (0),
        SERIAL_RECEIVE_REQUEST_BIT_NUM                      = (1),
        SERIAL_INIT_ACCEPTED_BIT_NUM                        = (2),
        SERIAL_ERROR_BIT_NUM                                = (3),
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
            
                        /**  The bus cycle time (in milliseconds) */
                        busCycleTime?:number;
                        /**  The frequency of status updates (between 20 and 1000, in milliseconds) */
                        statusFrequency?:number;
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
                        operationErrorMessage?:string;
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
                        /**  Whether the move should ignore the current feedrate override */
                        ignoreFeedrateOverride?:boolean;
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
            
            export type TriggerOnUnsignedIntegerInput = {
            
                        
                        input?:number;
                        
                        when?:GTLT;
                        
                        value?:number;
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
                        
                         unsignedInteger?: TriggerOnUnsignedIntegerInput,
                        
                         integer?: TriggerOnIntegerInput,
                        
                         timer?: TriggerOnTimer,
                        
                         tick?: TriggerOnTick,
    //              End of Union
            }
            /** 
            Config parameters for Tasks
             */
            export type TaskConfig = {
            
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
                        /**  The threshold at which the joint is considered to be moving */
                        dynamicsVelocityThreshold?:number;
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
                        /**  Actual control effort of the joint */
                        actControlEffort?:number;
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
            
            export type PlanarEnvelope = {
            
                        /**  Direction of planar envelope */
                        direction?:KC_ENVELOPE_CONSTRAINT_AXIS;
                        /**  Distance from origin */
                        position?:number;
                        /**  Whether the envelope is inside or outside */
                        outside?:boolean;
            }
            
            export type BoxEnvelope = {
            
                        /**  Origin of box envelope */
                        origin?:Vector3;
                        /**  Extents of box envelope */
                        extents?:Vector3;
                        /**  Whether the envelope is inside or outside */
                        outside?:boolean;
            }
            
            export type CylinderEnvelope = {
            
                        /**  Center of cylinder envelope */
                        center?:Vector3;
                        /**  Radius of cylinder envelope */
                        radius?:number;
                        /**  Height of cylinder envelope */
                        height?:number;
                        /**  Axis of cylinder envelope */
                        axis?:KC_ENVELOPE_CONSTRAINT_AXIS;
                        /**  Whether the envelope is inside or outside */
                        outside?:boolean;
            }
            
            export type SphericalEnvelope = {
            
                        /**  Center of spherical envelope (default 0, 0, 0) */
                        center?:Vector3;
                        /**  Radius of spherical envelope */
                        radius?:number;
                        /**  Whether the envelope is inside or outside */
                        outside?:boolean;
            }
            
            export type EnvelopeConstraint = {
            
                        /**  Type of envelope constraint */
                        constraintType?:KC_ENVELOPE_CONSTRAINT_TYPE;
    //              Start of Union
                        /**  Planar envelope constraint */
                         plane?: PlanarEnvelope,
                        /**  Box envelope constraint */
                         box?: BoxEnvelope,
                        /**  Cylinder envelope constraint */
                         cylinder?: CylinderEnvelope,
                        /**  Sphere envelope constraint */
                         sphere?: SphericalEnvelope,
    //              End of Union
            }
            
            export type VelocityScaling = {
            
                        /**  Whether auto velocity scaling is enabled */
                        enabled?:boolean;
                        /**  Trigger to activate velocity scaling */
                        trigger?:TriggerOnDigitalInput;
                        /**  Whether the trigger is a safe input */
                        safeInput?:boolean;
                        /**  Scale factor when active, between 0 and 1 */
                        scaleFactor?:number;
            }
            
            export type AgvWheel = {
            
                        /**  Position of wheel relative to center of AGV */
                        position?:Vector3;
                        /**  Radius of wheel */
                        radius?:number;
            }
            /** Configuration parameters for a kinematics configuration */
            export type KinematicsConfigurationConfig = {
            
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
                        velocityScaling?:VelocityScaling[];
                        /**  Matrix containing the DH parameters for the kinematics model */
                        kinChainParams?:MatrixInstanceDouble;
                        /**  Inverse dynamic parameters for the kinematics model */
                        inverseDynamicParams?:InverseDynamicParameters[];
                        /**  List of wheels for AGV kinematics configuration (half the number of joints) */
                        agvWheels?:AgvWheel[];
                        /**  List of envelope constraints for the kinematics configuration */
                        envelopeConstraints?:EnvelopeConstraint[];
                        /**  Integrated auxiliary axis for the kinematics configuration, if supported */
                        auxiliaryAxisType?:KC_AUXILIARYAXISTYPE;
                        /**  Amount of the move that the auxiliary axis should cover, in range 0 to 1 */
                        auxiliaryAxisFactor?:number;
                        /**  Default tool index for the kinematics configuration. Set to 0xFF to disable tool selection */
                        defaultToolIndex?:number;
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
                        /**  Payload currently carried by the kinematics configuration */
                        payload?:number;
            }
            /** 
            Configuration parameters for a digital input
             */
            export type DinConfig = {
            
                        /**  Defines if the input signal is inverted */
                        inverted?:boolean;
            }
            /** 
            Status of a digital input
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
            Configuration parameters for a safety digital input
             */
            export type SafetyDinConfig = {
            
                        /**  Defines if the input signal is inverted */
                        inverted?:boolean;
            }
            /** 
            Status of a safety digital input
             */
            export type SafetyDinStatus = {
            
                        /**  State of the safety digital input */
                        actValue?:boolean;
            }
            /** 
            Command for a safety digital input
             */
            export type SafetyDinCommand = {
            
                        /**  Defines if the digital input state is to be overridden */
                        override?:boolean;
                        /**  State of the digital input */
                        setValue?:boolean;
            }
            /** 
            Configuration parameters for an external digital input
             */
            export type ExternalDinConfig = {
            
                        /**  Defines if the input signal is inverted */
                        inverted?:boolean;
            }
            /** 
            Status of an external digital input
             */
            export type ExternalDinStatus = {
            
                        /**  State of the safety digital input */
                        actValue?:boolean;
            }
            /** 
            Command for an external digital input
             */
            export type ExternalDinCommand = {
            
                        /**  Defines if the digital input state is to be overridden */
                        override?:boolean;
                        /**  State of the digital input */
                        setValue?:boolean;
            }
            /** 
            Configuration parameters for a modbus digital input (coil / discrete input)
             */
            export type ModbusDinConfig = {
            
                        /**  Defines the modbus slave number to read from */
                        slaveNum?:number;
                        /**  Defines the modbus address to read from */
                        address?:number;
                        /**  Defines the modbus function to use (0x1 or 0x2) */
                        function?:number;
                        /**  Defines if the modbus data is little endian */
                        littleEndian?:boolean;
                        /**  Defines if the input signal is inverted */
                        inverted?:boolean;
            }
            /** 
            Status of an modbus digital input
             */
            export type ModbusDinStatus = {
            
                        /**  State of the modbus digital input */
                        actValue?:boolean;
                        /**  Error code of the modbus read */
                        errorCode?:number;
                        /**  Defines if the modbus read was successful */
                        isError?:boolean;
            }
            /** 
            Command for an modbus digital input
             */
            export type ModbusDinCommand = {
            
                        /**  Defines if the digital input state is to be overridden */
                        override?:boolean;
                        /**  State of the digital input */
                        setValue?:boolean;
            }
            /** 
            Configuration parameters for a digital output
             */
            export type DoutConfig = {
            
                        /**  Indicates that in simulation mode, the output is looped back to the digital input given. Note that loopback to digital input 0 is not supported. */
                        loopback?:number;
            }
            /** 
            Status of a digital output
             */
            export type DoutStatus = {
            
                        /**  State of the digital output */
                        effectiveValue?:boolean;
            }
            /** 
            Command for a digital output
             */
            export type DoutCommand = {
            
                        /**  Defines if the digital output state is to be overridden */
                        override?:boolean;
                        /**  State of the digital output to be set */
                        setValue?:boolean;
            }
            /** 
            Configuration parameters for a safety digital output
             */
            export type SafetyDoutConfig = {
            
                        /**  Indicates that in simulation mode, the output is looped back to the digital input given. Note that loopback to digital input 0 is not supported. */
                        loopback?:number;
            }
            /** 
            Status of a safety digital output
             */
            export type SafetyDoutStatus = {
            
                        /**  State of the digital output */
                        effectiveValue?:boolean;
            }
            /** 
            Command for a safety digital output
             */
            export type SafetyDoutCommand = {
            
                        /**  Defines if the digital output state is to be overridden */
                        override?:boolean;
                        /**  State of the digital output to be set */
                        setValue?:boolean;
            }
            /** 
            Configuration parameters for an external digital output
             */
            export type ExternalDoutConfig = {
            
                        /**  Indicates that in simulation mode, the output is looped back to the digital input given. Note that loopback to digital input 0 is not supported. */
                        loopback?:number;
            }
            /** 
            Status of an external digital output
             */
            export type ExternalDoutStatus = {
            
                        /**  State of the digital output */
                        effectiveValue?:boolean;
            }
            /** 
            Command for an external digital output
             */
            export type ExternalDoutCommand = {
            
                        /**  Defines if the digital output state is to be overridden */
                        override?:boolean;
                        /**  State of the digital output to be set */
                        setValue?:boolean;
            }
            /** 
            Configuration parameters for a modbus digital output. Uses modbus function 0x05 (single coil) or 0x0F (multiple coils)
             */
            export type ModbusDoutConfig = {
            
                        /**  Defines the modbus slave number to write to */
                        slaveNum?:number;
                        /**  Defines the modbus start address to write to */
                        startAddress?:number;
                        /**  Defines the modbus end address to write to */
                        endAddress?:number;
            }
            /** 
            There are currently no configuration parameteters apart from `name` and `description`.
             */
            export type AinConfig = {
            
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
                        setValue?:number;
            }
            /** 
            Configuration parameters for Analog Outs (aout - floats)
             */
            export type AoutConfig = {
            
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
            /** @ignore */
            export type UiinConfig = {
            
            }
            /** 
            Status of an unsigned integer input
             */
            export type UiinStatus = {
            
                        /**  value of iin */
                        actValue?:number;
            }
            /** 
            Command for an unsigned integer input
             */
            export type UiinCommand = {
            
                        /**  Defines if the integer input state is to be overridden */
                        override?:boolean;
                        /**  State of the integer input */
                        setValue?:number;
            }
            /** 
            Configuration parameters for a signed integer input
             */
            export type IinConfig = {
            
            }
            /** 
            Status of a signed integer input
             */
            export type IinStatus = {
            
                        /**  value of iin */
                        actValue?:number;
            }
            /** 
            Command for a signed integer input
             */
            export type IinCommand = {
            
                        /**  Defines if the integer input state is to be overridden */
                        override?:boolean;
                        /**  State of the integer input */
                        setValue?:number;
            }
            /** 
            Configuration parameters for an unsigned integer input
             */
            export type ExternalUiinConfig = {
            
            }
            /** 
            Status of an unsigned integer input
             */
            export type ExternalUiinStatus = {
            
                        /**  value of iin */
                        actValue?:number;
            }
            /** 
            Command for an external unsigned integer input
             */
            export type ExternalUiinCommand = {
            
                        /**  Defines if the integer input state is to be overridden */
                        override?:boolean;
                        /**  State of the integer input */
                        setValue?:number;
            }
            /** 
            Configuration parameters for a signed integer input
             */
            export type ExternalIinConfig = {
            
            }
            /** 
            Status of a external signed integer input
             */
            export type ExternalIinStatus = {
            
                        /**  value of iin */
                        actValue?:number;
            }
            /** 
            Command for a external signed integer input
             */
            export type ExternalIinCommand = {
            
                        /**  Defines if the integer input state is to be overridden */
                        override?:boolean;
                        /**  State of the integer input */
                        setValue?:number;
            }
            /** 
            Configuration parameters for an unsigned integer input
             */
            export type ModbusUiinConfig = {
            
                        /**  Defines the modbus slave number to read from */
                        slaveNum?:number;
                        /**  Defines the modbus address to read from */
                        address?:number;
                        /**  Defines the modbus function to use (0x3 or 0x4) */
                        function?:number;
            }
            /** 
            Status of an unsigned integer input
             */
            export type ModbusUiinStatus = {
            
                        /**  State of the modbus digital input */
                        actValue?:number;
                        /**  Error code of the modbus read */
                        errorCode?:number;
                        /**  Defines if the modbus read was successful */
                        isError?:boolean;
            }
            /** 
            Command for an external unsigned integer input
             */
            export type ModbusUiinCommand = {
            
                        /**  Defines if the integer input state is to be overridden */
                        override?:boolean;
                        /**  State of the integer input */
                        setValue?:number;
            }
            /** @ignore */
            export type UioutConfig = {
            
            }
            /** 
            Status of an unsigned integer output
             */
            export type UioutStatus = {
            
                        /**  Effective value of the integer output */
                        effectiveValue?:number;
            }
            /** 
            Command for an unsigned integer output
             */
            export type UioutCommand = {
            
                        /**  Override the value of the integer output */
                        override?:boolean;
                        /**  Value to set the integer output to */
                        setValue?:number;
            }
            /** @ignore */
            export type IoutConfig = {
            
            }
            /** 
            Status of a signed integer output
             */
            export type IoutStatus = {
            
                        /**  Effective value of the integer output */
                        effectiveValue?:number;
            }
            /** 
            Command for a signed integer output
             */
            export type IoutCommand = {
            
                        /**  Override the value of the integer output */
                        override?:boolean;
                        /**  Value to set the integer output to */
                        setValue?:number;
            }
            /** @ignore */
            export type ExternalUioutConfig = {
            
            }
            /** 
            Status of an external unsigned integer output
             */
            export type ExternalUioutStatus = {
            
                        /**  Effective value of the integer output */
                        effectiveValue?:number;
            }
            /** 
            Command for an unsigned integer output
             */
            export type ExternalUioutCommand = {
            
                        /**  Override the value of the integer output */
                        override?:boolean;
                        /**  Value to set the integer output to */
                        setValue?:number;
            }
            /** @ignore */
            export type ExternalIoutConfig = {
            
            }
            /** 
            Status of an external signed integer output
             */
            export type ExternalIoutStatus = {
            
                        /**  Effective value of the integer output */
                        effectiveValue?:number;
            }
            /** 
            Command for an external signed integer output
             */
            export type ExternalIoutCommand = {
            
                        /**  Override the value of the integer output */
                        override?:boolean;
                        /**  Value to set the integer output to */
                        setValue?:number;
            }
            /** 
            Configuration parameters for an modbus unsigned integer output. Uses modbus function 0x06 (write single register) or 0x10 (write multiple registers)
             */
            export type ModbusUioutConfig = {
            
                        /**  Defines the modbus slave number to write to */
                        slaveNum?:number;
                        /**  Defines the modbus start address to write to */
                        startAddress?:number;
                        /**  Defines the modbus end address to write to */
                        endAddress?:number;
                        /**  Defines if the modbus data is little endian */
                        littleEndian?:boolean;
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
                        /**  ${DOC_jointPositionArray} */
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
            Parameters for set initial position activity
             */
            export type SetInitialPositionActivityParams = {
            
                        /**  Index of the Kinematics Configuration (KC) to use */
                        kinematicsConfigurationIndex?:number;
                        
                        cartesianPosition?:CartesianPositionsConfig;
            }
            /** @ignore */
            export type SetInitialPositionActivityStatus = {
            
            }
            /** @ignore */
            export type SetInitialPositionActivityCommand = {
            
            }
            /** 
            Parameters for a streamed set initial position activity
             */
            export type SetInitialPositionStream = {
            
                        /**  Index of the Kinematics Configuration (KC) to use */
                        kinematicsConfigurationIndex?:number;
                        
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
            Parameters for a set modbus digital output activity
             */
            export type SetModbusDoutActivityParams = {
            
                        /**  The index of the digital output to set */
                        doutToSet?:number;
                        /**  The array of values to set on the modbus outputs */
                        valueToSetArray?:boolean[];
            }
            /** Status for a set modbus digital output activity */
            export type SetModbusDoutActivityStatus = {
            
                        /**  Error code of the modbus write */
                        errorCode?:number;
                        /**  Defines if the modbus write was successful */
                        isError?:boolean;
            }
            /** @ignore */
            export type SetModbusDoutActivityCommand = {
            
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
            Parameters for a set unsigned integer output activity
             */
            export type SetUioutActivityParams = {
            
                        /**  The index of the integer output to set */
                        ioutToSet?:number;
                        /**  The value to set */
                        valueToSet?:number;
            }
            /** @ignore */
            export type SetUioutActivityStatus = {
            
            }
            /** @ignore */
            export type SetUioutActivityCommand = {
            
            }
            /** 
            Parameters for a set unsigned integer modbus output activity
             */
            export type SetModbusUioutActivityParams = {
            
                        /**  The configuration index of the integer output to set */
                        uioutToSet?:number;
                        /**  The array of values to set on the modbus outputs */
                        valueToSetArray?:number[];
            }
            /** Status for a set modbus unsigned integer output activity */
            export type SetModbusUioutActivityStatus = {
            
                        /**  Error code of the modbus write */
                        errorCode?:number;
                        /**  Defines if the modbus write was successful */
                        isError?:boolean;
            }
            /** @ignore */
            export type SetModbusUioutActivityCommand = {
            
            }
            /** 
            Parameters for a dwell activity
             */
            export type DwellActivityParams = {
            
                        /**  Number of milliseconds that you want to wait for */
                        msToDwell?:number;
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
            export type SetPayloadActivityStatus = {
            
            }
            /** @ignore */
            export type SetPayloadActivityCommand = {
            
            }
            /** Set the current payload (mass) */
            export type SetPayloadActivityParams = {
            
                        /**  Index of the Kinematics Configuration (KC) to use */
                        kinematicsConfigurationIndex?:number;
                        /**  Mass of the payload */
                        mass?:number;
            }
            /** 
            This is a union discriminated by activityType. 
             */
            export type ActivityConfig = {
            
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
                        /**  Configuration parameters for set initial position activity */
                         setInitialPosition?: SetInitialPositionActivityParams,
                        /**  @ignore Configuration parameters for gear in position activity */
                         gearInPos?: GearInPosActivityParams,
                        /**  @ignore Configuration parameters for gear in velocity activity */
                         gearInVelo?: GearInVeloActivityParams,
                        /**  Configuration parameters for set dout activity */
                         setDout?: SetDoutActivityParams,
                        /**  Configuration parameters for set external dout activity */
                         setExternalDout?: SetDoutActivityParams,
                        /**  Configuration parameters for set analog out activity */
                         setAout?: SetAoutActivityParams,
                        /**  Configuration parameters for set integer out activity */
                         setIout?: SetIoutActivityParams,
                        /**  Configuration parameters for set unsigned integer out activity */
                         setUiout?: SetUioutActivityParams,
                        /**  Configuration parameters for set external integer out activity */
                         setExternalIout?: SetIoutActivityParams,
                        /**  Configuration parameters for set external unsigned integer out activity */
                         setExternalUiout?: SetUioutActivityParams,
                        /**  Configuration parameters for dwell activity */
                         dwell?: DwellActivityParams,
                        /**  Configuration parameters for spindle activity */
                         spindle?: SpindleActivityParams,
                        /**  Configuration parameters for set modbus dout activity */
                         setModbusDout?: SetModbusDoutActivityParams,
                        /**  Configuration parameters for set modbus unsigned integer out activity */
                         setModbusUiout?: SetModbusUioutActivityParams,
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
                         setInitialPosition?: SetInitialPositionActivityStatus,
                        /**  @ignore */
                         gearInPos?: GearInPosActivityStatus,
                        /**  @ignore */
                         gearInVelo?: GearInVeloActivityStatus,
                        /**  @ignore */
                         setDout?: SetDoutActivityStatus,
                        /**  @ignore */
                         setExternalDout?: SetDoutActivityStatus,
                        /**  @ignore */
                         setAout?: SetAoutActivityStatus,
                        /**  @ignore */
                         setIout?: SetIoutActivityStatus,
                        /**  @ignore */
                         setUiout?: SetUioutActivityStatus,
                        /**  @ignore */
                         setExternalIout?: SetIoutActivityStatus,
                        /**  @ignore */
                         setExternalUiout?: SetUioutActivityStatus,
                        /**  @ignore */
                         dwell?: DwellActivityStatus,
                        /**  @ignore */
                         spindle?: SpindleActivityStatus,
                        /**  @ignore */
                         setModbusDout?: SetModbusDoutActivityStatus,
                        /**  @ignore */
                         setModbusUiout?: SetModbusUioutActivityStatus,
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
                        /**  @ignore */
                         setInitialPosition?: SetInitialPositionActivityCommand,
                        /**  Gear in position command object for activity */
                         gearInPos?: GearInPosActivityCommand,
                        /**  Gear in velocity command object for activity */
                         gearInVelo?: GearInVeloActivityCommand,
                        /**  @ignore - no command properties */
                         setDout?: SetDoutActivityCommand,
                        /**  @ignore - no command properties */
                         setExternalDout?: SetDoutActivityCommand,
                        /**  @ignore - no command properties */
                         setAout?: SetAoutActivityCommand,
                        /**  @ignore - no command properties */
                         setIout?: SetIoutActivityCommand,
                        /**  @ignore - no command properties */
                         setUiout?: SetUioutActivityCommand,
                        /**  @ignore - no command properties */
                         setExternalIout?: SetIoutActivityCommand,
                        /**  @ignore - no command properties */
                         setExternalUiout?: SetUioutActivityCommand,
                        /**  Set dwell command object for activity */
                         dwell?: DwellActivityCommand,
                        /**  Set spindle command object for activity */
                         spindle?: SpindleActivityCommand,
                        /**  Parameters for a streamed setting of tool offset */
                         setToolOffset?: ToolOffsetActivityParams,
                        /**  Parameters for a streamed setting of payload */
                         setPayload?: SetPayloadActivityParams,
                        /**  @ignore - no command properties */
                         setModbusDout?: SetModbusDoutActivityCommand,
                        /**  @ignore - no command properties */
                         setModbusUiout?: SetModbusUioutActivityCommand,
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
                        /**  Parameters for a streamed set initial position */
                         setInitialPosition?: SetInitialPositionStream,
                        /**  Parameters for a streamed set dout */
                         setDout?: SetDoutActivityParams,
                        /**  Parameters for a streamed set external dout */
                         setExternalDout?: SetDoutActivityParams,
                        /**  Parameters for a streamed set modbus dout */
                         setModbusDout?: SetModbusDoutActivityParams,
                        /**  Parameters for a streamed set aout */
                         setAout?: SetAoutActivityParams,
                        /**  Parameters for a streamed set iout */
                         setIout?: SetIoutActivityParams,
                        /**  Parameters for a streamed set unsigned iout */
                         setUiout?: SetUioutActivityParams,
                        /**  Parameters for a streamed set external iout */
                         setExternalIout?: SetIoutActivityParams,
                        /**  Parameters for a streamed set external unsigned iout */
                         setExternalUiout?: SetUioutActivityParams,
                        /**  Parameters for a streamed set modbus unsigned iout */
                         setModbusUiout?: SetModbusUioutActivityParams,
                        /**  Parameters for a streamed dwell */
                         dwell?: DwellActivityParams,
                        /**  Parameters for a streamed spindle change */
                         spindle?: SpindleActivityParams,
                        /**  Parameters for a streamed setting of tool offset */
                         setToolOffset?: ToolOffsetActivityParams,
                        /**  Parameters for a streamed setting of payload */
                         setPayload?: SetPayloadActivityParams,
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
            
                        /**  Translation of the tool */
                        translation?:Vector3;
                        /**  Rotation of the tool */
                        rotation?:Quat;
                        /**  Diameter of the tool */
                        diameter?:number;
                        /**  Rigid body params for the tool */
                        rigidBodyInertia?:RigidBodyInertia;
                        /**  Interface used to control the tool */
                        interface?:INTERFACE;
                        /**  IO index for the grasp signal */
                        graspIo?:number;
                        /**  IO index for the release signal */
                        releaseIo?:number;
                        /**  IO index for the grasp sense signal */
                        graspSenseIo?:number;
                        /**  IO index for the release sense signal */
                        releaseSenseIo?:number;
            }
            /** @ignore */
            export type SerialConfig = {
            
            }
            /** 
            Status of serial communication
             */
            export type SerialStatus = {
            
                        /**  Status word for serial communication */
                        statusWord?:number;
                        /**  Length of the data received */
                        length?:number;
                        /**  Data received over serial communication */
                        data?:number[];
            }
            /** 
            Command for serial communication
             */
            export type SerialCommand = {
            
                        /**  Control word for serial communication */
                        controlWord?:number;
                        /**  Length of the data to send */
                        length?:number;
                        /**  Data to send over serial communication */
                        data?:number[];
            }

// TS-ONLY STRUCTS

