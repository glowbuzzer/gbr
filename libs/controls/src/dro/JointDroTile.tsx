/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { JointDro } from "./JointDro"
import { useKinematicsConfiguration } from "@glowbuzzer/store"
import { useLocalStorage } from "../util/LocalStorageHook"
import { KinematicsDropdown } from "../kinematics/KinematicsDropdown"
import { DockTileWithToolbar } from "../dock/DockTileWithToolbar"
import { StyledTileContent } from "../util/styles/StyledTileContent"

/**
 * The joint DRO tile displays all configured joints with joint position.
 * If the joint is finite, a read-only slider will be displayed next to the joint position.
 *
 * If the joint has negative and positive limits and the current position is close to or beyond a limit, the
 * value will be highlighted in red.
 */
export const JointDroTile = () => {
    const [selectedKc, setSelectedKc] = useLocalStorage("dro.joint.kc", 0)

    const kc = useKinematicsConfiguration(selectedKc)
    const jointsToDisplay = kc.participatingJoints

    return (
        <DockTileWithToolbar
            toolbar={<KinematicsDropdown value={selectedKc} onChange={setSelectedKc} />}
        >
            {/*
            Kinematics:{" "}
            <Select
                size="small"
                value={selectedKc}
                onChange={setSelectedKc}
                style={{ width: 120 }}
                options={[
                    { title: "All joints", value: "all" },
                    ...kcs.map((kc, index) => ({ title: kc.name, value: index }))
                ]}
            />
*/}
            <StyledTileContent>
                <JointDro warningThreshold={0.05} jointsToDisplay={jointsToDisplay} />
            </StyledTileContent>
        </DockTileWithToolbar>
    )
}
