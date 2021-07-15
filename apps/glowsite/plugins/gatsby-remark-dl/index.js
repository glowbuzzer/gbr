const deflist = require("remark-deflist")

module.exports = ({ markdownAST: root }) => {
    return new Promise(resolve => {
        deflist()(root)
        resolve(root)
    })
}
