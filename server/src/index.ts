import * as express from "express"
import { createServer } from "http"
import * as path from "path"

const [, , portString] = process.argv

const port = Number(portString)
if (isNaN(port)) {
    console.error("Invalid port number", portString)
    process.exit(1)
}

/**
 * Configure and start a very basic Express server. This will serve the static GBR frontend.
 */

const app = express()
const server = createServer(app)

const frontendPath = path.join(__dirname, ".")
// add the static express middleware to serve the frontend
app.use(express.static(frontendPath))

// handle single-page app routing by directing all other routes to the index.html file
// (not strictly necessary as the frontend doesn't currently have any routes)
app.get("*", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"))
})

server.listen(port, () => {
    console.log("Server listening on port", port)
})
