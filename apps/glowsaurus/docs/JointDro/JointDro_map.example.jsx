import * as React from "react";
import {JointDro} from "@glowbuzzer/controls";

const joints_to_display={
    0: "A",
    4: "B",
    5: "C",
};

export default () => <JointDro joints={joints_to_display}/>
