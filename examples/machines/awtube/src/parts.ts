/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import {
    PartDefinitionForBase,
    PartDefinitionForClamp,
    PartDefinitionForFlange,
    PartDefinitionForJoint,
    PartDefinitionForLink,
    PartDefinitionForMonobraccio,
    PartDefinitionForSpindle
} from "./types"

export const Base: Record<string, PartDefinitionForBase> = {
    MM219: {
        name: "MM219",
        filename: "bases/base_219.glb",
        // translation: [0, 0, 0.025],
        thickness: 0.025
    }
}
export const Joint: Record<string, PartDefinitionForJoint> = {
    J32: {
        name: "J32",
        filename: "joints/joint_j32.glb",
        // translation: [0.1045, 0.092, 0],
        fixedFlangeFromCentreLine: 0.1045,
        moveableFlangeFromCentreLine: 0.092
    },
    J25: {
        name: "J25",
        filename: "joints/joint_j25.glb",
        // translation: [0.0915, 0.0874, 0],
        fixedFlangeFromCentreLine: 0.0915,
        moveableFlangeFromCentreLine: 0.0874
    },
    J20: {
        name: "J20",
        filename: "joints/joint_j20.glb",
        // translation: [0.073, 0.063, 0],
        fixedFlangeFromCentreLine: 0.073,
        moveableFlangeFromCentreLine: 0.063
    }
}
export const Clamp: Record<string, PartDefinitionForClamp> = {
    J32_J32: {
        name: "J32_J32",
        filename: "clamps/clamp_j32_j32.glb",
        // translation: [0.0505, 0, 0],
        thickness: 0.0505
    },
    J32_J25: {
        name: "J32_J25",
        filename: "clamps/clamp_j32_j25.glb",
        // translation: [0.0635, 0, 0],
        thickness: 0.0635
    }
}
export const Flange: Record<string, PartDefinitionForFlange> = {
    J32: {
        name: "J32",
        filename: "flanges/flange_j32.glb",
        // translation: [0, 0.007, 0],
        offset: 0.007
    },
    J25: {
        name: "J25",
        filename: "flanges/flange_j25.glb",
        // translation: [0, 0.0105, 0],
        offset: 0.0105
    }
}
export const Link: Record<string, PartDefinitionForLink> = {
    MM127_302: {
        name: "MM127_302",
        filename: "links/link_127_302.glb",
        // translation: [0, 0.3, 0],
        length: 0.3
    },
    MM100_283: {
        name: "MM100_283",
        filename: "links/link_100_283.glb",
        // translation: [0, 0.2831, 0],
        length: 0.2831
    }
}
export const Monobraccio: Record<string, PartDefinitionForMonobraccio> = {
    M220: {
        name: "M220",
        filename: "monobraccios/monob_220.glb",
        // translation: [-0.023, 0.22, 0],
        length: 0.22,
        offset: 0.023
    }
}
export const Spindle: Record<string, PartDefinitionForSpindle> = {
    M112: {
        name: "M112",
        filename: "spindles/spindle_112.glb",
        // translation: [0, 0.045, 0],
        thickness: 0.045
    }
}
