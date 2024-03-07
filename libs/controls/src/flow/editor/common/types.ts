/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import { TriggerParams } from "@glowbuzzer/store"

export type TriggerEditProps = {
    trigger: TriggerParams
    onChange(trigger: TriggerParams): void
}
