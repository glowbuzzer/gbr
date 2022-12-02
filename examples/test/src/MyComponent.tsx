import * as React from "react"
import { Layout, Model } from "flexlayout-react"
import { ThreeDimensionalSceneTile } from "@glowbuzzer/controls"
import { Suspense } from "react"

const MyComponent = () => {
    function factory() {
        return (
            <Suspense>
                <ThreeDimensionalSceneTile />
            </Suspense>
        )
    }

    const model: Model = Model.fromJson({
        global: {
            tabEnableRenderOnDemand: true
        },
        layout: {
            id: "root",
            type: "row",
            children: [
                {
                    id: "row1",
                    type: "row",
                    children: [
                        {
                            id: "col1",
                            type: "tabset",
                            children: [
                                {
                                    id: "tab1",
                                    type: "tab"
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    })
    return <Layout factory={factory} model={model} />
}

export default MyComponent
