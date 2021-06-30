import * as all_suites from "./src/all_tests"
import { Command } from "commander"

const program = new Command()

program.option("-s, --suite <suite>", "suite to run")
//.option("-t, --test <test>", "test to run <test>")

program.parse(process.argv)

const { suite, test } = program.opts()

for (const [name, runner] of Object.entries(all_suites)) {
    if (!suite || suite === name) {
        runner.run()
    }
}
