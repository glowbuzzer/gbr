/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import React from "react"
import { Menu, MenuProps } from "antd"
import { useStatusBarElement } from "./StatusTrayProvider"

export const StatusBarMenu = (props: MenuProps) => {
    const container = useStatusBarElement()
    return <Menu {...props} getPopupContainer={() => container} />
}
