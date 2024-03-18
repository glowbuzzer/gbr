/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { PointerEventHandler, TouchEventHandler, useEffect } from "react"
import styled, { css } from "styled-components"

const radius = 80
const sm = 15

const StyledCartesianTouchSvg = styled.svg<{ width: number; height: number; disabled: boolean }>`
    ${props =>
        props.disabled &&
        css`
            pointer-events: none;
        `}

    // animate x and y position of circle

    circle.animate {
        transition:
            cx 0.2s,
            cy 0.2s;
    }

    circle.large {
        fill: ${props =>
            props.disabled ? props.theme.colorBgContainerDisabled : props.theme.colorPrimaryBg};
    }

    circle.small {
        fill: ${props =>
            props.disabled ? props.theme.colorBgContainerDisabled : props.theme.colorPrimary};
    }

    path {
        stroke: ${props =>
            props.disabled ? props.theme.colorBgContainerDisabled : props.theme.colorPrimary};
        stroke-opacity: 0.3;
        fill: none;
    }

    path.horizontal {
        transform: translate(0, ${props => props.height / 2}px);
    }

    path.vertical {
        transform: translate(${props => props.width / 2}px, 0px) rotate(90deg);
    }

    path.solo-control {
        fill: ${props =>
            props.disabled ? props.theme.colorBgContainerDisabled : props.theme.colorPrimaryBg};
    }
`

type JogTouchCartesianState = {
    x: number
    y: number
    active: boolean
}

export enum JogTouchWidgetMode {
    XY,
    VERTICAL,
    HORIZONTAL
}

type JogTouchWidgetProps = {
    mode: JogTouchWidgetMode
    lockXy?: boolean
    lockSpeed: boolean
    onJogStart(vx: number, vy: number): void
    onJogEnd(): void
    disabled?: boolean
}

