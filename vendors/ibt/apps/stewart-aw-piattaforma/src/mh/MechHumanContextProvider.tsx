/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { load_jaw_motion, TriangulatedPoint } from "./motion"
import { createContext, useContext, useState } from "react"
import JSZip from "jszip"
import { STLLoader } from "three-stdlib"
import { BufferGeometry } from "three"
import { XMLParser } from "fast-xml-parser"

type MechHumanContextType = {
    points: TriangulatedPoint[]
    upperJaw: BufferGeometry
    upperPosition: TriangulatedPoint
    lowerJaw: BufferGeometry
    openProject(buffer: ArrayBuffer): Promise<void>
}

const MechHumanContext = createContext<MechHumanContextType>(null)

/**
 * Provides state that is shared between all tiles, and provides the openProject function to load a project.
 * Sharing state is necessary because the 3D scene tile needs access to the loaded STL files.
 */
export const MechHumanContextProvider = ({ children }) => {
    const [state, setState] = useState<
        Pick<MechHumanContextType, "points" | "upperJaw" | "upperPosition" | "lowerJaw">
    >({
        points: [],
        upperPosition: null,
        upperJaw: null,
        lowerJaw: null
    })

    /**
     * Loads a project from a zip file buffer. Looks for .jawMotion file and the two .stl files.
     */
    async function openProject(buffer: ArrayBuffer) {
        const loader = new JSZip()
        const zip = await loader.loadAsync(buffer)
        // TODO: L: we don't really need to load all the entries to arraybuffer, only the files we want
        const entries = await Promise.all(
            Object.entries(zip.files).map(async ([relativePath, zipEntry]) => {
                const buffer = await zipEntry.async("arraybuffer")
                return { relativePath, buffer }
            })
        )

        const jaw_motion_file = entries.find(e => e.relativePath.endsWith(".jawMotion"))
        if (!jaw_motion_file) {
            throw new Error("No jawMotion file found in project zip")
        }

        // parse the XML to JSON object
        const text = new TextDecoder().decode(jaw_motion_file.buffer)
        const parser = new XMLParser()
        const jaw_motion_xml = parser.parse(text)
        // and interpret it
        const { upperPosition, points } = load_jaw_motion(jaw_motion_xml)

        const case_id = jaw_motion_file.relativePath.split("/").pop().split(".")[0]

        const lower_jaw = entries.find(e => e.relativePath === `${case_id}-LowerJaw_model.stl`)
        const upper_jaw = entries.find(e => e.relativePath === `${case_id}-UpperJaw_model.stl`)

        // parse the STL files using STLLoader
        const lower_jaw_geom = new STLLoader().parse(lower_jaw.buffer)
        const upper_jaw_geom = new STLLoader().parse(upper_jaw.buffer)

        setState({
            points,
            upperPosition,
            upperJaw: upper_jaw_geom,
            lowerJaw: lower_jaw_geom
        })
    }

    const context = {
        ...state,
        openProject
    }

    return <MechHumanContext.Provider value={context}>{children}</MechHumanContext.Provider>
}

export function useMechHumanContext() {
    return useContext(MechHumanContext)
}
