import * as React from "react";
import {usePrefs} from "@glowbuzzer/hooks";
import {Input} from "antd";

export default () => {
    const [{mypref}, setPref] = usePrefs();

    function change(e) {
        setPref("mypref", e.target.value);
    }

    return <>
        Enter a value to be stored in preferences:
        <Input placeholder="Enter a value" value={mypref} onChange={change}/>
    </>
}
