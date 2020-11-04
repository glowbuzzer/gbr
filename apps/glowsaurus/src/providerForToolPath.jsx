import * as React from "react";
import {toolPathContext} from "@glowbuzzer/hooks";

export const Provider = ({children}) => {
    const revolutions = 5;
    const resolution = 20;
    const angle = n => Math.PI * 2 * n / resolution;
    const path = Array.from({length: revolutions * resolution})
        .map((_, n) => ({
            x: Math.sin(angle(n)),
            y: Math.cos(angle(n)),
            z: n / resolution * 0.5
        }));

    const context=[path];
    return <toolPathContext.Provider value={context}>
        {children}
    </toolPathContext.Provider>
};
