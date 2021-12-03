import * as React from "react"
import styled from "styled-components"

const StyledDiv = styled.div`
    .bit-item {
        display: inline-block;
    }

    .bit-item.rw .bit-label {
        cursor: pointer;
    }

    .bit-item.rw:hover {
        background: #ebebeb;
    }

    .bit {
        margin: 1px;
        width: 10px;
        height: 10px;
        background: #ededed;
        cursor: pointer;
    }

    .bit-label {
        font-family: monospace;
        font-size: 12px;
        margin-left: -4px;
        margin-right: -4px;
        padding-top: 4px;
        padding-bottom: 10px;
        writing-mode: vertical-rl;
        white-space: nowrap;
        transform: rotate(180deg) scale(0.9, 1);
        cursor: default;
        user-select: none;
        /*background: red;*/
    }

    .bit.bit-readonly {
        cursor: default;
    }

    .bit.bit-set {
        background: #00c400 !important;
    }

    .bit.bit-readonly.bit-set {
        background: #b3af00 !important;
    }
`

type BitFieldDisplayProps = {
    /**
     * Value to display (should be an integer)
     */
    value: number
    /**
     * Number of bits to display
     */
    bitCount: number
    /**
     * Break into rows at this number
     */
    groupAt?: number
    /**
     * Make editable (`onChange` is required)
     */
    editable?: boolean
    /**
     * Display inline
     */
    inline?: boolean
    /**
     * Array of labels, least significant bit first
     */
    labels?: (string | undefined)[]
    /**
     * Change handler
     * @param value new value
     */
    onChange?(value: number): void

    className?: string
}

export const BitFieldDisplay = (props: BitFieldDisplayProps) => {
    const bits_as_single_list = Array.from({ length: props.bitCount }, () => true)

    const CHUNK = props.groupAt || 64
    const bits_grouped: boolean[][] = []
    for (let i = 0, j = bits_as_single_list.length; i < j; i += CHUNK) {
        bits_grouped.push(bits_as_single_list.slice(i, i + CHUNK))
    }

    function absolute_bit(group, bit): number {
        return props.bitCount - (group * CHUNK + bit) - 1
    }

    function test_bit(group, bit) {
        return props.value & (1 << absolute_bit(group, bit))
    }

    function toggle(group, bit) {
        if (!props.editable || !props.onChange) {
            return
        }
        const actual_bit = absolute_bit(group, bit)
        if (props.value & (1 << actual_bit)) {
            props.onChange(props.value & ~(1 << actual_bit))
        } else {
            props.onChange(props.value | (1 << actual_bit))
        }
    }

    function desc(bit) {
        if (props.labels && props.labels[bit]) {
            return `${bit} ${props.labels[bit]}`
        }
        return bit
    }

    return (
        <StyledDiv>
            {bits_grouped.map((g, group_num) => (
                <div key={group_num}>
                    {g.map((b, bit_num) => (
                        <div
                            key={bit_num}
                            onClick={() => toggle(group_num, bit_num)}
                            className={"bit-item" + (props.editable ? " rw" : "")}
                        >
                            <div className="bit-label">
                                {desc(absolute_bit(group_num, bit_num))}
                            </div>
                            <div
                                className={
                                    "bit " +
                                    (test_bit(group_num, bit_num) ? "bit-set " : "") +
                                    (props.editable ? "" : " bit-readonly ")
                                }
                            />
                        </div>
                    ))}
                </div>
            ))}
        </StyledDiv>
    )
}

BitFieldDisplay.defaultProps = {
    groupAt: 64
}
