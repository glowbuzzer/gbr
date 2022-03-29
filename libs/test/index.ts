import { Command } from "commander"
import * as all_suites from "./src/all_tests"

const program = new Command()

program
    .option("-p, --plot", "whether to output plot files")
    .option("-s, --suite <suite>", "suite to run")
    .option("-l, --lib <gbc_lib_path>", "path to gbc node add-in")

program.parse(process.argv)
const { suite } = program.opts()

for (const [name, runner] of Object.entries(all_suites)) {
    if (!suite || suite === name) {
        runner.run()
    }
}
