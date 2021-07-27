import { StateMachine } from "./StateMachine"

class Deferred {
    public promise: Promise<unknown>
    public reject: (reason?) => void
    public resolve: (value) => void

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
        const next = new StateMachine("start").eval({
            start: {
                transitions: {
                    end: true
                }
            },
            end: {}
        })
        expect(next).toEqual("end")
    })

    test("should execute exit side effect", () => {
        let testval = 0
        const next = new StateMachine("start").eval({
            start: {
                exit: () => (testval = 1),
                transitions: {
                    end: true
                }
            },
            end: null
        })
        expect(next).toEqual("end")
        expect(testval).toEqual(1)
    })

    test("should execute enter side effect", () => {
        let testval = 0
        const next = new StateMachine("start").eval({
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
        expect(next).toEqual("step1")
        expect(testval).toEqual(1)
    })

    test("enter function can return the next state", () => {
        const next = new StateMachine("start").eval({
            start: {
                enter: () => "end"
            },
            end: null
        })
        expect(next).toEqual("end")
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

        expect(machine.current_state).toEqual("end")
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

        expect(machine.current_state).toEqual("other")

        deferred.resolve("end")
        await nextTick()

        expect(machine.current_state).toEqual("other")
    })
})