export const JogTouchWidget = ({
    mode,
    lockXy,
    lockSpeed,
    onJogStart,
    onJogEnd,
    disabled
}: JogTouchWidgetProps) => {
    const { width, height, lock_xy, pointer_info } = (() => {
        switch (mode) {
            case JogTouchWidgetMode.XY:
                return {
                    width: radius * 2,
                    height: radius * 2,
                    lock_xy: lockXy,
                    pointer_info(x: number, y: number) {
                        const c = radius,
                            dx = x - c,
                            dy = y - c,
                            distance = Math.sqrt(dx * dx + dy * dy)

                        return { c, dx, dy, distance }
                    }
                }
            case JogTouchWidgetMode.VERTICAL:
                return {
                    width: sm * 2,
                    height: radius * 2,
                    lock_xy: true,
                    pointer_info(x: number, y: number) {
                        const c = radius,
                            dy = y - c,
                            distance = Math.abs(dy)

                        return { c, dx: 0, dy, distance }
                    }
                }
            case JogTouchWidgetMode.HORIZONTAL:
                return {
                    width: radius * 2,
                    height: sm * 2,
                    lock_xy: true,
                    pointer_info(x: number, y: number) {
                        const c = width / 2,
                            dx = x - c,
                            distance = Math.abs(dx)

                        return { c, dx, dy: 0, distance }
                    }
                }
        }
    })()

    const [state, setState] = React.useState<JogTouchCartesianState>({
        x: width / 2,
        y: height / 2,
        active: false
    })
    const [animate, setAnimate] = React.useState(true)

    useEffect(() => {
        if (state.active) {
            // document.body.classList.add("no-select")

            const timer = setTimeout(() => {
                setAnimate(false)
            }, 200)

            function handle_end() {
                clearTimeout(timer)
                setState({ x: width / 2, y: height / 2, active: false })
                setAnimate(true)
            }

            document.addEventListener("mouseup", handle_end)
            document.addEventListener("touchend", handle_end)
            document.addEventListener("pointerup", handle_end)
            return () => {
                document.body.classList.remove("no-select")
                document.removeEventListener("mouseup", handle_end)
                document.removeEventListener("touchend", handle_end)
                document.removeEventListener("pointerup", handle_end)
            }
        }
    }, [state.active])

    useEffect(() => {
        if (state.active) {
            const { distance, dx, dy } = pointer_info(state.x, state.y)
            // normalize
            const nx = dx / distance
            const ny = dy / distance

            // scale
            const scale = Math.min(1, distance / (radius - sm))
            const vx = nx * scale
            const vy = ny * scale

            onJogStart(vx, -vy)
        } else {
            onJogEnd()
        }
    }, [state.x, state.y, state.active])

    function ortho(dx: number, dy: number, x: number, y: number) {
        if (!lock_xy) {
            return { x, y }
        }
        if (Math.abs(dx) > Math.abs(dy)) {
            return { x, y: height / 2 }
        } else {
            return { x: width / 2, y }
        }
    }

    function clamp(x: number, y: number) {
        const { c, dx, dy, distance } = pointer_info(x, y)

        if (!lockSpeed && distance <= radius - sm) {
            // inside the circle
            return ortho(dx, dy, x, y)
        }

        const scale = (radius - sm) / distance
        const dxScaled = dx * scale
        const dyScaled = dy * scale

        // console.log("distance", distance)

        return ortho(dx, dy, c + dxScaled, c + dyScaled)
    }

    function update_position(
        currentTarget: EventTarget & SVGCircleElement,
        pointerId: number,
        x: number,
        y: number
    ) {
        if (currentTarget) {
            if (pointerId !== null) {
                // only for desktop, avoid text selection
                // this appears to be cleared automatically
                currentTarget.setPointerCapture(pointerId)
            }
            const owner = currentTarget.ownerSVGElement
            const point = owner.createSVGPoint()
            point.x = x
            point.y = y
            const t = point.matrixTransform(owner.getScreenCTM().inverse())
            setState({ active: true, ...clamp(t.x, t.y) })
        }
    }

    const touch_move: TouchEventHandler<SVGCircleElement> = e => {
        update_position(e.currentTarget, null, e.touches[0].clientX, e.touches[0].clientY)
    }

    const pointer_down: PointerEventHandler<SVGCircleElement> = e => {
        update_position(e.currentTarget, e.pointerId, e.clientX, e.clientY)
    }

    const pointer_move: PointerEventHandler<SVGCircleElement> = e => {
        if (!state.active) {
            return
        }
        update_position(e.currentTarget, e.pointerId, e.clientX, e.clientY)
    }

    const sausage_path = `
        M0,0
        a${sm},${sm} 0 0 1 ${sm},-${sm}
        H${radius * 2 - sm}
        a${sm},${sm} 0 0 1 ${sm},${sm}
        a${sm},${sm} 0 0 1 -${sm},${sm}
        H${sm}
        a${sm},${sm} 0 0 1 -${sm},-${sm}Z
    `

    const events = {
        onTouchMoveCapture: touch_move,
        onPointerDownCapture: pointer_down,
        onPointerMoveCapture: pointer_move
    }

    return (
        <StyledCartesianTouchSvg width={width} height={height} disabled={disabled}>
            {mode === JogTouchWidgetMode.XY ? (
                <circle className="large" cx={width / 2} cy={height / 2} r={radius} {...events} />
            ) : mode === JogTouchWidgetMode.VERTICAL ? (
                <path className="vertical solo-control" d={sausage_path} {...events} />
            ) : (
                <path className="horizontal solo-control" d={sausage_path} {...events} />
            )}
            <circle
                className={animate ? "animate small" : "small"}
                cx={state.x}
                cy={state.y}
                r={sm}
                {...events}
            />
            {lock_xy && mode === JogTouchWidgetMode.XY && (
                <>
                    <path className="horizontal" d={sausage_path} />
                    <path className="vertical" d={sausage_path} />
                </>
            )}
        </StyledCartesianTouchSvg>
    )
}
