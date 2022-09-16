import { useJointPositions, useSoloActivity } from "@glowbuzzer/store"
import { Button, Text, View } from "react-native"

export const SimpleMoveView = () => {
    const joints = useJointPositions(0)
    const api = useSoloActivity(0)

    function move(n: number) {
        return api.moveJoints([n]).relative(true).promise()
    }

    return (
        <View>
            <View>
                <Text>Position: {joints[0]}</Text>
            </View>
            <View>
                <Button title={"Move -100"} onPress={() => move(-100)} />
                <Button title={"Move +100"} onPress={() => move(+100)} />
            </View>
        </View>
    )
}
