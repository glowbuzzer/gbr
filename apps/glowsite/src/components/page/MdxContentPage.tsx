import React from "react"
import { MDXRenderer } from "gatsby-plugin-mdx"
import { graphql } from "gatsby"
import { ComponentProps } from "../ComponentProps"
import styled from "styled-components"

/**
 * Render an MDX page, plus React component properties if available.
 *
 * This is a page, in the sense that it can use dynamic graphql. But it's referenced by node building code in gatsby-node.js,
 * rather than pages that are mounted by virtue of being in src/pages. It's wrapped by a client-side layout in src/layouts/index.tsx
 */

const StyledMdxPage = styled.div`
    padding: 0 20px;

    h2 {
        margin-top: 40px;
    }

    p {
        margin: 0.5em 0;
        font-size: 1.1em !important;
    }

    .gatsby-highlight {
        margin-bottom: 1em;
    }
   

    code.language-text {
        border: inherit;
        // background: rgba(27, 31, 35, 0.05);
background: rgba(0, 0, 0, 0.5);
        font-family: SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace;
        //font-weight: bold;
        color: #ffffff;
        padding: 0 12px;
    }

  }
`
/**
 * Query for node by slug and render using MDXRenderer (custom MDXProvider in DefaultLayoutWithMdxSupport.tsx)
 */
const MdxContentPage = ({ data }) => {
    const componentMetadata = data.componentMetadata
    const componentProps = componentMetadata?.childrenComponentProp?.map(p => ({
        key: p.name,
        name: { name: p.name, required: p.required },
        type: p.type?.name,
        description: p.description?.text,
        default: p.defaultValue?.value
    }))

    console.log("MDX", data.mdx.body)
    return (
        <StyledMdxPage>
            <MDXRenderer>{data.mdx.body}</MDXRenderer>
            {componentProps && (
                <ComponentProps
                    displayName={componentMetadata.displayName}
                    properties={componentProps}
                    showDefaults={true}
                />
            )}
        </StyledMdxPage>
    )
}

export default MdxContentPage

export const query = graphql`
    query PageTemplateQuery($slug: String!, $name: String!) {
        mdx(slug: { eq: $slug }) {
            body
            frontmatter {
                slug
            }
        }
        componentMetadata(displayName: { eq: $name }) {
            displayName
            childrenComponentProp {
                name
                required
                defaultValue {
                    value
                }
                description {
                    text
                }
                type {
                    name
                }
            }
        }
    }
`
