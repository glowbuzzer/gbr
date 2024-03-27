/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import {
    ActivityController,
    ActivityPromiseResult,
    ActivityStreamItem,
    ACTIVITYTYPE,
    AoutBuilder,
    CartesianPositionsConfig,
    DoutBuilder,
    DwellActivityBuilder,
    ExternalDoutBuilder,
    ExternalIoutBuilder,
    ExternalUioutBuilder,
    FlowIntegration,
    GlowbuzzerStatus,
    IoutBuilder,
    MoveLineBuilder,
    MoveToPositionBuilder,
    SetPayloadBuilder,
    ToolOffsetBuilder,
    UioutBuilder
} from "@glowbuzzer/store"

export function toActivityTypeString(type: ACTIVITYTYPE) {
    switch (type) {
        case ACTIVITYTYPE.ACTIVITYTYPE_NONE:
            return "None"
        case ACTIVITYTYPE.ACTIVITYTYPE_PAUSEPROGRAM:
            return "Pause Program"
        case ACTIVITYTYPE.ACTIVITYTYPE_ENDPROGRAM:
            return "End Program"
        case ACTIVITYTYPE.ACTIVITYTYPE_MOVEJOINTS:
            return "Move Joints"
        case ACTIVITYTYPE.ACTIVITYTYPE_MOVEJOINTSATVELOCITY:
            return "Move Joints At Velocity"
        case ACTIVITYTYPE.ACTIVITYTYPE_MOVELINE:
            return "Move Line"
        case ACTIVITYTYPE.ACTIVITYTYPE_MOVEVECTORATVELOCITY:
            return "Move Vector At Velocity"
        case ACTIVITYTYPE.ACTIVITYTYPE_MOVEROTATIONATVELOCITY:
            return "Move Rotation At Velocity"
        case ACTIVITYTYPE.ACTIVITYTYPE_MOVEARC:
            return "Move Arc"
        case ACTIVITYTYPE.ACTIVITYTYPE_MOVEINSTANT:
            return "Move Instant"
        case ACTIVITYTYPE.ACTIVITYTYPE_MOVETOPOSITION:
            return "Move To Position"
        case ACTIVITYTYPE.ACTIVITYTYPE_SETDOUT:
            return "Set Digital Output"
        case ACTIVITYTYPE.ACTIVITYTYPE_SETIOUT:
            return "Set Integer Output"
        case ACTIVITYTYPE.ACTIVITYTYPE_SETAOUT:
            return "Set Analog Output"
        case ACTIVITYTYPE.ACTIVITYTYPE_DWELL:
            return "Dwell"
        case ACTIVITYTYPE.ACTIVITYTYPE_SPINDLE:
            return "Spindle"
        case ACTIVITYTYPE.ACTIVITYTYPE_MOVEJOINTSINTERPOLATED:
            return "Move Joints Interpolated"
        case ACTIVITYTYPE.ACTIVITYTYPE_SET_UIOUT:
            return "Set Unsigned Integer Output"
        case ACTIVITYTYPE.ACTIVITYTYPE_SET_EXTERNAL_IOUT:
            return "Set External Integer Output"
        case ACTIVITYTYPE.ACTIVITYTYPE_GEARINPOS:
            return "Gear In Position"
        case ACTIVITYTYPE.ACTIVITYTYPE_GEARINVELO:
            return "Gear In Velocity"
        case ACTIVITYTYPE.ACTIVITYTYPE_SET_EXTERNAL_DOUT:
            return "Set External Digital Output"
        case ACTIVITYTYPE.ACTIVITYTYPE_TOOLOFFSET:
            return "Tool Offset"
        case ACTIVITYTYPE.ACTIVITYTYPE_SET_EXTERNAL_UIOUT:
            return "Set External Unsigned Integer Output"
        case ACTIVITYTYPE.ACTIVITYTYPE_SET_PAYLOAD:
            return "Set Payload"
        default:
            return "Unknown"
    }
}

export type FlowActivityEditParametersProps = {
    item: ActivityStreamItem
    onChange(item: ActivityStreamItem): void
}

