import { createSlice, Slice } from "@reduxjs/toolkit"
import { useSelector } from "react-redux"
import deepEqual from "fast-deep-equal"
import { useEffect, useMemo } from "react"
import { ActivityApiImpl, SoloActivityApi } from "./activity_api"
import { ACTIVITYSTATE } from "../gbc"
import { RootState } from "../root"
import { useConnection } from "../connect"

type ActivityStatus = {
    tag: number
    state: ACTIVITYSTATE
}

export const activitySlice: Slice<
    ActivityStatus[],
    { status: (state, action) => ActivityStatus[] },
    string
> = createSlice({
    name: "activity",
    initialState: [] as ActivityStatus[],
    reducers: {
        status: (state, action): ActivityStatus[] => {
            return [...action.payload]
        }
    }
})

/**
 * Instantiates and returns a solo activity API on a given kinematics configuration (KC) index.
 *
 * Each KC can have at most one solo activity executing againt it at any time. For more information see {@link SoloActivityApi}.
 *
 * @param index The kinematics configuration index the solo activity API will execute against
 */
export function useSoloActivity(index = 0): SoloActivityApi {
    const connection = useConnection()
    const status = useSelector(
        ({ activity }: RootState) => activity[index],
        deepEqual
    ) as ActivityStatus
    // const currentTag = useRef(1) // initial value will be zero on m7
    // const promiseRef = useRef<{ tag: number; resolve; reject }>()

    const api = useMemo(() => {
        return new ActivityApiImpl(index, connection.send)
    }, [index, connection.send])

    useEffect(() => {
        if (!status) {
            return
        }
        // take care of resolving or rejecting previous promises when tag or solo activity status changes
        const { tag, state } = status
        api.update(tag, state)
    }, [api, status])

    return api
}

export { SoloActivityApi } from "./activity_api"
