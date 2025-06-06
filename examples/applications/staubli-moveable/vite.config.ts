/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { defineExampleViteConfig } from "../../vite.shared"

export default {
    ...defineExampleViteConfig({
        sharedAssetDirectories: ["environment", "tx40"]
    }),
    server: {
        strictPort: true,
        port: 5174
    }
}