export function toEnumString(value: string) {
    const [_, ...rest] = value.split("_")
    return rest.join(" ")
}

type ActivityTypeEntry = {
    type: ACTIVITYTYPE
    factory(position?: CartesianPositionsConfig): ActivityStreamItem
}
// Dummy controller used when adding activities via builders.
// These activities cannot be executed directly and the tags will be updated
// when the flow is actually executed.
const dummy_controller = new (class implements ActivityController {
    execute(): Promise<ActivityPromiseResult> {
        throw new Error("Method not implemented")
    }

    get kinematicsConfigurationIndex(): number {
        return 0
    }

    get nextTag(): number {
        return 0
    }
})()

export const ActivityFactoryList: ActivityTypeEntry[] = [
    {
        type: ACTIVITYTYPE.ACTIVITYTYPE_MOVETOPOSITION,
        factory: p =>
            new MoveToPositionBuilder(dummy_controller)
                .configuration(p.configuration)
                .setFromCartesianPosition(p.position).command
    },
    {
        type: ACTIVITYTYPE.ACTIVITYTYPE_MOVELINE,
        factory: p =>
            new MoveLineBuilder(dummy_controller).setFromCartesianPosition(p.position).command
    },
    {
        type: ACTIVITYTYPE.ACTIVITYTYPE_SETDOUT,
        factory: () => new DoutBuilder(dummy_controller).dout(0).value(true).command
    },
    {
        type: ACTIVITYTYPE.ACTIVITYTYPE_SETIOUT,
        factory: () => new IoutBuilder(dummy_controller).iout(0).value(0).command
    },
    {
        type: ACTIVITYTYPE.ACTIVITYTYPE_SETAOUT,
        factory: () => new AoutBuilder(dummy_controller).aout(0).value(0).command
    },
    {
        type: ACTIVITYTYPE.ACTIVITYTYPE_SET_UIOUT,
        factory: () => new UioutBuilder(dummy_controller).iout(0).value(0).command
    },
    {
        type: ACTIVITYTYPE.ACTIVITYTYPE_SET_EXTERNAL_DOUT,
        factory: () => new ExternalDoutBuilder(dummy_controller).dout(0).value(true).command
    },
    {
        type: ACTIVITYTYPE.ACTIVITYTYPE_SET_EXTERNAL_IOUT,
        factory: () => new ExternalIoutBuilder(dummy_controller).iout(0).value(0).command
    },
    {
        type: ACTIVITYTYPE.ACTIVITYTYPE_SET_EXTERNAL_UIOUT,
        factory: () => new ExternalUioutBuilder(dummy_controller).iout(0).value(0).command
    },
    {
        type: ACTIVITYTYPE.ACTIVITYTYPE_DWELL,
        factory: () => new DwellActivityBuilder(dummy_controller).msToDwell(1000).command
    },
    {
        type: ACTIVITYTYPE.ACTIVITYTYPE_TOOLOFFSET,
        factory: () => new ToolOffsetBuilder(dummy_controller).toolIndex(0).command
    },
    {
        type: ACTIVITYTYPE.ACTIVITYTYPE_SET_PAYLOAD,
        factory: () => new SetPayloadBuilder(dummy_controller).mass(0).command
    }
]

export async function call_http_endpoint(
    flow: FlowIntegration,
    status: GlowbuzzerStatus["status"]
) {
    if (flow.endpoint === "https://example.com") {
        // vaguely useful for testing
        return [
            new MoveLineBuilder(dummy_controller).translation(200, 0, 0).relative().command,
            new MoveLineBuilder(dummy_controller).translation(0, 200, 0).relative().command,
            new MoveLineBuilder(dummy_controller).translation(-200, 0, 0).relative().command,
            new MoveLineBuilder(dummy_controller).translation(0, -200, 0).relative().command
        ]
    }
    const result = await fetch(flow.endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(status)
    })
    if (result.status !== 200) {
        throw new Error(`Failed to execute integration: ${result.statusText}`)
    }
    return result.json()
}
