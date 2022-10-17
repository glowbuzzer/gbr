/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { IJsonModel } from "flexlayout-react"

export const GlowbuzzerDockModelTemplate: IJsonModel = {
    global: {
        tabSetEnableMaximize: false,
        borderBarSize: 1,
        borderSize: 1,
        tabBorderWidth: 1,
        splitterSize: 5
    },
    borders: [],
    layout: {
        type: "row",
        id: "root",
        children: [
            {
                type: "row",
                weight: 25,
                children: [
                    {
                        type: "tabset",
                        id: "connect-solo",
                        enableDrop: false, // don't allow tabs to be added here
                        children: []
                    }
                ]
                // additional "rows" for cols created automatically
            },
            {
                type: "row",
                weight: 50,
                children: [
                    {
                        type: "tabset",
                        id: "wide-tabset",
                        enableDeleteWhenEmpty: false,
                        children: []
                    }
                ]
            }
        ]
    }
}
