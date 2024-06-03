// assumes that you have already run `npm build` and `npm vite build site` to create all the dist files
// noinspection JSVoidFunctionReturnValueUsed

import * as tar from "tar";
import fs from "fs";
import svgrPlugin from "esbuild-plugin-svgr";
import { build } from "esbuild";

const [, , projectName, projectPath, portString] = process.argv;

if (!projectName) {
    console.error("No project name given");
    process.exit(1);
}

const port = Number(portString);
if (isNaN(port)) {
    console.error("Invalid port number given", portString);
    process.exit(1);
}

// bundle the server
const options = {
    entryPoints: ["./server/src/index.ts"],
    bundle: true,
    platform: 'node',
    target: 'es2020',
    treeShaking: true,
    outfile: `${projectPath}/dist/server.js`,
    // outExtension: {'.js'},
    // format: 'esm'
};

// invoke esbuild to create the bundle
await build(options)

// Create the tarball
tar.c(
    {
        gzip: true,
        file: "dist.tar.gz",
        cwd: process.cwd() + "/" + projectPath + "/dist/"
    },
    ["."]
).then(() => {
    // Convert the tarball to a Base64 encoded string
    const tarballContent = fs.readFileSync("dist.tar.gz");
    const base64Data = tarballContent.toString("base64");

    // Construct the install.sh content
    const installScriptContent = `
    #!/bin/bash

    set -e
    set -o pipefail

    NODE_PATH=$(which node || true)

    if [ -z "$NODE_PATH" ]; then
        echo "Node.js is not installed. Installation aborted."
        exit 1
    else
        echo "Node.js is installed at $NODE_PATH."
    fi

    # Decode and unpack the application using a heredoc
    echo "Installing ${projectName} application..."
    mkdir -p /opt/${projectName}
    base64 -d << EOF | tar -xzf - -C /opt/${projectName}
    ${base64Data}
    EOF

    # Create a systemd service
    echo "Configuring service..."
    echo "[Unit]
    Description=${projectName}
    After=network.target

    [Service]
    ExecStart=/usr/bin/node /opt/${projectName}/server.js ${port}
    WorkingDirectory=/opt/${projectName}
    StandardOutput=inherit
    StandardError=inherit
    Restart=always
    User=root

    [Install]
    WantedBy=multi-user.target" > /etc/systemd/system/${projectName}.service

    # Reload systemd, enable and start the service
    systemctl daemon-reload
    systemctl enable ${projectName}.service

    echo "Installation complete!"
    echo ""
    echo "To start the service, run: "
    echo ""
    echo "    sudo systemctl start ${projectName}"
    `.toString().split("\n").map(s => s.trim()).join("\n") + "\n";

    // Write the install.sh file
    fs.mkdirSync("dist", { recursive: true });
    fs.writeFileSync("dist/"+projectName+"-install.sh", installScriptContent);
    console.log("Packaging complete!");
}).catch((error) => {
    console.error("Error packaging app:", error);
});
