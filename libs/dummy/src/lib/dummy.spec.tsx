import React from "react"
import { render } from "@testing-library/react"

import Dummy from "./dummy"

describe("Dummy", () => {
    it("should render successfully", () => {
        const { baseElement } = render(<Dummy />)
        expect(baseElement).toBeTruthy()
    })
})
