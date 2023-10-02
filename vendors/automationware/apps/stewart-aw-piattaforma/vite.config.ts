/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import defineAutomationWareViteConfig from "../../vite.aw-config"

export default {
    ...defineAutomationWareViteConfig(),
    server: {
        strictPort: true,
        port: 7001,
        host: true
    }
}
