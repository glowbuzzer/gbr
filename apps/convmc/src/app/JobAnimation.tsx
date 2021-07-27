import styled from "styled-components"
import React, { useEffect, useRef, useState } from "react"
import { CounterCow, CounterPig, CounterUnknown } from "./animation/counters"
import anime from "animejs"
import { useApp } from "./AppContext"

const StyledJobAnimation = styled.svg`
    .curb {
        stroke: grey;
        stroke-width: 3px;
    }

    .centre {
        stroke: lightgrey;
    }

    // by default hide all the shapes inside the counters
    .unkfig,
    .pigfig,
    .cowfig {
        visibility: hidden;
    }

    // color and unhide unknown/question counter
    .unknown {
        .st0 {
            fill: #7b7c7f;
        }

        .st1 {
            fill: #babcbe;
        }

        .unkfig {
            visibility: visible;
        }
    }

    // color and unhide pig counter
    .pig {
        .st0 {
            fill: #eb7ab0;
        }

        .st1 {
            fill: #f1bdd8;
        }

        .pigfig {
            visibility: visible;
        }
    }

    // color and unhide cow counter
    .cow {
        .st0 {
            fill: #997131;
        }

        .st1 {
            fill: #f8d598;
        }

        .cowfig {
            visibility: visible;
        }
    }

    text {
        font-size: 2em;
    }
`
const Conveyor = ({ pos, y }) => (
    // draw two lines for the curb and the centre line of conveyor
    <g transform={`translate(0,${y})`}>
        <line className="curb" x1={0} y1={0} x2={600} y2={0} />
        <line className="curb" x1={0} y1={100} x2={600} y2={100} />
        <line
            className="centre"
            x1={0}
            y1={50}
            x2={600}
            y2={50}
            stroke="black"
            strokeWidth={5}
            strokeDasharray="20 10"
            strokeDashoffset={pos || 0}
        />
    </g>
)
export const JobAnimation = ({ c1, c2 }) => {
    const animalRef = useRef<SVGRectElement>(null) // reference to the counter
    const cylinderRef = useRef<SVGPolygonElement>(null) // reference to the cylinder/piston

    const [animalCssClass, setAnimalCssClass] = useState("unknown") // what type of counter to display
    const [conveyorLatch, setConveyorLatch] = useState(0) // latched position of conveyor (on detect)
    const [counts, setCounts] = useState([0, 0]) // counts of the animals sorted

    const cylinderAnimation = useRef(null) // used to play/reverse the cylinder/piston animation

    const { state, previousState } = useApp()

    const EXT = 160 // full extent of the cylinder
    const retracted_points = "0 30  20 30  20 10  30 10  30 60  20 60  20 40  0 40"
    // prettier-ignore
    const extended_points = `0 30  ${EXT} 30  ${EXT} 10  ${EXT + 10} 10  ${EXT + 10} 60  ${EXT} 60  ${EXT} 40  0 40`;

    useEffect(() => {
        // create re-usable cylinder animation
        cylinderAnimation.current = anime({
            targets: cylinderRef.current,
            easing: "linear",
            duration: 1500,
            points: extended_points,
            autoplay: false
        })
    }, [extended_points])

    // determine offset of counter based on the latched conveyor position (if we are ejecting an animal)
    const offset =
        state === "eject_type2"
            ? (c2 || 0) - conveyorLatch + 100
            : state === "eject_type1" ||
              state === "advance_type2" ||
              state === "extend_cylinder" ||
              state === "retract_cylinder"
            ? (c1 || 0) - conveyorLatch
            : 0

    useEffect(() => {
        switch (state) {
            case "idle":
            case "run_until_magic_eye":
                // reset the counter visibility / position
                anime
                    .timeline({
                        targets: animalRef.current
                    })
                    .add({
                        duration: 0,
                        translateX: previousState === "eject_type1" ? 500 : 600 // initially show at end of conveyor so we see fade out that position after eject
                    })
                    .add({
                        duration: 200,
                        easing: "linear",
                        opacity: 0 // fade out
                    })
                    .add({
                        duration: 200,
                        translateY: 0 // reset y-position
                    })
                anime.set(cylinderRef.current, {
                    // ensure cylinder is retracted
                    points: retracted_points
                })
                if (state === "run_until_magic_eye") {
                    // use previous state to determine which counter to increment
                    switch (previousState) {
                        case "eject_type1":
                            setCounts(current => [current[0] + 1, current[1]])
                            break
                        case "eject_type2":
                            setCounts(current => [current[0], current[1] + 1])
                            break
                    }
                }
                break
            case "detect_image":
                // show the unknown/question counter
                setAnimalCssClass("unknown")
                anime
                    .timeline({
                        targets: animalRef.current
                    })
                    .add({
                        duration: 0,
                        translateX: 0 // ensure shown in original position
                    })
                    .add({
                        duration: 100,
                        easing: "linear",
                        opacity: 1 // fade in
                    })
                break
            case "advance_type2":
                // show the pig counter
                setAnimalCssClass("pig")
                setConveyorLatch(c1)
                break
            case "extend_cylinder":
                // move the cylinder
                cylinderAnimation.current.direction = "normal"
                cylinderAnimation.current.play()
                // move the counter with the cylinder
                anime({
                    targets: animalRef.current,
                    easing: "linear",
                    duration: 1500,
                    translateY: -175
                })
                break
            case "retract_cylinder":
                cylinderAnimation.current.direction = "reverse"
                cylinderAnimation.current.play()
                break
            case "eject_type1":
                // show cow counter
                setConveyorLatch(c1)
                setAnimalCssClass("cow")
                break
            case "eject_type2":
                setConveyorLatch(c2)
                break
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state /* c1, c2 deliberately excluded as we only want to latch once */])

    return (
        <StyledJobAnimation width={850} height={300}>
            <g transform="translate(100,0)">
                <Conveyor pos={-c2} y={10} />
                <g transform="translate(590,0)">
                    <g className="pig">
                        <CounterPig />
                        <text x={100} y={70}>
                            {counts[1]}
                        </text>
                    </g>
                </g>
            </g>
            <Conveyor pos={-c1} y={150} />
            <g transform={`scale(0.8), translate(${75 + offset},195)`}>
                <g ref={animalRef} className={animalCssClass}>
                    <circle className="st0" cx="56.2" cy="56.2" r="56.2" />
                    <circle className="st1" cx="56.2" cy="56.2" r="50" />
                    <g>
                        <CounterUnknown />
                        <CounterPig />
                        <CounterCow />
                    </g>
                </g>
            </g>
            <polygon
                ref={cylinderRef}
                points={retracted_points}
                fill="#333399"
                transform="translate(150,280), rotate(-90)"
            />
            <g transform="translate(590,0)">
                <g className="cow" transform="translate(0,150)">
                    <g transform="translate(15,20), scale(0.7)">
                        <CounterCow />
                    </g>
                    <text x={100} y={70}>
                        {counts[0]}
                    </text>
                </g>
            </g>
        </StyledJobAnimation>
    )
}
