/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { Button, Card, Flex, Space, Switch } from "antd"

type DevDigitalInputOverridesProps = {
    title: string
    labels: string[]
    inputs: boolean[]
    onChange(index: number, value: boolean): void
    onClear(): void
}

export const DevDigitalInputOverrides = ({
    title,
    labels,
    inputs,
    onChange,
    onClear
}: DevDigitalInputOverridesProps) => {
    return (
        <Card
            size="small"
            title={title}
            extra={
                <div>
                    <Button size="small" onClick={onClear} disabled={!inputs.length}>
                        Clear
                    </Button>
                </div>
            }
        >
            {labels.length ? (
                <Flex vertical gap="small">
                    {labels.map((label, index) => {
                        return (
                            <Flex align="center" justify="space-between" key={index}>
                                <span>{label}</span>
                                <Switch
                                    size="small"
                                    checked={inputs[index]}
                                    onChange={checked => onChange(index, checked)}
                                />
                            </Flex>
                        )
                    })}
                </Flex>
            ) : (
                <div>No inputs configured</div>
            )}
        </Card>
    )
}
