import { awMediumRobotArmParts, awPartDataLibrary, PartInfoKey, PartTypes } from "./PartData"
import { getPartProperty } from "./GetPartProperty"

const robotArmPartsUsed = awMediumRobotArmParts

//set the object that contains the library of parts
const robotArmPartsLib = awPartDataLibrary

export const partTranslations = {
    /*
        base0Translation:
        z pos:
            base thickness
     */
    base0Translation: [
        0,
        0,
        (getPartProperty(
            robotArmPartsUsed,
            robotArmPartsLib,
            PartTypes.Bases,
            0,
            PartInfoKey.Thickness
        ) as number) +
            (getPartProperty(
                robotArmPartsUsed,
                robotArmPartsLib,
                PartTypes.Joints,
                0,
                PartInfoKey.MoveableFlangeFromCentreLine
            ) as number)
    ],
    /*
            j0Translation:
            z pos:
                joint 0 moveable flange from centre line
     */
    j0Translation: [
        0,
        0,
        getPartProperty(
            robotArmPartsUsed,
            robotArmPartsLib,
            PartTypes.Joints,
            0,
            PartInfoKey.MoveableFlangeFromCentreLine
        ) as number
    ],
    //todo
    clamp0Translation: [0, 0, 0],

    /*
        j1Translation:
        x pos:
            clamp 0 thickness +
            joint 0 moveable flange from centre line
     */
    j1Translation: [
        (getPartProperty(
            robotArmPartsUsed,
            robotArmPartsLib,
            PartTypes.Clamps,
            0,
            PartInfoKey.Thickness
        ) as number) +
            (getPartProperty(
                robotArmPartsUsed,
                robotArmPartsLib,
                PartTypes.Joints,
                0,
                PartInfoKey.MoveableFlangeFromCentreLine
            ) as number),
        0,
        0
    ],

    /*
        flange0Translation:
        x pos:
            joint 1 moveable flange from centre line +
            clamp 0 thickness
          y pos:
            joint 1 fixed flange from centre line
     */

    flange0Translation: [
        (getPartProperty(
            robotArmPartsUsed,
            robotArmPartsLib,
            PartTypes.Joints,
            1,
            PartInfoKey.MoveableFlangeFromCentreLine
        ) as number) +
            (getPartProperty(
                robotArmPartsUsed,
                robotArmPartsLib,
                PartTypes.Clamps,
                0,
                PartInfoKey.Thickness
            ) as number),
        getPartProperty(
            robotArmPartsUsed,
            robotArmPartsLib,
            PartTypes.Joints,
            1,
            PartInfoKey.FixedFlangeFromCentreLine
        ) as number,
        0
    ],

    //todo should x be on link 0?
    //this is wrong
    /*
        link0Translation:
        x pos:
            joint 1 moveable flange from centre line +
clamp 0 thickness

        y pos:
            joint 1 fixed flange from centre line +
            link 0 length

     */
    link0Translation: [
        (getPartProperty(
            robotArmPartsUsed,
            robotArmPartsLib,
            PartTypes.Joints,
            0,
            PartInfoKey.MoveableFlangeFromCentreLine
        ) as number) +
            (getPartProperty(
                robotArmPartsUsed,
                robotArmPartsLib,
                PartTypes.Clamps,
                0,
                PartInfoKey.Thickness
            ) as number),
        getPartProperty(
            robotArmPartsUsed,
            robotArmPartsLib,
            PartTypes.Joints,
            1,
            PartInfoKey.FixedFlangeFromCentreLine
        ) as number,
        0
    ],

    /*
        flange1Translation:
        x pos:
            joint 0 moveable flange from centre line +
            clamp 0 thickness
        y pos:
            joint 1 fixed flange from centre line +


     */
    flange1Translation: [
        (getPartProperty(
            robotArmPartsUsed,
            robotArmPartsLib,
            PartTypes.Joints,
            0,
            PartInfoKey.MoveableFlangeFromCentreLine
        ) as number) +
            (getPartProperty(
                robotArmPartsUsed,
                robotArmPartsLib,
                PartTypes.Clamps,
                0,
                PartInfoKey.Thickness
            ) as number),
        (getPartProperty(
            robotArmPartsUsed,
            robotArmPartsLib,
            PartTypes.Joints,
            1,
            PartInfoKey.FixedFlangeFromCentreLine
        ) as number) +
            (getPartProperty(
                robotArmPartsUsed,
                robotArmPartsLib,
                PartTypes.Flanges,
                0,
                PartInfoKey.OffsetOfTubeInFlange
            ) as number),
        0
    ],
    clamp1Translation: [
        getPartProperty(
            robotArmPartsUsed,
            robotArmPartsLib,
            PartTypes.Clamps,
            1,
            PartInfoKey.Thickness
        ) as number,
        0,
        0
    ],
    j2Translation: [
        (getPartProperty(
            robotArmPartsUsed,
            robotArmPartsLib,
            PartTypes.Joints,
            0,
            PartInfoKey.MoveableFlangeFromCentreLine
        ) as number) +
            (getPartProperty(
                robotArmPartsUsed,
                robotArmPartsLib,
                PartTypes.Clamps,
                0,
                PartInfoKey.Thickness
            ) as number),
        (getPartProperty(
            robotArmPartsUsed,
            robotArmPartsLib,
            PartTypes.Joints,
            1,
            PartInfoKey.FixedFlangeFromCentreLine
        ) as number) +
            (getPartProperty(
                robotArmPartsUsed,
                robotArmPartsLib,
                PartTypes.Flanges,
                0,
                PartInfoKey.OffsetOfTubeInFlange
            ) as number) +
            (getPartProperty(
                robotArmPartsUsed,
                robotArmPartsLib,
                PartTypes.Links,
                0,
                PartInfoKey.TubeLength
            ) as number) +
            ((getPartProperty(
                robotArmPartsUsed,
                robotArmPartsLib,
                PartTypes.Flanges,
                1,
                PartInfoKey.OffsetOfTubeInFlange
            ) as number) +
                (getPartProperty(
                    robotArmPartsUsed,
                    robotArmPartsLib,
                    PartTypes.Joints,
                    2,
                    PartInfoKey.FixedFlangeFromCentreLine
                ) as number)),
        0
    ],
    j3Translation: [
        -getPartProperty(
            robotArmPartsUsed,
            robotArmPartsLib,
            PartTypes.Joints,
            3,
            PartInfoKey.FixedFlangeFromCentreLine
        ) as number,
        0,
        0
    ],

    /* flange2Translation:
        y pos:
            joint 3 moveable flange from centre line

     */
    flange2Translation: [
        0,
        getPartProperty(
            robotArmPartsUsed,
            robotArmPartsLib,
            PartTypes.Joints,
            3,
            PartInfoKey.MoveableFlangeFromCentreLine
        ) as number,
        0
    ],

    /* link1Translation:

        y pos:
            joint 3 moveable flange from centre line +
            tube offset in flange 2
    */
    link1Translation: [
        0,
        (getPartProperty(
            robotArmPartsUsed,
            robotArmPartsLib,
            PartTypes.Flanges,
            2,
            PartInfoKey.OffsetOfTubeInFlange
        ) as number) +
            (getPartProperty(
                robotArmPartsUsed,
                robotArmPartsLib,
                PartTypes.Joints,
                3,
                PartInfoKey.MoveableFlangeFromCentreLine
            ) as number),
        0
    ],

    /* flange3Translation:
        y pos:
            joint 3 moveable flange from centre line +
            tube offset in flange 2 +
            tube length link 1
            - (flange 3 thickness - tube offset in flange 3)
     */
    flange3Translation: [
        0,
        (getPartProperty(
            robotArmPartsUsed,
            robotArmPartsLib,
            PartTypes.Joints,
            3,
            PartInfoKey.MoveableFlangeFromCentreLine
        ) as number) +
            (getPartProperty(
                robotArmPartsUsed,
                robotArmPartsLib,
                PartTypes.Flanges,
                2,
                PartInfoKey.OffsetOfTubeInFlange
            ) as number) +
            (getPartProperty(
                robotArmPartsUsed,
                robotArmPartsLib,
                PartTypes.Links,
                1,
                PartInfoKey.TubeLength
            ) as number),
        (getPartProperty(
            robotArmPartsUsed,
            robotArmPartsLib,
            PartTypes.Flanges,
            3,
            PartInfoKey.Thickness
        ) as number) -
            (getPartProperty(
                robotArmPartsUsed,
                robotArmPartsLib,
                PartTypes.Flanges,
                3,
                PartInfoKey.OffsetOfTubeInFlange
            ) as number),
        0
    ],

    /* j4Translation:
        y pos:
        this is the effective length of the link 1
     */
    j4Translation: [
        0,
        getPartProperty(
            robotArmPartsUsed,
            robotArmPartsLib,
            PartTypes.Links,
            1,
            PartInfoKey.EffectiveLength
        ) as number,
        0
    ],

    /* monobraccioOTranslation:
        x pos:
            moveable flange from centre line of joint 4
     */

    monobraccioOTranslation: [
        getPartProperty(
            robotArmPartsUsed,
            robotArmPartsLib,
            PartTypes.Joints,
            4,
            PartInfoKey.MoveableFlangeFromCentreLine
        ) as number,
        0,
        0
    ],
    clamp4Translation: [0, 0, 0],

    /* j5Translation:
        y pos:
            effective length of monobraccio
    
     */
    j5Translation: [
        0,
        getPartProperty(
            robotArmPartsUsed,
            robotArmPartsLib,
            PartTypes.Monobraccios,
            0,
            PartInfoKey.EffectiveLength
        ) as number,
        0
    ],
    spindle0Translation: [0, 0, 0]
}

export const partRotations = {
    base0Rotation: [Math.PI / 2, 0, 0],
    j0Rotation: [-Math.PI / 2, 0, 0],
    clamp0Rotation: [0, 0, Math.PI / 2],
    j1Rotation: [0, 0, Math.PI / 2],
    flange0Rotation: [Math.PI, 0, 0],
    link0Rotation: [Math.PI, 0, 0],
    flange1Rotation: [0, 0, 0],
    clamp1Rotation: [0, 0, Math.PI / 2],
    j2Rotation: [Math.PI, 0, Math.PI / 2],
    clamp2Rotation: [0, 0, 0],
    j3Rotation: [0, 0, 0],
    flange2Rotation: [0, 0, Math.PI],
    link1Rotation: [Math.PI, 0, 0],
    flange3Rotation: [0, Math.PI, 0],
    j4Rotation: [0, 0, -Math.PI / 2],
    monobraccioORotation: [Math.PI, 0, Math.PI / 2],
    j5Rotation: [0, 0, 0],
    spindle0Rotation: [0, 0, 0]
}
