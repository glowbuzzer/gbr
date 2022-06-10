import React, { FC, ReactNode, useState } from "react"
import styled, { css } from "styled-components"
import { Popover } from "antd"
import { QuestionCircleOutlined } from "@ant-design/icons"
import { tileContext } from "./TileContext"

type TileProps = {
    title
    fullHeight?
    help?
    footer?
    controls?
    settings?
    children?: ReactNode
}

const StyledTile = styled.div<{ fullHeight: boolean }>`
    display: flex;
    flex-direction: column;
    ${props =>
        props.fullHeight &&
        css`
            height: 100%;
        `}
    border: 1px solid #cccccc;
    border-radius: 5px;

    > .title {
        display: flex;
        align-items: center;
        padding: 4px 8px;
        border-bottom: 1px solid #cccccc;

        .text {
            flex-grow: 1;
            color: grey;
            font-size: 1.1em;
        }
    }

    .draggable {
        cursor: grab;
    }

    .title .help {
        display: none;
    }

    .title:hover .help {
        padding: 0 6px;
        cursor: default;
        display: inline-block;
    }

    > .content {
        padding: 4px 8px;
        flex-grow: 1;
        overflow-y: auto;
        overflow-x: hidden;

        &::-webkit-scrollbar {
            width: 10px;
        }

        &::-webkit-scrollbar-track {
            background: #f1f1f1;
        }

        &::-webkit-scrollbar-thumb {
            background: #dbdbdb;
        }

        &::-webkit-scrollbar-thumb:hover {
            background: #acacac;
        }
    }

    > .footer {
        padding: 4px 8px;
        border-top: 1px solid #cccccc;
    }

    .controls {
        button {
            border-radius: 5px;
        }
    }
`

export const Tile: FC<TileProps> = ({
    title,
    controls = undefined,
    settings = null,
    footer = undefined,
    help = undefined,
    fullHeight = true,
    children
}) => {
    const [showSettings, setShowSettings] = useState(false)

    return (
        <StyledTile fullHeight={fullHeight}>
            <tileContext.Provider value={{ showSettings, setShowSettings }}>
                <div className="title">
                    <div className="text draggable">
                        {title}
                        {help && (
                            <span className="help">
                                <Popover content={help} placement="bottom">
                                    <QuestionCircleOutlined style={{ color: "#8c8c8c" }} />
                                </Popover>
                            </span>
                        )}
                    </div>
                    {controls && <div className="controls">{controls}</div>}
                    {settings && <div className="settings">{settings}</div>}
                </div>
                <div className="content">{children}</div>
                {footer && <div className="footer">{footer}</div>}
            </tileContext.Provider>
        </StyledTile>
    )
}
