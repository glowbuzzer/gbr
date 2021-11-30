import React, {createContext, FC, useContext, useRef, useState} from "react"
import { useSoloActivity } from '@glowbuzzer/store';
import {Tile} from "@glowbuzzer/layout";
import {Button} from "antd";
import { ACTIVITYTYPE } from '@glowbuzzer/store';


export const TutorialOscillatingMoveTile = () => {
    const [complete, setComplete] = useState(false)
    const soloActivity = useSoloActivity(0)

    async function do_promise() {
        setComplete(false)
        await soloActivity.moveJoints([1000,0,0]).promise()
        await soloActivity.moveJoints([0,0,0]).promise()
        await soloActivity.moveJoints([1000,0,0]).promise()
        await soloActivity.moveJoints([0,0,0]).promise()
        setComplete(true)
    }

    return (
        <Tile title="Tutorial Oscillating Move">
            <Button onClick={do_promise}>Start Move</Button>
            {complete ? "Move complete" : ""}
        </Tile>
    )
}