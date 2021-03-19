const path = require("path")

exports.createPages = async ({ graphql, actions }) => {
    const { createPage } = actions

    const allMarkdown = await graphql(`
        {
            allMdx(limit: 1000) {
                edges {
                    node {
                        slug
                    }
                }
            }
        }
    `)

    if (allMarkdown.errors) {
        console.error(allMarkdown.errors)
        throw new Error(allMarkdown.errors)
    }

    allMarkdown.data.allMdx.edges.forEach(({ node }) => {
        const { slug, frontmatter } = node
        const name =
            (frontmatter && frontmatter.slug) ||
            slug
                .split("/")
                .filter(s => s.length)
                .pop() // get last part of the auto-generated slug

        createPage({
            path: slug,
            component: path.resolve(`./src/components/page/MdxContentPage.tsx`),
            context: {
                // Data passed to context is available in page queries as GraphQL variables.
                slug,
                layout: "docs",
                name
            }
        })
    })
}
