import React, { createContext, CSSProperties, FC, useContext, useState } from "react"
import styled from "styled-components"
import { Button, Modal } from "antd"
import { EditOutlined } from "@ant-design/icons"

type TileContextType = {
    showSettings: boolean
    setShowSettings(value: boolean): void
}

const tileContext = createContext<TileContextType>(null)

type TileSettingsProps = {
    onConfirm(): void
}

export const TileSettings: FC<TileSettingsProps> = ({ onConfirm, children }) => {
    const { showSettings, setShowSettings } = useContext(tileContext)
    return (
        <>
            <Button onClick={() => setShowSettings(!showSettings)} icon={<EditOutlined />} />
            <Modal visible={showSettings} onCancel={() => setShowSettings(false)} onOk={onConfirm}>
                {children}
            </Modal>
        </>
    )
}

type TileProps = {
    title?
    className?: string
    style?: CSSProperties
    footer?
    controls?
    settings?
}

const _Tile: FC<TileProps> = ({
    title,
    controls = undefined,
    settings = null,
    footer = undefined,
    className = "",
    style = {},
    children,
    ...props
}) => {
    const [showSettings, setShowSettings] = useState(false)

    return (
        <div {...props} className={"widget " + className} style={style}>
            <tileContext.Provider value={{ showSettings, setShowSettings }}>
                {title && (
                    <div className="title">
                        <div className="draggable">{title}</div>
                        {(controls || settings) && (
                            <span className="controls">
                                {controls}
                                {settings}
                            </span>
                        )}
                    </div>
                )}
                <div className="content">{children}</div>
                {footer && <div className="footer">{footer}</div>}
            </tileContext.Provider>
        </div>
    )
}
export const Tile = styled(_Tile)<{ title: string }>`
    display: flex;
    flex-direction: column;
    height: 100%;
    border: 1px solid ${props => props.theme.colors.border};
    > .title {
        position: relative;
        padding: 4px 8px;
        height: 35px;
        border-bottom: 1px solid
            ${props => {
                return props.theme.colors.border
            }};
    }
    .draggable {
        cursor: grab;
        position: absolute;
        padding: 4px 8px;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
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
        float: right;
    }
`
