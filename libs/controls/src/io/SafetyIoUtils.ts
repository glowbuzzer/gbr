/** Parses a description string into a description and a list of states and which state is an error state */

export const parseDescription = (descriptionString = "") => {
    if (!descriptionString.includes("|")) {
        return { description: descriptionString, states: [] }
    }
    const [description, statesString] = descriptionString.split("|").map(str => str.trim())
    const states = statesString.split(",").map(state => {
        const [stateValue, label, error] = state.split(":")
        return {
            state: parseInt(stateValue, 10),
            label: label.trim(),
            isError: error === "(negativeState)"
        }
    })
    return { description, states }
}
