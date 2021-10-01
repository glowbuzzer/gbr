// const typescript = require("typescript")
const { Application, TypeDocReader, TSConfigReader } = require("typedoc")
const fs = require("fs")

exports.sourceNodes = async (
    { actions, createNodeId, createContentDigest, cache, reporter },
    configOptions
) => {
    const { createNode } = actions

    delete configOptions.plugins

    const { id = "default", typedoc: typedocOptions = {} } = configOptions
    const input_file = typedocOptions.entryPoints[0]

    reporter.info("Setting up TypeDoc generation")

    function processTypeDoc(generated) {
        for (const item of generated?.children) {
            const nodeId = createNodeId(`typedoc-${id}-${item.name}`)
            createNode({
                id: nodeId,
                typedocId: id,
                source: item,
                internal: {
                    type: "Typedoc",
                    contentDigest: createContentDigest(item)
                }
            })
        }
    }

    async function processInput() {
        const app = new Application()
        app.options.addReader(new TypeDocReader())
        app.options.addReader(new TSConfigReader())

        const options = Object.assign(
            {
                name: id
            },
            typedocOptions
        )
        app.bootstrap(options)

        try {
            const project = app.convert()

            if (project) {
                const json = app.serializer.toObject(project)
                processTypeDoc(json)

                reporter.success(`Generated TypeDoc`)
            } else {
                reporter.warn("TypeDoc returned an empty project")
            }
        } catch (error) {
            reporter.panicOnBuild("Error executing TypeDoc", error)
        }
    }

    let wait = false
    fs.watch(input_file, {}, (event, filename) => {
        if (!wait) {
            wait = true
            setTimeout(() => {
                reporter.info("Generating TypeDoc on change in " + input_file)
                return processInput().finally(() => (wait = false))
            }, 1000)
        }
    })

    return processInput()
    // return new Promise.resolve(true)
    // return new Promise((resolve, reject) => {
    //     // TODO: handle multiple files
    // })
}
