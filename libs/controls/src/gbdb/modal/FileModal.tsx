/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { useEffect, useState } from "react"
import { GbdbItem, useGbdb } from ".."
import { DocumentSelectList } from "./DocumentSelectList"
import { Button, Flex, Modal } from "antd"
import styled from "styled-components"
import { DeleteOutlined } from "@ant-design/icons"
import { GbdbDependencySelect } from "./GbdbDependencySelect"
import { useDispatch } from "react-redux"
import { gbdbSlice } from "@glowbuzzer/store"

const StyledModal = styled(Modal)`
    .ant-modal-title {
        text-transform: capitalize;
    }

    .ant-tree {
        padding: 10px 0;
    }
`

const StyledFooter = styled.div`
    display: flex;
    justify-content: space-between;
`

export enum FileModalMode {
    NONE,
    NEW,
    OPEN,
    SAVE
}

type FileModalProps = {
    facetName: string
    mode: FileModalMode
    onClose: () => void
}

export const FileModal = ({ facetName, mode, onClose }: FileModalProps) => {
    const { list, open: openFile, saveAs, remove, facets } = useGbdb()
    const [selected, setSelected] = useState<GbdbItem>(null)
    const [files, setFiles] = useState<GbdbItem[]>([])
    const [filter, setFilter] = useState<string>("")
    const [references, setReferences] = useState({})
    const dispatch = useDispatch()

    useEffect(() => {
        list(facetName).then(setFiles)
    }, [facetName])

    function update_references(references: Record<string, string>) {
        setReferences(references)
        dispatch(gbdbSlice.actions.addReferences({ facetName, references }))
    }

    async function ok() {
        switch (mode) {
            case FileModalMode.NEW:
                await saveAs(facetName, filter)
                break
            case FileModalMode.OPEN:
                await openFile(facetName, selected._id)
                break
            case FileModalMode.SAVE:
                await saveAs(facetName, filter)
                break
        }
        onClose()
    }

    async function open(doc: GbdbItem) {
        if (mode === FileModalMode.OPEN) {
            await openFile(facetName, doc._id)
            onClose()
        }
    }

    async function delete_file() {
        if (!selected) {
            return
        }
        await remove(facetName, selected)
        setFiles(files.filter(f => f._id !== selected._id))
        setSelected(null)
    }

    function config() {
        function check_dependencies() {
            const facet_dependencies = facets[facetName].dependencies
            if (!facet_dependencies?.length) {
                return true
            }
            const result = facet_dependencies.every(d => !!references[d])
            console.log("checking dependencies", result, facet_dependencies, references)
            return result
        }
        switch (mode) {
            case FileModalMode.NEW:
                return {
                    title: `New ${facetName}`,
                    okText: "Create",
                    okEnabled:
                        !!filter.length &&
                        !files.find(f => f._id === filter) &&
                        check_dependencies(),
                    deleteEnabled: true,
                    filterList: false
                }
            case FileModalMode.OPEN:
                return {
                    title: `Open ${facetName}`,
                    okText: "Open",
                    okEnabled: !!selected,
                    deleteEnabled: true,
                    filterList: true
                }
            case FileModalMode.SAVE:
                return {
                    title: `Save ${facetName} As`,
                    okText: "Save",
                    okEnabled: !!filter.length && !files.find(f => f._id === filter),
                    deleteEnabled: true,
                    filterList: false
                }
        }
    }

    const { title, okEnabled, okText, deleteEnabled, filterList } = config()

    return (
        <StyledModal
            title={title}
            open={true}
            onOk={ok}
            onCancel={onClose}
            okButtonProps={{ disabled: !selected }}
            footer={
                <StyledFooter>
                    {deleteEnabled && (
                        <Button onClick={delete_file} danger={!!selected} disabled={!selected}>
                            <DeleteOutlined />
                        </Button>
                    )}
                    <div>
                        <Button onClick={onClose}>Cancel</Button>
                        <Button type="primary" onClick={ok} disabled={!okEnabled}>
                            {okText}
                        </Button>
                    </div>
                </StyledFooter>
            }
        >
            <Flex vertical gap="small">
                <DocumentSelectList
                    files={files}
                    onSelect={setSelected}
                    onChangeFilter={setFilter}
                    onDoubleClick={open}
                    filter={filterList}
                />
                {mode === FileModalMode.NEW && (
                    <GbdbDependencySelect facetName={facetName} onChange={update_references} />
                )}
            </Flex>
        </StyledModal>
    )
}
