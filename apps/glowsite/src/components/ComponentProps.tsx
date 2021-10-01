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
    return <span className="prop-cell-inner">{value}</span>
}

export const ComponentProps = ({ displayName, properties, showDefaults }) => {
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
        }
    ]
    if (showDefaults) {
        columns.push({
            title: "Default",
            dataIndex: "default",
            key: "default",
            className: "prop-default",
            render: render_cell_inner
        })
    }

    return (
        <StyledDiv>
            <h2>Properties of {displayName}</h2>
            <Table
                className="props-table"
                columns={columns}
                dataSource={properties}
                pagination={false}
                size="small"
            />
        </StyledDiv>
    )
}
