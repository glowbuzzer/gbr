import * as React from "react";
import {BitFieldDisplay, MotorDro} from "@glowbuzzer/controls";

export default () => <div>
    <BitFieldDisplay value={111} bitCount={16}/>
    <MotorDro value={0} width={200}/>
</div>;
