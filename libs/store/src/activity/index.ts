import { createSlice, Slice } from "@reduxjs/toolkit"
import { useSelector } from "react-redux"
import deepEqual from "fast-deep-equal"
import { useEffect, useMemo } from "react"
import { ActivityApi } from "./activity_api"
import { ACTIVITYSTATE } from "../gbc"
import { RootState } from "../root"
import { useConnect } from "../connect"

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

export function useSoloActivityStatus(index = 0): ActivityStatus {
    const status = useSelector(
        ({ activity }: RootState) => activity[index],
        deepEqual
    ) as ActivityStatus

    return (
        status || {
            tag: 0,
            state: ACTIVITYSTATE.ACTIVITY_INACTIVE
        }
    )
}

export function useSoloActivity(index = 0) {
    const connection = useConnect()
    const status = useSelector(
        ({ activity }: RootState) => activity[index],
        deepEqual
    ) as ActivityStatus
    // const currentTag = useRef(1) // initial value will be zero on m7
    // const promiseRef = useRef<{ tag: number; resolve; reject }>()

    const api = useMemo(() => {
        return new ActivityApi(index, connection.send)
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
