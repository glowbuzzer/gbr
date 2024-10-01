/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { Suspense, useEffect } from "react"
import { Button, Modal, Popconfirm, Space, Table, Upload } from "antd"
import { ToolModelPreview } from "./ToolModelPreview"
import { CloseOutlined, DeleteOutlined, DownloadOutlined, UploadOutlined } from "@ant-design/icons"
import useMessage from "antd/es/message/useMessage"
import styled from "styled-components"
import { RcFile } from "antd/es/upload"

const StyledFooter = styled(Space)`
    display: flex;
    justify-content: space-between;
`

type FileInfo = {
    name: string
    size: number
    modified: number
}

type ToolModelManagementModalProps = {
    onClose: () => void
}

export const ToolModelManagementModal = ({ onClose }: ToolModelManagementModalProps) => {
    const [files, setFiles] = React.useState<FileInfo[]>([])
    const [selected, setSelected] = React.useState<FileInfo>(null)
    const [messageApi, messageContext] = useMessage()

    useEffect(() => {
        fetch("/__file")
            .then(res => res.json())
            .then(setFiles)
            .catch(() => {
                // TODO: M: handle error
            })
    }, [])

    const columns = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name"
        },
        {
            title: "Size",
            dataIndex: "size",
            key: "size"
        },
        {
            title: "Modified",
            dataIndex: "modified",
            key: "modified",
            render: (value: number) => new Date(value).toLocaleString()
        }
    ]

    async function before_import(info: RcFile) {
        const buffer = await info.arrayBuffer()
        const name = info.name
        console.log("Uploading", name, buffer?.byteLength)
        fetch("__file/" + name, {
            method: "POST",
            headers: {
                "Content-Type": "application/octet-stream"
            },
            body: buffer
        })
            .then(() => {
                const newFile = { name, size: buffer.byteLength, modified: Date.now() }
                setFiles([...files, newFile])
                setSelected(newFile)
            })
            .catch(e => {
                return messageApi.error(`Failed to upload file: ${e.message}`)
            })

        // don't allow default upload
        return false
    }

    function download() {
        // create link and trigger download
        const link = document.createElement("a")
        link.href = `/gb/${selected.name}`
        link.download = selected.name
        link.click()
    }

    function do_delete() {
        fetch(`/__file/${selected.name}`, { method: "DELETE" })
            .then(res => res.json())
            .then(() => {
                setFiles(files.filter(f => f.name !== selected.name))
                setSelected(null)
            })
            .catch(e => {
                return messageApi.error(`Failed to delete file: ${e.message}`)
            })
    }

    return (
        <Modal
            open={true}
            onCancel={onClose}
            title="Remote Model Files"
            footer={
                <StyledFooter>
                    <Upload beforeUpload={before_import} maxCount={1} showUploadList={false}>
                        <Button icon={<UploadOutlined />} size="small">
                            Upload Model
                        </Button>
                    </Upload>
                    {selected && (
                        <div>
                            <Popconfirm
                                title={<>Are you sure to delete this item?</>}
                                onConfirm={do_delete}
                                onCancel={() => {}}
                                okText="Delete"
                                cancelText="Cancel"
                            >
                                <Button size="small" danger icon={<DeleteOutlined />}>
                                    Delete
                                </Button>
                            </Popconfirm>
                            <Button size="small" onClick={download} icon={<DownloadOutlined />}>
                                Download
                            </Button>
                        </div>
                    )}

                    <Button size="small" onClick={onClose} icon={<CloseOutlined />}>
                        Close
                    </Button>
                </StyledFooter>
            }
        >
            {messageContext}
            <Table
                columns={columns}
                dataSource={files}
                rowKey={record => record.name}
                size="small"
                pagination={{ hideOnSinglePage: true, pageSize: 10 }}
                rowSelection={{ type: "radio", onSelect: setSelected }}
            />
            {selected && (
                <div>
                    <Suspense>
                        <ToolModelPreview filename={selected.name} />
                    </Suspense>
                </div>
            )}
        </Modal>
    )
}
