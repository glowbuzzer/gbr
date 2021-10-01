import React from "react"
import { graphql, Link, useStaticQuery } from "gatsby"
import { Menu } from "antd"
import { StyledLeftNav } from "./nav/StyledLeftNav"

function slug_path(slug) {
    return slug.split("/").filter(p => p.trim().length)
}

function add_nav(item, tree) {
    const path = slug_path(item.relative)
    path.reduce((n, p) => {
        if (!n[p]) {
            n[p] = { $node: item }
        }
        return n[p]
    }, tree)
}

function slug_sort(a, b) {
    const [len1, len2] = [a.slug, b.slug].map(s => s.split("/")).map(s => s.length)
    if (len1 !== len2) {
        return len1 - len2
    }
    return a.slug.localeCompare(b.slug)
}

function node_sort(kva, kvb) {
    // items passed are key-value pair, we only care about the value
    const [, a] = kva
    const [, b] = kvb

    const { $node: $a, ...$ca } = a
    const { $node: $b, ...$cb } = b

    const ne = n => Object.keys(n).length > 0 // not empty test

    // nodes without children come first
    if ((ne($ca) && ne($cb)) || !(ne($ca) || ne($cb))) {
        // both nodes have children or neither does, use sort in frontmatter or the slug
        const sa = isNaN($a.frontmatter?.sort) ? 1000 : $a.frontmatter.sort
        const sb = isNaN($b.frontmatter?.sort) ? 1000 : $b.frontmatter.sort

        if (sa === sb) {
            return $a.slug.localeCompare($b.slug)
        }
        return sa - sb
    }
    // one has children
    return $ca ? 1 : -1
}

export const DynamicLeftNav = ({ current }) => {
    const qr = useStaticQuery(graphql`
        query MyQuery {
            allMdx {
                nodes {
                    id
                    slug
                    frontmatter {
                        title
                        slug
                        section
                        sort
                    }
                }
            }
        }
    `)

    console.log("QUERY", qr)
    const root = qr.allMdx.nodes.find(
        ({ slug, frontmatter }) => frontmatter.section && current.startsWith(slug)
    )
    console.log("FOUND ROOT", root)

    const subnav = qr.allMdx.nodes
        .filter(({ slug, frontmatter }) => slug.startsWith(root.slug) && slug !== root.slug)
        .map(i => ({
            ...i,
            relative: i.slug.substr(root.slug.length)
        }))
        .sort(slug_sort)

    const tree = {} as unknown
    for (const item of subnav) {
        add_nav(item, tree)
    }

    console.log("SUBNAV", subnav)
    console.log("TREE", tree)
    console.log("CURRENT", current)
    // TODO: auto-expand the selected item

    return (
        <StyledLeftNav>
            <div className="title">{root.frontmatter?.title}</div>
            <Menu mode="inline" selectedKeys={[current]}>
                {Object.entries(tree)
                    .sort(node_sort)
                    .map(([k, parent]) => {
                        const { $node, ...children } = parent
                        const title = $node?.frontmatter?.title
                        if (Object.keys(children).length) {
                            return (
                                <Menu.SubMenu
                                    key={$node.id}
                                    className={title || "capitalize"}
                                    title={title || k}
                                >
                                    {Object.keys(children)
                                        .filter(c => !c.startsWith("_")) // filter _meta
                                        .sort()
                                        .map(c => (
                                            <Menu.Item key={children[c].$node.slug}>
                                                <Link to={"/" + children[c].$node.slug}>
                                                    {children[c].$node?.frontmatter?.title || c}
                                                </Link>
                                            </Menu.Item>
                                        ))}
                                </Menu.SubMenu>
                            )
                        }
                        return (
                            <Menu.Item key={$node.slug}>
                                <Link to={"/" + $node.slug}>{title || k}</Link>
                            </Menu.Item>
                        )
                    })}
            </Menu>
        </StyledLeftNav>
    )
}
