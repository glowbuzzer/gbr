/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { JointConfig, TelemetryGenerator } from "@glowbuzzer/store"

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
                            `J${i} ACT TORQUE`
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
                                    d.act[index].t
                                ]
                            })
                            .flat()
                        return [d.t, ...values].map(v => v.toString())
                    })
                )
                .map(line => line.join(","))
                .join("\n")
        )

    const a = document.createElement("a")
    document.body.appendChild(a)
    a.download = "telemetry.csv"
    a.href = dl
    a.click()
}
