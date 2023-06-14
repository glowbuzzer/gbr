/*
 * Copyright (c) 2022-2023. Glowbuzzer. All rights reserved
 */

import { defineExampleViteConfig } from "../../vite.shared"

export default {
    ...defineExampleViteConfig(),
    server: {
        strictPort: true,
        port: 7000
    }
}
