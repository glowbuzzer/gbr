/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { defineExampleViteConfig } from "../../vite.shared"

export default defineExampleViteConfig({
    aliases: {
        "@glowbuzzer/awlib": "./vendors/automationware/awlib/src/index.ts"
    }
})
