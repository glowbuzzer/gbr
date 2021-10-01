import * as TypeDoc from 'typedoc';
import * as fs from "fs";

async function main() {
    const app = new TypeDoc.Application();

    // If you want TypeDoc to load tsconfig.json / typedoc.json files
    app.options.addReader(new TypeDoc.TSConfigReader());
    app.options.addReader(new TypeDoc.TypeDocReader());
    app.bootstrap({
        // typedoc options here
        entryPoints: ['libs/store/src/gbc.ts'],
        tsconfig: './tsconfig.doc.json'
    });

    const project = app.convert();

    if (project) {
        // Project may not have converted correctly
        const outputDir = 'docs';

        // Rendered docs
        // await app.generateDocs(project, outputDir)
        // Alternatively generate JSON output
        const json = app.serializer.toObject(project);
        const max=json.children.reduce((max, curr) => Math.max(max, curr.id), 0)
        console.log("MAX", max)
        // fs.writeFileSync("test.json", JSON.stringify(json, null, 2))
        // console.log(json)
    }
}

await main()
await main()
