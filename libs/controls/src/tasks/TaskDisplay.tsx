import * as React from "react";
import {useTasks} from "@glowbuzzer/hooks";
import {Button, List} from "antd";
import {CSSProperties} from "react";

const styles: { [index: string]: CSSProperties } = {
    button: {
        width: "100%",
        textAlign: "left",
        marginBottom: "4px"
    }
};

export const TaskDisplay = () => {
    const [expanded, setExpanded] = React.useState({});
    const tasks = useTasks();

    function toggle(k) {
        setExpanded({
            ...expanded,
            [k]: !expanded[k]
        })
    }

    return <List size="small">
        {
            Object.keys(tasks).map(k => <div key={k}>
                <div>{k}</div>
                {expanded[k] && <div>
                    EXPANDED
                </div>}
            </div>)
        }
    </List>
};
