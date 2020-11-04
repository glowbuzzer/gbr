import * as React from "react";
import {useKinematics} from "@glowbuzzer/hooks";
import {FrameSelector, DroItem} from "@glowbuzzer/controls";

export default () => {
    const [frameIndex, setFrameIndex] = React.useState(0);
    const kinematics = useKinematics(frameIndex);

    const {position} = kinematics.pose;

    React.useEffect(() => {
        setFrameIndex(kinematics.frameIndex);
    }, []);

    const pos = {
        x: position.x,
        y: position.y,
        z: position.z,
        a: 100,
    };

    return <div>
        <FrameSelector defaultFrame={kinematics.frameIndex} onChange={setFrameIndex}/>
        {
            Object.keys(pos).map(k => <DroItem key={k} label={k} value={pos[k]} type="scalar"/>)
        }
    </div>
}
