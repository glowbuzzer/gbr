import React from "react"
import { Helmet } from "react-helmet"
import { useStaticQuery, graphql } from "gatsby"
import PropTypes from "prop-types"

function SEO({ description, title, keywords, siteUrl, lang, meta }) {
    const { site } = useStaticQuery(
        graphql`
            query {
              site {
                siteMetadata {
                  description
                  keywords
                  title
                  siteUrl
                }
              }
            }
          `
    )

    const metaDescription = description || site.siteMetadata.description
    const defaultTitle = site.siteMetadata.title
    const metaUrl = siteUrl || site.siteMetadata.siteUrl
    const metaKeywords = keywords || site.siteMetadata.keywords

    return (
        <Helmet
            htmlAttributes={{
                lang,
            }}
            title={title}
            titleTemplate={defaultTitle ? `%s | ${defaultTitle}` : null}
            meta={[
                {
                    property: `og:title`,
                    content: title,
                },
                {
                    property: `og:siteurl`,
                    content: metaUrl,
                },
                {
                    name: `keywords`,
                    content: metaKeywords,
                },
                {
                    property: `og:description`,
                    content: metaDescription,
                },
                {
                    property: `og:type`,
                    content: `website`,
                },
            ].concat(meta)}
        />
    )
}

SEO.defaultProps = {
    lang: `en`,
    meta: [],
    description: ``,
}

SEO.propTypes = {
    description: PropTypes.string,
    lang: PropTypes.string,
    meta: PropTypes.arrayOf(PropTypes.object),
    title: PropTypes.string.isRequired,
}

export default SEO