console.log("DIRNAME", __dirname)

module.exports = {
    pathPrefix: "/site",
    flags: {
        FAST_DEV: true
    },
    siteMetadata: {
        title: `Glowbuzzer - Web Stack Machine Motion`,
        description: `Develop machines using web technologies combined with real-time motion control`
    },
    plugins: [
        {
            resolve: "gatsby-transformer-react-docgen",
            options: {
                babelrcRoots: ["${__dirname}/../../libs/controls"]
            }
        },
        // {
        //     resolve: "gatsby-source-typedoc",
        //     options: {
        //         // Array of Typescript files to
        //         // include
        //         src: [`${__dirname}/../../libs/controls/src/dro/BitFieldDisplay.tsx`],
        //
        //         // Options passed to Typedoc Application
        //         // Usually corresponds to CLI args directly
        //         // See: https://typedoc.org/guides/options/
        //         typedoc: {
        //             tsconfig: `${__dirname}/../../libs/controls/tsconfig.lib.json`,
        //             logLevel: "Verbose"
        //         }
        //     }
        // },
        {
            // uses layouts/index.tsx and allows .layout prop in node generation
            // prevents full page reload on nav changes
            resolve: "gatsby-plugin-layout"
        },
        // {
        //     resolve: `gatsby-plugin-alias-imports`,
        //     options: {
        //         alias: {
        //             "@mycode": `${__dirname}/src/redux`,
        //             "@glowbuzzer/store": `${__dirname}/src/redux`
        //         },
        //         extensions: ["js", "ts"]
        //     }
        // },

        {
            resolve: "gatsby-plugin-antd",
            options: {
                style: true
            }
        },
        {
            resolve: `gatsby-plugin-less`,
            options: {
                loaderOptions: {
                    lessOptions: {
                        modifyVars: {
                            "menu-dark-bg": "#1d0d45"
                        },
                        javascriptEnabled: true
                    }
                }
            }
        },
        {
            // this replaces the gatsby-transformer-remark plugin, see: https://www.gatsbyjs.com/docs/how-to/routing/migrate-remark-to-mdx
            resolve: "gatsby-plugin-mdx",
            options: {
                extensions: [".md", ".mdx"],
                gatsbyRemarkPlugins: [
                    "gatsby-plugin-mdx-code-demo", // not sure this is used?
                    {
                        resolve: "gatsby-remark-responsive-iframe",
                        options: {
                            wrapperStyle: "margin-bottom: 1rem"
                        }
                    },
                    "gatsby-remark-prismjs",
                    "gatsby-remark-copy-linked-files",
                    "gatsby-remark-smartypants",
                    {
                        resolve: "gatsby-remark-images",
                        options: {
                            maxWidth: 1140,
                            quality: 90,
                            linkImagesToOriginal: false
                        }
                    }
                ]
            }
        },
        {
            resolve: "gatsby-plugin-canonical-urls",
            options: {
                siteUrl: "https://www.glowbuzzer.com"
            }
        },
        "gatsby-plugin-styled-components",
        {
            resolve: "gatsby-plugin-svgr",
            options: {
                svgo: false,
                ref: true
            }
        },
        `gatsby-plugin-react-helmet`,
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                name: `images`,
                path: `${__dirname}/src/images`
            }
        },
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                name: `content`,
                path: `${__dirname}/src/content`
            }
        },
        `gatsby-transformer-json`,
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                name: `docgen`,
                path: `${__dirname}/../../libs/controls`,
                ignore: [`**/*\.json`]
            }
        },
        `gatsby-transformer-sharp`,
        {
            resolve: require.resolve(`@nrwl/gatsby/plugins/nx-gatsby-ext-plugin`),
            options: {
                path: __dirname
            }
        },
        {
            resolve: `gatsby-plugin-sharp`,
            options: {
                icon: "src/images/micro-logo.svg"
            }
        },
        {
            resolve: `gatsby-plugin-manifest`,
            options: {
                name: `Glowbuzzer`,
                short_name: `Glowbuzzer`,
                start_url: `/`,
                // background_color: `#663399`,
                // theme_color: `#663399`,
                display: `minimal-ui`,
                icon: "src/images/micro-logo.svg"
            }
        }
    ]
}
