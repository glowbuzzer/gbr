import * as React from "react";
import {tasksContext, useConfig} from "@glowbuzzer/hooks";

const context = {
};

export const Provider = ({children}) => {
    const config=useConfig();

    return <tasksContext.Provider value={config.task}>
        {children}
    </tasksContext.Provider>
};
