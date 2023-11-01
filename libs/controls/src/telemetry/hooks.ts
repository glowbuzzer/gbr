/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { useState, useRef, useEffect, MutableRefObject } from "react"

/**
 * Simple hook to watch the size of an element and return the width and height
 */
export function useElementSize<T extends SVGSVGElement | HTMLElement>(): [
    MutableRefObject<T>,
    number,
    number
] {
    const [size, setSize] = useState<[number, number]>([0, 0])
    const ref = useRef<T>(null) // Assuming the target is a div element

    useEffect(() => {
        if (ref.current) {
            setSize([ref.current.clientWidth, ref.current.clientHeight])

            const resizeObserver = new ResizeObserver(entries => {
                for (let entry of entries) {
                    if (entry.target === ref.current) {
                        const size: [number, number] = [
                            entry.target.clientWidth,
                            entry.target.clientHeight
                        ]
                        setSize(size)
                    }
                }
            })

            resizeObserver.observe(ref.current)

            // Clean up observer on component unmount
            return () => resizeObserver.disconnect()
        }
    }, [])

    return [ref, ...size]
}
