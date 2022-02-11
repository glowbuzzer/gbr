import { GbcTest } from "./src/framework"
import { Command } from "commander"

const program = new Command()

program
    .option("-s, --suite <suite>", "suite to run")
    .option("-l, --lib <gbc_lib_path>", "path to gbc node add-in")

program.parse(process.argv)
const { lib } = program.opts()

const addon = require(`../../../${lib}/libs/gbc-node/gbc-node.node`)
export const gbc = new GbcTest(addon)
