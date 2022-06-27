/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { StateMachine } from "./StateMachine"

class Deferred {
    public promise: Promise<string>
    public reject: (reason?) => void
    public resolve: (value: string) => void

    constructor() {
        this.promise = new Promise((resolve, reject) => {
            this.reject = reject
            this.resolve = resolve
        })
    }
}

async function nextTick() {
    return new Promise(resolve => process.nextTick(resolve))
}

describe("state machine handling", () => {
    test("should transition to another state", () => {
        const stateMachine = new StateMachine("start")
        stateMachine.eval({
            start: {
                transitions: {
                    end: true
                }
            },
            end: {}
        })
        expect(stateMachine.currentState).toEqual("end")
    })

    test("should execute exit side effect", () => {
        let testval = 0
        const stateMachine = new StateMachine("start")
        stateMachine.eval({
            start: {
                exit: () => (testval = 1),
                transitions: {
                    end: true
                }
            },
            end: null
        })
        expect(stateMachine.currentState).toEqual("end")
        expect(testval).toEqual(1)
    })

    test("should execute enter side effect", () => {
        let testval = 0
        const stateMachine = new StateMachine("start")
        stateMachine.eval({
            start: {
                transitions: {
                    step1: true
                }
            },
            step1: {
                enter: () => {
                    testval = 1
                }
            }
        })
        expect(stateMachine.currentState).toEqual("step1")
        expect(testval).toEqual(1)
    })

    test("enter function can return the next state", () => {
        const stateMachine = new StateMachine("start")
        stateMachine.eval({
            start: {
                enter: () => "end"
            },
            end: null
        })
        expect(stateMachine.currentState).toEqual("end")
    })

    test("state can return next state plus user data", () => {
        const stateMachine = new StateMachine("start")
        stateMachine.eval({
            start: {
                enter: () => ({ state: "end", data: "foo" })
            },
            end: null
        })
        expect(stateMachine.currentState).toEqual("end")
        expect(stateMachine.userData).toEqual("foo")
    })

    test("enter function can return a promise", async () => {
        const deferred = new Deferred()

        const machine = new StateMachine("start")
        machine.eval({
            start: {
                enter: () => deferred.promise
            },
            end: null
        })

        deferred.resolve("end")
        await nextTick()

        expect(machine.currentState).toEqual("end")
    })

    test("should not change state on async if already transitioned", async () => {
        const deferred = new Deferred()

        const machine = new StateMachine("start")
        machine.eval({
            start: {
                enter: () => deferred.promise,
                transitions: {
                    other: true
                }
            },
            end: null,
            other: null
        })

        expect(machine.currentState).toEqual("other")

        deferred.resolve("end")
        await nextTick()

        expect(machine.currentState).toEqual("other")
    })

    test("should execute exit function even if not eval", async () => {
        const deferred = new Deferred()
        let testval

        const machine = new StateMachine("start")
        machine.eval({
            start: {
                enter: () => deferred.promise,
                exit: () => {
                    testval = true
                }
            },
            end: null
        })

        expect(machine.currentState).toEqual("start")
        deferred.resolve("end")
        await nextTick()

        expect(machine.currentState).toEqual("end")
        expect(testval).toEqual(true)
    })
})
