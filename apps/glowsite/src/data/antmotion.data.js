import React from "react"

import { SmallLogo, StandardLogo } from "../components/logos"
import { GithubOutlined } from "@ant-design/icons"

function sub_item(title, description, to = "/") {
    return {
        className: "item-sub",
        children: {
            to,
            className: "item-sub-item",
            children: [
                {
                    name: "title",
                    className: "item-title",
                    children: title
                },
                {
                    name: "content",
                    className: "item-content",
                    children: description
                }
            ]
        }
    }
}

export const Nav00DataSource = {
    wrapper: { className: "header0 glow-page-wrapper" },
    page: { className: "glow-page" },
    logo: {
        className: "header0-logo",
        children: (
            <a href="/">
                <SmallLogo />
            </a>
        )
    },
    Menu: {
        className: "header0-menu",
        children: [
            {
                className: "header0-item",
                children: {
                    href: "#",
                    children: [{ children: "How it works", name: "text" }]
                },
                subItem: [
                    sub_item("Basics", "How it all fits together", "/how-it-works/basics"),
                    sub_item("Detail", "More technical details on the toolkit", "/how-it-works/detail"),
                    sub_item("Fieldbus", "How does the fieldbus interface work", "/how-it-works/fieldbus"),
                    sub_item("Drives", "How does it integrate with drives", "/how-it-works/drives"),
                    sub_item("Linux", "How to run on a Linux platform", "/how-it-works/linux"),
                    sub_item("Embedded", "How to run on a microcontroller", "/how-it-works/embedded")
                ].map((item, index) => ({
                    ...item,
                    name: `how${index}`
                }))
            },
            {
                className: "header0-item",
                children: {
                    href: "#",
                    children: [{ children: "Get started", name: "text" }]
                },
                subItem: [
                    sub_item("Hardware", "Starter kits and recommended hardware", "/get-started/hardware"),
                    sub_item("Motion", "Get a drive moving", "/get-started/motion"),
                    sub_item("Front-end", "Clone and modify a front-end template", "/get-started/front-end"),
                    sub_item("EtherCAT", "Commission an EtherCAT master", "/get-started/ethercat")
                ].map((item, index) => ({
                    ...item,
                    name: `get-started${index}`
                }))
            },
            {
                className: "header0-item",
                children: {
                    href: "#",
                    children: [{ children: "Documentation", name: "text" }]
                },
                subItem: [
                    sub_item("Tutorials", "Step-by-step guidance", "/docs/tutorials/"),
                    sub_item("Core Control (GBC)", "Core control documentation", "/docs/gbc/"),
                    sub_item("EtherCAT Master (GBEM)", "EtherCAT master documentation", "/docs/gbem/"),
                    sub_item("Front-end", "React component documentation", "/docs/ui/")
                ].map((item, index) => ({
                    ...item,
                    name: `docs${index}`
                }))
            },
            {
                className: "header0-item",
                children: {
                    href: "#",
                    children: [{ children: "Blogs", name: "text" }]
                },
                subItem: [
                    sub_item("Embedded", "All about embedded"),
                    sub_item("Drives", "All about drives"),
                    sub_item("Webdev", "Web development in automation")
                ].map((item, index) => ({
                    ...item,
                    name: `about${index}`
                }))
            },
            {
                className: "header0-item",
                children: {
                    href: "#",
                    children: [{ children: "About", name: "text" }]
                },
                subItem: [
                    sub_item("Vision", "What we want to achieve"),
                    sub_item("Values", "What we stand for"),
                    sub_item("Contact", "Contact form, location information")
                ].map((item, index) => ({
                    ...item,
                    name: `about${index}`
                }))
            },
            {
                className: "header0-item",
                children: {
                    href: "https://www.github.com/glowbuzzer",
                    children: [{ children: <GithubOutlined width={32} />, name: "text" }]
                }
            }
        ].map((item, index) => ({ ...item, name: `item${index}` }))
    },
    mobileMenu: { className: "header0-mobile-menu" }
}
export const Banner01DataSource = {
    wrapper: { className: "banner0" },
    textWrapper: { className: "banner0-text-wrapper" },
    title: {
        className: "banner0-title",
        children: <StandardLogo />
    },
    content: {
        className: "banner0-content",
        children: "Web Stack Machine Motion"
    },
    button: { className: "banner0-button", children: "Learn More" }
}
/* NOT USED - see HomeFeatures.tsx
export const Content00DataSource = {
    wrapper: { className: "glow-page-wrapper content0-wrapper" },
    page: { className: "glow-page content0" },
    OverPack: { playScale: 0.3, className: "" },
    titleWrapper: {
        className: "title-wrapper",
        children: [{ name: "title", children: "Features" }]
    },
    childWrapper: {
        className: "content0-block-wrapper",
        children: [
            {
                name: "block0",
                className: "content0-block",
                md: 8,
                xs: 24,
                children: {
                    className: "content0-block-item",
                    children: [
                        {
                            name: "image",
                            className: "content0-block-icon",
                            children: <StackIcon />
                        },
                        {
                            name: "title",
                            className: "content0-block-title",
                            children: "Web stack"
                        },
                        { name: "content", children: "Build complex machine control applications in a web stack - no proprietary languages or IDEs" }
                    ]
                }
            },
            {
                name: "block1",
                className: "content0-block",
                md: 8,
                xs: 24,
                children: {
                    className: "content0-block-item",
                    children: [
                        {
                            name: "image",
                            className: "content0-block-icon",
                            children: "https://zos.alipayobjects.com/rmsportal/YPMsLQuCEXtuEkmXTTdk.png"
                        },
                        {
                            name: "title",
                            className: "content0-block-title",
                            children: "Web Development Paradigm"
                        },
                        {
                            name: "content",
                            children: "Accelerate your development with web development tools and techniques"
                        }
                    ]
                }
            },
            {
                name: "block2",
                className: "content0-block",
                md: 8,
                xs: 24,
                children: {
                    className: "content0-block-item",
                    children: [
                        {
                            name: "image",
                            className: "content0-block-icon",
                            children: "https://zos.alipayobjects.com/rmsportal/EkXWVvAaFJKCzhMmQYiX.png"
                        },
                        {
                            name: "title",
                            className: "content0-block-title",
                            children: "Integration"
                        },
                        {
                            name: "content",
                            children: "Easily integrate with any web based services"
                        }
                    ]
                }
            }
        ]
    }
}
*/
export const Content50DataSource = {
    wrapper: { className: "glow-page-wrapper content5-wrapper" },
    page: { className: "glow-page content5" },
    OverPack: { playScale: 0.3, className: "" },
    titleWrapper: {
        className: "title-wrapper",
        children: [
            { name: "title", children: "Product Details", className: "title-h1" },
            {
                name: "content",
                className: "title-content",
                children: "Find out more about the Glowbuzzer ecosystem"
            }
        ]
    },
    block: {
        className: "content5-img-wrapper",
        gutter: 16,
        children: [
            {
                name: "block7",
                className: "block",
                md: 6,
                xs: 24,
                children: {
                    wrapper: { className: "content5-block-content" },
                    img: {
                        children: "https://zos.alipayobjects.com/rmsportal/faKjZtrmIbwJvVR.svg"
                    },
                    content: { children: "Real Time" }
                }
            },
            {
                name: "block0",
                className: "block",
                md: 6,
                xs: 24,
                children: {
                    wrapper: { className: "content5-block-content" },
                    img: {
                        children: "https://t.alipayobjects.com/images/rmsweb/T11aVgXc4eXXXXXXXX.svg"
                    },
                    content: { children: "Motion Control" }
                }
            },
            {
                name: "block1",
                className: "block",
                md: 6,
                xs: 24,
                children: {
                    wrapper: { className: "content5-block-content" },
                    img: {
                        children: "https://zos.alipayobjects.com/rmsportal/faKjZtrmIbwJvVR.svg"
                    },
                    content: { children: "User Interface" }
                }
            },
            {
                name: "block2",
                className: "block",
                md: 6,
                xs: 24,
                children: {
                    wrapper: { className: "content5-block-content" },
                    img: {
                        children: "https://t.alipayobjects.com/images/rmsweb/T11aVgXc4eXXXXXXXX.svg"
                    },
                    content: { children: "Development Boards" }
                }
            },
            {
                name: "block3",
                className: "block",
                md: 6,
                xs: 24,
                children: {
                    wrapper: { className: "content5-block-content" },
                    img: {
                        children: "https://zos.alipayobjects.com/rmsportal/faKjZtrmIbwJvVR.svg"
                    },
                    content: { children: "EtherCAT" }
                }
            },
            {
                name: "block4",
                className: "block",
                md: 6,
                xs: 24,
                children: {
                    wrapper: { className: "content5-block-content" },
                    img: {
                        children: "https://t.alipayobjects.com/images/rmsweb/T11aVgXc4eXXXXXXXX.svg"
                    },
                    content: { children: "Lorum Ipsum" }
                }
            },
            {
                name: "block5",
                className: "block",
                md: 6,
                xs: 24,
                children: {
                    wrapper: { className: "content5-block-content" },
                    img: {
                        children: "https://zos.alipayobjects.com/rmsportal/faKjZtrmIbwJvVR.svg"
                    },
                    content: { children: "Lorum Ipsum" }
                }
            },
            {
                name: "block6",
                className: "block",
                md: 6,
                xs: 24,
                children: {
                    wrapper: { className: "content5-block-content" },
                    img: {
                        children: "https://t.alipayobjects.com/images/rmsweb/T11aVgXc4eXXXXXXXX.svg"
                    },
                    content: { children: "Lorum Ipsum" }
                }
            }
        ]
    }
}
export const Content30DataSource = {
    wrapper: { className: "glow-page-wrapper content3-wrapper" },
    page: { className: "glow-page content3" },
    OverPack: { playScale: 0.3 },
    titleWrapper: {
        className: "title-wrapper",
        children: [
            {
                name: "title",
                children: "Documentation",
                className: "title-h1"
            },
            {
                name: "content",
                className: "title-content",
                children: "Learn how to integrate Glowbuzzer into your project"
            }
        ]
    },
    block: {
        className: "content3-block-wrapper",
        children: [
            {
                name: "block0",
                className: "content3-block",
                md: 8,
                xs: 24,
                children: {
                    icon: {
                        className: "content3-icon",
                        children: "https://zos.alipayobjects.com/rmsportal/ScHBSdwpTkAHZkJ.png"
                    },
                    textWrapper: { className: "content3-text" },
                    title: { className: "content3-title", children: "User Interface Framework" },
                    content: {
                        className: "content3-content",
                        children: "Bootstrap your development with example frontend projects"
                    }
                }
            },
            {
                name: "block1",
                className: "content3-block",
                md: 8,
                xs: 24,
                children: {
                    icon: {
                        className: "content3-icon",
                        children: "https://zos.alipayobjects.com/rmsportal/NKBELAOuuKbofDD.png"
                    },
                    textWrapper: { className: "content3-text" },
                    title: { className: "content3-title", children: "Lorum Ipsum" },
                    content: {
                        className: "content3-content",
                        children: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur"
                    }
                }
            },
            {
                name: "block2",
                className: "content3-block",
                md: 8,
                xs: 24,
                children: {
                    icon: {
                        className: "content3-icon",
                        children: "https://zos.alipayobjects.com/rmsportal/xMSBjgxBhKfyMWX.png"
                    },
                    textWrapper: { className: "content3-text" },
                    title: { className: "content3-title", children: "Lorum Ipsum" },
                    content: {
                        className: "content3-content",
                        children: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur"
                    }
                }
            },
            {
                name: "block3",
                className: "content3-block",
                md: 8,
                xs: 24,
                children: {
                    icon: {
                        className: "content3-icon",
                        children: "https://zos.alipayobjects.com/rmsportal/MNdlBNhmDBLuzqp.png"
                    },
                    textWrapper: { className: "content3-text" },
                    title: { className: "content3-title", children: "Lorum Ipsum" },
                    content: {
                        className: "content3-content",
                        children: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur"
                    }
                }
            },
            {
                name: "block4",
                className: "content3-block",
                md: 8,
                xs: 24,
                children: {
                    icon: {
                        className: "content3-icon",
                        children: "https://zos.alipayobjects.com/rmsportal/UsUmoBRyLvkIQeO.png"
                    },
                    textWrapper: { className: "content3-text" },
                    title: { className: "content3-title", children: "Lorum Ipsum" },
                    content: {
                        className: "content3-content",
                        children: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur"
                    }
                }
            },
            {
                name: "block5",
                className: "content3-block",
                md: 8,
                xs: 24,
                children: {
                    icon: {
                        className: "content3-icon",
                        children: "https://zos.alipayobjects.com/rmsportal/ipwaQLBLflRfUrg.png"
                    },
                    textWrapper: { className: "content3-text" },
                    title: { className: "content3-title", children: "Lorum Ipsum" },
                    content: {
                        className: "content3-content",
                        children: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur"
                    }
                }
            }
        ]
    }
}
export const Footer10DataSource = {
    wrapper: { className: "glow-page-wrapper footer1-wrapper" },
    OverPack: { className: "footer1", playScale: 0.2 },
    block: {
        className: "glow-page",
        gutter: 0,
        children: [
            {
                name: "block0",
                xs: 24,
                md: 6,
                className: "block",
                title: {
                    className: "logo",
                    children: "https://zos.alipayobjects.com/rmsportal/qqaimmXZVSwAhpL.svg"
                },
                childWrapper: {
                    className: "slogan",
                    children: [
                        {
                            name: "content0",
                            children: "Animation specification and components of Ant Design."
                        }
                    ]
                }
            },
            {
                name: "block1",
                xs: 24,
                md: 6,
                className: "block",
                title: { children: "Documentation" },
                childWrapper: {
                    children: [
                        { name: "link0", href: "#", children: "Guides" },
                        { name: "link1", href: "#", children: "API Reference" },
                        { name: "link2", href: "#", children: "Lorum Ipsum" },
                        { name: "link3", href: "#", children: "Lorum Ipsum" }
                    ]
                }
            },
            {
                name: "block2",
                xs: 24,
                md: 6,
                className: "block",
                title: { children: "Contact" },
                childWrapper: {
                    children: [
                        { href: "#", name: "link0", children: "FAQ" },
                        { href: "#", name: "link1", children: "联系我们" }
                    ]
                }
            },
            {
                name: "block3",
                xs: 24,
                md: 6,
                className: "block",
                title: { children: "Lorum Ipsum" },
                childWrapper: {
                    children: [
                        { href: "#", name: "link0", children: "Ant Design" },
                        { href: "#", name: "link1", children: "Ant Motion" }
                    ]
                }
            }
        ]
    },
    copyrightWrapper: { className: "copyright-wrapper" },
    copyrightPage: { className: "glow-page" },
    copyright: {
        className: "copyright",
        children: (
            <span>
                ©2018 by <a href="https://motion.ant.design">Ant Motion</a> All Rights Reserved
            </span>
        )
    }
}
