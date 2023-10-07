/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { useState } from "react"
import { JointDro, JointDroValue } from "./JointDro"
import { useKinematicsConfiguration, useKinematicsConfigurationList } from "@glowbuzzer/store"
import { useLocalStorage } from "../util/LocalStorageHook"
import { KinematicsDropdown } from "../kinematics/KinematicsDropdown"
import { DockTileWithToolbar } from "../dock/DockTileWithToolbar"
import { StyledTileContent } from "../util/styles/StyledTileContent"
import { PrecisionToolbarButtonGroup } from "../util/components/PrecisionToolbarButtonGroup"
import { Radio } from "antd"

/**
 * The joint DRO tile displays all configured joints with joint position.
 * If the joint is finite, a read-only slider will be displayed next to the joint position.
 *
 * If the joint has negative and positive limits and the current position is close to or beyond a limit, the
 * value will be highlighted in red.
 */
export const JointDroTile = () => {
    const [selectedKc, setSelectedKc] = useLocalStorage("dro.joint.kc", 0)
    const [precision, setPrecision] = useLocalStorage("dro.joint.precision", 4)
    const [valueToDisplay, setValueToDisplay] = useState(JointDroValue.POS)

    const kcs = useKinematicsConfigurationList()
    const kc = useKinematicsConfiguration(selectedKc)
    const jointsToDisplay = kc.participatingJoints

    const update_value = (e: any) => {
        setValueToDisplay(e.target.value)
    }

    return (
        <DockTileWithToolbar
            toolbar={
                <>
                    {kcs.length > 1 && (
                        <KinematicsDropdown value={selectedKc} onChange={setSelectedKc} />
                    )}

                    <Radio.Group
                        size="small"
                        value={valueToDisplay}
                        buttonStyle="solid"
                        onChange={update_value}
                    >
                        <Radio.Button value={JointDroValue.POS}>Pos</Radio.Button>
                        <Radio.Button value={JointDroValue.VEL}>Vel</Radio.Button>
                        <Radio.Button value={JointDroValue.TORQUE}>Torque</Radio.Button>
                    </Radio.Group>

                    <PrecisionToolbarButtonGroup value={precision} onChange={setPrecision} />
                </>
            }
        >
            <StyledTileContent>
                <JointDro
                    warningThreshold={0.01}
                    jointsToDisplay={jointsToDisplay}
                    precision={precision}
                    value={valueToDisplay}
                />
            </StyledTileContent>
        </DockTileWithToolbar>
    )
}
