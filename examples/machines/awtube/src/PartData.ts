export enum PartInfoKey {
    Filename = "filename",
    Thickness = "thickness",
    FixedFlangeFromCentreLine = "fixedFlangeFromCentreLine",
    MoveableFlangeFromCentreLine = "moveableFlangeFromCentreLine",
    EffectiveLength = "effectiveLength",
    OffsetOfTubeInFlange = "offsetOfTubeInFlange",
    TubeLength = "tubeLength"
}

/*
Thickness applies to bases and clamps and flanges
FixedFlangeFromCentreLine and MoveableFlangeFromCentreLine apply to joints
EffectiveLength applies to links and monobraccios
OffsetOfTubeInFlange applies to flanges
TubeLength applies to links
 */

export interface PartInfo {
    [PartInfoKey.Filename]: string
    [PartInfoKey.Thickness]?: number
    [PartInfoKey.FixedFlangeFromCentreLine]?: number
    [PartInfoKey.MoveableFlangeFromCentreLine]?: number
    [PartInfoKey.EffectiveLength]?: number
    [PartInfoKey.OffsetOfTubeInFlange]?: number
    [PartInfoKey.TubeLength]?: number
}

/** This is the data structure that holds the all the parts in a parts library */
export interface PartData {
    [partType: string]: {
        [partName: string]: PartInfo
    }
}

/** This is the data structure that holds the parts used to assemble a robot arm */
export interface RobotArmPartsUsed {
    // [partType: string]: string[]
    [partType: string]: {
        partName: string

        // Other properties for each part if needed
    }[]
}

export enum BasePartName {
    MM219 = "MM219",
    MM169 = "MM169"
    // Add other base part names here
}

export enum JointPartName {
    J17 = "J17",
    J20 = "J20",
    J25 = "J25",
    J32 = "J32",
    J40_LP = "J40_LP",
    J40_HP = "J40_HP"
}

export enum ClampPartName {
    J40_J40 = "J40_J40",
    J40_J32 = "J40_J32",
    J32_J32 = "J32_J32",
    J32_J25 = "J32_J25",
    J25_J25 = "J25_J25",
    J25_J20 = "J25_J20",
    J20_J20 = "J20_J20",
    J20_J17 = "J20_J17",
    J17_J17 = "J17_J17"
}

export enum FlangePartName {
    J40 = "J40",
    J32 = "J32",
    J25 = "J25",
    J20 = "J20",
    J17 = "J17"
}

export enum LinkPartName {
    MM127_302 = "MM127_302",
    MM100_283 = "MM100_283"
}

export enum MonobraccioPartName {
    MM205 = "MM205",
    MM220 = "MM220",
    MM250 = "MM250"
}

export enum SpindlePartName {
    MM112 = "MM112"
}

export enum PartTypes {
    Bases = "bases",
    Joints = "joints",
    Clamps = "clamps",
    Flanges = "flanges",
    Links = "links",
    Monobraccios = "monobraccios",
    Spindles = "spindles"
}

/** These are all the parts that are available from which to assemble AW arms - it is the parts library
 * As well as the filenames for the 3D models, it also contains key dimensions for each part.
 * These dimensions are used to calculate the position of each part in the robot arm.
 * If you add a new part, you will need to add the filename and the dimensions.
 * */
