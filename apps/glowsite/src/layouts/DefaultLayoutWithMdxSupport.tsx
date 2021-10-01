import React, { useEffect, useState } from "react"
import { MDXProvider } from "@mdx-js/react"
import SiteTopNav from "../antm/Nav0"
import SiteFooter from "../antm/Footer1"
import { enquireScreen } from "enquire-js"

import { Footer10DataSource, Nav00DataSource } from "../data/antmotion.data"
import { CodeDemo, CodeDemoStoreProvider } from "../components/CodeDemo"
import { MdxFragmentProvider } from "../providers/MdxFragmentProvider"
import { Link } from "gatsby"

let isMobile
enquireScreen(b => {
    isMobile = b
})

export const DefaultLayoutWithMdxSupport = ({ children }) => {
    const [show, setShow] = useState(false)
    const [mobile, setMobile] = useState(isMobile)

    const mdxComponents = {
        // h1: props => <h1 {...props} />,
        // this is our custom code with demo component
        CodeDemo: props => <CodeDemo {...props} />,
        // rewrite links using Link component
        a: ({ children, href, title }) => {
            return (
                <Link to={href} title={title}>
                    {children}
                </Link>
            )
        }
    }

    useEffect(() => {
        setTimeout(() => setShow(true), 500)
        enquireScreen(b => {
            setMobile(b)
        })
    }, [])

    return show ? (
        <CodeDemoStoreProvider>
            {/* MdxFragmentProvider is ours - it enables useFragment hook to get MDX fragments in a page */}
            <MdxFragmentProvider>
                {/* MDXProvider is NOT ours - it is required for MDXRenderer */}
                <MDXProvider components={mdxComponents}>
                    <SiteTopNav dataSource={Nav00DataSource} isMobile={mobile} />
                    {children}
                    <SiteFooter
                        id="Footer1_0"
                        key="Footer1_0"
                        dataSource={Footer10DataSource}
                        isMobile={mobile}
                    />
                </MDXProvider>
            </MdxFragmentProvider>
        </CodeDemoStoreProvider>
    ) : null
}
