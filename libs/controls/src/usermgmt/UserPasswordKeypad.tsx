import React, { useEffect, useState } from "react"
import styled from "styled-components"
import { Loader } from "@react-three/drei"

const StyledKeypad = styled.div`
    text-align: center;

    .keypad {
        display: inline-grid;
        grid-template-columns: repeat(3, 1fr);
        font-size: 1.4em;
        font-weight: bold;

        &.disabled {
            pointer-events: none;
            opacity: 0.5;
        }

        .key {
            user-select: none;
            margin: 2px;
            padding: 10px 30px;
            background: ${props => props.theme.colorBgTextActive};

            &:hover {
                background: ${props => props.theme.purple3};
            }

            &.pressed {
                background: ${props => props.theme.purple8};
            }
        }
    }

    .code {
        font-size: 1.4em;
        font-weight: bold;
        margin: 10px;
        color: #424242;

        span {
            width: 40px;
            display: inline-block;
            border: 1px solid grey;
            margin: 3px;
            padding: 8px 10px 8px 10px;
        }
    }
`

const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", null, "0", "C"]

enum State {
    INPUT,
    VALIDATING,
    INVALID
}

type UserPasswordKeypadProps = {
    onValidate: (pin: string) => Promise<boolean>
    prompt?: string
}

export const UserPasswordKeypad = ({ prompt, onValidate }: UserPasswordKeypadProps) => {
    const [pressed, setPressed] = useState<string>(null)
    const [pin, setPin] = useState("")
    const [state, setState] = useState(State.INPUT)

    useEffect(() => {
        if (pressed) {
            const timeout = setTimeout(() => {
                setPressed(null)
            }, 200)

            return () => clearTimeout(timeout)
        }
    }, [pressed])

    useEffect(() => {
        if (pin.length === 4) {
            setState(State.VALIDATING)
            onValidate(pin).then(valid => {
                setState(valid ? State.INPUT : State.INVALID)
                setPin("")
            })
        }
    }, [pin])

    function add(key: string) {
        setPressed(key)
        if (key === "C") {
            setPin("")
        } else {
            setPin(code => code + key)
        }
    }

    return (
        <StyledKeypad>
            <div className="wrapper">
                <div className="code">
                    {pin
                        .padEnd(4, " ")
                        .split("")
                        .map((c, index) =>
                            pressed && index === pin.length - 1 ? (
                                c
                            ) : index >= pin.length ? (
                                <>&nbsp;</>
                            ) : (
                                "•"
                            )
                        )
                        .map((c, index) => (
                            <span key={index}>{c}</span>
                        ))}
                </div>

                {state === State.INVALID ? (
                    <div>Invalid code. Please try again</div>
                ) : state === State.VALIDATING ? (
                    <div>
                        <Loader />
                        &nbsp;&nbsp;Please wait...
                    </div>
                ) : (
                    <div>{prompt || <>Enter PIN</>}</div>
                )}

                <div className={["keypad", state === State.VALIDATING && "disabled"].join(" ")}>
                    {keys.map((key, i) => (
                        <div
                            key={i}
                            className={[key && "key", key === pressed && "pressed"].join(" ")}
                            onClick={() => add(key)}
                        >
                            {key}
                        </div>
                    ))}
                </div>
            </div>
        </StyledKeypad>
    )
}
