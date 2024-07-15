import styled from "styled-components"
import { Table } from "antd"

const hexToRgb = hex =>
    hex
        .replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, (m, r, g, b) => "#" + r + r + g + g + b + b)
        .substring(1)
        .match(/.{2}/g)
        .map(x => parseInt(x, 16))

const rgbToHex = (r, g, b) =>
    "#" +
    [r, g, b]
        .map(x => {
            const hex = x.toString(16)
            return hex.length === 1 ? "0" + hex : hex
        })
        .join("")

export const lightenColor = (hex, factor) => {
    const [r, g, b] = hexToRgb(hex)
    const adjustedR = Math.round(r + (255 - r) * factor)
    const adjustedG = Math.round(g + (255 - g) * factor)
    const adjustedB = Math.round(b + (255 - b) * factor)

    return rgbToHex(adjustedR, adjustedG, adjustedB)
}

export const StyledTable = styled(Table)`
    /* Add your styles here */

    .highlight-row {
        font-weight: bold;
            //background-color: ${props => props.theme.colorPrimary};


        background-color: ${props => lightenColor(props.theme.colorPrimary, 0.4)};
        /* Adjust the second parameter (0.2) to control the degree of lightening */
    }

    td {
        /* Adjust the padding or margin as needed */
        padding-left: 10px;
    }
}
`

export const columns = [
    {
        title: "Property",
        dataIndex: "property",
        key: "property"
    },
    {
        title: "Value",
        dataIndex: "value",
        key: "value"
    }
]

export function extractValidKeys(dict, parentKey = "") {
    let keys = []

    function helper(node, isChild = false) {
        for (const key in node.children) {
            if (node.children[key].type === "object" || node.children[key].type === "array") {
                if (!isChild && !keys.includes(key)) {
                    keys.push(key) // Include parent node name
                }
                helper(node.children[key], true)
            } else {
                if (!keys.includes(key)) {
                    keys.push(key) // Include leaf node name
                }
            }
        }
    }

    helper(dict)
    return keys
}
