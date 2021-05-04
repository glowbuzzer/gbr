import React from "react"
import { Table } from "antd"
import styled from "styled-components"

const StyledDiv = styled.div`
    .props-table {
        max-width: 800px;

        .prop-name {
            font-family: monospace;
        }

        .prop-type,
        .prop-default {
            .prop-cell-inner {
                font-family: monospace;
                font-size: 0.9em;
                padding: 2px 4px;
                color: #7878bf;
                border: 1px solid #7878bf;
                border-radius: 4px;
            }
        }

        .prop-type {
            white-space: nowrap;
        }
    }
`

function render_cell_inner(value) {
    return value?.trim().length ? <span className="prop-cell-inner">{value}</span> : null
}

export const ComponentProps = ({ data }) => {
    console.log("DATA", data)
    const props = data?.childrenComponentProp
    if (!props) {
        return null
    }

    const columns = [
        {
            title: "Property",
            dataIndex: "name",
            key: "name",
            render({ name, required }) {
                return (
                    <>
                        <span className="prop-name">{name}</span>
                        <span className="prop-required">{required && "*"}</span>
                    </>
                )
            }
        },
        {
            title: "Type",
            dataIndex: "type",
            key: "type",
            className: "prop-type",
            render: render_cell_inner
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
            className: "prop-description",
            render: render_cell_inner
        },
        {
            title: "Default",
            dataIndex: "default",
            key: "default",
            className: "prop-default",
            render: render_cell_inner
        }
    ]

    const dataSource = props.map(p => ({
        key: p.name,
        name: { name: p.name, required: p.required },
        type: p.type?.name,
        description: p.description?.text,
        default: p.defaultValue?.value
    }))

    return (
        <StyledDiv>
            <h2>Properties of {data.displayName}</h2>
            <Table className="props-table" columns={columns} dataSource={dataSource} pagination={false} size="small" />
            {/*
            <table className="prop-table">
                <thead>
                    <tr>
                        <th>Property</th>
                        <th>Type</th>
                        <th>Description</th>
                        <th>Default</th>
                    </tr>
                </thead>
                <tbody>
                    {props.map(p => (
                        <tr key={p.name}>
                            <td>
                                {p.name}
                                {p.required && <>*</>}
                            </td>
                            <td>{p.type?.name}</td>
                            <td>{p.description?.text}</td>
                            <td>{p.defaultValue?.value}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <pre>{JSON.stringify(data, null, 2)}</pre>
*/}
        </StyledDiv>
    )
}
