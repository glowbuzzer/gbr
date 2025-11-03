/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { useAppState } from "../store"
import { StateMachineViewer } from "../../../../util/StateMachineViewer"

/**
 * Tile that displays a state machine using elkjs as the layout engine. Displays the states and connections between them,
 * and highlights the current state.
 */
export const StateViewerTile = () => {
    const { definition, currentState } = useAppState().currentWorkflowState

    return <StateMachineViewer definition={definition} currentState={currentState} />
}
