import { PreferencesDialog, useDockViewMenu } from "@glowbuzzer/controls"
import { Menu } from "antd"
import * as React from "react"
import { useEffect, useState } from "react"
import styled from "styled-components"
import { ItemType } from "antd/es/menu/hooks/useItems"
import { AwTubeModel, useAwTubeModel } from "./model/ModelProvider"
import { useConfigLoader } from "@glowbuzzer/store"

const StyledDiv = styled.div`
    display: flex;

    .title {
        padding-top: 9px;
        padding-right: 20px;
        font-size: 1.5em;
        border-bottom: 1px solid ${props => props.theme.colorBorderSecondary};
    }

    .ant-menu {
        flex-grow: 1;
    }
`

export const AppMenu = () => {
    const viewMenu = useDockViewMenu()
    const [showPrefs, setShowPrefs] = useState(false)
    const loader = useConfigLoader()
    const { config, changeModel } = useAwTubeModel()

    useEffect(() => {
        loader(config, true).then(() => {
            console.log("switched")
        })
    }, [config])

    function switch_l() {
        changeModel(AwTubeModel.AWTUBE_L)
    }

    function switch_l2() {
        changeModel(AwTubeModel.AWTUBE_L2)
    }

    const menuItems: ItemType[] = [
        {
            key: "file",
            label: "File",
            children: [
                {
                    key: "file-preferences",
                    label: "Preferences",
                    onClick: () => setShowPrefs(true)
                }
            ]
        },
        {
            key: "model",
            label: "AwTube Models",
            children: [
                {
                    key: "awtube-l",
                    label: "AwTube L",
                    onClick: switch_l
                },
                {
                    key: "awtube-l2",
                    label: "AwTube L2",
                    onClick: switch_l2
                }
            ]
        },
        viewMenu
    ]

    return (
        <StyledDiv>
            <PreferencesDialog open={showPrefs} onClose={() => setShowPrefs(false)} />
            <div className="title">AutomationWare URDF Visualisation</div>
            <Menu mode="horizontal" selectedKeys={[]} items={menuItems} />
        </StyledDiv>
    )
}
