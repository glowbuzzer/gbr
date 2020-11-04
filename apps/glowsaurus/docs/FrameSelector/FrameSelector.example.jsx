import * as React from "react";
import {FrameSelector} from "@glowbuzzer/controls";

export default () => {
    function onChange(v) {
        console.log("Frame changed: ", v);
    }

    return <FrameSelector onChange={onChange} defaultFrame={2}/>;
}
