import { Button, StyleSheet, Text, View } from "react-native"
import {
    DesiredState,
    determine_machine_state,
    FaultCode,
    MachineState,
    possible_transitions,
    useConnection,
    useMachine
} from "@glowbuzzer/store"

// CHANGE THE CONNECT URL WITH ADDRESS WHERE GBC IS RUNNING
const CONNECT_URL = "ws://192.168.1.141:9001/ws"

export const SimpleConnectView = () => {
    const connection = useConnection()
    const machine = useMachine()

    const state = determine_machine_state(machine.statusWord)

    const connected = connection.connected && connection.statusReceived
    const fault = machine.currentState === MachineState.FAULT
    const fault_active = machine.currentState === MachineState.FAULT_REACTION_ACTIVE
    const target_not_acquired = machine.target !== machine.requestedTarget
    const op_enabled = !(!connected || fault || fault_active || target_not_acquired)

    function active_faults(faults: number) {
        // this function unpacks the combined faults code (bitwise or) into fault names
        function* gen() {
            for (let n = 0; n < 15; n++) {
                const fault = faults & (1 << n)
                if (fault) {
                    yield FaultCode[fault]
                }
            }
        }

        return Array.from(gen())
    }

    return (
        <View>
            <Text>Connection state: {connection.state}</Text>
            <View>
                <Text>
                    {connection.connected ? (
                        <Button title={"DISCONNECT"} onPress={() => connection.disconnect()} />
                    ) : (
                        <Button title={"CONNECT"} onPress={() => connection.connect(CONNECT_URL)} />
                    )}
                </Text>
            </View>
            <View>
                <View>
                    <View>
                        <Text>Machine operation</Text>
                    </View>
                    <Button
                        disabled={!op_enabled}
                        onPress={() => machine.setDesiredState(DesiredState.STANDBY)}
                        color={state === MachineState.OPERATION_ENABLED ? "gray" : undefined}
                        title={"Disabled"}
                    />
                    <Button
                        disabled={!op_enabled}
                        onPress={() => machine.setDesiredState(DesiredState.OPERATIONAL)}
                        color={state === MachineState.OPERATION_ENABLED ? undefined : "gray"}
                        title={"Enabled"}
                    />
                </View>

                {fault_active && (
                    <View>
                        <Text>FAULT ACTIVE</Text>
                        {active_faults(machine.activeFault).map(f => (
                            <Text key={f}>{f}</Text>
                        ))}
                    </View>
                )}

                {connected && fault && (
                    <Button
                        onPress={() =>
                            machine.setMachineControlWord(possible_transitions.FaultReset())
                        }
                        title={"Reset Fault"}
                    />
                )}

                {connection.statusReceived || <Text>No status received</Text>}
                {machine.heartbeatReceived || <Text>Lost heartbeat</Text>}
            </View>
        </View>
    )
}
