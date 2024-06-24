import React from "react"

export const ToolConfigTab = () => {
    return (
        <div>
            <p>Tool config content</p>
            <p>Type generic mech gripper, pnu gripper, electric gripper, specific models</p>
            <p>
                Output / input signals? grasp/release ops and grasp release sensors? - on dig io or
                modbus
            </p>
            <p>Set TCP offsets</p>
            <p>Set dims of tool - predefined for specific models</p>
            <p> tool weight</p>
            <p> tool CoM</p>
            <p> tool dynamics params</p>
            <p>
                Add 3d model - 3d model in grasp release? or is this just for specific tools we
                support
            </p>
        </div>
    )
}
