/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { shallowEqual, useSelector } from "react-redux"
import { useEffect, useMemo } from "react"
import { ActivityStatus, ACTIVITYTYPE } from "../gbc"
import { RootState } from "../root"
import { useConnection } from "../connect"
import { useDefaultMoveParameters } from "../config"
import { SoloActivityApi } from "./solo/api"
import { ActivityApi } from "./api/interface"

export const activitySlice = createSlice({
    name: "activity",
    initialState: [],
    reducers: {
        status(state, action: PayloadAction<ActivityStatus[]>) {
            return action.payload
        }
    }
})

/**
 * Instantiates and returns a solo activity API on a given kinematics configuration (KC) index.
 *
 * Each KC can have at most one solo activity executing at any time. For more information see {@link ActivityApi}.
 *
 * @param kinematicsConfigurationIndex The kinematics configuration index the solo activity API will execute against
 */
export function useSoloActivity(kinematicsConfigurationIndex = 0): SoloActivityApi {
    const connection = useConnection()
    const defaultMoveParameters = useDefaultMoveParameters()

    const status = useSelector(
        ({ activity }: RootState) => activity[kinematicsConfigurationIndex],
        shallowEqual
    ) as ActivityStatus

    const api = useMemo(() => {
        return new SoloActivityApi(
            kinematicsConfigurationIndex,
            defaultMoveParameters,
            connection.send
        )
    }, [kinematicsConfigurationIndex, defaultMoveParameters, connection.send])

    useEffect(() => {
        if (!status) {
            return
        }
        // take care of resolving or rejecting previous promises when tag or solo activity status changes
        const { tag, state } = status
        api.updateActivity(tag, state)
    }, [api, status])

    //AK can we return the whole status object here as well?

    return api
}

export * from "./api/builders"
export * from "./api/interface"
