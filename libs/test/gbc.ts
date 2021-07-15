import { GbcTest } from "./src/framework"

const addon = require("../../../builds/cmake-build-gbc_linux/libs/gbc-node/gbc-node.node")
export const gbc = new GbcTest(addon)
