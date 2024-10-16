/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import styled, { css } from "styled-components"
import { useStatusTrayVisible } from "./StatusTrayProvider"
import { StatusTrayModifiedConfiguration } from "./StatusTrayModifiedConfiguration"
import { StatusTrayFaults } from "./StatusTrayFaults"
import { StatusTrayGbcVersionCheck } from "./StatusTrayGbcVersionCheck"
import { StatusTrayModeSwitch } from "./StatusTrayModeSwitch"
import { StatusTrayConnect } from "./StatusTrayConnect"
import { useEffect, useState } from "react"
import { StatusTraySafetyErrors } from "./StatusTraySafetyErrors"
import { DownCircleOutlined, UpCircleOutlined } from "@ant-design/icons"
import { StatusTrayKinematicsConstraint } from "./StatusTrayKinematicsConstraint"
import { StatusTrayQuickStopIndicator } from "./StatusTrayQuickStopIndicator"

const StyledDiv = styled.div<{ $visible: boolean; $collapsed: boolean; $bottomOffset: number }>`
    position: absolute;
    z-index: 500;
    bottom: ${props => `calc(100vh - ${props.$bottomOffset}px + 1px)`};
    // top: ${props => `${props.$bottomOffset}px`};
    //bottom: 40px;
    left: 0;
    width: 100vw;
    pointer-events: none;
    display: ${props => (props.$visible ? "block" : "none")};

    .tray-interactive {
        .tray-header {
            text-align: center;
            transform: translate(0, ${props => (props.$collapsed ? "0" : "3px")});
            opacity: 0.8;

            &:hover {
                opacity: 1;
            }

            .button {
                pointer-events: all;
                display: inline-block;
                padding: 6px 12px 4px 12px;
                border: 3px solid ${props => props.theme.colorWarningBorder};
                box-shadow: 0 0 15px 3px ${props => props.theme.colorWarningBorder}; /* Glow effect */
                border-radius: 12px 12px 0 0;
                border-bottom: 3px solid ${props => props.theme.colorBgContainer};
                background: ${props => props.theme.colorBgContainer};

                //width: 100px;
            }
        }

        .tray {
            pointer-events: all;
            ${props =>
                props.$collapsed
                    ? css`
                          width: 60px;
                          min-height: 38px;
                      `
                    : css`
                          width: 50%;
                          min-width: 500px;
                      `}
            margin: 0 auto;
            height: 100%;
            border: 3px solid ${props => props.theme.colorWarningBorder};
            background: ${props => props.theme.colorBgContainer};
            max-height: ${props => `${props.$bottomOffset - 4}px`};
            overflow-y: auto;
            border-radius: 14px;
            box-shadow: 0 0 15px 3px ${props => props.theme.colorWarningBorder}; /* Glow effect */

            .tray-items.hidden {
                display: none;
            }
        }

        .tray.hidden {
            display: none;
        }
    }
`

type StatusTrayProps = {
    statusBarRef: React.RefObject<HTMLDivElement>
}

/**
 * Status tray at the bottom of the screen, which will appear if there are any notifications active
 */
export const StatusTray = ({ statusBarRef }: StatusTrayProps) => {
    const visible = useStatusTrayVisible()
    const [bottomOffset, setBottomOffset] = useState(0)
    const [collapsed, setCollapsed] = useState(false)

    useEffect(() => {
        // ensure tray is expanded when it becomes visible, so that operator does not miss important information
        if (visible) {
            setCollapsed(false)
        }
    }, [visible])

    useEffect(() => {
        if (statusBarRef.current) {
            function handle_resize(entries: ResizeObserverEntry[]) {
                const entry = entries[0]
                if (entry) {
                    const rect = entry.target.getBoundingClientRect()
                    setBottomOffset(rect.top)
                }
            }

            const observer = new ResizeObserver(handle_resize)
            observer.observe(statusBarRef.current)
            return () => {
                observer.disconnect()
            }
        }
    }, [statusBarRef])

    return (
        <StyledDiv $visible={visible} $collapsed={collapsed} $bottomOffset={bottomOffset}>
            <div className="tray-interactive">
                <div className="tray-header" onClick={() => setCollapsed(v => !v)}>
                    <span className="button">
                        {collapsed ? <UpCircleOutlined /> : <DownCircleOutlined />}
                    </span>
                </div>
                <div className={collapsed ? "tray hidden" : "tray"}>
                    <div className={collapsed ? "tray-items hidden" : ""}>
                        <StatusTrayQuickStopIndicator />
                        <StatusTrayKinematicsConstraint />
                        <StatusTraySafetyErrors />
                        <StatusTrayConnect />
                        <StatusTrayModeSwitch />
                        <StatusTrayModifiedConfiguration />
                        <StatusTrayFaults />
                        <StatusTrayGbcVersionCheck />
                    </div>
                </div>
            </div>
        </StyledDiv>
    )
}
