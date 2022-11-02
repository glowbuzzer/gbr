/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

/**
 * The definition of a perspective in the dock layout.
 */
export type DockPerspective = {
    /** The id of the perspective. */
    id: string
    /** The name of the perspective. Shown in the perspective menu. */
    name: string
    /** A list of tile ids that should be visible by default. If not specified, all tiles are visible. */
    defaultVisible?: string[]
}