export const awPartDataLibrary: PartData = {
    [PartTypes.Bases]: {
        [BasePartName.MM219]: { filename: "base_219.glb", thickness: 25 },
        [BasePartName.MM169]: { filename: "base_169.glb" }
        //there are more bases, e.g. ones with a cable outlet
    },
    [PartTypes.Joints]: {
        [JointPartName.J17]: {
            filename: "joint_j17.glb"
        },
        [JointPartName.J20]: {
            filename: "joint_j20.glb",
            fixedFlangeFromCentreLine: 73,
            moveableFlangeFromCentreLine: 66
        },
        [JointPartName.J25]: {
            filename: "joint_j25.glb",
            fixedFlangeFromCentreLine: 91.5,
            moveableFlangeFromCentreLine: 87.4
        },
        [JointPartName.J32]: {
            filename: "joint_j32.glb",
            fixedFlangeFromCentreLine: 104.5,
            moveableFlangeFromCentreLine: 92
        },
        [JointPartName.J40_LP]: { filename: "joint_j40_lp.glb" },
        [JointPartName.J40_HP]: { filename: "joint_j40_hp.glb" }
    },
    [PartTypes.Clamps]: {
        [ClampPartName.J40_J40]: { filename: "clamp_j40_j40.glb" },
        [ClampPartName.J40_J32]: { filename: "clamp_j40_j32.glb" },
        [ClampPartName.J32_J32]: { filename: "clamp_j32_j32.glb", thickness: 50.5 },
        [ClampPartName.J32_J25]: { filename: "clamp_j32_j25.glb", thickness: 63.5 },
        [ClampPartName.J25_J25]: { filename: "clamp_j25_j25.glb" },
        [ClampPartName.J25_J20]: { filename: "clamp_j25_j20.glb" },
        [ClampPartName.J20_J20]: { filename: "clamp_j20_j20.glb" },
        [ClampPartName.J20_J17]: { filename: "clamp_j20_j17.glb" },
        [ClampPartName.J17_J17]: { filename: "clamp_j17_j17.glb" }
        //clamps connect joints to each other
        //assumes that you can't connect a J40 motor to a J17 motor
    },
    [PartTypes.Flanges]: {
        [FlangePartName.J40]: { filename: "flange_j40.glb" },
        [FlangePartName.J32]: {
            filename: "flange_j32.glb",
            offsetOfTubeInFlange: 7,
            thickness: 34
        },
        [FlangePartName.J25]: {
            filename: "flange_j25.glb",
            offsetOfTubeInFlange: 10.5,
            thickness: 34.5
        },
        [FlangePartName.J20]: { filename: "flange_j20.glb" },
        [FlangePartName.J17]: { filename: "flange_j17.glb" }
        //these are the flanges that connect to tubes (links)
        //these may need to reflect different tube sizes (100 and 127?)
    },
    [PartTypes.Links]: {
        [LinkPartName.MM127_302]: {
            filename: "link_127_302.glb",
            effectiveLength: 525,
            tubeLength: 300
        },
        [LinkPartName.MM100_283]: {
            filename: "link_100_283.glb",
            effectiveLength: 475,
            tubeLength: 283.1
        }
        //links have different diameters and different lengths
    },
    [PartTypes.Monobraccios]: {
        [MonobraccioPartName.MM205]: { filename: "monob_205.glb" },
        [MonobraccioPartName.MM250]: { filename: "monob_250.glb" },
        [MonobraccioPartName.MM220]: { filename: "monob_220.glb", effectiveLength: 220 }
        //a monobraccio connects J4 to J5 (zero indexed)
    },
    [PartTypes.Spindles]: {
        [SpindlePartName.MM112]: { filename: "spindle_112.glb" }
    }
}

/** Make-up of an AW robot arm:
 * each robot has:
 *     - base
 *
 *     - j0
 *
 *     - clamp 0
 *     - j1
 *     - flange 0
 *     - link 0
 *     - flange 1
 *     - clamp 1
 *     - j2
 *
 *     - clamp 2
 *     - j3
 *     - flange 2
 *     - link 1
 *     - flange 3
 *
 *     - j4
 *     - monobraccio
 *
 *      - j5
 *
 *      - spindle 0
 */

/** This is where we define which parts are used to assemble a specific robot arm (drawn from the parts library */
export const awMediumRobotArmParts: RobotArmPartsUsed = {
    [PartTypes.Bases]: [{ partName: BasePartName.MM219 }],
    [PartTypes.Joints]: [
        { partName: JointPartName.J32 },
        { partName: JointPartName.J32 },
        {
            partName: JointPartName.J32
        },
        { partName: JointPartName.J25 },
        { partName: JointPartName.J25 },
        {
            partName: JointPartName.J20
        }
    ],
    [PartTypes.Clamps]: [{ partName: ClampPartName.J32_J32 }, { partName: ClampPartName.J32_J25 }],
    [PartTypes.Flanges]: [
        { partName: FlangePartName.J32 },
        { partName: FlangePartName.J32 },
        {
            partName: FlangePartName.J25
        },
        { partName: FlangePartName.J25 }
    ],
    [PartTypes.Monobraccios]: [{ partName: MonobraccioPartName.MM220 }],
    [PartTypes.Links]: [
        { partName: LinkPartName.MM127_302 },
        {
            partName: LinkPartName.MM100_283
        }
    ],
    [PartTypes.Spindles]: [{ partName: SpindlePartName.MM112 }]
}
