/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { JointConfig, TelemetryEntry, TelemetryGenerator } from "@glowbuzzer/store"

export function generate_telemetry_download(joints: JointConfig[], generator: TelemetryGenerator) {
    const data = Array.from(generator([0]))
    const dl =
        "data:application/octet-stream;charset=utf-16le;base64," +
        btoa(
            [
                [
                    "t",
                    ...joints
                        .map((_, i) => [
                            `J${i} SET POS`,
                            `J${i} ACT POS`,
                            `J${i} SET VEL`,
                            `J${i} ACT VEL`,
                            `J${i} SET ACC`,
                            `J${i} SET TORQUE`,
                            `J${i} SET TORQUE OFFSET`,
                            `J${i} ACT TORQUE`,
                            `J${i} ACT CONTROL EFFORT`
                        ])
                        .flat()
                ]
            ]
                .concat(
                    data.map(d => {
                        const values = joints
                            .map((_v, index) => {
                                return [
                                    d.set[index].p,
                                    d.act[index].p,
                                    d.set[index].v,
                                    d.act[index].v,
                                    d.set[index].a,
                                    d.set[index].t,
                                    d.set[index].to,
                                    d.act[index].t,
                                    d.act[index].e
                                ]
                            })
                            .flat()
                        return [d.t, ...values].map(v => v.toString())
                    })
                )
                .map(line => line.join(","))
                .join("\n")
        )

    const time = new Date()
        .toISOString()
        .substring(0, 19)
        .replace(/:/g, "")
        .replace(/-/g, "")
        .replace("T", "-")
    const a = document.createElement("a")
    document.body.appendChild(a)
    a.download = time + "-telemetry.csv"
    a.href = dl
    a.click()
}

export function parse_telemetry_csv(csv: string): TelemetryEntry[] {
    const lines = csv.split("\n")
    const header = lines[0].split(",")
    const data = lines.slice(1).map(line => line.split(",").map(v => parseFloat(v)))

    return data.map(([t, ...rest]) => {
        const set = []
        const act = []
        // the 'rest' array should be divisible by 9, as each joint has 9 values
        while (rest.length) {
            const [set_p, act_p, set_v, act_v, set_a, set_t, set_to, act_t, act_e] = rest.splice(
                0,
                9
            )
            set.push({ p: set_p, v: set_v, a: set_a, t: set_t, to: set_to })
            act.push({ p: act_p, v: act_v, t: act_t, e: act_e })
        }
        return {
            t,
            m4cap: 0,
            m7cap: 0,
            m7wait: 0,
            set,
            act
        }
    })
}
