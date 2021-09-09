module.exports = {
    displayName: "dummy",
    preset: "../../jest.preset.js",
    transform: {
        "^.+\\.[tj]sx?$": "babel-jest"
    },
    moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
    coverageDirectory: "../../coverage/libs/dummy"
}
