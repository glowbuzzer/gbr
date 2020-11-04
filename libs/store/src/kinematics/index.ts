import { createSlice } from "@reduxjs/toolkit"
import { useSelector } from "react-redux"
import { RootState } from "../root"
import * as THREE from "three"
import deepEqual from "fast-deep-equal"
import { KinematicsConfigurationMcStatus } from "../types"
import { useFrames } from "../util/useFrames"

const IDENTITY_ROTATION = { x: 0, y: 0, z: 0, w: 1 }

enum KINEMATICSCONFIGURATIONTYPE {
    TX40,
    TX60,
    TS40,
    TS60,
    CARTESIAN,
    DH6DOF,
    NAKED
}

type Pose = {
    position: THREE.Vector3
    orientation: THREE.Quaternion
}

export type KinematicsState = {
    type: KINEMATICSCONFIGURATIONTYPE
    pose: Pose
    currentConfiguration: number
    frameIndex: number
    froTarget: number
    froActual: number
}

export const status_to_redux_state = (k: KinematicsConfigurationMcStatus) => {
    const { x, y, z } = k.cartesianActPos
    return {
        type: KINEMATICSCONFIGURATIONTYPE.CARTESIAN,
        currentConfiguration: 0,
        frameIndex: 0,
        froTarget: k.froTarget,
        froActual: k.froActual,
        pose: {
            position: { x, y, z },
            orientation: IDENTITY_ROTATION
        }
    }
}

export const kinematicsSlice = createSlice({
    name: "kinematics",
    initialState: [] as KinematicsState[],
    reducers: {
        status(state, action) {
            // convert inbound state to more friendly redux state
            return action.payload.map(status_to_redux_state)
        }
    }
})

// we're not allowed to put THREE objects into state because they are not serializable,
// so we need to convert the vanilla pojso into THREE version for downstream
function unmarshall(state): KinematicsState {
    if (!state) {
        // ensure downstream always has something to work with even if just a default
        return {
            type: KINEMATICSCONFIGURATIONTYPE.CARTESIAN,
            currentConfiguration: 0,
            frameIndex: 0,
            froTarget: 0,
            froActual: 0,
            pose: {
                position: new THREE.Vector3(0, 0, 0),
                orientation: new THREE.Quaternion(0, 0, 0, 1)
            }
        }
    }
    const { z, y, x } = state.pose.position
    const { z: qz, y: qy, x: qx, w: qw } = state.pose.orientation

    return {
        ...state,
        pose: {
            position: new THREE.Vector3(x, y, z),
            orientation: new THREE.Quaternion(qx, qy, qz, qw)
        }
    }
}

export const useKinematics = (kc: number, frameIndex: number) => {
    // select the given kc
    const state = unmarshall(useSelector(({ kinematics }: RootState) => kinematics[kc], deepEqual))
    // const dispatch = useDispatch()
    const frames = useFrames()

    return {
        ...state,
        pose: frames.convertToFrame(state.pose.position, state.pose.orientation, state.frameIndex, frameIndex)
    }
}
