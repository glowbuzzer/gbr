/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { Tile } from "../tiles"
import * as React from "react"
import { JointDro } from "./JointDro"
import { Select } from "antd"
import { useKinematicsConfigurationList } from "@glowbuzzer/store"
import { useLocalStorage } from "../util/LocalStorageHook"

const help = (
    <div>
        <h4>Joint DRO Tile</h4>
        <p>
            The Joint DRO Tile shows the positions of all the joints across all kinematics
            configurations (kcs).
        </p>
        <p>
            The position is shown in linear units (mm/inches) for prismatic joints and rotary units
            (deg/radians) for revolute (rotary) joints{" "}
        </p>
        <p>
            If the joint has been configured with a <code>negLimit</code> and <code>posLimit</code>{" "}
            in the config then a slider bar{" "}
        </p>
        <p>will be shown showing the extents of its allowed travel.</p>
        <p>The preferences menu can be used to select what linear and angular units are shown.</p>
    </div>
)

/**
 * The joint DRO tile displays all configured joints with joint position.
 * If the joint is finite, a read-only slider will be displayed next to the joint position.
 *
 * If the joint has negative and positive limits and the current position is close to or beyond a limit, the
 * value will be highlighted in red.
 */
export const JointDroTile = () => {
    const [selectedKc, setSelectedKc] = useLocalStorage("dro.joint.kc", "all")

    const kcs = useKinematicsConfigurationList()
    const jointsToDisplay = kcs[selectedKc]
        ? kcs[Number(selectedKc)].participatingJoints
        : undefined

    return (
        <Tile title="Joint DRO" help={help}>
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
            <JointDro warningThreshold={0.05} jointsToDisplay={jointsToDisplay} />
        </Tile>
    )
}
