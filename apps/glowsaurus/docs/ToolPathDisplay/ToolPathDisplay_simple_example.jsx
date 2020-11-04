import * as React from "react";
import {ToolPathDisplay} from "@glowbuzzer/controls";
import {useToolPath} from "@glowbuzzer/hooks";

export default () => {
    const path=useToolPath(0);
    return <ToolPathDisplay width={800} height={500} path={path} extent={2}/>
}
