import { graphql, Link } from "gatsby"
import React from "react"
import { ComponentProps } from "../ComponentProps"
import { unified } from "unified"
import remarkParse from "remark-parse"
// import remarkSlug from 'remark-slug'
// import remarkToc from 'remark-toc'
// import remarkGithub from 'remark-github'
import remarkRehype from "remark-rehype"
// import rehypeHighlight from 'rehype-highlight'
import rehypeReact from "rehype-react"

const processor = unified()
    .use(remarkParse)
    // .use(remarkSlug)
    // .use(remarkToc)
    // .use(remarkGithub, { repository: "rehypejs/rehype-react" })
    .use(remarkRehype)
    // .use(rehypeHighlight)
    .use(rehypeReact, {
        createElement: React.createElement,
        components: {
            a: ({ children, href, title }) => {
                return (
                    <Link to={href} title={title}>
                        {children}
                    </Link>
                )
            }
        }
    })

const GbcSchemaPage = ({ data }) => {
    console.log("DATA", data)
    const doc = data.typedoc.source
    switch (doc.kindString) {
        case "Type alias": {
            const props = doc.type.declaration.children.map(p => ({
                key: p.name,
                name: { name: p.name, required: false },
                type: p.type.id ? <Link to={"../" + p.type.name}>{p.type.name}</Link> : p.type.name,
                description: p.comment?.shortText || ""
            }))

            const text = doc.comment?.text?.length
                ? processor.processSync(doc.comment.text).result
                : ""

            return (
                <>
                    <h1>{doc.name}</h1>
                    <div className="shortText">{doc.comment?.shortText}</div>
                    <div className="text">{text}</div>
                    <ComponentProps
                        displayName={doc.name}
                        properties={props}
                        showDefaults={false}
                    />
                </>
            )
        }
        default:
            return <></>
    }
}

export default GbcSchemaPage

export const query = graphql`
    query GbcSchemaPageQuery($name: String!) {
        typedoc(source: { name: { eq: $name } }) {
            source {
                name
                kind
                kindString
                type {
                    id
                    declaration {
                        children {
                            name
                            type {
                                name
                                id
                            }
                            comment {
                                shortText
                            }
                        }
                    }
                    type
                }
                children {
                    name
                }
                comment {
                    shortText
                    text
                }
            }
        }
    }
`
