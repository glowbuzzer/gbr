import React, { FC, useContext, useState } from "react"
import styled from "styled-components"
import { Button, Modal } from "antd"
import { EditOutlined } from "@ant-design/icons"
import { tileContext } from "./TileContext"

type TileSettingsProps = {
    title?: string
    onConfirm(): void
    onReset?(): void
}

export const TileSettings: FC<TileSettingsProps> = ({ title, onConfirm, onReset, children }) => {
    const { showSettings, setShowSettings } = useContext(tileContext)

    function cancel() {
        if (onReset) {
            onReset()
        }
        setShowSettings(false)
    }

    function ok() {
        onConfirm()
        setShowSettings(false)
    }

    return (
        <>
            <Button onClick={() => setShowSettings(!showSettings)} icon={<EditOutlined />} />
            <Modal title={title} visible={showSettings} onCancel={cancel} onOk={ok}>
                {children}
            </Modal>
        </>
    )
}

type TileProps = {
    title
    footer?
    controls?
    settings?
}

const StyledTile = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    border: 1px solid ${props => props.theme.colors.border};
    border-radius: 5px;
    > .title {
        display: flex;
        align-items: center;
        padding: 4px 8px;
        border-bottom: 1px solid
            ${props => {
                return props.theme.colors.border
            }};
        .text {
            flex-grow: 1;
            color: grey;
            font-size: 1.1em;
        }
    }
    .draggable {
        cursor: grab;
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
        border-top: 1px solid ${props => props.theme.colors.border};
    }
    .controls {
        button {
            border-radius: 5px;
        }
    }
`

export const Tile: FC<TileProps> = ({ title, controls = undefined, settings = null, footer = undefined, children }) => {
    const [showSettings, setShowSettings] = useState(false)

    return (
        <StyledTile>
            <tileContext.Provider value={{ showSettings, setShowSettings }}>
                <div className="title">
                    <div className="text draggable">{title}</div>
                    {controls && <div className="controls">{controls}</div>}
                    {settings && <div className="settings">{settings}</div>}
                </div>
                <div className="content">{children}</div>
                {footer && <div className="footer">{footer}</div>}
            </tileContext.Provider>
        </StyledTile>
    )
}
