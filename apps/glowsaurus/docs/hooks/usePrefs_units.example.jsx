import * as React from "react";
import {usePrefs} from "@glowbuzzer/hooks";
import {UnitSelector} from "@glowbuzzer/controls";

export default () => {
    const [{units_scalar}] = usePrefs();

    return <>
        <UnitSelector type="scalar"/>
        <div>Currently selected units are: {units_scalar}</div>
    </>
}
