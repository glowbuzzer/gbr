/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { useEffect } from "react"
import { useCustomLinkLengths } from "./store"
import { KinematicsConfigurationConfig, useConfig, useConfigLoader } from "@glowbuzzer/store"
import { Button, Slider, message } from "antd"
import styled from "styled-components"

const StyledDiv = styled.div`
    padding: 10px;

    p {
        margin: 10px 0;
    }
    > div {
        display: flex;
        align-items: center;
        font-weight: bold;
        .ant-slider {
            flex: 1;
        }
    }
`

/**
 * This component is used to edit the link lengths of the robot.
 */
export const LinkLengthTile = () => {
    const { kinematicsConfiguration } = useConfig()
    const kc = kinematicsConfiguration[0]

    // we are only interested in a couple of values from the DH matrix (the link lengths)
    const [, , , , , , , , l1, , , , , , , , , , , l2] = kc.kinChainParams.data

    // these are the app-controlled link lengths
    const [linkLengths, setLinkLengths] = useCustomLinkLengths()

    // the loader is used to update the configuration in GBC
    const loader = useConfigLoader()

    // if the link lengths are changed in the GBC config, we need to update our app state
    // (since the config is the master)
    useEffect(() => {
        setLinkLengths([l1, l2])
    }, [l1, l2])

    function set(v, l) {
        // selectively update the lengths with the given link length
        setLinkLengths(linkLengths.map((current, i) => (i === l ? v : current)))
    }

    const [c1, c2] = linkLengths

    /**
     * This function is used to update the configuration in GBC.
     * It is called when the user clicks the "Update Kinematics" button.
     * It patches the DH matrix with the new link lengths and sends it to GBC.
     */
    function apply() {
        const data = [
            ...kc.kinChainParams.data.slice(0, 8),
            c1,
            ...kc.kinChainParams.data.slice(9, 19),
            c2,
            ...kc.kinChainParams.data.slice(20)
        ]
        const newKcConfig: KinematicsConfigurationConfig = {
            ...kc,
            kinChainParams: {
                ...kc.kinChainParams,
                data
            }
        }

        // Send the new configuration to GBC
        loader({
            kinematicsConfiguration: [newKcConfig]
        }).then(() => message.success("Configuration updated"))
    }

    return (
        <StyledDiv>
            <div>
                Link 1
                <Slider
                    value={c1}
                    min={0}
                    max={1000}
                    tooltip={{ formatter: null }}
                    onChange={v => set(v, 0)}
                />
                {c1} mm
            </div>
            <div>
                Link 2
                <Slider
                    value={c2}
                    min={0}
                    max={1000}
                    tooltip={{ formatter: null }}
                    onChange={v => set(v, 1)}
                />
                {c2} mm
            </div>
            <p>
                Note that the link lengths are only updated in the kinematics you click the "Update
                Kinematics" button. You need to do this before executing a move after changing the
                link lengths.
            </p>
            <Button size="small" onClick={apply}>
                Update Kinematics
            </Button>
        </StyledDiv>
    )
}
