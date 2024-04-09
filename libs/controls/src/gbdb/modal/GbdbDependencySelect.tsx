/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { useEffect } from "react"
import { useGbdb } from ".."
import { Form, Select } from "antd"

const GbdbSelectFacet = ({ facetName, onSelect }) => {
    const [files, setFiles] = React.useState([])
    const { list } = useGbdb()

    React.useEffect(() => {
        list(facetName).then(setFiles)
    }, [facetName])

    const options = files.map(file => ({
        label: file._id,
        value: file._id
    }))

    return (
        <Form layout="vertical">
            <Form.Item label={`Choose a ${facetName}`} style={{ textTransform: "capitalize" }}>
                <Select
                    options={options}
                    onSelect={onSelect}
                    popupMatchSelectWidth={false}
                    placeholder={`Select ${facetName}`}
                />
            </Form.Item>
        </Form>
    )
}

type GbdbDependencySelectProps = {
    facetName: string
    onChange: (value: { [index: string]: string }) => void
}

export const GbdbDependencySelect = ({ facetName, onChange }: GbdbDependencySelectProps) => {
    const { facets } = useGbdb()
    const [selection, setSelection] = React.useState({})
    const { dependencies } = facets[facetName]

    useEffect(() => {
        onChange(selection)
    }, [selection])

    function update_selection(facetName: string, value: string) {
        console.log("update", value)
        setSelection(current => ({ ...current, [facetName]: value }))
    }

    if (!dependencies?.length) {
        return null
    }

    return (
        <>
            {dependencies.map(dependency => (
                <GbdbSelectFacet
                    key={dependency}
                    facetName={dependency}
                    onSelect={(v: string) => update_selection(dependency, v)}
                />
            ))}
        </>
    )
}
