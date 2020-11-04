import * as React from "react";
import {BitFieldDisplay} from "@glowbuzzer/controls";

export default () => {
    const [value, setValue]=React.useState(0);

    return <BitFieldDisplay value={value} bitCount={8} editable={true} onChange={setValue} />
}
