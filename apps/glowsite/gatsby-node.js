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
        const breadcrumb = slug.split("/").filter(s => s.length)
        const name = (frontmatter && frontmatter.slug) || breadcrumb.pop() // get last part of the auto-generated slug

        // we only want to create nodes for mdx files that are in "known" locations where we want pages
        switch (breadcrumb[0]) {
            case "docs":
            case "how-it-works":
            case "get-started":
            case "blogs":
            case "about":
                createPage({
                    path: slug,
                    component: path.resolve(`./src/components/page/MdxContentPage.tsx`),
                    context: {
                        // Data passed to context is available in page queries as GraphQL variables.
                        slug,
                        layout: breadcrumb[0],
                        name
                    }
                })
        }
    })

    const allTypedoc = await graphql(`
        {
            allTypedoc {
                edges {
                    node {
                        source {
                            kindString
                            id
                            name
                        }
                    }
                }
            }
        }
    `)

    allTypedoc.data.allTypedoc.edges.forEach(({ node }) => {
        const { kindString, name } = node.source

        createPage({
            path: "docs/gbc/schema/" + name,
            component: path.resolve(`./src/components/page/GbcSchemaPage.tsx`),
            context: {
                // Data passed to context is available in page queries as GraphQL variables.
                layout: "gbc-schema", // handled in src/layouts/index.tsx (may use default fallback layout)
                name
            }
        })
    })
}
