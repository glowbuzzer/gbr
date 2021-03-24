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
        margin-top: 20px;
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
        background: inherit;
        font-weight: bold;
        color: #797979;
        padding: inherit;
    }
`
/**
 * Query for node by slug and render using MDXRenderer (custom MDXProvider in DefaultLayoutWithMdxSupport.tsx)
 */
const MdxContentPage = ({ data }) => {
    return (
        <StyledMdxPage>
            <MDXRenderer>{data.mdx.body}</MDXRenderer>
            <ComponentProps data={data.componentMetadata} />
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
