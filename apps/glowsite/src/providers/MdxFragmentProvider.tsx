import React, { createContext, useContext, useMemo } from "react"
import { graphql, useStaticQuery } from "gatsby"
import { MDXRenderer } from "gatsby-plugin-mdx"

type Fragment = {
    slug: string
    body: any
}

const fragmentContext = createContext<Fragment[]>(null)

export const MdxFragmentProvider = ({ children }) => {
    const qr = useStaticQuery(graphql`
        query AllMdx {
            allMdx {
                nodes {
                    body
                    slug
                }
            }
        }
    `)

    const fragments = useMemo(() => qr.allMdx.nodes.filter(n => n.slug.startsWith("fragments/")), [qr])
    return <fragmentContext.Provider value={fragments}>{children}</fragmentContext.Provider>
}

export function useFragment(name: string) {
    const fragments = useContext(fragmentContext)
    if (!fragments) {
        throw new Error("No FragmentProvider in scope")
    }

    return fragments.find(f => f.slug === `fragments/${name}`)
}

export const MdxFragment = ({ name, className = "" }) => {
    const fragment = useFragment(name)
    // concat classes provided with 'fragment' class
    const classes = [...className.split(" "), "fragment"].join(" ")
    return (
        <div className={classes}>
            <MDXRenderer>{fragment.body}</MDXRenderer>
        </div>
    )
}
