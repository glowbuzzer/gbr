import React, { useState } from "react"
import { Button, Checkbox, Empty, Form, Input, Modal, Tree } from "antd"
import { useConnection, useFrames, useKinematics } from "@glowbuzzer/store"
import styled from "styled-components"

function map_tree(tree) {
    const gcode = tree.index < 8 ? " (G5" + (4 + tree.index) + ")" : ""
    return {
        key: tree.index,
        title: tree.text + gcode,
        children: tree.children?.map(c => map_tree(c))
    }
}

const FrameOverride = ({ selected }) => {
    const frames = useFrames()
    const frame = frames.asList.find(f => f.index === selected)
    const parentIndex = frame.parentIndex // could be undefined = world
    // console.log("PARENT INDEX", parentIndex)
    // we want position relative to the parent frame, if relative
    const kc = useKinematics(0)
    const { translation } = frames.convertToFrame(
        kc.translation,
        kc.rotation,
        kc.frameIndex,
        parentIndex
    )

    const overrides = frames.overrides

    const current_override = overrides[selected]

    function toggle_override() {
        if (current_override) {
            frames.setOverride(selected, undefined)
        } else {
            const { x, y, z } = frame.relative.translation
            frames.setOverride(selected, [x, y, z])
        }
    }

    const set_override = (index, value) => {
        frames.setOverride(
            selected,
            current_override.map((v, i) => (i === index ? value : v))
        )
    }
    const change_x = e => set_override(0, e.target.value)
    const change_y = e => set_override(1, e.target.value)
    const change_z = e => set_override(2, e.target.value)

    function update_from_current() {
        const { x, y, z } = translation
        const arr = [x, y, z]
        console.log("SET FROM CURRENT", arr)
        frames.setOverride(selected, arr)
    }

    const { x, y, z } = frame.relative.translation // value before override

    function pick(index, defaultValue) {
        return current_override?.[index] === undefined ? defaultValue : current_override[index]
    }

    // noinspection RequiredAttributes
    return (
        <Form layout="horizontal">
            <Form.Item>
                <Checkbox checked={!!current_override} onChange={toggle_override}>
                    Override
                </Checkbox>
                <Button disabled={!current_override} onClick={update_from_current}>
                    Set From Current Position
                </Button>
            </Form.Item>
            <Form.Item label={"X"}>
                <Input value={pick(0, x) || 0} disabled={!current_override} onChange={change_x} />
            </Form.Item>
            <Form.Item label={"Y"}>
                <Input value={pick(1, y) || 0} disabled={!current_override} onChange={change_y} />
            </Form.Item>
            <Form.Item label={"Z"}>
                <Input value={pick(2, z) || 0} disabled={!current_override} onChange={change_z} />
            </Form.Item>
        </Form>
    )
}

const StyledModal = styled.div`
    display: flex;
    gap: 20px;

    .ant-tree {
        flex-grow: 1;
    }

    .ant-form {
        flex-grow: 1;
    }
`

/**
 * @ignore - internal
 */
export const FrameOverrideDialog = ({ visible, onClose }) => {
    const [selected, setSelected] = useState([])
    const frames = useFrames()
    const connection = useConnection()

    const tree = frames.asTree.map(t => map_tree(t))

    const selectedIndex = selected[0]

    return (
        <Modal
            title="Work Offsets"
            visible={visible}
            onCancel={onClose}
            footer={[<Button onClick={onClose}>Close</Button>]}
        >
            {connection.connected ? (
                <StyledModal>
                    <Tree treeData={tree} showLine onSelect={setSelected} selectedKeys={selected} />
                    {selected.length > 0 && <FrameOverride selected={selectedIndex} />}
                </StyledModal>
            ) : (
                <Empty />
            )}
        </Modal>
    )
}
