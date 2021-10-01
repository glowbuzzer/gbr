import { graphql, useStaticQuery } from "gatsby"

type GbcSchemaItem = {
    kindString: string
    name: string
}

export function useGbcSchemaNav(): { [index: string]: GbcSchemaItem[] } {
    const qr = useStaticQuery(graphql`
        query GbcSchemaNavQuery {
            allTypedoc {
                nodes {
                    source {
                        kindString
                        name
                    }
                }
            }
        }
    `)

    console.log("QR", qr)
    const groups = {
        Enumeration: [] as GbcSchemaItem[],
        "Type alias": [] as GbcSchemaItem[]
    }
    qr.allTypedoc.nodes.forEach(({ source }) => groups[source.kindString]?.push(source))

    return groups
}
